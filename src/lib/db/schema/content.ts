import { sql } from "drizzle-orm"
import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { contentStatus } from "./enums"
import { categories } from "./taxonomy"

export const blogs = pgTable(
  "blogs",
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    slug: text().notNull(),
    title: text().notNull(),
    metaDescription: text(),
    bodyMd: text().notNull(),
    bodyHtml: text(),
    coverImageUrl: text(),
    categoryId: uuid().references(() => categories.id, { onDelete: "set null" }),
    status: contentStatus().notNull().default("pending_review"),
    author: text().notNull().default("CyberSathi Desk"),
    publishedAt: timestamp({ withTimezone: true }),
    aiGenerated: integer().notNull().default(1),
    aiModel: text(),
    aiPromptVersion: text(),
    viewCount: bigint({ mode: "number" }).notNull().default(0),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("blogs_slug_key").on(t.slug),
    index("blogs_status_published_at_idx").on(t.status, t.publishedAt),
    index("blogs_category_idx").on(t.categoryId),
  ],
)

export const newsArticles = pgTable(
  "news_articles",
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    slug: text().notNull(),
    title: text().notNull(),
    summary: text().notNull(),
    sourceId: uuid().references(() => newsSources.id, { onDelete: "set null" }),
    sourceUrl: text().notNull(),
    sourceUrlHash: text().notNull(),
    sourcePublishedAt: timestamp({ withTimezone: true }),
    categoryId: uuid().references(() => categories.id, { onDelete: "set null" }),
    imageUrl: text(),
    status: contentStatus().notNull().default("pending_review"),
    aiRewritten: integer().notNull().default(1),
    viewCount: bigint({ mode: "number" }).notNull().default(0),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("news_articles_slug_key").on(t.slug),
    uniqueIndex("news_articles_source_url_hash_key").on(t.sourceUrlHash),
    index("news_articles_status_created_at_idx").on(t.status, t.createdAt),
  ],
)

export const videos = pgTable(
  "videos",
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    slug: text().notNull(),
    youtubeId: text().notNull(),
    title: text().notNull(),
    description: text(),
    channelName: text(),
    channelId: text(),
    publishedAt: timestamp({ withTimezone: true }),
    durationSeconds: integer(),
    thumbnailUrl: text(),
    transcript: text(),
    summary: text(),
    timestamps: jsonb().$type<Array<{ t: number; label: string }>>(),
    categoryId: uuid().references(() => categories.id, { onDelete: "set null" }),
    status: contentStatus().notNull().default("pending_review"),
    viewCount: bigint({ mode: "number" }).notNull().default(0),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("videos_slug_key").on(t.slug),
    uniqueIndex("videos_youtube_id_key").on(t.youtubeId),
    index("videos_status_published_at_idx").on(t.status, t.publishedAt),
  ],
)

import { newsSources } from "./automation"
