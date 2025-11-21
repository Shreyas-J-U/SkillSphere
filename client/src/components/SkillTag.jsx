import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const SkillTag = ({ skill, onRemove, removable = false, type = 'offered' }) => {
  const colors = {
    offered: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    wanted: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${colors[type]}`}
    >
      <span>{skill}</span>
      {removable && (
        <button
          onClick={() => onRemove(skill)}
          className="hover:opacity-70 rounded-full transition-opacity"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
};

export default SkillTag;
