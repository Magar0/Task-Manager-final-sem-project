import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface User {
  userId: string;
  username: string;
  name: string;
  email: string;
  exp?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initializeAuth(state) {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const decoded = jwtDecode<any>(token);
        if (!decoded || !decoded.userId) {
          localStorage.removeItem("token"); // invalid token format
          return;
        }
        // check token expiry
        const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;
        if (!isExpired) {
          const { userId, username, name, email, createdAt } = decoded;
          state.user = {
            userId,
            username,
            name,
            email,
          };
          state.isAuthenticated = true;
        }
      } catch {
        localStorage.removeItem("token"); //invalid token format
      }
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export default authSlice.reducer;
export const { initializeAuth, setUser, logout } = authSlice.actions;
