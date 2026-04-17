"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

type Stat = {
  value: string;
  label: string;
  context: string;
  trend?: string;
  source: string;
};

const stats: Stat[] = [
  {
    value: "12.02L",
    label: "cyber-crime complaints in India",
    context: "last 12 months",
    trend: "+113%",
    source: "NCRP / I4C",
  },
  {
    value: "₹11,333Cr",
    label: "lost to cyber fraud",
    context: "India, 2024",
    trend: "+60%",
    source: "I4C",
  },
  {
    value: "3,158",
    label: "major data breaches",
    context: "last 12 months",
    trend: "+68%",
    source: "ITRC",
  },
  {
    value: "2.8Bn",
    label: "records exposed in breaches",
    context: "2024",
    source: "ITRC / HIBP",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 },
  },
};

export function Stats() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto grid grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:gap-10 md:py-12"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="flex flex-col"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {stat.value}
              </span>
              {stat.trend && (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-destructive">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stat.context} &bull; {stat.source}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Stats;
