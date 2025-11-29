import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Send,
  Image as ImageIcon,
  MoreHorizontal,
  Share2,
  X,
  Award,
  Bookmark,
  Flag,
  Edit3,
  Trash2,
  Filter,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  Zap,
  Target,
  Calendar,
  MapPin,
  Mail,
  Link as LinkIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  createPost,
  getPosts,
  likePost,
  addComment,
} from "../api/communityApi";
import { uploadFile } from "../api/uploadApi";
import toast from "react-hot-toast";

const COLORS = {
  gradientPrimary: "from-blue-600 via-purple-600 to-pink-500",
};

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showOptions, setShowOptions] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await uploadFile(file);
      setSelectedImage(url);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;

    try {
      const newPost = await createPost({
        content: newPostContent,
        image: selectedImage,
      });
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setSelectedImage(null);
      toast.success("Post shared!");
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const updatedLikes = await likePost(postId);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        )
      );
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (postId) => {
    if (!commentContent.trim()) return;

    try {
      const updatedComments = await addComment(postId, commentContent);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: updatedComments } : post
        )
      );
      setCommentContent("");
      setCommentingPostId(null);
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
    setShowOptions(null);
    toast.success("Post deleted");
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "my-posts" && post.user?._id === user?._id) ||
      (selectedFilter === "popular" && post.likes?.length > 1);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 font-semibold">
            Loading community...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
          <p className="text-slate-600 font-semibold">
            Please log in to view the community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - User Profile */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* User Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-100"
              >
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1">
                      <img
                        src={
                          user?.avatar ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={user?.name}
                        className="w-full h-full rounded-full border-4 border-white object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-4 border-white">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-1">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    @{user?.name?.toLowerCase().replace(/\s/g, "")}
                  </p>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {posts.filter((p) => p.user?._id === user?._id).length}
                    </div>
                    <div className="text-xs text-slate-500">Posts</div>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {posts.reduce(
                        (acc, p) =>
                          acc + (p.likes?.includes(user?._id) ? 1 : 0),
                        0
                      )}
                    </div>
                    <div className="text-xs text-slate-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {posts.reduce(
                        (acc, p) =>
                          acc +
                          (p.comments?.filter((c) => c.user?._id === user?._id)
                            .length || 0),
                        0
                      )}
                    </div>
                    <div className="text-xs text-slate-500">Comments</div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">
                      {user?.email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{user?.location || "Location not set"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      Joined{" "}
                      {new Date(
                        user?.createdAt || Date.now()
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Skills Badge */}
                {user?.skills && user.skills.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      My Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-purple-600 rounded-full text-xs font-semibold border border-purple-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Edit Profile
                </button>
              </motion.div>

              {/* Trending Topics */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-100"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900">Trending Topics</h3>
                </div>
                <div className="space-y-2">
                  {[
                    "#SkillSwap",
                    "#Python",
                    "#WebDev",
                    "#Design",
                    "#Learning",
                  ].map((tag, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 group-hover:text-purple-600 text-sm">
                          {tag}
                        </span>
                        <span className="text-xs text-slate-400">
                          {Math.floor(Math.random() * 50 + 10)} posts
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`bg-gradient-to-br ${COLORS.gradientPrimary} rounded-2xl shadow-xl p-6 text-white`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold">Community Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Total Posts</span>
                    <span className="font-bold text-xl">{posts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Active Today</span>
                    <span className="font-bold text-xl">
                      {Math.floor(posts.length * 0.6)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Engagement</span>
                    <span className="font-bold text-xl">
                      {posts.reduce(
                        (acc, p) =>
                          acc +
                          (p.likes?.length || 0) +
                          (p.comments?.length || 0),
                        0
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content - Posts Feed */}
          <div className="lg:col-span-9">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-4 border-2 border-slate-100 mb-6"
            >
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts, people, topics..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-slate-700"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    showFilters
                      ? "bg-purple-50 border-purple-500 text-purple-600"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-slate-100"
                  >
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { id: "all", label: "All Posts" },
                        { id: "my-posts", label: "My Posts" },
                        { id: "popular", label: "Popular" },
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedFilter(filter.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            selectedFilter === filter.id
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Create Post Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-100 mb-6"
            >
              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-0.5 flex-shrink-0">
                  <img
                    src={
                      user?.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={user?.name}
                    className="w-full h-full rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your thoughts with the community..."
                    className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none resize-none h-28 text-slate-700 placeholder:text-slate-400"
                  />

                  {selectedImage && (
                    <div className="relative mt-4 inline-block">
                      <img
                        src={selectedImage}
                        alt="Upload preview"
                        className="h-40 rounded-xl object-cover border-2 border-slate-200"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <label className="flex items-center space-x-2 text-slate-500 hover:text-purple-600 cursor-pointer transition-colors px-4 py-2 rounded-xl hover:bg-purple-50">
                      <ImageIcon size={20} />
                      <span className="text-sm font-semibold">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>

                    <button
                      onClick={handleCreatePost}
                      disabled={
                        (!newPostContent.trim() && !selectedImage) || uploading
                      }
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send size={18} />
                          Post
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 overflow-hidden hover:shadow-2xl transition-all"
                  >
                    {/* Post Header */}
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-0.5">
                          <img
                            src={
                              post.user?.avatar ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt={post.user?.name}
                            className="w-full h-full rounded-full border-2 border-white object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {post.user?.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {new Date(post.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowOptions(
                              showOptions === post._id ? null : post._id
                            )
                          }
                          className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        <AnimatePresence>
                          {showOptions === post._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-slate-200 py-2 z-10"
                            >
                              {post.user?._id === user?._id ? (
                                <>
                                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Edit3 size={16} />
                                    Edit Post
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(post._id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 size={16} />
                                    Delete Post
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Bookmark size={16} />
                                    Save Post
                                  </button>
                                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Flag size={16} />
                                    Report
                                  </button>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-6 pb-4">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-4 break-words">
                        {post.content}
                      </p>
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full rounded-xl max-h-[500px] object-cover border-2 border-slate-100"
                        />
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t-2 border-slate-100">
                      <div className="flex space-x-6">
                        <button
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center space-x-2 transition-all group ${
                            post.likes?.includes(user?._id)
                              ? "text-red-500"
                              : "text-slate-500 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            size={22}
                            fill={
                              post.likes?.includes(user?._id)
                                ? "currentColor"
                                : "none"
                            }
                            className="group-hover:scale-110 transition-transform"
                          />
                          <span className="font-bold">
                            {post.likes?.length || 0}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            setCommentingPostId(
                              commentingPostId === post._id ? null : post._id
                            )
                          }
                          className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors group"
                        >
                          <MessageSquare
                            size={22}
                            className="group-hover:scale-110 transition-transform"
                          />
                          <span className="font-bold">
                            {post.comments?.length || 0}
                          </span>
                        </button>

                        <button className="flex items-center space-x-2 text-slate-500 hover:text-green-600 transition-colors group">
                          <Share2
                            size={22}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {commentingPostId === post._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-slate-50 border-t-2 border-slate-100"
                        >
                          <div className="p-6 space-y-4">
                            {post.comments?.map((comment, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex space-x-3"
                              >
                                <img
                                  src={
                                    comment.user?.avatar ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                  }
                                  alt={comment.user?.name}
                                  className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                                />
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-md flex-1 border-2 border-slate-100">
                                  <p className="font-bold text-sm text-slate-900 mb-1">
                                    {comment.user?.name}
                                  </p>
                                  <p className="text-slate-700 text-sm leading-relaxed break-words">
                                    {comment.content}
                                  </p>
                                </div>
                              </motion.div>
                            ))}

                            <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-200">
                              <img
                                src={
                                  user?.avatar ||
                                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt={user?.name}
                                className="w-10 h-10 rounded-full border-2 border-purple-200 object-cover"
                              />
                              <input
                                type="text"
                                value={commentContent}
                                onChange={(e) =>
                                  setCommentContent(e.target.value)
                                }
                                placeholder="Write a thoughtful comment..."
                                className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-full focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleComment(post._id);
                                }}
                              />
                              <button
                                onClick={() => handleComment(post._id)}
                                disabled={!commentContent.trim()}
                                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send size={18} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-2xl shadow-xl border-2 border-slate-100"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    No posts found
                  </h3>
                  <p className="text-slate-600">
                    Try adjusting your filters or search query
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
