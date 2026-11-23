"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, mediaUrl } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { qp } from "../../lib/paths";
import { RichText, longDate } from "../../lib/text";
import type { BlogArticle } from "../../lib/social";

export default function Article({ slug, initial, missing }: { slug: string; initial: BlogArticle | null; missing: boolean }) {
  const { user, ready } = useAuth();
  const [post, setPost] = useState<BlogArticle | null>(initial);
  const [error, setError] = useState(missing ? "We couldn't find that article." : "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initial || missing) return;
    api<{ post: BlogArticle }>(`/blog/${encodeURIComponent(slug)}`)
      .then((d) => setPost(d.post))
      .catch((e) => setError(e.status === 404 ? "We couldn't find that article." : e.message));
  }, [slug, initial, missing]);

  async function share() {
    if (!post) return;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: post.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* closed the share sheet */
    }
  }

  const cover = mediaUrl(post?.coverUrl);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link href={qp("blog")} className="qp-btn qp-btn-ghost px-4 py-2 text-sm">
          ← All articles
        </Link>
        {post && (
          <button className="qp-btn qp-btn-ghost px-4 py-2 text-sm" onClick={share}>
            {copied ? "Link copied" : "Share"}
          </button>
        )}
      </div>
      {error && (
        <div className="qp-card p-8 text-center">
          <p className="qp-muted">{error}</p>
        </div>
      )}
      {!post && !error && <p className="qp-muted">Loading…</p>}
      {post && (
        <article className="qp-card overflow-hidden">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="aspect-video w-full object-cover" />
          )}
          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
            <p className="qp-muted mt-2 text-sm">
              {post.authorName} · {longDate(post.publishedAt)}
            </p>
            <div className="qp-article mt-6">
              <RichText text={post.body} />
            </div>
          </div>
        </article>
      )}
      {post && ready && !user && (
        <div className="qp-card flex flex-col items-center gap-3 p-8 text-center" style={{ background: "var(--qp-blush)" }}>
          <p className="qp-serif text-2xl font-bold">Ready to meet someone?</p>
          <p className="qp-muted">Joining Qpids Place is free and takes a minute.</p>
          <Link href={qp("join")} className="qp-btn qp-btn-primary">Join free</Link>
        </div>
      )}
    </div>
  );
}
