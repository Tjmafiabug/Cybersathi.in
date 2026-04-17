import { Hero } from "@/components/landing/hero";
import { BlogsAndNews } from "@/components/landing/blogs-and-news";
import { FeaturedVideos } from "@/components/landing/featured-videos";
import { NewsletterCta } from "@/components/landing/newsletter-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <BlogsAndNews />
      <FeaturedVideos />
      <NewsletterCta />
    </>
  );
}
