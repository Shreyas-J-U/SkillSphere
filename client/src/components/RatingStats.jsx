import React from "react";
import { Star, TrendingUp, Award, Users } from "lucide-react";

const RatingStats = ({ user }) => {
  const { averageRating = 0, totalRatings = 0, ratingBreakdown = {} } = user;

  const categories = [
    { key: "communication", label: "Communication", icon: Users },
    { key: "skillQuality", label: "Skill Quality", icon: Award },
    { key: "punctuality", label: "Punctuality", icon: TrendingUp },
    { key: "professionalism", label: "Professionalism", icon: Star },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderProgressBar = (value) => {
    const percentage = (value / 5) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  if (totalRatings === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <Star size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600 font-medium">No ratings yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Complete barters to receive ratings
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      {/* Overall Rating */}
      <div className="text-center pb-6 border-b border-gray-200">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-xs text-white opacity-90">out of 5</div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 mb-2">
          {renderStars(averageRating)}
        </div>
        <p className="text-sm text-gray-600">
          Based on {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
        </p>
      </div>

      {/* Category Breakdown */}
      {Object.keys(ratingBreakdown).some((key) => ratingBreakdown[key] > 0) && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900">Rating Breakdown</h4>
          {categories.map(({ key, label, icon: Icon }) => {
            const value = ratingBreakdown[key] || 0;
            if (value === 0) return null;

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {value.toFixed(1)}
                  </span>
                </div>
                {renderProgressBar(value)}
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Distribution (Optional - can be added later with more data) */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Award size={16} className="text-blue-600" />
          <span>
            {averageRating >= 4.5
              ? "Excellent"
              : averageRating >= 4.0
              ? "Very Good"
              : averageRating >= 3.0
              ? "Good"
              : "Fair"}{" "}
            Reputation
          </span>
        </div>
      </div>
    </div>
  );
};

export default RatingStats;
