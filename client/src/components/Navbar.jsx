import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  User,
  History,
  Home,
  Zap,
  Activity,
  Briefcase,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Navbar = ({ onHistoryClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillSphere
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Home size={20} />
              <span className="hidden md:inline font-medium">Dashboard</span>
            </Link>

            <Link
              to="/activity"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Activity size={20} />
              <span className="hidden md:inline font-medium">Activity</span>
            </Link>

            <Link
              to="/jobs"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Briefcase size={20} />
              <span className="hidden md:inline font-medium">Jobs</span>
            </Link>

            <Link
              to="/community"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Users size={20} />
              <span className="hidden md:inline font-medium">Community</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <User size={20} />
              <span className="hidden md:inline font-medium">Profile</span>
            </Link>

            {onHistoryClick && (
              <button
                onClick={onHistoryClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <History size={20} />
                <span className="hidden md:inline font-medium">History</span>
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <img
                  src={
                    user?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-blue-500"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
                <span className="hidden md:inline font-medium text-gray-900">
                  {user?.name}
                </span>
              </button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
                >
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
