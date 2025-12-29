import { and, desc, eq, is } from "drizzle-orm";
import { db } from "../db/drizzle";
import { notifications } from "../db/schema";

export const getNotificationsByUserId = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const notificationsList = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
  return notificationsList;
};

export const createNotification = async ({
  userId,
  taskId,
  type,
  message,
}: {
  userId: string;
  taskId: string;
  type: "assignment" | "update" | "reminder";
  message: string;
}) => {
  if (!userId || !taskId || !type || !message) {
    throw new Error("All fields are required");
  }
  const notification = {
    userId,
    taskId,
    type,
    message,
    isRead: false,
  };

  await db.insert(notifications).values(notification);
  return notification;
};

export const updateNotification = async (
  notificationId: string,
  userId: string,
  update: Partial<{
    isRead: boolean;
    type: "assignment" | "update" | "reminder";
    message: string;
    taskId: string;
    userId: string;
  }>
) => {
  if (!notificationId || !userId) {
    throw new Error("Notification ID and User ID are required");
  }
  const updatedNotification = await db
    .update(notifications)
    .set(update)
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning();
  return updatedNotification[0] || null;
};

export const updateAllNotificationsAsRead = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const updatedNotifications = await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false))
    )
    .returning();
  return updatedNotifications;
};
