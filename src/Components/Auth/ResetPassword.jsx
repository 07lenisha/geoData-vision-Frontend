import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearError } from "../../store/userSlice";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [token, setToken] = useState("");

  // ✅ Get token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    if (tokenFromURL) setToken(tokenFromURL);
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    dispatch(
      resetPassword({
        token,
        email: formData.email,
        newPassword: formData.newPassword,
      })
    ).then((action) => {
      if (action.type === "auth/resetPassword/fulfilled") {
        setResetSuccess(true);
      }
    });
  };

  const handleContinueLogin = () => {
    navigate("/login");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-sm shadow-lg rounded-2xl border border-white/10">
      {!resetSuccess ? (
        <>
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Create New Password
          </h2>
          <p className="text-blue-200/80 text-center mb-8">
            Enter your registered email and new password
          </p>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-white placeholder-blue-200/50"
                required
              />
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-white placeholder-blue-200/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-blue-300 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-white placeholder-blue-200/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center text-blue-300 hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/30 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      ) : (
        <div className="w-full text-center">
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Password Reset Successfully!
            </h2>
            <p className="text-blue-200/80 mb-4">
              Your password has been updated successfully.
            </p>
            <button
              onClick={handleContinueLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/30 transition shadow-lg"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;