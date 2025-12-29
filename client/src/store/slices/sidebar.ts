import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: false,
  reducers: {
    setSidebar(state, action) {
      return action.payload;
    },
  },
});

export default sidebarSlice.reducer;
export const { setSidebar } = sidebarSlice.actions;
