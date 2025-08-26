import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "error" | "payment" | "reminder" | "login";
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

// 🔄 Async Thunks
export const getNotifications = createAsyncThunk(
  "notifications/getAll",
  async ({ userId, token }: { userId: string; token: string }) => {
    return await fetchNotifications(userId, token);
  }
);

export const readNotification = createAsyncThunk(
  "notifications/readOne",
  async ({ id, token }: { id: string; token: string }) => {
    return await markNotificationAsRead(id, token);
  }
);

export const readAllNotifications = createAsyncThunk(
  "notifications/readAll",
  async ({ userId, token }: { userId: string; token: string }) => {
    return await markAllNotificationsAsRead(userId, token);
  }
);

// 📦 Slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload); // add on top
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load notifications";
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        state.notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
      })
      .addCase(readAllNotifications.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
      });
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
