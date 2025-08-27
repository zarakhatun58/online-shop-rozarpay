import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addNotification } from "@/features/notification/notificationSlice";
import { API_URL } from "./api";

type SocketContextType = {
  socket: Socket | null;
  connectSocket: (userId?: string) => void;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  connectSocket: () => {},
});

type Props = {
  children: ReactNode;
};

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useDispatch();

  const connectSocket = (userIdFromArg?: string) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userIdFromArg || storedUser?.id || storedUser?._id;

    if (!userId) {
      console.warn("⚠️ connectSocket: userId missing");
      return;
    }

    if (socket) {
      socket.disconnect(); // always cleanup before making new one
    }

    const newSocket = io(API_URL, {
      withCredentials: true,
      query: { userId }, // pass userId directly
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected", newSocket.id);
      newSocket.emit("join", userId); // ensure backend registers
    });

    newSocket.on("reconnect", () => {
      console.log("♻️ Socket reconnected");
      newSocket.emit("join", userId); // re-register after reconnect
    });

    newSocket.on("disconnect", () => {
      console.log("🛑 Socket disconnected");
    });

    // 🔔 Listen for notifications
    newSocket.on("notification", (data: any) => {
      console.log("🔔 Notification received:", data);
      dispatch(
        addNotification({
          id: data.id,
          title: data.title || "Notification",
          message: data.message,
          type: data.type || "info",
          read: false,
          createdAt: data.createdAt || new Date().toISOString(),
        })
      );
    });

    setSocket(newSocket);
  };

  // Auto-connect when app loads
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?.id || storedUser?._id;
    if (userId) connectSocket(userId);

    return () => {
      socket?.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SocketContext.Provider value={{ socket, connectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
