import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function buildUrl(
  basePath: string,
  page: number,
  extraParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(extraParams)) if (v) params.set(k, v)
  if (page > 1) params.set("page", String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

function pageList(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: Array<number | "…"> = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) pages.push("…")
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push("…")
  pages.push(total)
  return pages
}

export function SitePagination({
  basePath,
  page,
  totalPages,
  extraParams = {},
}: {
  basePath: string
  page: number
  totalPages: number
  extraParams?: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null
  const pages = pageList(page, totalPages)

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PaginationPrevious href={buildUrl(basePath, page - 1, extraParams)} />
          ) : (
            <PaginationPrevious
              aria-disabled
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>

        {pages.map((p, i) =>
          p === "…" ? (
            <PaginationItem key={`e-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                href={buildUrl(basePath, p, extraParams)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {page < totalPages ? (
            <PaginationNext href={buildUrl(basePath, page + 1, extraParams)} />
          ) : (
            <PaginationNext
              aria-disabled
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
