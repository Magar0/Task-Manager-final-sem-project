import express from "express";
import {
  getTaskCreatedByUser,
  handleDeleteTask,
  handleUpdateTask,
  getTasksAssignedToUser,
  handleCreateTask,
} from "../controllers/task";

const router = express.Router();

router.get("/", getTaskCreatedByUser);
router.get("/assignedTask", getTasksAssignedToUser);
router.post("/", handleCreateTask);
router.delete("/:taskId", handleDeleteTask);
router.put("/:taskId", handleUpdateTask);

export default router;
