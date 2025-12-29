import axios from "axios";

const URL = process.env.REACT_APP_SERVER_URL;
export const API = axios.create({ baseURL: URL });
export const publicAPI = axios.create({ baseURL: URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // req.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    config.headers["Authorization"] = `Bearer ${JSON.parse(token)}`; //using config.headers
  }
  return config;
});

// transforming response data globally

// publicAPI.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   // Handle errors globally
//   (error) => {
//     if (error.response) {
//       console.error("API error:", error.response.data);
//     }
//     return Promise.reject(error);
//   },
// );
