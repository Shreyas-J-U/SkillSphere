import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import { SignUp } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  // Show loading toast when registration starts
  const handleStartSignup = () => {
    toast.loading("Creating your account...");
  };

  // Success toast after account creation
  const handleAfterSignup = () => {
    toast.dismiss();
    toast.success("Account created! Redirecting...");
  };

  // Handle Clerk errors
  const handleError = (err) => {
    toast.dismiss();
    toast.error(err?.errors?.[0]?.longMessage || "Signup failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium z-20"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 flex flex-col items-center"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
          >
            <Zap className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join SkillSphere
          </h1>
          <p className="text-gray-600">
            Start your skill exchange journey today
          </p>
        </div>

        {/* Sign-Up Form with Toast Events */}
        <div onClick={handleStartSignup}>
          <SignUp
            signInUrl="/login"
            forceRedirectUrl="/profile"
            afterSignUp={handleAfterSignup}
            onError={handleError}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-2xl border border-gray-100 rounded-2xl",
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
