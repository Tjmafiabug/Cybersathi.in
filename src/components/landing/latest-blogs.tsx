/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type BlogCard = {
  title: string;
  category: string;
  href: string;
  imageUrl: string;
};

const placeholderPosts: BlogCard[] = [
  {
    title: "How UPI pull-payment scams drain bank accounts in seconds",
    category: "UPI Fraud",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Ransomware is shifting to double-extortion — what that means for you",
    category: "Ransomware",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Six telltale signs of a modern phishing email you probably miss",
    category: "Phishing",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Inside the dark-web markets selling Indian KYC data",
    category: "Dark Web",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Why your stolen Aadhaar is worth more than a credit card",
    category: "Identity Theft",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&auto=format&fit=crop&q=60",
  },
  {
    title: "The top five data breaches India saw this year",
    category: "Data Breaches",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&auto=format&fit=crop&q=60",
  },
];

export function LatestBlogs({ posts = placeholderPosts }: { posts?: BlogCard[] }) {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Latest from the blog
        </h2>
        <p className="mt-3 text-muted-foreground">
          Explainers, deep-dives and quick alerts on the scams and threats
          reshaping India&apos;s digital life.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.title}
            href={post.href}
            className="group block transition duration-300 hover:-translate-y-0.5"
          >
            <div className="overflow-hidden rounded-xl">
              <img
                src={post.imageUrl}
                alt=""
                className="aspect-[3/2] w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-primary">
              {post.category}
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View all posts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default LatestBlogs;
