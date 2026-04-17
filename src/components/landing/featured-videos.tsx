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
  views: string;
  href: string;
  thumbnailUrl: string;
  description?: string;
};

const featuredVideos: VideoCard[] = [
  {
    title: "How the \u20b9500 UPI scam actually works — a live demo",
    channel: "CyberAware India",
    duration: "12:34",
    views: "450K views",
    href: "#",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=750&auto=format&fit=crop&q=60",
    description:
      "Watch a white-hat walk through the exact pull-payment request scammers send, and the five seconds you have to react before the money is gone.",
  },
  {
    title: "Inside a ransomware negotiation: leaked chat transcripts",
    channel: "Dark Reading",
    duration: "8:22",
    views: "127K views",
    href: "#",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Why your phone's SIM card is the weakest link in 2FA",
    channel: "Scam School",
    duration: "15:07",
    views: "89K views",
    href: "#",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=500&auto=format&fit=crop&q=60",
  },
];

function VideoThumbnail({
  src,
  duration,
}: {
  src: string;
  duration: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-muted">
      <img
        src={src}
        alt=""
        className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
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

export function FeaturedVideos() {
  const [featured, ...rest] = featuredVideos;

  return (
    <section className="bg-muted/30 py-20 md:py-28">
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
                  {featured.channel} &bull; {featured.views}
                </p>
              </div>
            </Link>
          </motion.div>

          {rest.map((video) => (
            <motion.div key={video.title} variants={listItemVariants}>
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
                    {video.channel} &bull; {video.views}
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
