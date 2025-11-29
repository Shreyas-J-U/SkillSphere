import { createContext, useContext, useState, useEffect } from "react";
import { useUser, useAuth as useClerkAuth, useClerk } from "@clerk/clerk-react";
import api from "../utils/api";

// Create a context that will hold authentication state for the whole app
const AuthContext = createContext();

// Helper hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Provider component – wraps the app in App.jsx
export const AuthProvider = ({ children }) => {
  // Clerk hooks
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const clerk = useClerk();

  // Local state for the MongoDB user and loading flag
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Clerk user with our own MongoDB user record
  useEffect(() => {
    console.log("AuthContext: Effect triggered", { isClerkLoaded, isSignedIn });

    const syncUser = async () => {
      if (!isClerkLoaded) return;

      if (isSignedIn) {
        // Only set loading if we don't have a user yet, to prevent flicker on nav
        if (!user) setLoading(true);

        try {
          const token = await getToken();
          // console.log("AuthContext: Got token");
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const { data } = await api.get("/auth/me");
          // console.log("AuthContext: User synced", data);
          setUser(data);
        } catch (err) {
          console.error("Error syncing user:", err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        // Not signed in
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
        setLoading(false);
      }
    };

    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClerkLoaded, isSignedIn]); // Removed getToken to prevent loops if it's unstable

  // Helper functions for UI components
  const login = () => clerk.openSignIn();
  const register = () => clerk.openSignUp();
  const logout = () => signOut();

  // Expose everything the rest of the app needs
  return (
    <AuthContext.Provider
      value={{
        user, // MongoDB user object
        clerkUser, // Raw Clerk user (optional)
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getToken,
        // Utility to manually update the stored user (e.g., after profile edit)
        updateUser: (newData) => setUser(newData),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
