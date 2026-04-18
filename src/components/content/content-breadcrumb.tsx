import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export type Crumb = { label: string; href?: string }

export function ContentBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <span key={`${c.label}-${i}`} className="contents">
              <BreadcrumbItem>
                {last || !c.href ? (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={c.href} />}>
                    {c.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!last ? <BreadcrumbSeparator /> : null}
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
