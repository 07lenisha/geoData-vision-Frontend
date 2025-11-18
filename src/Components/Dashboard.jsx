import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  
  const { countryData } = useSelector(state => state.dataInput);
  const { selectedCountry } = useSelector(state => state.globalView);

  const stats = {
    totalCountries: Object.keys(countryData).length,
    totalDataPoints: Object.values(countryData).reduce((acc, country) => acc + Object.keys(country).length, 0),
    selectedCountry: selectedCountry || 'None',
  };

  const quickActions = [
    {
      title: '3D Globe Explorer',
      description: 'Immerse yourself in interactive 3D globe visualization with real-time country data exploration',
      path: '/globe',
      icon: '🌐',
      gradient: 'from-blue-600 to-cyan-500',
      stats: 'Explore 190+ Countries',
    },
    {
      title: 'Advanced Analytics',
      description: 'Comprehensive charts, graphs and detailed analytics for deep data insights and pattern discovery',
      path: '/graphs',
      icon: '📊',
      gradient: 'from-cyan-600 to-blue-500',
      stats: 'Visualize Patterns & Trends',
    },
    {
      title: 'Data Management Hub',
      description: 'Add, modify and manage country datasets with intuitive forms and real-time global updates',
      path: '/input',
      icon: '⚡',
      gradient: 'from-purple-600 to-blue-500',
      stats: 'Manage Your Datasets',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-blue-500/10">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/50 animate-bounce">
              🌍
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent animate-pulse">
                GeoData Vision
              </span>
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed font-light">
              Transform raw data into stunning visual stories. Explore global insights through 
              interactive 3D visualizations and powerful analytics in real-time.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
              🌍
            </div>
            <h3 className="text-blue-200 text-lg font-semibold mb-3 uppercase tracking-wider">Countries with Data</h3>
            <p className="text-5xl font-black text-cyan-300 mb-4">{stats.totalCountries}</p>
            <div className="w-full bg-blue-800/30 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-cyan-500/30"
                style={{ width: `${(stats.totalCountries / 190) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform duration-300">
              📊
            </div>
            <h3 className="text-blue-200 text-lg font-semibold mb-3 uppercase tracking-wider">Total Data Points</h3>
            <p className="text-5xl font-black text-cyan-300 mb-4">{stats.totalDataPoints}</p>
            <div className="text-blue-300 text-sm font-medium">
              Across {stats.totalCountries} countries
            </div>
          </div>

          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
              📍
            </div>
            <h3 className="text-blue-200 text-lg font-semibold mb-3 uppercase tracking-wider">Selected Country</h3>
            <p className="text-2xl font-black text-white mb-4 truncate">{stats.selectedCountry}</p>
            <div className="mt-3">
              {selectedCountry && countryData[selectedCountry.toLowerCase()] && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-bold border border-green-500/30">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {Object.keys(countryData[selectedCountry.toLowerCase()]).length} datasets
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-white text-center mb-12 flex items-center justify-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-white text-lg">🚀</span>
            </div>
            Explore Features
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="group block transform transition-all duration-500 hover:scale-105"
              >
                <div className={`bg-gradient-to-br ${action.gradient} p-8 h-full rounded-3xl shadow-2xl relative overflow-hidden border border-white/20`}>
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                      {action.icon}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{action.title}</h3>
                    <p className="text-white/90 mb-6 leading-relaxed text-base font-light">
                      {action.description}
                    </p>
                    <div className="text-white/80 text-sm font-semibold uppercase tracking-widest border-t border-white/20 pt-4">
                      {action.stats}
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Active Countries */}
        {stats.totalCountries > 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🌎</span>
                </div>
                Active Countries
              </h3>
              <div className="text-cyan-300 text-xl font-black">
                {stats.totalCountries} Total
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {Object.keys(countryData).slice(0, 12).map((country, index) => (
                <div
                  key={country}
                  className="relative group"
                >
                  <span
                    className="inline-flex items-center gap-3 px-6 py-4 bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-xl text-base font-semibold hover:bg-blue-500/20 hover:border-cyan-400/40 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <span className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></span>
                    {country.charAt(0).toUpperCase() + country.slice(1)}
                    <span className="text-cyan-300 text-sm">
                      ({Object.keys(countryData[country]).length})
                    </span>
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 min-w-40 text-center shadow-2xl">
                    {Object.keys(countryData[country]).length} datasets available
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              ))}
              
              {Object.keys(countryData).length > 12 && (
                <span className="inline-flex items-center px-6 py-4 bg-blue-500/5 border border-blue-500/10 text-blue-300 rounded-xl text-base font-semibold">
                  +{Object.keys(countryData).length - 12} more
                </span>
              )}
            </div>

            {/* Progress Summary */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-blue-200 text-base font-medium mb-2">
                <span>Global Coverage</span>
                <span>{((stats.totalCountries / 190) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-800/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-cyan-500/30"
                  style={{ width: `${(stats.totalCountries / 190) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <p className="text-blue-300/70 text-lg uppercase tracking-widest font-semibold animate-pulse">
            Ready to explore your data in new dimensions?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;