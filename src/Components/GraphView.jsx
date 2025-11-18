import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { setGraphType, setSelectedCountry } from '../store/globalViewSlice';

const GraphView = () => {
  const dispatch = useDispatch();
  // Updated to use the new slice structure
  const { countryData } = useSelector(state => state.dataInput);
  const { selectedCountry, graphType } = useSelector(state => state.globalView);

  // Get data for the selected country (using lowercase key)
  const countryKey = selectedCountry?.toLowerCase();
  const countryInfo = countryData[countryKey] || {};
  
  // Convert data to chart format
  const data = Object.entries(countryInfo).map(([key, value]) => ({
    name: key,
    value: isNaN(value) ? 0 : Number(value),
    [key]: isNaN(value) ? 0 : Number(value)
  }));

  const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#1D4ED8', '#2563EB', '#1E40AF', '#1E3A8A'];

  const renderGraph = () => {
    if (data.length === 0) {
      return (
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 rounded-2xl p-12 text-center backdrop-blur-lg shadow-2xl shadow-cyan-500/20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 shadow-lg shadow-blue-500/50">
            📊
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Data Available</h3>
          <p className="text-blue-200/80 mb-8 text-lg max-w-md mx-auto leading-relaxed">
            No data has been entered for {selectedCountry || 'the selected country'} yet.
          </p>
          <Link 
            to="/input"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300"
          >
            <span>📝</span>
            Go to Data Input
          </Link>
        </div>
      );
    }

    const chartConfig = {
      bar: {
        component: (
          <BarChart width={800} height={450} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#93C5FD" fontSize={12} />
            <YAxis stroke="#93C5FD" fontSize={12} />
            <Tooltip 
              contentStyle={{
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '12px',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Value" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )
      },
      pie: {
        component: (
          <PieChart width={800} height={450}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={160}
              innerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '12px',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
          </PieChart>
        )
      },
      line: {
        component: (
          <LineChart width={800} height={450} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#93C5FD" fontSize={12} />
            <YAxis stroke="#93C5FD" fontSize={12} />
            <Tooltip 
              contentStyle={{
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '12px',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={4}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 10, fill: '#60A5FA', stroke: '#1D4ED8', strokeWidth: 2 }}
            />
          </LineChart>
        )
      }
    };

    return (
      <div className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-lg shadow-2xl shadow-cyan-500/20">
        {chartConfig[graphType]?.component}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black relative overflow-hidden">
      {/* Glitter Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex-1">
            <Link 
              to="/"
              className="inline-flex items-center gap-3 text-blue-300 hover:text-white transition-all duration-300 mb-6 group"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">◀</span>
              <span className="font-bold text-sm uppercase tracking-wider">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-4 p-6 bg-blue-900/30 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/50">
                📈
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  Data Analytics
                </h1>
                <p className="text-blue-300 text-sm font-medium uppercase tracking-wider mt-2">
                  Advanced Visualization Suite
                </p>
                {selectedCountry && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <p className="text-blue-200 text-lg">
                      Analyzing data for <span className="font-bold text-cyan-300">{selectedCountry}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-lg min-w-80">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚙️</span>
              </div>
              Controls
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm font-semibold mb-2 uppercase tracking-wide">
                  Chart Type
                </label>
                <select 
                  value={graphType} 
                  onChange={(e) => dispatch(setGraphType(e.target.value))}
                  className="w-full bg-blue-900/40 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                >
                  <option value="bar" className="bg-blue-900">📊 Bar Chart</option>
                  <option value="pie" className="bg-blue-900">🔵 Pie Chart</option>
                  <option value="line" className="bg-blue-900">📈 Line Chart</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-semibold mb-2 uppercase tracking-wide">
                  Select Country
                </label>
                <select 
                  value={selectedCountry || ''}
                  onChange={(e) => dispatch(setSelectedCountry(e.target.value))}
                  className="w-full bg-blue-900/40 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                >
                  <option value="" className="bg-blue-900">🌍 Choose Country</option>
                  {Object.keys(countryData).map(country => (
                    <option key={country} value={country} className="bg-blue-900">
                      {country.charAt(0).toUpperCase() + country.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              {selectedCountry && countryData[selectedCountry.toLowerCase()] && (
                <div className="pt-4 border-t border-blue-500/20">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-blue-800/30 rounded-xl p-3 border border-blue-500/20">
                      <div className="text-cyan-300 text-xl font-bold">
                        {Object.keys(countryData[selectedCountry.toLowerCase()]).length}
                      </div>
                      <div className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Metrics</div>
                    </div>
                    <div className="bg-blue-800/30 rounded-xl p-3 border border-blue-500/20">
                      <div className="text-cyan-300 text-xl font-bold">
                        {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                      </div>
                      <div className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Total</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Graph Area */}
        <div className="mb-8">
          {renderGraph()}
        </div>

        {/* Data Table */}
        {data.length > 0 && (
          <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-lg">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📋</span>
              </div>
              Raw Data Table
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-blue-500/20">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600/50 to-cyan-600/50 border-b border-blue-500/30">
                    <th className="px-6 py-4 text-left text-blue-200 font-bold uppercase tracking-wider text-sm">
                      Metric
                    </th>
                    <th className="px-6 py-4 text-left text-blue-200 font-bold uppercase tracking-wider text-sm">
                      Value
                    </th>
                    <th className="px-6 py-4 text-left text-blue-200 font-bold uppercase tracking-wider text-sm">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const total = data.reduce((sum, d) => sum + d.value, 0);
                    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                    
                    return (
                      <tr 
                        key={index} 
                        className="border-b border-blue-500/10 hover:bg-blue-800/20 transition-colors"
                      >
                        <td className="px-6 py-4 text-blue-100 font-medium">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-cyan-300 font-bold">
                          {item.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-blue-800/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-blue-200 text-sm font-medium min-w-12">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphView;