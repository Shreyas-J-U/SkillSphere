import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Send,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  Play,
  Square,
  Clock,
  History,
} from "lucide-react";
import Navbar from "../components/Navbar";
import {
  getOrCreateChat,
  getChatMessages,
  sendMessage as apiSendMessage,
} from "../api/chatApi";
import { getBarterRequestById, completeBarterRequest } from "../api/barterApi";
import {
  createSession,
  getSessionByBarterId,
  markUserReady,
  startMeetingInstance,
  endMeetingInstance,
} from "../api/sessionApi";
import { uploadFile } from "../api/uploadApi";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

// 🔥 Add toast
import toast from "react-hot-toast";

const ChatPage = () => {
  const { barterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [barterRequest, setBarterRequest] = useState(null);
  const [session, setSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [barterId]);

  useEffect(() => {
    if (socket && chat) {
      socket.emit("join_chat", chat._id);

      socket.on("new_message", handleNewMessage);
      socket.on("participant_ready", handleParticipantReady);

      return () => {
        socket.emit("leave_chat", chat._id);
        socket.off("new_message");
        socket.off("participant_ready");
      };
    }
  }, [socket, chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [barterData, chatData] = await Promise.all([
        getBarterRequestById(barterId),
        getOrCreateChat(barterId),
      ]);

      setBarterRequest(barterData);
      setChat(chatData);

      const messagesData = await getChatMessages(chatData._id);
      setMessages(messagesData);

      try {
        const sessionData = await getSessionByBarterId(barterId);
        if (sessionData?._id) {
          setSession(sessionData);
        } else {
          setSession(null);
        }
      } catch (err) {
        // No session yet
      }
    } catch {
      toast.error("Failed to load chat data");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleParticipantReady = () => {
    fetchData();
  };

  const sendMessage = async (
    content,
    messageType = "text",
    mediaUrl = null
  ) => {
    if ((!content.trim() && !mediaUrl) || uploading) return;

    const messageData = {
      chatId: chat._id,
      content,
      messageType,
      mediaUrl,
    };

    try {
      if (socket?.connected) {
        socket.emit("send_message", messageData);
      } else {
        const savedMessage = await apiSendMessage(chat._id, messageData);
        setMessages((prev) => [...prev, savedMessage]);
      }
      setNewMessage("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await uploadFile(file);
      const messageType = file.type.startsWith("image/") ? "image" : "file";
      await sendMessage(file.name, messageType, url);
      toast.success("File uploaded successfully");
    } catch {
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const sessionData = await createSession({
        barterRequestId: barterId,
        meetLink,
      });
      setSession(sessionData);
      setShowSessionModal(false);
      setMeetLink("");
      toast.success("Session created successfully");
    } catch {
      toast.error("Failed to create session");
    }
  };

  const handleMarkReady = async () => {
    try {
      const updatedSession = await markUserReady(session._id);
      setSession(updatedSession);

      socket?.emit("session_ready", {
        sessionId: session._id,
        barterRequestId: barterId,
        participants: session.participants.map((p) => p.user._id),
      });

      toast.success("You're marked as ready");
    } catch {
      toast.error("Failed to mark as ready");
    }
  };

  const handleStartMeeting = async () => {
    try {
      const updatedSession = await startMeetingInstance(session._id);
      setSession(updatedSession);
      window.open(session.meetLink, "_blank");
      toast.success("Meeting started");
    } catch {
      toast.error("Failed to start meeting");
    }
  };

  const handleEndMeeting = async () => {
    if (confirm("End the current meeting? Time will be recorded.")) {
      try {
        const updatedSession = await endMeetingInstance(session._id);
        setSession(updatedSession);

        toast.success(
          `Meeting ended (Duration: ${
            updatedSession.meetingInstances.at(-1).duration
          } min)`
        );
      } catch {
        toast.error("Failed to end meeting");
      }
    }
  };

  const handleCompleteRequest = async () => {
    if (confirm("Mark this barter as completed?")) {
      try {
        await completeBarterRequest(barterId);
        toast.success("Barter marked as completed!");
        navigate("/dashboard");
      } catch {
        toast.error("Failed to complete barter");
      }
    }
  };

  const otherUser =
    barterRequest?.sender?._id === user?._id
      ? barterRequest?.receiver
      : barterRequest?.sender;

  const isUserReady = session?.participants?.find(
    (p) => p.user._id === user?._id
  )?.isReady;
  const isOtherReady = session?.participants?.find(
    (p) => p.user._id !== user?._id
  )?.isReady;
  const bothReady = isUserReady && isOtherReady;
  const hasInProgressMeeting = session?.meetingInstances?.some(
    (inst) => inst.status === "in-progress"
  );
  const currentInstance = session?.meetingInstances?.find(
    (inst) => inst.status === "in-progress"
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="flex-1 container mx-auto px-6 py-6 flex flex-col max-w-5xl relative z-10">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-4 flex items-center justify-between shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600"
            >
              <ArrowLeft size={24} />
            </button>
            <img
              src={
                otherUser?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={otherUser?.name}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
            />
            <div>
              <h2 className="font-bold text-lg text-gray-900">
                {otherUser?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {barterRequest?.skillOffered} ↔️ {barterRequest?.skillRequested}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            {!session && (
              <button
                onClick={() => setShowSessionModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Video size={18} />
                Create Session
              </button>
            )}
          </div>
        </div>

        {/* Session Info */}
        {session && (
          <div className="bg-blue-50 p-4 border-x border-blue-100">
            <div className="space-y-4">
              {/* Ready Status & Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Learning Session</p>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        isUserReady
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      You: {isUserReady ? "Ready" : "Not Ready"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        isOtherReady
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {otherUser?.name}: {isOtherReady ? "Ready" : "Not Ready"}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!isUserReady && !hasInProgressMeeting && (
                    <button
                      onClick={handleMarkReady}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {bothReady && !hasInProgressMeeting && (
                    <button
                      onClick={handleStartMeeting}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <Play size={18} />
                      Start Meeting
                    </button>
                  )}
                  {hasInProgressMeeting && (
                    <button
                      onClick={handleEndMeeting}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      <Square size={18} />
                      End Meeting
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-4 py-2 border-2 border-blue-200 text-blue-700 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2"
                  >
                    <History size={18} />
                    History
                  </button>
                </div>
              </div>

              {/* Current Meeting Status */}
              {hasInProgressMeeting && currentInstance && (
                <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-gray-900">
                        Meeting #{session.currentInstance} in Progress
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>
                        Started:{" "}
                        {new Date(
                          currentInstance.startedAt
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Meeting History */}
              {showHistory &&
                session.meetingInstances &&
                session.meetingInstances.length > 0 && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Meeting History
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>Total: {session.totalDuration || 0} minutes</span>
                      </div>
                    </div>
                    <div
                      className="space-y-2 max-h-40 overflow-y-auto"
                      style={{ scrollbarWidth: "thin" }}
                    >
                      {session.meetingInstances.map((instance, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                Meeting #{instance.instanceNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(instance.startedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              {instance.status === "completed" ? (
                                <>
                                  <p className="font-semibold text-green-600">
                                    {instance.duration} min
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Completed
                                  </p>
                                </>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                                  In Progress
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          className="flex-1 bg-white border-x border-gray-100 p-4 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.map((message) => {
            const isOwn = message.sender._id === user?._id;
            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex mb-4 ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${
                      isOwn
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.messageType === "image" && (
                      <img
                        src={message.mediaUrl}
                        alt="Shared image"
                        className="rounded-lg mb-2 max-w-full"
                      />
                    )}
                    {message.messageType === "file" && (
                      <a
                        href={message.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline ${
                          isOwn ? "text-blue-100" : "text-blue-600"
                        }`}
                      >
                        📎 {message.content}
                      </a>
                    )}
                    {message.messageType === "text" && <p>{message.content}</p>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-2">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-2xl p-4 flex items-center space-x-2 shadow-lg border border-gray-100">
          <label className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-all text-gray-500 hover:text-blue-600">
            <ImageIcon size={20} />
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage(newMessage);
              }
            }}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900"
            placeholder="Type a message..."
            disabled={uploading}
          />

          <button
            onClick={() => sendMessage(newMessage)}
            disabled={!newMessage.trim() || uploading}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Create Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Create Learning Session
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Google Meet Link
                </label>
                <input
                  type="url"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleCreateSession}
                  disabled={!meetLink}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Create Session
                </button>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
