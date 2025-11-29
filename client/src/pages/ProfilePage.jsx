import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Save, X, Plus, Upload, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import SkillTag from "../components/SkillTag";
import BarterHistoryModal from "../components/BarterHistoryModal";
import { useAuth } from "../context/AuthContext";
import { updateProfile, updateSkills } from "../api/userApi";
import { uploadFile } from "../api/uploadApi";

// ⭐ Only addition
import toast from "react-hot-toast";

const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-w-[180px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 flex items-center justify-between transition-colors"
      >
        <span className="font-medium">
          {options.find((opt) => opt.value === value)?.label}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl overflow-hidden z-20"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                    value === option.value
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [skills, setSkills] = useState({
    offered: user?.skillsOffered || [],
    wanted: user?.skillsWanted || [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [skillType, setSkillType] = useState("offered");
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a valid skill");
      return;
    }
    setSkills({
      ...skills,
      [skillType]: [...skills[skillType], newSkill.trim()],
    });
    setNewSkill("");
    toast.success("Skill added");
  };

  const handleRemoveSkill = (skill, type) => {
    setSkills({
      ...skills,
      [type]: skills[type].filter((s) => s !== skill),
    });
    toast("Skill removed", { icon: "🗑️" });
  };

  const handleSaveSkills = async () => {
    try {
      const updatedUser = await updateSkills({
        skillsOffered: skills.offered,
        skillsWanted: skills.wanted,
      });
      updateUser(updatedUser);
      toast.success("Skills updated successfully!");
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Failed to update skills");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await uploadFile(file);
      setFormData({ ...formData, avatar: url });
      toast.success("Avatar uploaded!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar onHistoryClick={() => setShowHistory(true)} />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-56 sm:w-72 h-56 sm:h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            My Profile
          </h1>

          {!editing ? (
            <motion.button
              onClick={() => setEditing(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium sm:font-semibold text-sm sm:text-base flex items-center gap-2 hover:shadow-lg"
            >
              <Edit2 size={18} />
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <motion.button
                onClick={handleSaveProfile}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-xl font-medium sm:font-semibold text-sm sm:text-base flex items-center gap-2 hover:bg-green-700"
              >
                <Save size={18} />
                Save
              </motion.button>

              <motion.button
                onClick={() => setEditing(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 text-white rounded-xl font-medium sm:font-semibold text-sm sm:text-base flex items-center gap-2 hover:bg-gray-700"
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
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  formData.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={formData.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-blue-500 shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
              {editing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg">
                  <Upload size={16} className="text-white" />
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
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full text-gray-700 px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="w-full text-gray-700 px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 min-h-[80px] sm:min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {formData.name}
                  </h2>
                  <p className="text-gray-600">{user?.email}</p>
                  {formData.bio && (
                    <p className="text-gray-700 mt-2">{formData.bio}</p>
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
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            My Skills
          </h3>

          {/* Skill Add Panel */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-5 rounded-xl border border-gray-200 mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <CustomDropdown
                value={skillType}
                onChange={setSkillType}
                options={[
                  { value: "offered", label: "Skills I Offer" },
                  { value: "wanted", label: "Skills I Want" },
                ]}
              />

              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 text-gray-700"
                placeholder="e.g., Python, Cooking..."
              />

              <motion.button
                onClick={handleAddSkill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
              >
               + Add the skill
              </motion.button>
            </div>
          </div>

          {/* Skills */}
          {skills.offered.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Skills I Offer
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.offered.map((skill, i) => (
                  <SkillTag
                    key={i}
                    skill={skill}
                    removable
                    onRemove={() => handleRemoveSkill(skill, "offered")}
                  />
                ))}
              </div>
            </div>
          )}

          {skills.wanted.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Skills I Want
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.wanted.map((skill, i) => (
                  <SkillTag
                    key={i}
                    skill={skill}
                    removable
                    onRemove={() => handleRemoveSkill(skill, "wanted")}
                  />
                ))}
              </div>
            </div>
          )}

          <motion.button
            onClick={handleSaveSkills}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-2 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold"
          >
            <Save size={18} />
            Save Skills
          </motion.button>
        </motion.div>
      </div>

      {/* History Modal */}
      <BarterHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

export default ProfilePage;
