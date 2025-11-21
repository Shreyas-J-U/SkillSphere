import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Send,
  X,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import BarterRequestCard from "../components/BarterRequestCard";
import BarterHistoryModal from "../components/BarterHistoryModal";
import { getUsers } from "../api/userApi";
import {
  createBarterRequest,
  getBarterRequests,
  acceptBarterRequest,
  rejectBarterRequest,
} from "../api/barterApi";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedSkills, setSelectedSkills] = useState({
    offered: "",
    requested: "",
  });
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new_barter_request", handleNewRequest);
      socket.on("barter_status_changed", handleStatusChange);
      socket.on("new_notification", () => fetchData()); // Refresh on new message

      return () => {
        socket.off("new_barter_request");
        socket.off("barter_status_changed");
        socket.off("new_notification");
      };
    }
  }, [socket]);

  // Dynamic search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (activeTab === "discover") {
        fetchUsers();
      }
    }, 300); // 300ms delay to avoid excessive API calls

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeTab]);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers({ search: searchTerm });
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, sentRequests, receivedRequests] = await Promise.all([
        getUsers({ search: searchTerm }),
        getBarterRequests({ type: "sent" }),
        getBarterRequests({ type: "received" }),
      ]);
      setUsers(usersData);
      setRequests({ sent: sentRequests, received: receivedRequests });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = (request) => {
    setRequests((prev) => ({
      ...prev,
      received: [request, ...prev.received],
    }));
  };

  const handleStatusChange = (request) => {
    fetchData();
  };

  const handleSendRequest = (targetUser) => {
    setSelectedUser(targetUser);
    setShowRequestModal(true);
  };

  const submitRequest = async () => {
    try {
      const request = await createBarterRequest({
        receiverId: selectedUser._id,
        skillOffered: selectedSkills.offered,
        skillRequested: selectedSkills.requested,
        message: requestMessage,
      });

      if (socket) {
        socket.emit("barter_request_sent", {
          receiverId: selectedUser._id,
          request,
        });
      }

      setRequests((prev) => ({
        ...prev,
        sent: [request, ...prev.sent],
      }));

      setShowRequestModal(false);
      setRequestMessage("");
      setSelectedSkills({ offered: "", requested: "" });
      setSelectedUser(null);
    } catch (error) {
      console.error("Error sending request:", error);
      alert(error.response?.data?.message || "Failed to send request");
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const { request } = await acceptBarterRequest(requestId);

      if (socket) {
        socket.emit("barter_status_updated", {
          userId: request.sender._id,
          request,
        });
      }

      fetchData();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const request = await rejectBarterRequest(requestId);

      if (socket) {
        socket.emit("barter_status_updated", {
          userId: request.sender._id,
          request,
        });
      }

      fetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Sent Requests",
      value: requests.sent.length,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Received",
      value: requests.received.length,
      icon: CheckCircle,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Pending",
      value: requests.received.filter((r) => r.status === "pending").length,
      icon: Clock,
      color: "from-pink-500 to-pink-600",
    },
  ];

  // Calculate counts
  const sentUnreadCount = requests.sent.reduce(
    (acc, r) => acc + (r.unreadCount || 0),
    0
  );
  const receivedUnreadCount = requests.received.reduce(
    (acc, r) => acc + (r.unreadCount || 0),
    0
  );
  const receivedPendingCount = requests.received.filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar onHistoryClick={() => setShowHistory(true)} />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-2 text-gray-900">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {user?.name}
            </span>
            ! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Discover new skills and connect with learners
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}
                >
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["discover", "sent", "received"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:shadow-md border border-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}

              {/* Badge for Received Tab (Pending Requests + Unread Messages) */}
              {tab === "received" &&
                receivedPendingCount + receivedUnreadCount > 0 && (
                  <span className="ml-2 px-2.5 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse shadow-sm border border-white/20">
                    {receivedPendingCount + receivedUnreadCount}
                  </span>
                )}

              {/* Badge for Sent Tab (Unread Messages only) */}
              {tab === "sent" && sentUnreadCount > 0 && (
                <span className="ml-2 px-2.5 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse shadow-sm border border-white/20">
                  {sentUnreadCount}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Search Bar (only for discover tab) */}
        {activeTab === "discover" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchData()}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="Search for users or skills..."
              />
            </div>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === "discover" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {users.map((u, index) => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <UserCard user={u} onSendRequest={handleSendRequest} />
                  </motion.div>
                ))}
                {users.length === 0 && (
                  <div className="col-span-full text-center py-20">
                    <p className="text-gray-500 text-lg">No users found</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "sent" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {requests.sent.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BarterRequestCard
                      request={request}
                      type="sent"
                      onUpdate={fetchData}
                    />
                  </motion.div>
                ))}
                {requests.sent.length === 0 && (
                  <div className="col-span-full text-center py-20">
                    <p className="text-gray-500 text-lg">No sent requests</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "received" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {requests.received.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BarterRequestCard
                      request={request}
                      type="received"
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onUpdate={fetchData}
                    />
                  </motion.div>
                ))}
                {requests.received.length === 0 && (
                  <div className="col-span-full text-center py-20">
                    <p className="text-gray-500 text-lg">
                      No received requests
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Send Request Modal */}
      {showRequestModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Send Barter Request
              </h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skill You Offer
                </label>
                <select
                  value={selectedSkills.offered}
                  onChange={(e) =>
                    setSelectedSkills({
                      ...selectedSkills,
                      offered: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900"
                  required
                >
                  <option value="">Select a skill...</option>
                  {user?.skillsOffered?.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skill You Want
                </label>
                <select
                  value={selectedSkills.requested}
                  onChange={(e) =>
                    setSelectedSkills({
                      ...selectedSkills,
                      requested: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900"
                  required
                >
                  <option value="">Select a skill...</option>
                  {selectedUser.skillsOffered?.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 min-h-[100px] resize-none"
                  placeholder="Introduce yourself and explain why you'd like to exchange skills..."
                />
              </div>

              <motion.button
                onClick={submitRequest}
                disabled={!selectedSkills.offered || !selectedSkills.requested}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Request
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* History Modal */}
      <BarterHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

export default DashboardPage;
