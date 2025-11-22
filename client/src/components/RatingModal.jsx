import React, { useState } from "react";
import { X, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

const RatingModal = ({
  isOpen,
  onClose,
  barterRequest,
  otherUser,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [categories, setCategories] = useState({
    communication: 0,
    skillQuality: 0,
    punctuality: 0,
    professionalism: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categoryLabels = {
    communication: "Communication",
    skillQuality: "Skill Quality",
    punctuality: "Punctuality",
    professionalism: "Professionalism",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select an overall rating");
      toast.error("Please select an overall rating.");
      return;
    }

    // 🔹 Ensure all categories are rated
    const unratedCategories = Object.entries(categories)
      .filter(([_, value]) => value === 0)
      .map(([key]) => categoryLabels[key]);

    if (unratedCategories.length > 0) {
      const message = `Please rate: ${unratedCategories.join(", ")}`;
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError("");
    const loadingToast = toast.loading("Submitting rating...");

    try {
      const response = await api.post("/ratings", {
        barterRequestId: barterRequest._id,
        rateeId: otherUser._id,
        rating,
        review,
        categories,
      });

      if (onRatingSubmitted) {
        onRatingSubmitted(response.data);
      }

      toast.dismiss(loadingToast);
      toast.success("Rating submitted successfully!");
      onClose();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Failed to submit rating");
      setError(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value, onChange, size = 24) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={`${
              star <= (hoverRating || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Rate Your Experience
            </h2>
            <p className="text-gray-600 mt-1">
              How was your barter with {otherUser?.name}?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <img
              src={
                otherUser?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={otherUser?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-gray-900">{otherUser?.name}</h3>
              <p className="text-sm text-gray-600">
                {barterRequest?.skillOffered} ↔ {barterRequest?.skillRequested}
              </p>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Overall Rating *
            </label>
            {renderStars(rating, setRating, 32)}
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Category Ratings */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Detailed Ratings (Required)
            </label>
            {Object.keys(categories).map((category) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700">
                  {categoryLabels[category]}
                </span>
                {renderStars(
                  categories[category],
                  (value) =>
                    setCategories({ ...categories, [category]: value }),
                  20
                )}
              </div>
            ))}
          </div>

          {/* Review */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 text-right">
              {review.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
