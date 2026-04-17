"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldHalf } from "lucide-react";

type IconProps = React.SVGProps<SVGSVGElement>;

function TwitterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 10 },
  },
};

const sections = [
  {
    title: "Content",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "News", href: "/news" },
      { label: "Videos", href: "/videos" },
      { label: "Newsletter", href: "#newsletter" },
    ],
  },
  {
    title: "Topics",
    links: [
      { label: "Phishing", href: "/category/phishing" },
      { label: "Ransomware", href: "/category/ransomware" },
      { label: "UPI Fraud", href: "/category/upi-fraud" },
      { label: "Identity Theft", href: "/category/identity-theft" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Editorial policy", href: "/editorial" },
      { label: "Report a scam", href: "/report" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Grievance officer", href: "/grievance" },
    ],
  },
];

const socials = [
  { label: "Twitter", href: "#", Icon: TwitterIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
];

function NavSection({
  title,
  links,
  index,
}: {
  title: string;
  links: { label: string; href: string }[];
  index: number;
}) {
  return (
    <motion.div variants={itemVariants} custom={index} className="flex flex-col gap-2">
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
        className="mb-2 border-b border-border pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors duration-300 hover:text-foreground"
      >
        {title}
      </motion.h3>
      {links.map((link, linkIndex) => (
        <motion.div key={link.label} variants={linkVariants} custom={linkIndex}>
          <Link
            href={link.href}
            className="group relative text-xs text-muted-foreground transition-colors duration-300 hover:text-foreground md:text-sm"
          >
            <span className="relative">
              {link.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

function SocialLink({
  href,
  label,
  Icon,
  index,
}: {
  href: string;
  label: string;
  Icon: (props: IconProps) => React.ReactElement;
  index: number;
}) {
  return (
    <motion.a
      variants={socialVariants}
      custom={index}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{
        scale: 1.15,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }}
      whileTap={{ scale: 0.9 }}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </motion.a>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-gradient-to-br from-card via-muted to-card/90">
      {/* decorative orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl md:h-96 md:w-96"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-secondary/20 blur-3xl md:h-96 md:w-96"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="container mx-auto px-4 py-14 md:px-8 md:py-16"
      >
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12 lg:gap-20">
          {sections.map((section, index) => (
            <NavSection
              key={section.title}
              title={section.title}
              links={section.links}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-border/60 pt-8 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
            >
              <ShieldHalf className="h-8 w-8 text-primary md:h-10 md:w-10" aria-hidden />
              CyberSathi
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Your compass through the cyber crime world
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex items-center gap-3">
              {socials.map((social, index) => (
                <SocialLink
                  key={social.label}
                  href={social.href}
                  label={social.label}
                  Icon={social.Icon}
                  index={index}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} CyberSathi &mdash; All rights reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer;
