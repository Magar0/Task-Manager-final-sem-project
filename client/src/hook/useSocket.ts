import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import NotificationService from "../services/notification.service";
import toast from "react-hot-toast";

export function useSocket(userId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: NotificationService.getNotifications,
    enabled: !!userId, // Only fetch if userId is available
  });

  // console.log("Notifications:", notifications);

  // Mutation to mark a notification as read
  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: NotificationService.markNotificationAsRead,
    onSuccess: (data) => {
      console.log("Notification marked as read:", data);
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    },
  });
  const { mutateAsync: markAsReadAll } = useMutation({
    mutationFn: NotificationService.markAllNotificationsAsRead,
    onSuccess: (data) => {
      console.log("All Notifications marked as read:", data);
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error);
    },
  });

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(
      process.env.REACT_APP_SERVER_URL || "http://localhost:4000",
    );
    socketRef.current = newSocket;

    // handle connection
    newSocket.on("connect", () => {
      console.log("Socket connected: " + newSocket.id); // x8WIv7-mJelg7on_ALbx
    });
    // Handle disconnection
    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    //   join user specific room
    newSocket.emit("join-user-room", userId);

    // handle upcoming notifications
    newSocket.on("new-notification", async (notification: Notification) => {
      await queryClient.invalidateQueries({
        queryKey: ["todos", "assignedTodos"],
      });
      //TODO: refetch assigned todos
      console.log("I m running");
      queryClient.setQueryData<Notification[]>(
        ["notifications", userId],
        (prevNotifications) => {
          if (!prevNotifications) return [notification];
          return [notification, ...prevNotifications];
        },
      );
    });
    return () => {
      newSocket.disconnect(); // Clean up the socket connection on unmount
      socketRef.current = null;
    };
  }, [userId, queryClient]);

  return {
    notifications,
    unreadNotifications: notifications?.filter((n) => !n.isRead) || [],
    markAsRead,
    markAsReadAll,
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    isLoading,
    isError,
  };
}
