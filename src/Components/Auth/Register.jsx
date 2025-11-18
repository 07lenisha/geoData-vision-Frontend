import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from "../../store/userSlice";
import { Eye, EyeOff } from 'lucide-react';

const Register = ({ switchToLogin, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 Form data:', formData);
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    })).then((action) => {
      if (action.type === 'auth/register/fulfilled') {
        if (!action.payload.requiresOtp) {
          onSuccess();
        }
      }
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
      <p className="text-blue-200/80 text-center mb-8">Sign up to get started</p>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition backdrop-blur-sm"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition backdrop-blur-sm"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (e.g., +91...)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition backdrop-blur-sm"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition backdrop-blur-sm"
            required
            minLength="6"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-blue-200/70 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition backdrop-blur-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-blue-200/70 hover:text-white transition"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-blue-200/80">
          Already have an account?{' '}
          <span 
            className="text-blue-300 font-semibold hover:text-white cursor-pointer transition"
            onClick={switchToLogin}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;