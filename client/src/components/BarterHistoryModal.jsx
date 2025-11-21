import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getBarterRequests } from '../api/barterApi';
import BarterRequestCard from './BarterRequestCard';

const BarterHistoryModal = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getBarterRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-2xl font-bold text-gray-900">Barter History</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-lg transition-all"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'accepted', 'completed', 'rejected'].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => setFilter(status)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        filter === status
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div 
                className="p-6 overflow-y-auto bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" 
                style={{ 
                  maxHeight: 'calc(90vh - 200px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f1f5f9'
                }}
              >
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No barter requests found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRequests.map((request) => (
                      <BarterRequestCard
                        key={request._id}
                        request={request}
                        type={request.sender._id === request.sender ? 'sent' : 'received'}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BarterHistoryModal;
