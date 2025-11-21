import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  Filter,
  Search,
  TrendingUp,
  Building2,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getJobRecommendations } from '../api/jobApi';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [page, filter]);

  // Reset page when filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setJobs([]); // Clear current jobs to avoid mixing types
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobRecommendations(page, 'Remote', filter);
      
      if (page === 1) {
        setJobs(data.jobs || []);
      } else {
        setJobs(prevJobs => [...prevJobs, ...(data.jobs || [])]);
      }
      
      setUserSkills(data.userSkills || []);
      setIsMockData(data.isMockData || false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to load job recommendations');
    } finally {
      setLoading(false);
    }
  };



  const formatSalary = (job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Salary not disclosed';
    const currency = job.salaryCurrency || 'USD';
    const min = job.salaryMin ? `${currency} ${job.salaryMin.toLocaleString()}` : '';
    const max = job.salaryMax ? `${currency} ${job.salaryMax.toLocaleString()}` : '';
    return min && max ? `${min} - ${max}` : min || max;
  };

  const getEmploymentTypeBadge = (type) => {
    const badges = {
      FULLTIME: { label: 'Full-time', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      PARTTIME: { label: 'Part-time', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      CONTRACTOR: { label: 'Contract', color: 'bg-orange-100 text-orange-700 border-orange-200' }
    };
    return badges[type] || { label: type, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const JobSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-24 mb-4"></div>
      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Briefcase className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Job Recommendations</h1>
          </div>
          <p className="text-gray-600 text-lg">Opportunities tailored to your skills</p>
        </motion.div>

        {/* Mock Data Warning */}
        {isMockData && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-amber-900 font-medium">Demo Mode</p>
                <p className="text-amber-700 text-sm">Showing sample jobs. Add your RapidAPI key to the server's .env file to see real job listings.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills Section */}
        {userSkills.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-purple-600" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Your Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg font-medium border border-blue-200"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="text-gray-600" size={18} />
              <span className="font-semibold text-gray-900">Filter by Type</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'FULLTIME', 'PARTTIME', 'CONTRACTOR'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === type
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Jobs' : getEmploymentTypeBadge(type).label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="text-red-600 mx-auto mb-3" size={48} />
              <h3 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchJobs}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all inline-flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Jobs Grid */}
        {!error && (
          <>
            {loading && jobs.length === 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <JobSkeleton key={n} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Briefcase className="text-gray-400 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">
                  {userSkills.length === 0
                    ? 'Add skills to your profile to get personalized recommendations!'
                    : 'Try adjusting your filters or check back later.'}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <AnimatePresence>
                  {jobs.map((job, index) => {
                    const typeBadge = getEmploymentTypeBadge(job.employmentType);
                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                      >
                        <div className="p-6">
                          {/* Company Logo & Header */}
                          <div className="flex items-start gap-4 mb-4">
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.company}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <Building2 className="text-white" size={28} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 font-medium">{job.company}</p>
                            </div>
                          </div>

                          {/* Job Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={16} className="flex-shrink-0" />
                              <span className="text-sm">{job.location}</span>
                              {job.isRemote && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">Remote</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign size={16} className="flex-shrink-0" />
                              <span className="text-sm">{formatSalary(job)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} className="flex-shrink-0" />
                              <span className="text-sm">{getTimeAgo(job.datePosted)}</span>
                            </div>
                          </div>

                          {/* Employment Type Badge */}
                          <div className="mb-4">
                            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${typeBadge.color}`}>
                              {typeBadge.label}
                            </span>
                          </div>

                          {/* Description Preview */}
                          {job.description && (
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                              {job.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
                            </p>
                          )}

                          {/* Skills */}
                          {job.requiredSkills && job.requiredSkills.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1.5">
                                {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {job.requiredSkills.length > 4 && (
                                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                    +{job.requiredSkills.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Apply Button */}
                          <a
                            href={job.applyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105"
                          >
                            Apply Now
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {/* Load More (if needed) */}
        {!error && jobs.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <button
              onClick={() => setPage(page + 1)}
              disabled={loading}
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <TrendingUp size={18} />
                  Load More Jobs
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
