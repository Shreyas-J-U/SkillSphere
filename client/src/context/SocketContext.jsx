import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { getToken, isAuthenticated } = useAuth();

  useEffect(() => {
    let currentSocket = null;
    let hasShownConnectionToast = false;

    const initSocket = async () => {
      if (isAuthenticated) {
        try {
          const token = await getToken();

          if (!token) return;

          const newSocket = io(
            import.meta.env.VITE_API_URL || "http://localhost:5000",
            {
              auth: { token },
              reconnection: true,
              reconnectionDelay: 1000,
              reconnectionAttempts: 5,
            }
          );

          currentSocket = newSocket;

          newSocket.on("connect", () => {
            console.log("✅ Socket connected");
            setConnected(true);

            // Only show reconnection toast, not initial connection
            if (hasShownConnectionToast) {
              toast.success("Reconnected to server");
            }
            hasShownConnectionToast = true;
          });

          newSocket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
            setConnected(false);
          });

          newSocket.on("get_online_users", (users) => {
            setOnlineUsers(users);
          });

          newSocket.on("user_online", (userId) => {
            setOnlineUsers((prev) => [...prev, userId]);
          });

          newSocket.on("user_offline", (userId) => {
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
          });

          newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            toast.error("Connection issue. Retrying...");
          });

          setSocket(newSocket);
        } catch (error) {
          console.error("Error getting token for socket:", error);
          toast.error("Failed to establish real-time connection");
        }
      } else {
        // User logged out - clean up socket
        if (currentSocket) {
          currentSocket.close();
          currentSocket = null;
          setSocket(null);
          setConnected(false);
          setOnlineUsers([]);
        }
      }
    };

    initSocket();

    // Cleanup function with local socket reference
    return () => {
      if (currentSocket) {
        currentSocket.close();
        currentSocket = null;
      }
    };
  }, [isAuthenticated, getToken]);

  const value = {
    socket,
    connected,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
