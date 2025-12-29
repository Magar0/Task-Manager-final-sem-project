import { TaskPriority, TaskStatus } from "./task";

export interface Filter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  // creator?: string[];
  // assignee?: string[];
  // dueDate?: string;
}
