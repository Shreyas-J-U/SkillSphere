import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

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
  const { getToken, isAuthenticated } = useAuth();

  useEffect(() => {
    const initSocket = async () => {
      if (isAuthenticated) {
        try {
          const token = await getToken();

          if (!token) return;

          const newSocket = io(
            import.meta.env.VITE_API_URL || "http://localhost:5000",
            {
              auth: { token },
            }
          );

          newSocket.on("connect", () => {
            console.log("✅ Socket connected");
            setConnected(true);
          });

          newSocket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
            setConnected(false);
          });

          newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
          });

          setSocket(newSocket);
        } catch (error) {
          console.error("Error getting token for socket:", error);
        }
      } else {
        if (socket) {
          socket.close();
          setSocket(null);
          setConnected(false);
        }
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isAuthenticated, getToken]);

  const value = {
    socket,
    connected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
