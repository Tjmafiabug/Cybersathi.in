import { Hero } from "@/components/landing/hero";
import { LatestBlogs } from "@/components/landing/latest-blogs";
import { TrendingNews } from "@/components/landing/trending-news";

export default function Home() {
  return (
    <>
      <Hero />
      <LatestBlogs />
      <TrendingNews />
    </>
  );
}
