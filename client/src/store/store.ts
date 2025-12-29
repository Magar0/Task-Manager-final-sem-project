import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/authSlice";
import sidebarSlice from "./slices/sidebar";

const store = configureStore({
  reducer: {
    users: userSlice,
    sidebar: sidebarSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
