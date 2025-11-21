import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, X, Plus, Upload, User as UserIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import SkillTag from '../components/SkillTag';
import BarterHistoryModal from '../components/BarterHistoryModal';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updateSkills } from '../api/userApi';
import { uploadFile } from '../api/uploadApi';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [skills, setSkills] = useState({
    offered: user?.skillsOffered || [],
    wanted: user?.skillsWanted || []
  });
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState('offered');
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const updatedSkills = {
      ...skills,
      [skillType]: [...skills[skillType], newSkill.trim()]
    };

    setSkills(updatedSkills);
    setNewSkill('');
  };

  const handleRemoveSkill = (skill, type) => {
    const updatedSkills = {
      ...skills,
      [type]: skills[type].filter(s => s !== skill)
    };
    setSkills(updatedSkills);
  };

  const handleSaveSkills = async () => {
    try {
      const updatedUser = await updateSkills({
        skillsOffered: skills.offered,
        skillsWanted: skills.wanted
      });
      updateUser(updatedUser);
      alert('Skills updated successfully!');
    } catch (error) {
      console.error('Error updating skills:', error);
      alert('Failed to update skills');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await uploadFile(file);
      setFormData({ ...formData, avatar: url });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar onHistoryClick={() => setShowHistory(true)} />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          {!editing ? (
            <motion.button
              onClick={() => setEditing(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Edit2 size={18} />
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                onClick={handleSaveProfile}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <Save size={18} />
                Save
              </motion.button>
              <motion.button
                onClick={() => setEditing(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={formData.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                alt={formData.name}
                className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                }}
              />
              {editing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-all">
                  <Upload size={20} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 min-h-[100px] resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{formData.name}</h2>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  {formData.bio && (
                    <p className="text-gray-700 leading-relaxed">{formData.bio}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">My Skills</h3>

          {/* Add Skill */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl border-2 border-gray-200 mb-6">
            <div className="flex gap-2 mb-4">
              <select
                value={skillType}
                onChange={(e) => setSkillType(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900"
              >
                <option value="offered">Skills I Offer</option>
                <option value="wanted">Skills I Want</option>
              </select>
              
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900"
                placeholder="e.g., Python, Guitar, Cooking..."
              />
              
              <motion.button
                onClick={handleAddSkill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Plus size={20} />
              </motion.button>
            </div>
          </div>

          {/* Skills Offered */}
          {skills.offered.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills I Offer</h4>
              <div className="flex flex-wrap gap-2">
                {skills.offered.map((skill, index) => (
                  <SkillTag
                    key={index}
                    skill={skill}
                    type="offered"
                    removable
                    onRemove={() => handleRemoveSkill(skill, 'offered')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Skills Wanted */}
          {skills.wanted.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills I Want to Learn</h4>
              <div className="flex flex-wrap gap-2">
                {skills.wanted.map((skill, index) => (
                  <SkillTag
                    key={index}
                    skill={skill}
                    type="wanted"
                    removable
                    onRemove={() => handleRemoveSkill(skill, 'wanted')}
                  />
                ))}
              </div>
            </div>
          )}

          <motion.button
            onClick={handleSaveSkills}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Skills
          </motion.button>
        </motion.div>
      </div>

      {/* History Modal */}
      <BarterHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
};

export default ProfilePage;
