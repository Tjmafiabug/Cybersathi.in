import { formatDistanceToNow } from "date-fns";

import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { BlogsAndNews } from "@/components/landing/blogs-and-news";
import { FeaturedVideos } from "@/components/landing/featured-videos";
import { NewsletterCta } from "@/components/landing/newsletter-cta";
import {
  listPublishedBlogs,
  listPublishedNews,
  listPublishedVideos,
} from "@/lib/content/queries";

export const revalidate = 600;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default async function Home() {
  const [blogsResult, newsResult, videosResult] = await Promise.all([
    listPublishedBlogs({ page: 1 }),
    listPublishedNews({ page: 1 }),
    listPublishedVideos({ page: 1 }),
  ]);

  const blogs = blogsResult.rows.slice(0, 3).map((b) => ({
    title: b.title,
    category: b.categoryName ?? "General",
    href: `/blog/${b.slug}`,
    imageUrl: b.coverImageUrl ?? "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&auto=format&fit=crop&q=60",
  }));

  const news = newsResult.rows.slice(0, 5).map((n) => ({
    id: n.id,
    title: n.title,
    imageUrl: n.imageUrl ?? "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&auto=format&fit=crop&q=60",
    date: formatDistanceToNow(n.sourcePublishedAt ?? n.createdAt, { addSuffix: true }),
    source: n.sourceName ?? "Unknown",
    href: `/news/${n.slug}`,
    external: false,
  }));

  const videos = videosResult.rows.slice(0, 3).map((v) => ({
    title: v.title,
    channel: v.channelName ?? "",
    duration: v.durationSeconds ? formatDuration(v.durationSeconds) : "0:00",
    href: `/video/${v.slug}`,
    thumbnailUrl: v.thumbnailUrl ?? "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=750&auto=format&fit=crop&q=60",
    description: v.summary ?? undefined,
  }));

  return (
    <>
      <Hero />
      <Stats />
      <BlogsAndNews blogs={blogs} news={news} />
      <FeaturedVideos videos={videos} />
      <NewsletterCta />
    </>
  );
}
