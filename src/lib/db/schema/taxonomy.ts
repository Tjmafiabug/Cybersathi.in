import { sql } from "drizzle-orm"
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const categories = pgTable("categories", {
  id: uuid().primaryKey().default(sql`gen_random_uuid()`),
  slug: text().notNull().unique(),
  name: text().notNull(),
  description: text(),
  icon: text(),
  sortOrder: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const tags = pgTable("tags", {
  id: uuid().primaryKey().default(sql`gen_random_uuid()`),
  slug: text().notNull().unique(),
  name: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const blogTags = pgTable(
  "blog_tags",
  {
    blogId: uuid()
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
    tagId: uuid()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.blogId, t.tagId] })],
)

export const newsTags = pgTable(
  "news_tags",
  {
    newsId: uuid()
      .notNull()
      .references(() => newsArticles.id, { onDelete: "cascade" }),
    tagId: uuid()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.newsId, t.tagId] })],
)

export const videoTags = pgTable(
  "video_tags",
  {
    videoId: uuid()
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    tagId: uuid()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.videoId, t.tagId] })],
)

import { blogs, newsArticles, videos } from "./content"
