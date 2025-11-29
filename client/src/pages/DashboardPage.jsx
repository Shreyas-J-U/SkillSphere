import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import toast from "react-hot-toast";

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
  const { socket, onlineUsers } = useSocket();

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

      toast.success(`Barter request sent to ${selectedUser.name}!`);

      setShowRequestModal(false);
      setRequestMessage("");
      setSelectedSkills({ offered: "", requested: "" });
      setSelectedUser(null);
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error(error.response?.data?.message || "Failed to send request");
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
      color: "bg-blue-500",
      gradient: "from-blue-500/20 to-blue-600/20",
      text: "text-blue-600",
    },
    {
      label: "Sent Requests",
      value: requests.sent.length,
      icon: TrendingUp,
      color: "bg-purple-500",
      gradient: "from-purple-500/20 to-purple-600/20",
      text: "text-purple-600",
    },
    {
      label: "Received",
      value: requests.received.length,
      icon: CheckCircle,
      color: "bg-indigo-500",
      gradient: "from-indigo-500/20 to-indigo-600/20",
      text: "text-indigo-600",
    },
    {
      label: "Pending",
      value: requests.received.filter((r) => r.status === "pending").length,
      icon: Clock,
      color: "bg-pink-500",
      gradient: "from-pink-500/20 to-pink-600/20",
      text: "text-pink-600",
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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <Navbar onHistoryClick={() => setShowHistory(true)} />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user?.name?.split(" ")[0]}
              </span>
              ! 👋
            </h1>
            <p className="text-slate-500 text-lg">
              Ready to learn something new today?
            </p>
          </motion.div>

          {activeTab === "discover" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-96 relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchData()}
                className="block w-full pl-11 pr-4 py-3 text-slate-700 bg-white border border-slate-200 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                placeholder="Search skills or people..."
              />
            </motion.div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500`}
                ></div>
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-${stat.color}/30`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-slate-500 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs & Content */}
        <div className="space-y-6">
          {/* Custom Tab Switcher */}
          <div className="flex justify-center md:justify-start">
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex relative">
              {["discover", "sent", "received"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-colors z-10 ${
                    activeTab === tab
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 rounded-xl"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "received" &&
                      receivedPendingCount + receivedUnreadCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                          {receivedPendingCount + receivedUnreadCount}
                        </span>
                      )}
                    {tab === "sent" && sentUnreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {sentUnreadCount}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">
                  Loading amazing people...
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "discover" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {users.map((u, index) => (
                        <UserCard
                          key={u._id}
                          user={u}
                          onSendRequest={handleSendRequest}
                          isOnline={socket && onlineUsers.includes(u._id)}
                        />
                      ))}
                      {users.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-10 h-10 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No users found
                          </h3>
                          <p className="text-slate-500">
                            Try adjusting your search terms
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "sent" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {requests.sent.map((request) => (
                        <BarterRequestCard
                          key={request._id}
                          request={request}
                          type="sent"
                          onUpdate={fetchData}
                        />
                      ))}
                      {requests.sent.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-10 h-10 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No sent requests
                          </h3>
                          <p className="text-slate-500">
                            Go to Discover to find people to swap skills with!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "received" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {requests.received.map((request) => (
                        <BarterRequestCard
                          key={request._id}
                          request={request}
                          type="received"
                          onAccept={handleAccept}
                          onReject={handleReject}
                          onUpdate={fetchData}
                        />
                      ))}
                      {requests.received.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No received requests
                          </h3>
                          <p className="text-slate-500">
                            When someone wants to swap with you, they'll appear
                            here.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Send Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Propose a Swap
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    with{" "}
                    <span className="font-semibold text-blue-600">
                      {selectedUser.name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X
                    size={24}
                    className="text-slate-400 hover:text-slate-600"
                  />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      You Offer
                    </label>
                    <select
                      value={selectedSkills.offered}
                      onChange={(e) =>
                        setSelectedSkills({
                          ...selectedSkills,
                          offered: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 font-medium appearance-none"
                      required
                    >
                      <option value="">Select skill...</option>
                      {user?.skillsOffered?.map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      You Want
                    </label>
                    <select
                      value={selectedSkills.requested}
                      onChange={(e) =>
                        setSelectedSkills({
                          ...selectedSkills,
                          requested: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 font-medium appearance-none"
                      required
                    >
                      <option value="">Select skill...</option>
                      {selectedUser.skillsOffered?.map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 min-h-[120px] resize-none placeholder-slate-400"
                    placeholder="Hi! I'd love to learn from you. I can help you with..."
                  />
                </div>

                <motion.button
                  onClick={submitRequest}
                  disabled={
                    !selectedSkills.offered || !selectedSkills.requested
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Proposal
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <BarterHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

export default DashboardPage;
