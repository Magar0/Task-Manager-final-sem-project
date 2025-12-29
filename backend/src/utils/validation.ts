export interface Filter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
}
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

export const validateTaskFilters = (
  filter: Filter
): { valid: boolean; error?: string } => {
  const validFilters = {
    status: Object.values(TaskStatus),
    priority: Object.values(TaskPriority),
  };

  if (filter.status) {
    const invalid = filter.status.filter(
      (f: string) => !validFilters.status.includes(f as TaskStatus)
    );
    if (invalid.length > 0) {
      return {
        valid: false,
        error: `Valid status filters are: ${validFilters.status.join(", ")}`,
      };
    }
  }

  if (filter.priority) {
    const invalid = filter.priority.filter(
      (f: string) => !validFilters.priority.includes(f as TaskPriority)
    );
    if (invalid.length > 0) {
      return {
        valid: false,
        error: `Valid priority filters are: ${validFilters.priority.join(
          ", "
        )}`,
      };
    }
  }

  return { valid: true };
};
