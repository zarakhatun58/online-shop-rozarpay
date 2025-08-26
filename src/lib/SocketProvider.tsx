import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { addNotification } from "@/features/notification/notificationSlice";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const newSocket = io("https://online-shop-server-hy92.onrender.com", {
      withCredentials: true,
    });

    setSocket(newSocket);

    // ✅ Register userId when logged in
    const userId = localStorage.getItem("userId");
    if (userId) {
      newSocket.emit("register", userId);
    }

    // ✅ Listen for notifications
    newSocket.on("notification", (data) => {
      dispatch(
         addNotification({
      id: uuid(), // unique id for client-side notifications
      title: data.title || "Notification", // default title if not provided
      message: data.message,
      type: data.type || "info",
      read: false, // new notifications are unread
      createdAt: new Date().toISOString(), // timestamp
    })
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
