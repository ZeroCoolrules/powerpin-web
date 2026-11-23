"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, mediaUrl } from "../lib/api";
import { useAuth } from "../lib/auth";
import { qp } from "../lib/paths";
import { longDate } from "../lib/text";
import type { BlogArticle, BlogSummary } from "../lib/social";

// `initial` comes from the server when it could reach the backend, so the
// articles are in the page's HTML. Otherwise they load here in the browser.
export default function BlogList({ initial }: { initial: BlogSummary[] | null }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogSummary[] | null>(initial);
  const [mine, setMine] = useState<BlogArticle[] | null>(null); // admins: every article, drafts included
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) return;
    api<{ posts: BlogSummary[] }>("/blog")
      .then((d) => setPosts(d.posts))
      .catch((e) => setError(e.message));
  }, [initial]);

  useEffect(() => {
    if (!user) return setMine(null);
    api<{ posts: BlogArticle[] }>("/admin/blog")
      .then((d) => {
        setMine(d.posts);
        // An admin sees fresh data, not the cached copy.
        setPosts(d.posts.filter((p) => p.status === "published").sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "")));
      })
      .catch(() => {}); // not an admin
  }, [user]);

  const drafts = mine?.filter((p) => p.status !== "published") || [];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <span className="qp-chip qp-chip-teal">The Qpids Place blog</span>
        <h1 className="text-4xl font-bold sm:text-5xl">Notes on dating well</h1>
        <p className="qp-muted max-w-xl text-lg">Honest advice, real stories and news from the Qpids Place team.</p>
        {mine && (
          <Link href={qp("blog/write")} className="qp-btn qp-btn-primary">
            Write an article
          </Link>
        )}
      </header>

      {drafts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Your drafts</h2>
          <ul className="space-y-2">
            {drafts.map((p) => (
              <li key={p.id}>
                <Link href={qp(`blog/write/${p.id}`)} className="qp-card flex items-center gap-3 px-4 py-3" style={{ borderRadius: 16 }}>
                  <span className="qp-chip">Draft</span>
                  <b className="min-w-0 flex-1 truncate">{p.title}</b>
                  <span className="qp-muted text-sm">Edit</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && <p className="qp-error" role="alert">{error}</p>}
      {posts === null && !error && <p className="qp-muted">Loading articles…</p>}
      {posts?.length === 0 && (
        <div className="qp-card p-8 text-center">
          <p className="qp-muted">No articles yet. Check back soon.</p>
        </div>
      )}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((p) => {
          const cover = mediaUrl(p.coverUrl);
          return (
            <li key={p.id} className="qp-card relative overflow-hidden">
              <Link href={qp(`blog/${p.slug}`)} className="block h-full">
                <div className="qp-cover">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" loading="lazy" />
                  ) : (
                    <span aria-hidden="true">♥</span>
                  )}
                </div>
                <div className="space-y-2 p-5">
                  <h2 className="text-xl font-bold leading-snug">{p.title}</h2>
                  <p className="qp-muted line-clamp-3 text-sm leading-relaxed">{p.excerpt}</p>
                  <p className="qp-muted text-xs">
                    {p.authorName} · {longDate(p.publishedAt)}
                  </p>
                </div>
              </Link>
              {mine && (
                <Link href={qp(`blog/write/${p.id}`)} className="qp-btn absolute right-3 top-3 bg-white px-3 py-1 text-sm shadow">
                  Edit
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {!user && (
        <div className="qp-card flex flex-col items-center gap-3 p-8 text-center" style={{ background: "var(--qp-blush)" }}>
          <p className="qp-serif text-2xl font-bold">Ready to meet someone?</p>
          <p className="qp-muted">Joining Qpids Place is free and takes a minute.</p>
          <Link href={qp("join")} className="qp-btn qp-btn-primary">Join free</Link>
        </div>
      )}
    </div>
  );
}
