import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from "../../store/userSlice";
import { Eye, EyeOff } from 'lucide-react'; // icons

const Login = ({ switchToRegister, switchToForgot, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    loginMethod: 'email'
  });

  // toggle state
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const credentials = formData.loginMethod === 'email' 
      ? { email: formData.email, password: formData.password, loginMethod: 'email' }
      : { phone: formData.phone, loginMethod: 'phone' };

    dispatch(loginUser(credentials)).then((action) => {
      if (action.type === 'auth/login/fulfilled') {
        if (action.payload.requiresOtp) {
          // Navigate to OTP verification page
          navigate('/otp-verification');
        } else {
          onSuccess();
        }
      }
    });
  };

  return (
    <div className="w-full">
      
      <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
      <p className="text-blue-200/80 text-center mb-8">Sign in to your account</p>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle between Email and Phone login */}
        <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1 mb-4 border border-white/10">
          <label className="flex-1 text-center">
            <input
              type="radio"
              name="loginMethod"
              value="email"
              checked={formData.loginMethod === 'email'}
              onChange={handleChange}
              className="hidden"
            />
            <span className={`block py-2 px-4 rounded-md cursor-pointer transition ${
              formData.loginMethod === 'email' 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white font-medium border border-white/20' 
                : 'text-blue-200/70 hover:text-white'
            }`}>
              Email Login
            </span>
          </label>
          <label className="flex-1 text-center">
            <input
              type="radio"
              name="loginMethod"
              value="phone"
              checked={formData.loginMethod === 'phone'}
              onChange={handleChange}
              className="hidden"
            />
            <span className={`block py-2 px-4 rounded-md cursor-pointer transition ${
              formData.loginMethod === 'phone' 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white font-medium border border-white/20' 
                : 'text-blue-200/70 hover:text-white'
            }`}>
              Phone Login
            </span>
          </label>
        </div>

        {formData.loginMethod === 'email' ? (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition backdrop-blur-sm"
              required
            />

            {/* Password with eye icon */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition backdrop-blur-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-blue-200/70 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </>
        ) : (
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g., +91...)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition backdrop-blur-sm"
            required
          />
        )}

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-4">
        <span 
          className="text-blue-300 font-semibold hover:text-white cursor-pointer transition text-sm"
          onClick={switchToForgot}
        >
          Forgot your password?
        </span>
      </div>

      <div className="mt-6 text-center">
        <p className="text-blue-200/80">
          Don't have an account?{' '}
          <span 
            className="text-blue-300 font-semibold hover:text-white cursor-pointer transition"
            onClick={switchToRegister}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;