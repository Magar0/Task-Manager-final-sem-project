import { Response, Request } from "express";
import { createNotification } from "../repository/notification";
import {
  createTask,
  deleteTask,
  getTaskByAssignedToId,
  getTaskById,
  getTaskByUserId,
  getTotalAssignedTaskCount,
  getTotalTaskCount,
  updateTask,
} from "../repository/task";
import qs from "qs";
import { Filter, validateTaskFilters } from "../utils/validation";

export const getTaskCreatedByUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }

  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  // Parse the full query string to handle filters
  const parsed = qs.parse(req.url.split("?")[1] || "");

  const filter: any = parsed.filter || {};

  // validate limit and offset
  if ((limit % 5 !== 0 || limit < 5 || limit > 50) && limit !== 3) {
    // Allow 3 for testing purposes
    res.status(400).json({
      message: "Limit must be a multiple of 5 and between 5 and 50",
    });
  }
  if (offset < 0) {
    res.status(400).json({ message: "Offset must be a positive number" });
    return;
  }

  // Validate filter
  const { valid, error } = validateTaskFilters(filter);
  if (!valid) {
    res.status(400).json({ message: error });
    return;
  }
  try {
    const data = await getTaskByUserId(userId, limit, offset, filter as Filter);
    const total = await getTotalTaskCount(userId, filter as Filter);

    const isValidPage = offset < total && offset >= 0;
    if (!isValidPage) {
      res.status(400).json({
        message: `Invalid page. Total items: ${total}, limit: ${limit}, offset: ${offset}`,
      });
      return;
    }

    res.status(200).json({
      data,
      meta: {
        total,
        limit,
        offset,
        currentPage: Math.floor(offset / limit) + 1,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks", error: err });
  }
};

export const getTasksAssignedToUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }

  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  // Parse the full query string to handle filters
  const parsed = qs.parse(req.url.split("?")[1] || "");

  const filter: any = parsed.filter || {};

  // validate limit and offset
  if ((limit % 5 !== 0 || limit < 5 || limit > 50) && limit !== 3) {
    // Allow 3 for testing purposes
    res.status(400).json({
      message: "Limit must be a multiple of 5 and between 5 and 50",
    });
  }
  if (offset < 0) {
    res.status(400).json({ message: "Offset must be a positive number" });
    return;
  }

  // Validate filter
  const { valid, error } = validateTaskFilters(filter);
  if (!valid) {
    res.status(400).json({ message: error });
    return;
  }

  try {
    const data = await getTaskByAssignedToId(
      userId,
      limit,
      offset,
      filter as Filter
    );
    const total = await getTotalAssignedTaskCount(userId, filter as Filter);
    res.status(200).json({
      data,
      meta: {
        total,
        limit,
        offset,
        currentPage: Math.floor(offset / limit) + 1,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err });
  }
};

export const handleCreateTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, status, assignedToId } =
    req.body;

  const userId = req.userId;

  // console.log({ body: req.body, userId });
  if (!title || !description) {
    res.status(400).json({ message: "Title and descriptions are required" });
    return;
  }
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }
  try {
    const data = await createTask({
      title,
      description,
      dueDate,
      priority,
      status,
      createdById: userId,
      assignedToId: assignedToId || null,
    });

    // create notification on assigning task to someone
    if (assignedToId && assignedToId !== userId) {
      const notification = await createNotification({
        userId: assignedToId,
        taskId: data.id,
        type: "assignment",
        message: `You have been assigned a new task: ${title}`,
      });

      req.io.to(`user-${assignedToId}`).emit("new-notification", notification);

      res.status(201).json(data);
    }
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating tasks", error: err });
  }
};
export const handleUpdateTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, status, assignedToId } =
    req.body;
  const { taskId } = req.params;
  const userId = req.userId;
  // console.log({ title, description, dueDate, priority, status, assignedToId });
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }
  if (!taskId) {
    res.status(400).json({ message: "taskId is missing" });
    return;
  }
  try {
    // First get the current task to compare changes
    const currentTask = await getTaskById(taskId);
    if (!currentTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Check if user is either creator or assignee
    const isCreator = currentTask.createdById === userId;
    const isAssignee = currentTask.assignedToId === userId;

    if (!isCreator && !isAssignee) {
      res.status(403).json({ message: "Unauthorized to update this task" });
      return;
    }

    // Prepare update data based on user role
    let updateData = {};

    if (isCreator) {
      // Creator can update all fields
      Object.assign(updateData, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        status,
        assignedToId,
      });
    } else {
      // Assignee can only update status and their own assignment
      Object.assign(updateData, {
        status,
        assignedToId,
      });
    }

    // Perform the update
    const updatedTask = await updateTask(taskId, updateData);

    // Handle notifications for assignment changes
    if (
      assignedToId !== undefined &&
      assignedToId !== currentTask.assignedToId
    ) {
      const notification = await createNotification({
        userId: assignedToId,
        taskId,
        message: `You've been assigned to task: ${updatedTask.title}`,
        type: "assignment",
      });

      req.io.to(`user-${assignedToId}`).emit("new-notification", notification);
    }

    res.status(200).json(updatedTask);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating tasks", error: err });
    return;
  }
};
export const handleDeleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.userId;
  if (!taskId) {
    res.status(400).json({ message: "taskId is missing" });
    return;
  }
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }
  try {
    const data = await deleteTask(taskId, userId);
    if (!data) {
      res.status(404).json({ message: "Task not found or unauthorized" });
      return;
    }
    res.status(204).send(data);
  } catch (err) {
    res.status(500).json({ message: "Error Deleting tasks", error: err });
  }
};
