import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { loadUser } from './store/userSlice';
import Layout from './Components/Layout';
import GlobeView from './Components/GlobeView';
import GraphView from './Components/GraphView';
import DataInput from './Components/DataInput';
import Dashboard from "./Components/Dashboard";
import AuthContainer from './Components/Auth/AuthContainer';
import OtpVerification from './Components/Auth/OtpVerification';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';

// Component to handle user loading
const UserLoader = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return children;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector(state => state.user);
  return isAuthenticated || token ? children : <Navigate to="/auth" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector(state => state.user);
  return !isAuthenticated && !token ? children : <Navigate to="/" />;
};

// Auth Layout Component with Poster Background
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Poster Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/auth-poster.jpg)' 
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>
      
      {/* Auth Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

// OTP Layout Component with Different Poster
const OtpLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* OTP Poster Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/auth-poster.jpg)' 
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

// Forgot Password Layout Component
const ForgotPasswordLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Forgot Password Poster Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/auth-poster.jpg)' 
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main App Routes
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Main Auth Route */}
        <Route path="/auth" element={
          <PublicRoute>
            <AuthLayout>
              <AuthContainer />
            </AuthLayout>
          </PublicRoute>
        } />

        {/* Separate OTP Verification Route */}
        <Route path="/otp-verification" element={
          <PublicRoute>
            <OtpLayout>
              <OtpVerification />
            </OtpLayout>
          </PublicRoute>
        } />

        {/* Forgot Password Page */}
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordLayout>
              <ForgotPassword />
            </ForgotPasswordLayout>
          </PublicRoute>
        } />

        {/* Reset Password Page */}
        <Route path="/reset-password" element={
          <PublicRoute>
            <ForgotPasswordLayout>
              <ResetPassword />
            </ForgotPasswordLayout>
          </PublicRoute>
        } />

        {/* Protected Main App Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/globe" element={
          <ProtectedRoute>
            <Layout>
              <GlobeView />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/graphs" element={
          <ProtectedRoute>
            <Layout>
              <GraphView />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/input" element={
          <ProtectedRoute>
            <Layout>
              <DataInput />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <UserLoader>
          <AppRoutes />
        </UserLoader>
      </div>
    </Provider>
  );
}

export default App;