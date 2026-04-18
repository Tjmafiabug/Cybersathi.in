import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

export type ReadNextItem = {
  slug: string
  title: string
  coverImageUrl: string | null
  categoryName: string | null
}

export function ReadNext({
  heading = "Read next",
  items,
  basePath = "/blog",
  className,
}: {
  heading?: string
  items: ReadNextItem[]
  basePath?: string
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <section className={cn("mt-12", className)}>
      <header className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className="group relative flex h-60 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-muted p-5 text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {item.coverImageUrl ? (
              <Image
                src={item.coverImageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />
            <div className="relative z-10">
              {item.categoryName ? (
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest opacity-80">
                  {item.categoryName}
                </p>
              ) : null}
            </div>
            <div className="relative z-10 flex items-end justify-between gap-3">
              <h3 className="line-clamp-3 text-lg font-semibold leading-snug">
                {item.title}
              </h3>
              <ArrowUpRight
                className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
