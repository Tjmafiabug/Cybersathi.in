/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

import { listContainerVariants, listItemVariants } from "./news-card";

type VideoCard = {
  title: string;
  channel: string;
  duration: string;
  href: string;
  thumbnailUrl: string;
  description?: string;
};

interface FeaturedVideosProps {
  videos: VideoCard[];
}

function VideoThumbnail({
  src,
  duration,
}: {
  src: string;
  duration: string;
}) {
  const fallbacks = [
    src.replace(/\/[^/?]+\.jpg[^"]*$/, "/hqdefault.jpg"),
    src.replace(/\/[^/?]+\.jpg[^"]*$/, "/mqdefault.jpg"),
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=750&auto=format&fit=crop&q=60",
  ];

  return (
    <div className="relative overflow-hidden rounded-xl bg-muted">
      <img
        src={src}
        alt=""
        className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
        onError={(e) => {
          const img = e.currentTarget;
          const tried = parseInt(img.dataset.fallback ?? "0", 10);
          if (tried < fallbacks.length) {
            img.dataset.fallback = String(tried + 1);
            img.src = fallbacks[tried];
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform duration-300 group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5 fill-black text-black" />
        </div>
      </div>
      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
        {duration}
      </span>
    </div>
  );
}

export function FeaturedVideos({ videos }: FeaturedVideosProps) {
  const [featured, ...rest] = videos;

  if (!featured) return null;

  return (
    <section className="bg-muted/30 pt-10 pb-20 md:pt-12 md:pb-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Featured videos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Hand-picked cyber-crime explainers from trusted channels — each one
            with an AI-generated summary and searchable transcript.
          </p>
        </div>

        <motion.div
          className="mt-12 grid gap-5 lg:grid-cols-3 lg:grid-rows-2"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={listItemVariants}
            className="lg:col-span-2 lg:row-span-2"
          >
            <Link href={featured.href} className="group block h-full">
              <VideoThumbnail
                src={featured.thumbnailUrl}
                duration={featured.duration}
              />
              <div className="mt-4">
                <h3 className="text-xl font-semibold leading-snug transition-colors group-hover:text-primary md:text-2xl">
                  {featured.title}
                </h3>
                {featured.description && (
                  <p className="mt-2 line-clamp-2 text-muted-foreground">
                    {featured.description}
                  </p>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
                  {featured.channel}
                </p>
              </div>
            </Link>
          </motion.div>

          {rest.map((video) => (
            <motion.div key={video.href} variants={listItemVariants}>
              <Link href={video.href} className="group block">
                <VideoThumbnail
                  src={video.thumbnailUrl}
                  duration={video.duration}
                />
                <div className="mt-3">
                  <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                    {video.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {video.channel}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all videos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedVideos;
