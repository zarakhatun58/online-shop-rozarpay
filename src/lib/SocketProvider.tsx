import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { addNotification } from "@/features/notification/notificationSlice";

interface SocketContextType {
  socket: Socket | null;
  sendNotification?: (data: { title: string; message: string; type?: string }) => void;
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

    const userId = localStorage.getItem("userId");
    if (userId) {
      newSocket.emit("register", userId);
    }
    newSocket.on("notification", (data) => {
      dispatch(
         addNotification({
      id: uuid(),
      title: data.title || "Notification",
      message: data.message,
      type: data.type || "info",
      read: false,
      createdAt: new Date().toISOString(), 
    })
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);
  
 const sendNotification = (data: { title: string; message: string; type?: string }) => {
    if (socket) {
      socket.emit("notification", data);
    }
  };
  return (
    <SocketContext.Provider value={{ socket , sendNotification}}>
      {children}
    </SocketContext.Provider>
  );
};
