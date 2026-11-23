import type { Metadata } from "next";
import Article from "./Article";
import { backendOrigin, fetchBlog, type BlogArticle } from "../../lib/social";

type Props = { params: Promise<{ slug: string }> };

const load = (slug: string) => fetchBlog<{ post: BlogArticle }>(`/blog/${encodeURIComponent(slug)}`);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (data === "missing") return { title: "Article not found · Qpids Place", robots: { index: false } };
  if (!data) return { title: "Blog · Qpids Place" };
  const { post } = data;
  const origin = backendOrigin();
  const image = post.coverUrl ? (/^https?:\/\//.test(post.coverUrl) ? post.coverUrl : origin ? `${origin}${post.coverUrl}` : null) : null;
  return {
    title: `${post.title} · Qpids Place`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const data = await load(slug);
  return <Article slug={slug} initial={data && data !== "missing" ? data.post : null} missing={data === "missing"} />;
}
