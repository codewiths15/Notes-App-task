import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../apis/auth-api";

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginUser(credentials);

      // Save to localStorage
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("isLogged", "true");

      return {
        token: res.data.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

const initialState = {
  isLogged: localStorage.getItem("isLogged") === "true",
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLogged = false;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("isLogged");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogged = true;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
