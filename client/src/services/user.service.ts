import { API, publicAPI } from "../config/axios";
import { User } from "../interfaces/user";
class userService {
  async fetchAllUsers() {
    const response = await API.get<User[]>("/api/users");
    return response.data;
  }
  async loginUser(formData: { email: string; password: string }) {
    const response = await publicAPI.post("/api/auth/login", formData); // using publicAPI to avoid sending token
    return response.data;
  }
  async getUserById(id: string) {
    const response = await API.get<User>(`/api/users/${id}`);
    return response.data;
  }
  async uploadPic(formData: FormData) {
    const response = await API.post<{ message: string; fileUrl: string }>(
      "/api/users/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }
}

export default new userService();
