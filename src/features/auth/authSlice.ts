// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../store"
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../../lib/api"

type User = {
  id: string
  username: string
  email: string
  profilePic?: string | null
  address?: string
}

type AuthState = {
  token: string | null
  user: User | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}
const savedToken = localStorage.getItem("authToken")
const savedUser = localStorage.getItem("authUser")

const initial: AuthState = {
  token: savedToken ? JSON.parse(savedToken) : null,
  user: savedUser ? JSON.parse(savedUser) : null,
  status: "idle",
  error: null,
}

// REGISTER
export const register = createAsyncThunk<
  { token: string; user: User },
  { username?: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    return await registerUser(payload)
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Register failed")
  }
})

// LOGIN
export const login = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await loginUser(payload)
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Login failed")
  }
})

// LOGOUT
export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser()
  localStorage.removeItem("authToken")
  return null
})

// GET PROFILE
export const fetchProfile = createAsyncThunk<
  { user: User },
  void,
  { state: RootState; rejectValue: string }
>("auth/profile", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token
    if (!token) return rejectWithValue("No token found")

    return await getProfile(token)
  } catch (err: any) {
    return rejectWithValue("Failed to load profile")
  }
})


// FORGOT PASSWORD
export const forgotPasswordAction = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    return await forgotPassword(payload)
  } catch (err: any) {
    return rejectWithValue("Failed to send reset email")
  }
})

// RESET PASSWORD
export const resetPasswordAction = createAsyncThunk<
  { message: string },
  { token: string; newPassword: string },
  { rejectValue: string }
>("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    return await resetPassword(payload)
  } catch (err: any) {
    return rejectWithValue("Failed to reset password")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem("authToken", JSON.stringify(action.payload.token))
        localStorage.setItem("authUser", JSON.stringify(action.payload.user))
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Register failed"
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem("authToken", JSON.stringify(action.payload.token))
        localStorage.setItem("authUser", JSON.stringify(action.payload.user))
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Login failed"
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.token = null
        state.user = null
        state.status = "idle"
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
      })

      // PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload.user
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Failed to load profile"
      })

      // FORGOT PASSWORD
      .addCase(forgotPasswordAction.fulfilled, (state) => {
        state.status = "succeeded"
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Forgot password failed"
      })

      // RESET PASSWORD
      .addCase(resetPasswordAction.fulfilled, (state) => {
        state.status = "succeeded"
      })
      .addCase(resetPasswordAction.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Reset password failed"
      })
  },
})

export const selectAuth = (state: RootState) => state.auth
export default authSlice.reducer
