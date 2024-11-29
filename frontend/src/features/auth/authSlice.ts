import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SignInResponse } from "./authTypes";

interface AuthState {
  token: string | null;
  userRole: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  userRole: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    signInSuccess(state, action: PayloadAction<SignInResponse>) {
      state.token = action.payload.token;
      state.userRole = action.payload.roleId;
      state.isLoading = false;
    },
    signInFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    signOut(state) {
      state.token = null;
      state.userRole = null;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signOut } =
  authSlice.actions;
export default authSlice.reducer;
