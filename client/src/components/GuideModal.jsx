import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Users, MessageSquare, Calendar } from "lucide-react";

const GuideModal = ({ isOpen, onClose }) => {
  const steps = [
    {
      icon: Users,
      title: "Discover Skills",
      description:
        "Browse through our community of learners and find people who offer skills you want to learn.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Send Requests",
      description:
        "Send a barter request offering your skill in exchange for theirs. Include a personal message!",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: BookOpen,
      title: "Start Learning",
      description:
        "Once accepted, chat with your learning partner and schedule sessions to exchange knowledge.",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Calendar,
      title: "Schedule Sessions",
      description:
        "Create Google Meet sessions, mark yourself ready, and start your learning journey together!",
      gradient: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-2xl font-bold text-gray-900">
                  How SkillSphere Works
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-lg transition-all"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-4 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Got it! Let's start
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GuideModal;
