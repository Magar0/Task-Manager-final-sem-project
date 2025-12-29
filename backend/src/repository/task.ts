import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db/drizzle";
import { tasks } from "../db/schema";
import { Filter, TaskPriority, TaskStatus } from "../utils/validation";

export const getTotalTaskCount = async (userId: string, filter: Filter) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const countQuery = await db
    .select({ count: count() })
    .from(tasks)
    .where(() => {
      const baseCondition = [eq(tasks.createdById, userId)];
      if (filter.status && filter.status.length > 0) {
        baseCondition.push(
          inArray(tasks.status, filter.status as TaskStatus[])
        );
      }
      if (filter.priority && filter.priority.length > 0) {
        baseCondition.push(
          inArray(tasks.priority, filter.priority as TaskPriority[])
        );
      }
      return and(...baseCondition);
    });
  return countQuery[0]?.count || 0;
};
export const getTotalAssignedTaskCount = async (
  userId: string,
  filter: Filter
) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const countQuery = await db
    .select({ count: count() })
    .from(tasks)
    .where(() => {
      const baseCondition = [eq(tasks.assignedToId, userId)];
      if (filter.status && filter.status.length > 0) {
        baseCondition.push(
          inArray(tasks.status, filter.status as TaskStatus[])
        );
      }
      if (filter.priority && filter.priority.length > 0) {
        baseCondition.push(
          inArray(tasks.priority, filter.priority as TaskPriority[])
        );
      }
      return and(...baseCondition);
    });
  return countQuery[0]?.count || 0;
};

export const getTaskByUserId = async (
  userId: string,
  limit: number,
  offset: number,
  filter: Filter
) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  // console.log({ userId, limit, offset, filter });
  const task = await db
    .select()
    .from(tasks)
    .where(() => {
      const baseCondition = [eq(tasks.createdById, userId)];
      if (filter.status && filter.status.length > 0) {
        baseCondition.push(
          inArray(tasks.status, filter.status as TaskStatus[])
        );
      }
      if (filter.priority && filter.priority.length > 0) {
        baseCondition.push(
          inArray(tasks.priority, filter.priority as TaskPriority[])
        );
      }
      return and(...baseCondition);
    })
    .orderBy(desc(tasks.updatedAt))
    .limit(limit)
    .offset(offset);
  return task;
};

export const getTaskByAssignedToId = async (
  userId: string,
  limit: number,
  offset: number,
  filter: Filter
) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const task = await db
    .select()
    .from(tasks)
    .where(() => {
      const baseCondition = [eq(tasks.assignedToId, userId)];
      if (filter.status && filter.status.length > 0) {
        baseCondition.push(
          inArray(tasks.status, filter.status as TaskStatus[])
        );
      }
      if (filter.priority && filter.priority.length > 0) {
        baseCondition.push(
          inArray(tasks.priority, filter.priority as TaskPriority[])
        );
      }
      return and(...baseCondition);
    })
    .orderBy(desc(tasks.updatedAt))
    .limit(limit)
    .offset(offset);
  return task;
};

export const createTask = async ({
  title,
  description,
  dueDate,
  priority,
  status,
  createdById,
  assignedToId,
}: any) => {
  if (!title || !description || !createdById) {
    throw new Error("Title, description, and createdById are required");
  }
  const task = await db
    .insert(tasks)
    .values({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 86400000), // 24 * 60 * 60 * 1000,
      priority,
      status,
      createdById,
      assignedToId: assignedToId || null,
    })
    .returning();
  return task[0] || null;
};

export const getTaskById = async (taskId: string) => {
  if (!taskId) {
    throw new Error("taskId is required");
  }
  const task = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, taskId))
    .limit(1);
  return task[0] || null;
};

export const updateTask = async (
  taskId: string,
  updates: Partial<{
    title: string;
    description: string;
    dueDate: Date;
    priority: "low" | "medium" | "high";
    status: "todo" | "in_progress" | "done";
    assignedToId: string | null;
  }>
) => {
  if (!taskId) {
    throw new Error("taskId is required");
  }
  const updatedTask = await db
    .update(tasks)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(tasks.id, taskId))
    .returning();
  return updatedTask[0] || null;
};

export const deleteTask = async (taskId: string, userId: string) => {
  if (!taskId || !userId) {
    throw new Error("taskId and userId are required");
  }
  const deletedTask = await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.createdById, userId)))
    .returning();
  return deletedTask[0] || null;
};
