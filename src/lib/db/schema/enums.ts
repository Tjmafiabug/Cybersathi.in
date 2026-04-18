import { pgEnum } from "drizzle-orm/pg-core"

export const contentStatus = pgEnum("content_status", [
  "pending_review",
  "published",
  "rejected",
  "archived",
])

export const newsSourceType = pgEnum("news_source_type", ["rss", "api"])

export const jobType = pgEnum("job_type", [
  "generate_blogs",
  "scrape_news",
  "fetch_videos",
  "revalidate",
])

export const jobStatus = pgEnum("job_status", [
  "running",
  "succeeded",
  "failed",
])

export const userRole = pgEnum("user_role", ["admin", "user"])
