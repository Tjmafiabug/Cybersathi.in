import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

export function MarkdownBody({
  source,
  className,
}: {
  source: string
  className?: string
}) {
  return (
    <article
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-headings:scroll-mt-24 prose-headings:tracking-tight",
        "prose-a:font-medium prose-a:underline-offset-4",
        "prose-pre:rounded-xl prose-pre:border prose-pre:border-border",
        className,
      )}
    >
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "wrap",
                  properties: { className: ["no-underline"] },
                },
              ],
            ],
          },
        }}
      />
    </article>
  )
}
