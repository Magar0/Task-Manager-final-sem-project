import { AxiosResponse } from "axios";
import { API } from "../config/axios";

export interface Notification {
  id: string;
  createdAt: Date;
  taskId: string;
  type: "assignment" | "update" | "reminder";
  userId: string;
  message: string;
  isRead: boolean;
}

class NotificationService {
  static async markNotificationAsRead(notificationId: string) {
    const res = await API.put<{ message: String }>(
      "/api/notification/mark-read",
      {
        notificationId,
      },
    );
    return res.data;
  }

  static async getNotifications() {
    const res = await API.get<Notification[]>("/api/notification");
    return res.data;
  }

  static async markAllNotificationsAsRead() {
    const res = await API.put<{ message: String }>(
      "/api/notification/mark-all-read",
    );
    return res.data;
  }
}

export default NotificationService;
