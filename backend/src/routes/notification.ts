import express from "express";
import {
  markReadNotification,
  getNotifications,
  markAllNotificationsAsRead,
} from "../controllers/notification";

const router = express.Router();

router.put("/mark-read", markReadNotification);
router.put("/mark-all-read", markAllNotificationsAsRead);
router.get("/", getNotifications);

export default router;
