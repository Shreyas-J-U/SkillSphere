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
  Menu,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Navbar = ({ onHistoryClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
      <div className="container mx-auto px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillSphere
            </span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/activity"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              <Activity size={20} />
              <span>Activity</span>
            </Link>
            <Link
              to="/jobs"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              <Briefcase size={20} />
              <span>Jobs</span>
            </Link>
            <Link
              to="/community"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              <Users size={20} />
              <span>Community</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              <User size={20} />
              <span>Profile</span>
            </Link>

            {onHistoryClick && (
              <button
                onClick={onHistoryClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <History size={20} />
                <span>History</span>
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <img
                  src={
                    user?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-blue-500"
                />
                <span className="font-medium text-gray-900">{user?.name}</span>
              </button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                >
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 flex flex-col space-y-2 bg-gray-100 shadow-lg rounded-xl p-4 text-gray-700 border border-gray-200"
          >
            <Link
              to="/dashboard"
              onClick={() => setShowMobileMenu(false)}
              className="hover:bg-white px-2 py-1 rounded"
            >
              <Home size={20} className="inline-block mr-2" /> Dashboard
            </Link>
            <Link
              to="/activity"
              onClick={() => setShowMobileMenu(false)}
              className="hover:bg-white px-2 py-1 rounded"
            >
              <Activity size={20} className="inline-block mr-2" /> Activity
            </Link>
            <Link
              to="/jobs"
              onClick={() => setShowMobileMenu(false)}
              className="hover:bg-white px-2 py-1 rounded"
            >
              <Briefcase size={20} className="inline-block mr-2" /> Jobs
            </Link>
            <Link
              to="/community"
              onClick={() => setShowMobileMenu(false)}
              className="hover:bg-white px-2 py-1 rounded"
            >
              <Users size={20} className="inline-block mr-2" /> Community
            </Link>
            <Link
              to="/profile"
              onClick={() => setShowMobileMenu(false)}
              className="hover:bg-white px-2 py-1 rounded"
            >
              <User size={20} className="inline-block mr-2" /> Profile
            </Link>

            {onHistoryClick && (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onHistoryClick();
                }}
                className="hover:bg-white px-2 py-1 rounded text-left"
              >
                <History size={20} className="inline-block mr-2" /> History
              </button>
            )}

            <button
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 px-2 py-1 rounded flex items-center mt-2"
            >
              <LogOut size={20} className="inline-block mr-2" /> Logout
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
