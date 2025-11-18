import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/userSlice';

const Layout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
 
  const { user } = useSelector(state => state.user);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🌐', color: 'from-blue-600 to-cyan-500' },
    { path: '/globe', label: 'Globe', icon: '🪐', color: 'from-cyan-600 to-blue-500' },
    { path: '/graphs', label: 'Analytics', icon: '📊', color: 'from-purple-600 to-blue-500' },
    { path: '/input', label: 'Data Hub', icon: '🎯', color: 'from-blue-600 to-purple-500' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  // Safe user data with fallbacks
  const userName = user?.name || 'User';
  const userRole = user?.role || 'user';
  const userEmail = user?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black flex flex-col">
      {/* Navigation Header */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-cyan-500/30 sticky top-0 z-50 shadow-2xl shadow-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/50">
                🌍
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GeoData Vision</h1>
                <p className="text-xs text-cyan-300">Interactive Platform</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative group px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm
                    ${location.pathname === item.path 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105` 
                      : 'text-cyan-200 hover:text-white bg-blue-900/20 hover:bg-blue-800/30 border border-blue-500/20 hover:border-cyan-500/30'
                    }
                    hover:scale-105 hover:shadow-lg
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  
                  {/* Active indicator */}
                  {location.pathname === item.path && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/30">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold leading-none">
                      {userName}
                    </p>
                    <p className="text-cyan-300 text-xs leading-none mt-1 capitalize">
                      {userRole}
                    </p>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="group relative px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 border border-red-500/30 flex items-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 border border-cyan-500/30 rounded-lg text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      Sign out of your account
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </button>
                </div>
              ) : (
                // Show login button if user is not authenticated
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-cyan-500/30 flex items-center space-x-2"
                >
                  <span>🔑</span>
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Modern Small Footer */}
      <footer className="bg-black/90 backdrop-blur-xl border-t border-cyan-500/20 mt-auto">
        <div className="max-w-7xl mx-auto">
          {/* Glowing Top Line */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-lg shadow-cyan-500/30"></div>
          
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Left - Brand */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-cyan-300 text-xs font-semibold">
                    GEODATA VISION
                  </p>
                </div>
                <div className="h-3 w-px bg-cyan-500/30"></div>
                <p className="text-cyan-200/70 text-xs">
                  © 2024
                </p>
              </div>

              {/* Center - Quick Stats */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-200/80 text-xs">Live</span>
                </div>
                <div className="h-3 w-px bg-cyan-500/30"></div>
                <div className="flex items-center space-x-2 text-cyan-200/70 text-xs">
                  <span>🌐 3D</span>
                  <span>📊 Analytics</span>
                  <span>🚀 Real-time</span>
                </div>
              </div>

              {/* Right - User Status */}
              <div className="flex items-center space-x-2">
                {user ? (
                  <>
                    <div className="flex items-center space-x-1 bg-blue-900/30 px-2 py-1 rounded-lg border border-cyan-500/20">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-cyan-300 text-xs font-medium">
                        {userEmail || userName}
                      </span>
                    </div>
                    <div className="h-3 w-px bg-cyan-500/30"></div>
                  </>
                ) : (
                  <div className="flex items-center space-x-1 bg-yellow-900/30 px-2 py-1 rounded-lg border border-yellow-500/20">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-300 text-xs font-medium">Guest</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 bg-green-900/30 px-2 py-1 rounded-lg border border-green-500/20">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-xs font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Glow Line */}
          <div className="h-px bg-gradient-to-r from-blue-500/20 via-cyan-500/40 to-blue-500/20"></div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;