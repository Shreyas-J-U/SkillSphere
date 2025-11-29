import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { loading } = useAuth();

  // Show spinner while auth state is being resolved (both Clerk and our backend sync)
  if (!isLoaded || loading) {
    // console.log("ProtectedRoute: Loading...", { isLoaded, loading });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    console.log("ProtectedRoute: Redirecting to login. Details:", {
      isSignedIn,
      typeOfIsSignedIn: typeof isSignedIn,
      isLoaded,
      clerkUser: useUser().user,
    });
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
