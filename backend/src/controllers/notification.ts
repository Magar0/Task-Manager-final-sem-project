import { Response, Request } from "express";
import {
  getNotificationsByUserId,
  updateNotification,
  updateAllNotificationsAsRead,
} from "../repository/notification";

export const markReadNotification = async (req: Request, res: Response) => {
  const { notificationId } = req.body;
  if (!notificationId) {
    res.status(400).json({ message: "Notification Id is missing" });
    return;
  }
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "User Id is missing" });
    return;
  }
  try {
    const updatedNotification = await updateNotification(
      notificationId,
      userId,
      { isRead: true }
    );
    if (!updatedNotification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    res.status(200).json({ message: "Succesfully updated notifications" });
  } catch (err) {
    res.status(500).json({ message: "Error Updating notification" });
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "User Id is missing" });
    return;
  }
  try {
    await updateAllNotificationsAsRead(userId);
    res.status(200).json({ message: "Succesfully updated all notifications" });
  } catch (err) {
    res.status(500).json({ message: "Error Updating notification" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "User Id is missing" });
    return;
  }
  try {
    const notificationsList = await getNotificationsByUserId(userId);
    res.status(200).json(notificationsList);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
