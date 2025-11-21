import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import RatingModal from './RatingModal';

const BarterRequestCard = ({ request, onUpdate }) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [canRate, setCanRate] = useState(false);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [loading, setLoading] = useState(false);

  const isCompleted = request.status === 'completed';
  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;
  const isSender = request.sender._id === currentUserId;
  const otherUser = isSender ? request.receiver : request.sender;

  useEffect(() => {
    if (isCompleted) {
      checkCanRate();
    }
  }, [request._id, isCompleted]);

  const checkCanRate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ratings/can-rate/${request._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCanRate(response.data.canRate);
      if (response.data.otherParticipant) {
        setOtherParticipant(response.data.otherParticipant);
      }
    } catch (error) {
      console.error('Error checking rating eligibility:', error);
    }
  };

  const handleCompleteRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/barters/${request._id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (onUpdate) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error completing request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmitted = (rating) => {
    setCanRate(false);
    // Optionally refresh the request data
    if (onUpdate) {
      onUpdate({ ...request });
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={otherUser.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt={otherUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{otherUser.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {otherUser.averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{otherUser.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400">({otherUser.totalRatings})</span>
                </div>
              )}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            request.status === 'accepted' ? 'bg-green-100 text-green-700' :
            request.status === 'completed' ? 'bg-blue-100 text-blue-700' :
            'bg-red-100 text-red-700'
          }`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        {/* Barter Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">You Offer</p>
              <p className="font-semibold text-gray-900">{request.skillOffered}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">You Want</p>
              <p className="font-semibold text-gray-900">{request.skillRequested}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {request.message && (
          <p className="text-gray-600 text-sm mb-4 italic">"{request.message}"</p>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          {request.status === 'accepted' && (
            <>
              <button
                onClick={() => window.location.href = `/chat/${request._id}`}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle size={18} />
                <span>Chat</span>
              </button>
              <button
                onClick={handleCompleteRequest}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <CheckCircle size={18} />
                <span>{loading ? 'Completing...' : 'Mark Complete'}</span>
              </button>
            </>
          )}

          {isCompleted && canRate && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Star size={18} />
              <span>Rate Experience</span>
            </button>
          )}

          {isCompleted && !canRate && (
            <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center space-x-2">
              <CheckCircle size={18} className="text-green-600" />
              <span>Rated</span>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        barterRequest={request}
        otherUser={otherParticipant || otherUser}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </>
  );
};

export default BarterRequestCard;
