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

interface BlogsAndNewsProps {
  blogs: BlogCard[];
  news: NewsItem[];
}

export function BlogsAndNews({ blogs, news }: BlogsAndNewsProps) {
  return (
    <section className="container mx-auto px-4 pt-20 pb-10 md:pt-28 md:pb-12">
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
            {blogs.map((post) => (
              <motion.div
                key={post.href}
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
            newsItems={news}
          />
        </div>
      </div>
    </section>
  );
}

export default BlogsAndNews;
