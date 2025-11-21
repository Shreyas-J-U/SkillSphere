import { motion } from 'framer-motion';
import { Send, User as UserIcon, Star } from 'lucide-react';
import SkillTag from './SkillTag';

const UserCard = ({ user, onSendRequest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-shrink-0">
          <img
            src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-md object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-gray-900 truncate">{user.name}</h3>
          {/* <p className="text-sm text-gray-500 truncate">{user.email}</p> */}
          {user.averageRating > 0 && (
            <div className="flex items-center space-x-1 mt-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{user.averageRating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({user.totalRatings})</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 h-12">
        {user.bio ? (
          <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No bio available</p>
        )}
      </div>

      <div className="space-y-4 mb-6 flex-1">
        <div className="h-20">
          {user.skillsOffered && user.skillsOffered.length > 0 ? (
            <>
              <p className="text-sm text-gray-700 mb-2 font-semibold">Offers:</p>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.slice(0, 3).map((skill, index) => (
                  <SkillTag key={index} skill={skill} type="offered" />
                ))}
                {user.skillsOffered.length > 3 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                    +{user.skillsOffered.length - 3}
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No skills offered listed</p>
          )}
        </div>

        <div className="h-20">
          {user.skillsWanted && user.skillsWanted.length > 0 ? (
            <>
              <p className="text-sm text-gray-700 mb-2 font-semibold">Wants to learn:</p>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted.slice(0, 3).map((skill, index) => (
                  <SkillTag key={index} skill={skill} type="wanted" />
                ))}
                {user.skillsWanted.length > 3 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                    +{user.skillsWanted.length - 3}
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No learning goals listed</p>
          )}
        </div>
      </div>

      <motion.button
        onClick={() => onSendRequest(user)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-auto"
      >
        <Send size={18} />
        Send Request
      </motion.button>
    </motion.div>
  );
};

export default UserCard;
