"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api, mediaUrl } from "../lib/api";
import { useAuth } from "../lib/auth";
import { qp } from "../lib/paths";
import { timeAgo } from "../lib/text";
import type { FeedComment, FeedPost } from "../lib/social";
import Avatar from "../Avatar";

type FeedPage = { posts: FeedPost[]; nextBefore: number | null; limits: { post: number; comment: number } };

function Face({ a, size }: { a: FeedPost["author"]; size: number }) {
  return <Avatar name={a.displayName} photoUrl={a.photoUrl} emoji={a.avatarEmoji} color={a.avatarColor} size={size} />;
}

export default function Feed() {
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [nextBefore, setNextBefore] = useState<number | null>(null);
  const [limits, setLimits] = useState({ post: 1000, comment: 500 });
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    api<FeedPage>("/feed")
      .then((d) => {
        setPosts(d.posts);
        setNextBefore(d.nextBefore);
        setLimits(d.limits);
      })
      .catch((e) => setError(e.message));
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const d = await api<FeedPage>(`/feed?before=${nextBefore}`);
      setPosts((p) => [...(p || []), ...d.posts]);
      setNextBefore(d.nextBefore);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingMore(false);
    }
  }

  const patch = (id: number, changes: Partial<FeedPost>) =>
    setPosts((p) => (p || []).map((x) => (x.id === id ? { ...x, ...changes } : x)));
  const remove = (id: number) => setPosts((p) => (p || []).filter((x) => x.id !== id));

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Feed</h1>
        <Link href={qp("blog")} className="qp-btn qp-btn-ghost px-4 py-2 text-sm">
          Read the blog
        </Link>
      </div>

      <Composer max={limits.post} onPosted={(post) => setPosts((p) => [post, ...(p || [])])} />

      {error && <p className="qp-error" role="alert">{error}</p>}
      {posts === null && !error && <p className="qp-muted">Loading the feed…</p>}
      {posts?.length === 0 && (
        <div className="qp-card p-8 text-center">
          <p className="qp-muted">Nothing here yet. Be the first to share something.</p>
        </div>
      )}

      {posts?.map((post) => (
        <PostCard key={post.id} post={post} max={limits.comment} onPatch={patch} onRemove={remove} />
      ))}

      {nextBefore && (
        <div className="text-center">
          <button className="qp-btn qp-btn-ghost" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Loading…" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
}

function Composer({ max, onPosted }: { max: number; onPosted: (p: FeedPost) => void }) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const empty = !body.trim() && !file;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || empty) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("body", body);
      if (file) form.append("photo", file);
      const { post } = await api<{ post: FeedPost }>("/feed", { method: "POST", form });
      onPosted(post);
      setBody("");
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="qp-card space-y-3 p-4" onSubmit={submit}>
      <div className="flex items-start gap-3">
        {user && <Avatar name={user.displayName} photoUrl={user.photoUrl} emoji={user.avatarEmoji} color={user.avatarColor} size={40} />}
        <textarea
          className="qp-input min-h-[72px] flex-1"
          rows={2}
          maxLength={max}
          placeholder="Share something with everyone"
          aria-label="Write a post"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      {preview && (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="max-h-44 rounded-2xl" />
          <button
            type="button"
            aria-label="Remove photo"
            className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-sm font-bold shadow"
            onClick={() => {
              setFile(null);
              if (fileInput.current) fileInput.current.value = "";
            }}
          >
            ✕
          </button>
        </div>
      )}
      {error && <p className="qp-error" role="alert">{error}</p>}
      <div className="flex items-center gap-3">
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="button" className="qp-btn qp-btn-ghost px-4 py-2 text-sm" onClick={() => fileInput.current?.click()}>
          Add photo
        </button>
        <span className="qp-muted flex-1 text-right text-xs">{body.length > max - 100 ? `${body.length}/${max}` : ""}</span>
        <button className="qp-btn qp-btn-primary px-6 py-2" disabled={busy || empty}>
          {busy ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}

function PostCard({
  post,
  max,
  onPatch,
  onRemove,
}: {
  post: FeedPost;
  max: number;
  onPatch: (id: number, c: Partial<FeedPost>) => void;
  onRemove: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [note, setNote] = useState("");
  const photo = mediaUrl(post.photoUrl);

  async function toggleLike() {
    const liked = !post.liked;
    onPatch(post.id, { liked, likeCount: post.likeCount + (liked ? 1 : -1) });
    try {
      const r = await api<{ liked: boolean; likeCount: number }>(`/feed/${post.id}/like`, { method: liked ? "POST" : "DELETE" });
      onPatch(post.id, r);
    } catch {
      onPatch(post.id, { liked: post.liked, likeCount: post.likeCount });
    }
  }

  async function del() {
    setMenu(false);
    if (!window.confirm("Delete this post?")) return;
    try {
      await api(`/feed/${post.id}`, { method: "DELETE" });
      onRemove(post.id);
    } catch (e: any) {
      setNote(e.message);
    }
  }

  async function report() {
    setMenu(false);
    const reason = window.prompt("What's wrong with this post?");
    if (reason === null) return;
    try {
      await api(`/feed/${post.id}/report`, { method: "POST", body: { reason } });
      setNote("Thanks. Our team will review this post.");
    } catch (e: any) {
      setNote(e.message);
    }
  }

  return (
    <article className="qp-card space-y-3 p-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Face a={post.author} size={40} />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-bold">
              {post.author.displayName}
              {post.author.isVerified && <span className="qp-chip qp-chip-teal ml-2 align-middle">Verified</span>}
            </p>
            <p className="qp-muted text-sm">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <div className="relative">
          <button className="qp-navlink" aria-label="Post options" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            ⋯
          </button>
          {menu && (
            <div className="qp-card absolute right-0 top-full z-10 mt-1 min-w-[150px] overflow-hidden p-1" style={{ borderRadius: 16 }}>
              {post.canDelete && (
                <button className="qp-menu-item" onClick={del}>Delete post</button>
              )}
              {!post.mine && (
                <button className="qp-menu-item" onClick={report}>Report post</button>
              )}
            </div>
          )}
        </div>
      </header>
      {post.body && <p className="whitespace-pre-wrap break-words leading-relaxed">{post.body}</p>}
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" loading="lazy" className="max-h-[520px] w-full rounded-2xl object-cover" />
      )}
      {note && <p className="qp-muted text-sm">{note}</p>}
      <footer className="flex gap-2 border-t pt-2" style={{ borderColor: "var(--qp-line)" }}>
        <button className="qp-action" aria-pressed={post.liked} onClick={toggleLike}>
          <span aria-hidden="true">{post.liked ? "♥" : "♡"}</span> {post.likeCount || ""} {post.likeCount === 1 ? "like" : "likes"}
        </button>
        <button className="qp-action" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {post.commentCount || ""} {post.commentCount === 1 ? "comment" : "comments"}
        </button>
      </footer>
      {open && (
        <Comments
          postId={post.id}
          max={max}
          onCount={(delta) => onPatch(post.id, { commentCount: Math.max(0, post.commentCount + delta) })}
        />
      )}
    </article>
  );
}

function Comments({ postId, max, onCount }: { postId: number; max: number; onCount: (delta: number) => void }) {
  const [items, setItems] = useState<FeedComment[] | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ comments: FeedComment[] }>(`/feed/${postId}/comments`)
      .then((d) => setItems(d.comments))
      .catch((e) => setError(e.message));
  }, [postId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { comment } = await api<{ comment: FeedComment }>(`/feed/${postId}/comments`, { method: "POST", body: { body: text } });
      setItems((c) => [...(c || []), comment]);
      setText("");
      onCount(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function del(id: number) {
    try {
      await api(`/feed/comments/${id}`, { method: "DELETE" });
      setItems((c) => (c || []).filter((x) => x.id !== id));
      onCount(-1);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-3">
      {items === null && !error && <p className="qp-muted text-sm">Loading comments…</p>}
      {items?.map((c) => (
        <div key={c.id} className="flex items-start gap-2">
          <Face a={c.author} size={28} />
          <div className="min-w-0 flex-1 rounded-2xl px-3 py-2 text-sm" style={{ background: "var(--qp-bg)" }}>
            <p>
              <b>{c.author.displayName}</b> <span className="qp-muted text-xs">{timeAgo(c.createdAt)}</span>
            </p>
            <p className="whitespace-pre-wrap break-words">{c.body}</p>
          </div>
          {c.canDelete && (
            <button className="qp-muted px-2 py-1 text-sm" aria-label="Delete comment" onClick={() => del(c.id)}>
              ✕
            </button>
          )}
        </div>
      ))}
      {error && <p className="qp-error" role="alert">{error}</p>}
      <form className="flex items-center gap-2" onSubmit={send}>
        <input
          className="qp-input flex-1 py-2"
          value={text}
          maxLength={max}
          placeholder="Add a comment"
          aria-label="Add a comment"
          onChange={(e) => setText(e.target.value)}
        />
        <button className="qp-btn qp-btn-ghost px-4 py-2 text-sm" disabled={busy || !text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
