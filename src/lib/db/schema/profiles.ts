import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { userRole } from "./enums"

// Mirrors auth.users(id). FK added manually in the SQL migration because
// drizzle-kit doesn't introspect the `auth` schema managed by Supabase.
export const profiles = pgTable("profiles", {
  userId: uuid().primaryKey(),
  role: userRole().notNull().default("user"),
  displayName: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
