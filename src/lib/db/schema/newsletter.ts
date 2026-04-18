import { sql } from "drizzle-orm"
import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const subscribers = pgTable(
  "subscribers",
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    email: text().notNull().unique(),
    verified: boolean().notNull().default(false),
    verifyToken: text(),
    unsubscribedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("subscribers_verified_idx").on(t.verified)],
)
