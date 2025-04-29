import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

/**
 * ユーザテーブル
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  is_active: integer("is_active").notNull().default(1),
});

/**
 * タスクテーブル
 */
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  is_completed: integer("is_completed").notNull().default(0),
  start_at: text("start_at"),
  end_at: text("end_at"),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  user_id: integer("user_id").references(() => users.id),
});

/**
 * サブタスクテーブル
 */
export const subtasks = sqliteTable("subtasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  is_completed: integer("is_completed").notNull().default(0),
  task_id: integer("task_id").references(() => tasks.id),
});
