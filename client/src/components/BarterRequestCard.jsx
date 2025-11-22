// BarterRequestCard.jsx – updated for react-hot-toast
import { motion } from "framer-motion";
import { MessageSquare, CheckCircle, XCircle, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import RatingModal from "./RatingModal";
import api from "../utils/api";

// 🔥 Use react-hot-toast instead of toastify
import toast from "react-hot-toast";

const BarterRequestCard = ({ request, onAccept, onReject, type, onUpdate }) => {
  const navigate = useNavigate();
  const isSender = type === "sent";
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [canRate, setCanRate] = useState(null);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [completing, setCompleting] = useState(false);

  const isCompleted = request.status === "completed";

  const checkCanRate = async () => {
    try {
      const response = await api.get(`/ratings/can-rate/${request._id}`);
      setCanRate(response.data.canRate);
      if (response.data.otherParticipant) {
        setOtherParticipant(response.data.otherParticipant);
      }
    } catch {
      setCanRate(false);
    }
  };

  useEffect(() => {
    if (isCompleted) checkCanRate();
  }, [request._id, isCompleted]);

  const handleCompleteRequest = async () => {
    setCompleting(true);
    try {
      const response = await api.put(`/barters/${request._id}/complete`);

      toast.success("Barter marked as completed!");

      if (onUpdate) {
        onUpdate(response.data);
        checkCanRate();
      }
    } catch {
      toast.error("Failed to mark complete. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  const handleRatingSubmitted = () => {
    setCanRate(false);
    setShowRatingModal(false);

    toast.success("Thank you for rating!");

    if (onUpdate) onUpdate({ ...request });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: Clock,
        class: "bg-yellow-100 text-yellow-700",
        text: "Pending",
      },
      accepted: {
        icon: CheckCircle,
        class: "bg-green-100 text-green-700",
        text: "Accepted",
      },
      rejected: {
        icon: XCircle,
        class: "bg-red-100 text-red-700",
        text: "Rejected",
      },
      completed: {
        icon: CheckCircle,
        class: "bg-blue-100 text-blue-700",
        text: "Completed",
      },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span
        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${badge.class}`}
      >
        <Icon size={14} />
        <span>{badge.text}</span>
      </span>
    );
  };

  const otherUser = isSender ? request.receiver : request.sender;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
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
              <h3 className="font-semibold text-lg text-gray-900">
                {otherUser?.name}
              </h3>
              <p className="text-sm text-gray-500">{otherUser?.email}</p>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>

        {/* Offer/Request */}
        <div className="space-y-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">
              {isSender ? "You offered:" : "They offered:"}
            </p>
            <p className="font-semibold text-blue-700">
              {request.skillOffered}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
            <p className="text-sm text-gray-600 mb-1">
              {isSender ? "You requested:" : "They requested:"}
            </p>
            <p className="font-semibold text-purple-700">
              {request.skillRequested}
            </p>
          </div>
          {request.message && (
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Message:</p>
              <p className="text-sm text-gray-700">{request.message}</p>
            </div>
          )}
        </div>

        {/* Session */}
        {!isCompleted &&
          request.session &&
          (request.session.status === "scheduled" ||
            request.session.status === "in-progress") && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
                request.session.status === "in-progress"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-blue-50 text-blue-600 border border-blue-100"
              }`}
            >
              {request.session.status === "in-progress" ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                  </span>
                  Session Started - Join Now!
                </>
              ) : (
                <>
                  <Clock size={16} />
                  Session Scheduled
                </>
              )}
            </div>
          )}

        {/* Buttons */}
        <div className="flex gap-2">
          {request.status === "pending" && !isSender && (
            <>
              <motion.button
                onClick={() => {
                  if (onAccept) {
                    onAccept(request._id);
                    toast.success("Request accepted!");
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> Accept
              </motion.button>
              <motion.button
                onClick={() => {
                  if (onReject) {
                    onReject(request._id);
                    toast.error("Request rejected.");
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={18} /> Reject
              </motion.button>
            </>
          )}

          {request.status === "accepted" && (
            <>
              <motion.button
                onClick={() => navigate(`/chat/${request._id}`)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Chat
                {request.unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {request.unreadCount}
                  </span>
                )}
              </motion.button>

              {(() => {
                const hasCompleted = isSender
                  ? request.senderCompleted
                  : request.receiverCompleted;
                if (hasCompleted) {
                  return (
                    <div className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-xl font-semibold flex items-center justify-center gap-2 border border-yellow-200">
                      <Clock size={18} /> Waiting for partner
                    </div>
                  );
                }
                return (
                  <motion.button
                    onClick={handleCompleteRequest}
                    disabled={completing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={18} />
                    {completing ? "Marking..." : "Mark Complete"}
                  </motion.button>
                );
              })()}
            </>
          )}

          {isCompleted && canRate === true && (
            <motion.button
              onClick={() => setShowRatingModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Star size={18} /> Rate Experience
            </motion.button>
          )}
          {isCompleted && canRate === false && (
            <div className="w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              <span>Rated</span>
            </div>
          )}
        </div>
      </motion.div>

      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          barterRequest={request}
          otherUser={otherParticipant}
          onClose={() => setShowRatingModal(false)}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </>
  );
};

export default BarterRequestCard;
