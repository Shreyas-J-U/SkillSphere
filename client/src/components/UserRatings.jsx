import React, { useEffect, useState } from "react";
import { Star, User as UserIcon } from "lucide-react";
import axios from "axios";

const UserRatings = ({ userId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRatings();
  }, [userId, currentPage]);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/ratings/user/${userId}?page=${currentPage}&limit=5`
      );
      setRatings(response.data.ratings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Star size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600">No ratings yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <div
          key={rating._id}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={
                  rating.rater?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={rating.rater?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-900">
                  {rating.rater?.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(rating.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {renderStars(rating.rating)}
              <span className="font-bold text-gray-900">{rating.rating}.0</span>
            </div>
          </div>

          {/* Barter Info */}
          {rating.barterRequest && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Barter:</span>{" "}
                {rating.barterRequest.skillOffered} ↔{" "}
                {rating.barterRequest.skillRequested}
              </p>
            </div>
          )}

          {/* Review */}
          {rating.review && (
            <p className="text-gray-700 leading-relaxed mb-4 italic">
              "{rating.review}"
            </p>
          )}

          {/* Category Ratings */}
          {rating.categories &&
            Object.keys(rating.categories).some(
              (key) => rating.categories[key] > 0
            ) && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                {Object.entries(rating.categories).map(([category, value]) => {
                  if (value === 0) return null;
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <div className="flex items-center space-x-1">
                        {renderStars(value)}
                        <span className="text-sm font-medium text-gray-700">
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserRatings;
