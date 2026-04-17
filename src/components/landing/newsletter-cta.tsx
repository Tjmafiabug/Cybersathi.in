"use client";

import Link from "next/link";
import { useState } from "react";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    // Placeholder — real wiring to Resend (or Supabase subscribers table) lands in a later milestone.
    setTimeout(() => {
      setStatus("sent");
      setEmail("");
    }, 400);
  }

  return (
    <section id="newsletter" className="container mx-auto px-4 py-16 md:py-20">
      <div className="relative mx-4 overflow-hidden rounded-2xl bg-primary px-4 py-14 md:mx-8 md:px-8">
        <div className="relative z-10 mx-auto max-w-xl sm:text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Get cyber alerts in your inbox
            </h2>
            <p className="leading-relaxed text-primary-foreground/80">
              One weekly digest with the scams, breaches and threats worth
              knowing about — India-first, globally informed, no fluff.
            </p>
          </div>

          <div className="mt-6">
            <form
              onSubmit={onSubmit}
              className="flex items-center justify-center rounded-lg bg-background p-1 sm:mx-auto sm:max-w-md"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === "submitting"}
                className="w-full bg-transparent p-2 text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground shadow-md outline-none duration-150 hover:bg-primary/90 active:bg-primary/80 focus:shadow-none disabled:opacity-60"
              >
                {status === "submitting" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>

            <p className="mt-3 text-sm text-primary-foreground/70 sm:mx-auto sm:max-w-lg">
              {status === "sent"
                ? "Thanks — check your inbox to confirm."
                : (
                  <>
                    No spam, ever. Read our{" "}
                    <Link className="underline" href="/privacy">
                      privacy policy
                    </Link>
                    .
                  </>
                )}
            </p>
          </div>
        </div>

        <div
          className="absolute inset-0 h-full w-full"
          aria-hidden
          style={{
            background:
              "linear-gradient(268deg, hsl(var(--primary) / 0.76) 50%, hsl(var(--primary) / 0.55) 80%, hsl(var(--primary) / 0) 117%)",
          }}
        />
      </div>
    </section>
  );
}

export default NewsletterCta;
