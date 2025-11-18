import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp, clearError } from "../../store/userSlice";

const OtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, userId } = useSelector(state => state.user);
  
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ userId, otp })).then((action) => {
      if (action.type === 'user/verifyOtp/fulfilled') {
        navigate('/');
      }
    });
  };

  const handleResendOtp = () => {
    dispatch(resendOtp(userId));
    setCountdown(60);
    setCanResend(false);
    setOtp('');
  };

  const handleBackToLogin = () => {
    console.log('Navigating to /auth'); // Add this for debugging
   navigate('/auth', { replace: true })
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center text-white mb-2">Verify OTP</h2>
      <p className="text-blue-200/80 text-center mb-8">Enter the 6-digit code sent to your phone</p>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-center text-xl tracking-widest text-white placeholder-blue-200/50 backdrop-blur-sm"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="text-center mt-4">
        {canResend ? (
          <button 
            type="button" 
            className="text-blue-300 font-semibold hover:text-white cursor-pointer transition"
            onClick={handleResendOtp}
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-blue-200/80 text-sm">
            Resend OTP in {countdown} seconds
          </p>
        )}
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={handleBackToLogin}
          className="text-blue-300 font-semibold hover:text-white cursor-pointer transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;