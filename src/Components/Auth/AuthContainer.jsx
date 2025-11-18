import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const AuthContainer = () => {
  const [currentView, setCurrentView] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();

  // Reset to login view when the route changes to /auth
  useEffect(() => {
    setCurrentView('login');
  }, [location.pathname]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return (
          <Register 
            switchToLogin={() => setCurrentView('login')}
            onSuccess={() => navigate('/')}
          />
        );
      case 'login':
        return (
          <Login 
            switchToRegister={() => setCurrentView('register')}
            switchToForgot={() => setCurrentView('forgot')}
            onSuccess={() => navigate('/')}
          />
        );
      case 'forgot':
        return (
          <ForgotPassword 
            switchToLogin={() => setCurrentView('login')}
            switchToReset={() => setCurrentView('reset')}
          />
        );
      case 'reset':
        return (
          <ResetPassword 
            switchToLogin={() => setCurrentView('login')}
            onSuccess={() => setCurrentView('login')}
          />
        );
      default:
        return (
          <Login 
            switchToRegister={() => setCurrentView('register')}
            switchToForgot={() => setCurrentView('forgot')}
            onSuccess={() => navigate('/')}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {renderCurrentView()}
    </div>
  );
};

export default AuthContainer;