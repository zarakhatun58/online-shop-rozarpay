import React, { createContext, useContext, useEffect, useState, ReactNode, } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { addNotification } from "@/features/notification/notificationSlice";
import { API_URL } from "./api";


type SocketContextType = {
    socket: Socket | null;
    connectSocket: (userId?: string) => void;
};

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    connectSocket: () => { },
});
type Props = {
    children: ReactNode;
};


export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: Props) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const dispatch = useDispatch();

    const connectSocket = (userIdFromArg?: string) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userIdFromArg || user?.id || user?._id;
        if (!userId) return console.warn("UserId missing");

        // Reuse existing socket
        if (socket && socket.connected) {
            socket.emit("join", userId);
            return;
        }

        if (socket) socket.disconnect();

        const newSocket = io(API_URL, {
            withCredentials: true,
            query: { userId },
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket connected", newSocket.id);
            newSocket.emit("join", userId);
        });

        newSocket.on("disconnect", () => {
            console.log("🛑 Socket disconnected");
        });

        // 🔔 Listen for notifications
        newSocket.on("notification", (data: any) => {
            console.log("🔔 Notification received:", data);

            // Dispatch Redux notification
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

        setSocket(newSocket);
    };

    // Auto-connect on page load if user is logged in
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = storedUser?.id || storedUser?._id;
        if (userId) connectSocket(userId);

        return () => {
            socket?.disconnect();
        };
    }, []);
    return (
        <SocketContext.Provider value={{ socket, connectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};