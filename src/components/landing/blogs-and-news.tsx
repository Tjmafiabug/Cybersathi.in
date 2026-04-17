/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import {
  NewsCard,
  listContainerVariants,
  listItemVariants,
  type NewsItem,
} from "./news-card";

type BlogCard = {
  title: string;
  category: string;
  href: string;
  imageUrl: string;
};

const recentPosts: BlogCard[] = [
  {
    title: "How UPI pull-payment scams drain bank accounts in seconds",
    category: "UPI Fraud",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&auto=format&fit=crop&q=60",
  },
  {
    title: "Ransomware is shifting to double-extortion — what that means for you",
    category: "Ransomware",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&auto=format&fit=crop&q=60",
  },
  {
    title: "Six telltale signs of a modern phishing email you probably miss",
    category: "Phishing",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=600&h=400&auto=format&fit=crop&q=60",
  },
];

const recentNews: NewsItem[] = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&auto=format&fit=crop&q=60",
    title: "CERT-In warns of fresh spear-phishing campaign targeting banks",
    date: "2 hours ago",
    source: "The Hindu",
    href: "#",
    external: true,
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&h=300&auto=format&fit=crop&q=60",
    title: "LockBit ransomware group resurfaces under new banner",
    date: "5 hours ago",
    source: "BleepingComputer",
    href: "#",
    external: true,
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=300&h=300&auto=format&fit=crop&q=60",
    title: "UPI fraud cases up 35% this quarter, RBI data shows",
    date: "Today",
    source: "Economic Times",
    href: "#",
    external: true,
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=300&auto=format&fit=crop&q=60",
    title: "Microsoft patches zero-day exploited in the wild by state actors",
    date: "Today",
    source: "The Register",
    href: "#",
    external: true,
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&auto=format&fit=crop&q=60",
    title: "Mumbai police bust call-centre scam syndicate targeting NRIs",
    date: "Yesterday",
    source: "Hindustan Times",
    href: "#",
    external: true,
  },
];

export function BlogsAndNews() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Latest from the blog
            </h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            className="flex flex-col divide-y divide-border/60"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {recentPosts.map((post) => (
              <motion.div
                key={post.title}
                variants={listItemVariants}
                className="py-5 first:pt-0 last:pb-0"
              >
                <Link
                  href={post.href}
                  className="group flex gap-5 transition-colors"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="h-28 w-40 shrink-0 object-cover transition duration-300 group-hover:scale-105 sm:h-32 sm:w-48"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                      {post.category}
                    </p>
                    <h3 className="mt-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <NewsCard
            title="Latest news"
            viewAllHref="/news"
            newsItems={recentNews}
          />
        </div>
      </div>
    </section>
  );
}

export default BlogsAndNews;
