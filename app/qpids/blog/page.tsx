import type { Metadata } from "next";
import BlogList from "./BlogList";
import { fetchBlog, type BlogSummary } from "../lib/social";

export const metadata: Metadata = {
  title: "Blog · Qpids Place",
  description: "Honest dating advice, real stories and news from the Qpids Place team.",
};

export default async function BlogPage() {
  const data = await fetchBlog<{ posts: BlogSummary[] }>("/blog");
  return <BlogList initial={data && data !== "missing" ? data.posts : null} />;
}
