import { createSlice } from "@reduxjs/toolkit";

const initialData = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoggedIn: false,
};

export const authReducer = createSlice({
  name: "auth",
  initialState: initialData,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setAccessToken, setRefreshToken, setUser, setIsLoggedIn, logout } = authReducer.actions;

export default authReducer.reducer;
