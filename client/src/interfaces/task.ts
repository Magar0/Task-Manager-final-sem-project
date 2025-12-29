export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface TaskDataReceived {
  data: Task[];
  meta: Meta;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  createdById: string;
  assignedToId?: string;
}

interface Meta {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPage: number;
}
