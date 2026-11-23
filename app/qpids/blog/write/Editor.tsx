"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, mediaUrl } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { qp } from "../../lib/paths";
import { RichText } from "../../lib/text";
import type { BlogArticle } from "../../lib/social";

// Admin-only: write, edit, publish or delete a blog article.
export default function Editor({ id }: { id?: string }) {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [post, setPost] = useState<BlogArticle | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [denied, setDenied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const coverInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(qp("login"));
      return;
    }
    (id ? api<{ post: BlogArticle }>(`/admin/blog/${id}`) : api<any>("/admin/blog"))
      .then((d) => {
        if (id) {
          setPost(d.post);
          setTitle(d.post.title);
          setExcerpt(d.post.excerpt);
          setBody(d.post.body);
        }
        setLoaded(true);
      })
      .catch((e) => (e.status === 403 ? setDenied(true) : setError(e.message)));
  }, [id, ready, user, router]);

  async function save(status: "draft" | "published") {
    setBusy(true);
    setError("");
    setSaved("");
    try {
      const payload = { title, excerpt, body, status };
      const d = post
        ? await api<{ post: BlogArticle }>(`/admin/blog/${post.id}`, { method: "PUT", body: payload })
        : await api<{ post: BlogArticle }>("/admin/blog", { method: "POST", body: payload });
      setPost(d.post);
      setSaved(status === "published" ? "Published. It can take a minute to show for visitors." : "Draft saved.");
      if (!post) window.history.replaceState(null, "", qp(`blog/write/${d.post.id}`));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadCover(file?: File) {
    if (!file || !post) return;
    setError("");
    try {
      const form = new FormData();
      form.append("photo", file);
      const d = await api<{ post: BlogArticle }>(`/admin/blog/${post.id}/cover`, { method: "POST", form });
      setPost(d.post);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function removeCover() {
    if (!post) return;
    try {
      const d = await api<{ post: BlogArticle }>(`/admin/blog/${post.id}/cover`, { method: "DELETE" });
      setPost(d.post);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function del() {
    if (!post || !window.confirm("Delete this article for good?")) return;
    try {
      await api(`/admin/blog/${post.id}`, { method: "DELETE" });
      router.replace(qp("blog"));
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (denied) {
    return (
      <div className="qp-card mx-auto max-w-md space-y-4 p-8 text-center">
        <p className="qp-muted">Only site admins can write blog articles.</p>
        <Link href={qp("blog")} className="qp-btn qp-btn-ghost">Back to the blog</Link>
      </div>
    );
  }
  if (!loaded && !error) return <p className="qp-muted py-20 text-center">Loading…</p>;

  const live = post?.status === "published";
  const cover = mediaUrl(post?.coverUrl);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link href={qp("blog")} className="qp-btn qp-btn-ghost px-4 py-2 text-sm">← All articles</Link>
        <span className={"qp-chip " + (live ? "qp-chip-teal" : "")}>{live ? "Published" : "Draft"}</span>
      </div>

      <div className="qp-card space-y-5 p-5 sm:p-8">
        <div>
          <label className="qp-label" htmlFor="blog-title">Title</label>
          <input id="blog-title" className="qp-input" value={title} maxLength={140} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="qp-label" htmlFor="blog-excerpt">Short summary (shown on the blog list)</label>
          <input
            id="blog-excerpt"
            className="qp-input"
            value={excerpt}
            maxLength={300}
            placeholder="Leave empty to use the first lines of the article"
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-2 flex gap-1" role="tablist">
            <button type="button" role="tab" aria-selected={!preview} className="qp-navlink" aria-current={!preview ? "page" : undefined} onClick={() => setPreview(false)}>
              Write
            </button>
            <button type="button" role="tab" aria-selected={preview} className="qp-navlink" aria-current={preview ? "page" : undefined} onClick={() => setPreview(true)}>
              Preview
            </button>
          </div>
          {preview ? (
            <div className="qp-article min-h-[320px] rounded-2xl border p-5" style={{ borderColor: "var(--qp-line)" }}>
              {body.trim() ? <RichText text={body} /> : <p className="qp-muted">Nothing to preview yet.</p>}
            </div>
          ) : (
            <>
              <textarea
                className="qp-input min-h-[320px] leading-relaxed"
                rows={16}
                value={body}
                aria-label="Article text"
                placeholder="Write your article here."
                onChange={(e) => setBody(e.target.value)}
              />
              <p className="qp-muted mt-2 text-xs">
                Leave an empty line between paragraphs. Start a line with ## for a heading, - for a bullet, &gt; for a quote.
                Use **bold**, *italic* and [link text](https://example.com).
              </p>
            </>
          )}
        </div>

        <div className="space-y-3">
          <p className="font-bold">Cover photo</p>
          {post ? (
            <>
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className="aspect-video w-full max-w-md rounded-2xl object-cover" />
              )}
              <input
                ref={coverInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={(e) => uploadCover(e.target.files?.[0])}
              />
              <div className="flex flex-wrap gap-2">
                <button type="button" className="qp-btn qp-btn-ghost px-4 py-2 text-sm" onClick={() => coverInput.current?.click()}>
                  {cover ? "Change photo" : "Add photo"}
                </button>
                {cover && (
                  <button type="button" className="qp-btn qp-btn-ghost px-4 py-2 text-sm" onClick={removeCover}>Remove</button>
                )}
              </div>
            </>
          ) : (
            <p className="qp-muted text-sm">Save a draft first, then you can add a cover photo.</p>
          )}
        </div>

        {error && <p className="qp-error" role="alert">{error}</p>}
        {saved && (
          <p className="text-sm" style={{ color: "var(--qp-teal)" }} role="status">
            {saved}{" "}
            {live && post && (
              <Link href={qp(`blog/${post.slug}`)} className="underline">View article</Link>
            )}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {post && (
            <button type="button" className="qp-btn qp-btn-ghost px-4 py-2 text-sm" style={{ color: "#a8282f" }} onClick={del}>
              Delete
            </button>
          )}
          <span className="flex-1" />
          <button type="button" className="qp-btn qp-btn-ghost" disabled={busy || !title.trim()} onClick={() => save("draft")}>
            {live ? "Unpublish" : "Save draft"}
          </button>
          <button type="button" className="qp-btn qp-btn-primary" disabled={busy || !title.trim()} onClick={() => save("published")}>
            {live ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
