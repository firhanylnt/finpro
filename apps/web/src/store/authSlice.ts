import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: Cookies.get("access_token") || null,
  user: Cookies.get("access_token") ? jwtDecode(Cookies.get("access_token") as string) : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      try {
        state.user = jwtDecode(action.payload.token);
        Cookies.set("access_token", action.payload.token, { expires: 7, secure: true });
      } catch (error) {
        state.user = null;
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove("access_token");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
