import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError } from "../../store/userSlice"

const ForgotPassword = ({ switchToLogin, switchToReset }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.user);
  
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email)).then((action) => {
      if (action.type === 'auth/forgotPassword/fulfilled') {
        setEmailSent(true);
      }
    });
  };

  if (emailSent) {
    return (
      <div className="w-full text-center">
        <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-blue-200/80 mb-4">
            We've sent a password reset link to <strong className="text-white">{email}</strong>
          </p>
          <p className="text-blue-200/80 text-sm mb-4">
            Please check your email and click on the reset link to create a new password.
          </p>
        </div>
        <button 
          className="w-full bg-white/10 backdrop-blur-sm text-white py-3 rounded-lg font-semibold hover:bg-white/20 focus:ring-4 focus:ring-blue-500/30 transition mb-4 border border-white/10"
          onClick={() => setEmailSent(false)}
        >
          Resend Reset Link
        </button>
        <button 
          className="text-blue-300 font-semibold hover:text-white cursor-pointer transition"
          onClick={switchToReset}
        >
          I have a reset token
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center text-white mb-2">Reset Password</h2>
      <p className="text-blue-200/80 text-center mb-8">Enter your email to receive a reset link</p>
      
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-white placeholder-blue-200/50"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/30 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center mt-4">
        <span 
          className="text-blue-300 font-semibold hover:text-white cursor-pointer transition text-sm"
          onClick={switchToReset}
        >
          Already have a reset token?
        </span>
      </div>

      <div className="mt-6 text-center">
        <p className="text-blue-200/80">
          Remember your password?{' '}
          <span 
            className="text-blue-300 font-semibold hover:text-white cursor-pointer transition"
            onClick={switchToLogin}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;