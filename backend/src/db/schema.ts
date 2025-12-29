import { relations } from "drizzle-orm";
import {
  uuid,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const statusEnum = pgEnum("status", ["todo", "in_progress", "done"]);
export const notificationEnum = pgEnum("notification_type", [
  "assignment",
  "update",
  "reminder",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("user_name", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  profilePicUrl: varchar("profile_pic_url", { length: 255 }),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }),
  priority: priorityEnum("priority").default("medium").notNull(),
  status: statusEnum("status").default("todo").notNull(),
  createdById: uuid("created_by_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  assignedToId: uuid("assigned_to_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  type: notificationEnum("type").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// relations
// export const usersRelations = relations(users, ({ many }) => ({
//   createdTasks: many(tasks, { relationName: "created_tasks" }),
//   assignedTasks: many(tasks, { relationName: "assigned_tasks" }),
//   notifications: many(notifications),
// })); //realtion name not required as it has only one relation

// export const tasksRelations = relations(tasks, ({ one }) => ({
//   createdBy: one(users, {
//     relationName: "created_tasks",
//     fields: [tasks.createdById],
//     references: [users.id],
//   }),
//   assignedTo: one(users, {
//     relationName: "assigned_tasks",
//     fields: [tasks.assignedToId],
//     references: [users.id],
//   }),
// }));

// export const notificationsRelations = relations(notifications, ({ one }) => ({
//   user: one(users, { fields: [notifications.userId], references: [users.id] }),
//   task: one(tasks, { fields: [notifications.taskId], references: [tasks.id] }),
// }));
