import { API } from "../config/axios";
import { Filter } from "../interfaces/filter";
import { TaskDataReceived, TaskStatus } from "../interfaces/task";

interface QueryParams {
  limit: number;
  offset: number;
  filter?: Filter;
}
class TaskService {
  async getAllTasks({
    limit,
    offset,
    filter,
  }: QueryParams): Promise<TaskDataReceived> {
    const response = await API.get(`/api/task`, {
      params: { limit, offset, filter },
    });
    return response.data;
  }

  async getAssignedTasks({
    limit,
    offset,
    filter,
  }: QueryParams): Promise<TaskDataReceived> {
    const response = await API.get("/api/task/assignedTask", {
      params: { limit, offset, filter },
    });
    return response.data;
  }

  async findTask(taskId: string) {
    const response = await API.get(`/api/task/${taskId}`);
    return response.data;
  }

  async createTask(taskData: any) {
    const response = await API.post("/api/task", taskData);
    return response.data;
  }

  async updateTask(taskId: string, taskData: any) {
    const response = await API.put(`/api/task/${taskId}`, taskData);
    return response.data;
  }

  async deleteTask(taskId: string) {
    const response = await API.delete(`/api/task/${taskId}`);
    return response.data;
  }
}

export default new TaskService();
