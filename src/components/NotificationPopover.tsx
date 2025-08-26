import React, { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/Button";

import {
  getNotifications,
  readAllNotifications,
  readNotification,
} from "@/features/notification/notificationSlice";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "error" | "payment" | "reminder" | "login";
  read: boolean;
  createdAt: string;
}

const NotificationPopover: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousUnreadCount = useRef(0);
const dispatch = useDispatch<AppDispatch>()
const { notifications } = useSelector((state: RootState) => state.notifications);


  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || user?._id;
  const token = localStorage.getItem("token");

  const unreadCount = notifications.filter((n:any) => !n.read).length;

  // 🔊 Play notification sound
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.src =
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Hn0GshFDs=";
      audioRef.current.volume = 0.3;
    }

    if (unreadCount > previousUnreadCount.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }

    previousUnreadCount.current = unreadCount;
  }, [unreadCount]);

  // 🗂 Fetch notifications on mount
  useEffect(() => {
    if (userId && token) {
      dispatch(getNotifications({ userId, token }));
    }
  }, [dispatch, userId, token]);

  const handleMarkAsRead = (id: string) => {
    if (token) dispatch(readNotification({ id, token }));
  };

  const handleMarkAllAsRead = () => {
    if (userId && token) dispatch(readAllNotifications({ userId, token }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "payment":
        return "💳";
      case "reminder":
        return "⏰";
      case "login":
        return "🔑";
      default:
        return "📢";
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="end">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs h-7"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notifi: Notification) => (
                    <div
                      key={notifi.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notifi.read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                      onClick={() => handleMarkAsRead(notifi.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-1">{getIcon(notifi.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-sm font-medium ${
                                !notifi.read ? "text-blue-900" : "text-gray-900"
                              }`}
                            >
                              {notifi.title}
                            </h4>
                            {!notifi.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notifi.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDistanceToNow(new Date(notifi.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationPopover;
