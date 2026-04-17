/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export interface NewsItem {
  id: string | number;
  imageUrl: string;
  title: string;
  date: string;
  source: string;
  href: string;
  external?: boolean;
}

export interface NewsCardProps {
  title: string;
  viewAllText?: string;
  viewAllHref?: string;
  newsItems: NewsItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 10 },
  },
};

export function NewsCard({
  title,
  viewAllText = "View all",
  viewAllHref = "#",
  newsItems,
}: NewsCardProps) {
  return (
    <div className="w-full rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          aria-label={`View all ${title}`}
        >
          {viewAllText}
        </Link>
      </div>

      <motion.ul
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={`${title} list`}
      >
        {newsItems.map((item) => (
          <motion.li key={item.id} variants={itemVariants}>
            <a
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent"
            >
              <img
                src={item.imageUrl}
                alt=""
                className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-grow">
                <h4 className="line-clamp-2 font-medium leading-tight text-card-foreground">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.date} &bull; {item.source}
                </p>
              </div>
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default NewsCard;
