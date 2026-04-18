import { sql } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { jobStatus, jobType, newsSourceType } from "./enums"

export const topicQueue = pgTable(
  "topic_queue",
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    keyword: text().notNull().unique(),
    priority: integer().notNull().default(0),
    lastUsedAt: timestamp({ withTimezone: true }),
    active: boolean().notNull().default(true),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("topic_queue_active_priority_idx").on(t.active, t.priority)],
)

export const newsSources = pgTable("news_sources", {
  id: uuid().primaryKey().default(sql`gen_random_uuid()`),
  name: text().notNull(),
  type: newsSourceType().notNull(),
  url: text().notNull(),
  active: boolean().notNull().default(true),
  lastPolledAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const jobRuns = pgTable(
  "job_runs",
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    jobType: jobType().notNull(),
    startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp({ withTimezone: true }),
    status: jobStatus().notNull().default("running"),
    itemsProcessed: integer().notNull().default(0),
    errorsJson: jsonb().$type<Array<{ message: string; stack?: string }>>(),
  },
  (t) => [index("job_runs_type_started_idx").on(t.jobType, t.startedAt)],
)
