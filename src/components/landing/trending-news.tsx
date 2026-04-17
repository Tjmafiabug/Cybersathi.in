import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { NewsCard, type NewsItem } from "./news-card";

const indiaNews: NewsItem[] = [
  {
    id: "in-1",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&auto=format&fit=crop&q=60",
    title: "CERT-In warns of fresh spear-phishing campaign targeting banks",
    date: "2 hours ago",
    source: "The Hindu",
    href: "#",
    external: true,
  },
  {
    id: "in-2",
    imageUrl:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&h=300&auto=format&fit=crop&q=60",
    title: "UPI fraud cases up 35% this quarter, RBI data shows",
    date: "Today",
    source: "Economic Times",
    href: "#",
    external: true,
  },
  {
    id: "in-3",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=300&auto=format&fit=crop&q=60",
    title: "Mumbai police bust call-centre scam syndicate targeting NRIs",
    date: "Yesterday",
    source: "Hindustan Times",
    href: "#",
    external: true,
  },
  {
    id: "in-4",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&auto=format&fit=crop&q=60",
    title: "Aadhaar-linked loan scam hits 120 victims across Bengaluru",
    date: "2 days ago",
    source: "Times of India",
    href: "#",
    external: true,
  },
  {
    id: "in-5",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&auto=format&fit=crop&q=60",
    title: "Indian fintech reports third data breach in six months",
    date: "3 days ago",
    source: "Indian Express",
    href: "#",
    external: true,
  },
];

const worldNews: NewsItem[] = [
  {
    id: "w-1",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&auto=format&fit=crop&q=60",
    title: "LockBit ransomware group resurfaces under new banner",
    date: "1 hour ago",
    source: "BleepingComputer",
    href: "#",
    external: true,
  },
  {
    id: "w-2",
    imageUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=300&h=300&auto=format&fit=crop&q=60",
    title: "Microsoft patches zero-day exploited in the wild by state actors",
    date: "Today",
    source: "The Register",
    href: "#",
    external: true,
  },
  {
    id: "w-3",
    imageUrl:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&h=300&auto=format&fit=crop&q=60",
    title: "FBI seizes dark-web marketplace peddling stolen credit cards",
    date: "Yesterday",
    source: "Krebs on Security",
    href: "#",
    external: true,
  },
  {
    id: "w-4",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=300&auto=format&fit=crop&q=60",
    title: "Okta breach post-mortem: what enterprises need to know",
    date: "2 days ago",
    source: "Wired",
    href: "#",
    external: true,
  },
  {
    id: "w-5",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&auto=format&fit=crop&q=60",
    title: "Ransomware payments hit record $1.1B globally, Chainalysis reports",
    date: "3 days ago",
    source: "Reuters",
    href: "#",
    external: true,
  },
];

export function TrendingNews() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Trending cyber news
          </h2>
          <p className="mt-3 text-muted-foreground">
            The scams, breaches and takedowns you should know about —
            summarized, categorized and linked to the source.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <NewsCard title="India" viewAllHref="/news?region=india" newsItems={indiaNews} />
          <NewsCard title="World" viewAllHref="/news?region=world" newsItems={worldNews} />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all news
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TrendingNews;
