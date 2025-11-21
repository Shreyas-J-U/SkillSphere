import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award, 
  Users,
  MessageSquare,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import BarterHistoryModal from '../components/BarterHistoryModal';
import { getBarterRequests } from '../api/barterApi';
import { useAuth } from '../context/AuthContext';

const ActivityPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [stats, setStats] = useState({
    totalBarters: 0,
    completedBarters: 0,
    activeBarters: 0,
    totalHours: 0,
    skillsLearned: 0,
    skillsTaught: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sentRequests, receivedRequests] = await Promise.all([
        getBarterRequests({ type: 'sent' }),
        getBarterRequests({ type: 'received' })
      ]);

      setRequests({ sent: sentRequests, received: receivedRequests });

      // Calculate stats
      const allRequests = [...sentRequests, ...receivedRequests];
      const completed = allRequests.filter(r => r.status === 'completed').length;
      const active = allRequests.filter(r => r.status === 'accepted').length;
      
      setStats({
        totalBarters: allRequests.length,
        completedBarters: completed,
        activeBarters: active,
        totalHours: completed * 2,
        skillsLearned: new Set(receivedRequests.filter(r => r.status === 'completed').map(r => r.skillOffered)).size,
        skillsTaught: new Set(sentRequests.filter(r => r.status === 'completed').map(r => r.skillOffered)).size
      });
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'accepted':
        return <Video className="text-blue-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-yellow-500" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar onHistoryClick={() => setShowHistory(true)} />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Activity Dashboard
          </h1>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: Users, label: 'Total Barters', value: stats.totalBarters, gradient: 'from-blue-500 to-cyan-500' },
            { icon: CheckCircle, label: 'Completed', value: stats.completedBarters, gradient: 'from-green-500 to-emerald-500' },
            { icon: Video, label: 'Active', value: stats.activeBarters, gradient: 'from-purple-500 to-pink-500' },
            { icon: Clock, label: 'Total Hours', value: stats.totalHours, gradient: 'from-orange-500 to-red-500' },
            { icon: TrendingUp, label: 'Skills Learned', value: stats.skillsLearned, gradient: 'from-indigo-500 to-purple-500' },
            { icon: Award, label: 'Skills Taught', value: stats.skillsTaught, gradient: 'from-yellow-500 to-orange-500' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <button onClick={() => setShowHistory(true)} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium">View All History</button>
          </div>

          <div className="space-y-4">
            {[...requests.sent, ...requests.received].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10).map((request) => {
              const isSent = request.sender._id === user?._id;
              const otherUser = isSent ? request.receiver : request.sender;

              return (
                <motion.div key={request._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-all border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">{getStatusIcon(request.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <img 
                            src={otherUser.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                            alt={otherUser.name} 
                            className="w-8 h-8 rounded-full border-2 border-blue-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                            }}
                          />
                          <p className="font-medium truncate text-gray-900">
                            {isSent ? 'You' : otherUser.name} offered <span className="text-blue-600">{request.skillOffered}</span> for <span className="text-purple-600">{request.skillRequested}</span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1"><Calendar size={14} /><span>{new Date(request.createdAt).toLocaleDateString()}</span></span>
                          <span className="flex items-center space-x-1"><MessageSquare size={14} /><span>{isSent ? 'Sent' : 'Received'}</span></span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(request.status)} ml-4`}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                  </div>
                </motion.div>
              );
            })}
            {requests.sent.length === 0 && requests.received.length === 0 && (
              <div className="text-center py-12"><p className="text-gray-500">No activity yet. Start by discovering skills!</p></div>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900"><TrendingUp className="mr-2 text-blue-600" size={24} />Skills You're Learning</h3>
            <div className="space-y-2">
              {(() => {
                // Skills you're learning: skillRequested from sent requests + skillOffered from received requests
                const learningSkills = [
                  ...requests.sent.filter(r => r.status === 'accepted' || r.status === 'completed').map(r => r.skillRequested),
                  ...requests.received.filter(r => r.status === 'accepted' || r.status === 'completed').map(r => r.skillOffered)
                ];
                const uniqueLearningSkills = [...new Set(learningSkills)];
                
                return uniqueLearningSkills.length > 0 ? (
                  uniqueLearningSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-gray-900">{skill}</span>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold">Active</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No active learning sessions</p>
                );
              })()}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900"><Award className="mr-2 text-green-600" size={24} />Skills You're Teaching</h3>
            <div className="space-y-2">
              {(() => {
                // Skills you're teaching: skillOffered from sent requests + skillRequested from received requests
                const teachingSkills = [
                  ...requests.sent.filter(r => r.status === 'accepted' || r.status === 'completed').map(r => r.skillOffered),
                  ...requests.received.filter(r => r.status === 'accepted' || r.status === 'completed').map(r => r.skillRequested)
                ];
                const uniqueTeachingSkills = [...new Set(teachingSkills)];
                
                return uniqueTeachingSkills.length > 0 ? (
                  uniqueTeachingSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                      <span className="text-gray-900">{skill}</span>
                      <span className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold">Active</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No active teaching sessions</p>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </div>

      <BarterHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
};

export default ActivityPage;
