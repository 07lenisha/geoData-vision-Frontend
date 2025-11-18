// import { useState, useEffect, useRef, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import Globe from 'react-globe.gl';
// import { geoCentroid } from 'd3-geo';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";
// import {
//   setCountries,
//   setHoverD,
//   setSelectedCountry,
//   setShowGraphOnGlobe,
//   setGraphType,
// } from '../store/globalViewSlice';
// import {
//   setLabelsData,
// } from '../store/dataInputSlice';

// const GlobeView = () => {
//   const dispatch = useDispatch();
//   // Updated to use the new slice structure
//   const {
//     countries,
//     hoverD,
//     selectedCountry,
//     showGraphOnGlobe,
//     graphType,
//   } = useSelector(state => state.globalView);
//   const {
//     countryData,
//     labelsData,
//   } = useSelector(state => state.dataInput);
  
//   const globeRef = useRef();
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // Load GeoJSON once
//   useEffect(() => {
//     fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
//       .then((res) => res.json())
//       .then((data) => {
//         dispatch(setCountries(data.features));
//       });
//   }, [dispatch]);

//   const handleCountryClick = (country) => {
//     const countryName = country.properties.name;
//     dispatch(setSelectedCountry(countryName));
//     dispatch(setShowGraphOnGlobe(false));
//   };

//   const handleShowGraphOnGlobe = () => {
//     if (selectedCountry) {
//       const countryKey = selectedCountry.toLowerCase();
//       if (countryData[countryKey]) {
//         dispatch(setShowGraphOnGlobe(true));
//       } else {
//         alert(`No data available for ${selectedCountry}. Please enter data first using the form.`);
//       }
//     } else {
//       alert("Please select a country first by clicking on it!");
//     }
//   };

//   const handleHideGraphOnGlobe = () => {
//     dispatch(setShowGraphOnGlobe(false));
//   };

//   // Memoize merged countries
//   const mergedCountries = useMemo(() => {
//     return countries.map((c) => ({
//       ...c,
//       data: countryData[c.properties.name.toLowerCase()] || {},
//     }));
//   }, [countries, countryData]);

//   const getCountryGraphData = () => {
//     if (!selectedCountry) return [];
//     const countryKey = selectedCountry.toLowerCase();
//     const countryInfo = countryData[countryKey] || {};
    
//     return Object.entries(countryInfo).map(([key, value]) => ({
//       name: key,
//       value: isNaN(value) ? 0 : Number(value),
//       [key]: isNaN(value) ? 0 : Number(value)
//     }));
//   };

//   const graphData = getCountryGraphData();
//   const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#1D4ED8', '#2563EB', '#1E40AF', '#1E3A8A'];

//   const renderGraphOnGlobe = () => {
//     if (graphData.length === 0) return null;

//     switch (graphType) {
//       case 'bar':
//         return (
//           <BarChart width={400} height={250} data={graphData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//             <XAxis dataKey="name" stroke="#93C5FD" fontSize={10} />
//             <YAxis stroke="#93C5FD" fontSize={10} />
//             <Tooltip 
//               contentStyle={{
//                 background: 'rgba(30, 41, 59, 0.95)',
//                 border: '1px solid rgba(59, 130, 246, 0.5)',
//                 borderRadius: '8px',
//                 color: 'white',
//                 backdropFilter: 'blur(10px)'
//               }}
//             />
//             <Legend />
//             <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]}>
//               {graphData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Bar>
//           </BarChart>
//         );
//       case 'pie':
//         return (
//           <PieChart width={400} height={250}>
//             <Pie
//               data={graphData}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//               outerRadius={80}
//               innerRadius={40}
//               dataKey="value"
//             >
//               {graphData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip 
//               contentStyle={{
//                 background: 'rgba(30, 41, 59, 0.95)',
//                 border: '1px solid rgba(59, 130, 246, 0.5)',
//                 borderRadius: '8px',
//                 color: 'white',
//                 backdropFilter: 'blur(10px)'
//               }}
//             />
//             <Legend />
//           </PieChart>
//         );
//       case 'line':
//         return (
//           <LineChart width={400} height={250} data={graphData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//             <XAxis dataKey="name" stroke="#93C5FD" fontSize={10} />
//             <YAxis stroke="#93C5FD" fontSize={10} />
//             <Tooltip 
//               contentStyle={{
//                 background: 'rgba(30, 41, 59, 0.95)',
//                 border: '1px solid rgba(59, 130, 246, 0.5)',
//                 borderRadius: '8px',
//                 color: 'white',
//                 backdropFilter: 'blur(10px)'
//               }}
//             />
//             <Legend />
//             <Line 
//               type="monotone" 
//               dataKey="value" 
//               stroke="#3B82F6" 
//               strokeWidth={3}
//               dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
//               activeDot={{ r: 6, fill: '#60A5FA', stroke: '#1D4ED8', strokeWidth: 2 }}
//             />
//           </LineChart>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-black via-blue-900 to-black overflow-hidden relative">
//       {/* Glitter Background Effects */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
//       </div>

//       {/* Toggle Sidebar Button */}
//       <button
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         className={`absolute top-4 left-4 z-20 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/50 hover:scale-110 transition-all duration-300 ${
//           sidebarOpen ? 'left-64' : 'left-4'
//         }`}
//       >
//         {sidebarOpen ? '◀' : '▶'}
//       </button>

//       {/* Sliding Sidebar */}
//       <div className={`
//         absolute left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-blue-900/90 to-slate-900 border-r border-cyan-500/30 
//         backdrop-blur-xl z-10 shadow-2xl shadow-cyan-500/20 transition-all duration-500 ease-in-out
//         ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'}
//       `}>
//         <div className={`h-full flex flex-col overflow-hidden transition-opacity duration-300 ${
//           sidebarOpen ? 'opacity-100' : 'opacity-0'
//         }`}>
          
//           {/* Scrollable Content */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-6">
//             {/* Header */}
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/50">
//                 🪐
//               </div>
//               <h2 className="text-xl font-bold text-white mb-2">Globe Explorer</h2>
//               <p className="text-blue-300 text-sm">Click countries to explore data</p>
//             </div>

//             {/* Selected Country - Compact Card */}
//             {selectedCountry && (
//               <div className="bg-gradient-to-br from-blue-800/40 to-cyan-800/30 rounded-xl p-4 border border-cyan-500/30">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
//                     <span className="text-white">📍</span>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-white font-bold truncate">{selectedCountry}</h3>
//                     <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
//                       countryData[selectedCountry.toLowerCase()] 
//                         ? 'bg-green-500/20 text-green-300' 
//                         : 'bg-amber-500/20 text-amber-300'
//                     }`}>
//                       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//                       {countryData[selectedCountry.toLowerCase()] 
//                         ? `${Object.keys(countryData[selectedCountry.toLowerCase()]).length} datasets`
//                         : 'No data'}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Quick Actions Grid */}
//             <div className="grid grid-cols-2 gap-3">
//               <button 
//                 onClick={handleShowGraphOnGlobe}
//                 disabled={!selectedCountry || !countryData[selectedCountry.toLowerCase()]}
//                 className={`p-3 rounded-xl font-semibold text-xs transition-all duration-300 ${
//                   selectedCountry && countryData[selectedCountry.toLowerCase()] 
//                     ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:scale-105' 
//                     : 'bg-gray-700 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 Show Graph
//               </button>
              
//               <Link 
//                 to="/graphs"
//                 className={`p-3 rounded-xl font-semibold text-xs text-center transition-all duration-300 ${
//                   selectedCountry && countryData[selectedCountry.toLowerCase()] 
//                     ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-lg hover:scale-105' 
//                     : 'bg-gray-700 text-gray-400 cursor-not-allowed pointer-events-none'
//                 }`}
//               >
//                 Full View
//               </Link>
//             </div>

//             {/* Chart Type Selector */}
//             <div>
//               <label className="block text-blue-200 text-xs font-semibold mb-2 uppercase">
//                 Chart Type
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 {[
//                   { value: 'bar', label: 'Bar', icon: '📊' },
//                   { value: 'pie', label: 'Pie', icon: '🔵' },
//                   { value: 'line', label: 'Line', icon: '📈' }
//                 ].map(type => (
//                   <button
//                     key={type.value}
//                     onClick={() => dispatch(setGraphType(type.value))}
//                     className={`p-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
//                       graphType === type.value
//                         ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
//                         : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/40'
//                     }`}
//                   >
//                     <div className="text-base mb-1">{type.icon}</div>
//                     {type.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Stats Overview */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="bg-blue-800/20 rounded-lg p-3 text-center border border-blue-500/20">
//                 <div className="text-cyan-300 text-lg font-bold">{Object.keys(countryData).length}</div>
//                 <div className="text-blue-300 text-xs">Countries</div>
//               </div>
//               <div className="bg-blue-800/20 rounded-lg p-3 text-center border border-blue-500/20">
//                 <div className="text-cyan-300 text-lg font-bold">
//                   {Object.values(countryData).reduce((acc, country) => acc + Object.keys(country).length, 0)}
//                 </div>
//                 <div className="text-blue-300 text-xs">Datasets</div>
//               </div>
//             </div>

//             {/* Legend - Compact */}
//             <div>
//               <h4 className="text-blue-200 text-sm font-semibold mb-3 flex items-center gap-2">
//                 <span>🎨</span>
//                 Colors
//               </h4>
//               <div className="space-y-2">
//                 {[
//                   { color: 'bg-red-500', label: 'Has Data' },
//                   { color: 'bg-green-500', label: 'Selected' },
//                   { color: 'bg-blue-400', label: 'No Data' }
//                 ].map((item, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <div className={`w-3 h-3 ${item.color} rounded-full shadow`}></div>
//                     <span className="text-blue-200 text-xs">{item.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Country List */}
//             {Object.keys(countryData).length > 0 && (
//               <div>
//                 <h4 className="text-blue-200 text-sm font-semibold mb-3 flex items-center gap-2">
//                   <span>🌍</span>
//                   Data Countries
//                 </h4>
//                 <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
//                   {Object.keys(countryData).slice(0, 8).map(country => (
//                     <span
//                       key={country}
//                       className="inline-block px-2 py-1 bg-blue-700/30 text-blue-200 rounded text-xs border border-blue-500/30 hover:border-cyan-500/50 transition-colors"
//                     >
//                       {country.slice(0, 3).toUpperCase()}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="p-4 border-t border-blue-500/20">
//             <Link 
//               to="/" 
//               className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm"
//             >
//               ← Back to Dashboard
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Main Globe Area */}
//       <div className={`flex-1 transition-all duration-500 ${
//         sidebarOpen ? 'ml-80' : 'ml-0'
//       }`}>
//         <div className="relative w-full h-full">
//           <Globe
//             ref={globeRef}
//             globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
//             backgroundColor="rgba(0,0,0,0)"
//             polygonsData={mergedCountries}
//             polygonCapColor={(d) =>
//               d === hoverD
//                 ? "rgba(59, 130, 246, 1)"
//                 : d.properties.name === selectedCountry
//                 ? "rgba(34, 197, 94, 1)"
//                 : Object.keys(d.data).length
//                 ? "rgba(239, 68, 68, 1)"
//                 : "rgba(96, 165, 250, 0.4)"
//             }
//             polygonSideColor={() => "rgba(30, 58, 138, 0.3)"}
//             polygonStrokeColor={() => "rgba(255, 255, 255, 0.3)"}
//             polygonLabel={(d) => {
//               const fieldsText =
//                 d.data && Object.keys(d.data).length
//                   ? Object.entries(d.data)
//                       .map(([k, v]) => `${k}: ${v}`)
//                       .join("<br/>")
//                   : "No data available";
//               return `
//                 <div style="
//                   background: linear-gradient(135deg, #1e3a8a, #1e40af);
//                   border: 1px solid rgba(59, 130, 246, 0.5);
//                   border-radius: 12px;
//                   padding: 12px;
//                   color: white;
//                   font-family: 'Inter', sans-serif;
//                   box-shadow: 0 10px 25px rgba(0,0,0,0.3);
//                   backdrop-filter: blur(10px);
//                   max-width: 250px;
//                 ">
//                   <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #93c5fd;">${d.properties.name}</div>
//                   <div style="font-size: 12px; color: #bfdbfe; line-height: 1.4;">${fieldsText}</div>
//                 </div>
//               `;
//             }}
//             onPolygonHover={(d) => dispatch(setHoverD(d))}
//             onPolygonClick={handleCountryClick}
//             polygonsTransitionDuration={500}
//             polygonAltitude={0.025}
//             labelsData={labelsData}
//             labelText="text"
//             labelSize={1.2}
//             labelDotRadius={0.5}
//             labelColor={() => "rgba(255, 255, 255, 0.9)"}
//             labelLabel={(d) =>
//               `<div style="
//                 background: rgba(30, 41, 59, 0.9);
//                 backdrop-filter: blur(10px);
//                 border: 1px solid rgba(59, 130, 246, 0.3);
//                 border-radius: 8px;
//                 padding: 8px 12px;
//                 font-size: 11px;
//                 color: white;
//                 font-family: 'Inter', sans-serif;
//               ">${d.text.replace(/\n/g, "<br/>")}</div>`
//             }
//           />
          
//           {/* Graph Display - Hovering near the globe */}
//           {showGraphOnGlobe && graphData.length > 0 && (
//             <div className="absolute bottom-4 right-4 backdrop-blur-xl rounded-2xl p-6 bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-white font-bold text-lg">
//                   {selectedCountry} - {graphType.charAt(0).toUpperCase() + graphType.slice(1)} Chart
//                 </h3>
//                 <button 
//                   onClick={handleHideGraphOnGlobe}
//                   className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
//                 >
//                   ×
//                 </button>
//               </div>
//               {renderGraphOnGlobe()}
//             </div>
//           )}
          
//           {/* Floating Info Panel */}
//           {selectedCountry && !showGraphOnGlobe && (
//             <div className={`absolute top-4 right-4 backdrop-blur-xl rounded-xl p-3 border-2 shadow-xl ${
//               countryData[selectedCountry.toLowerCase()] 
//                 ? 'border-cyan-400/50 bg-cyan-500/10' 
//                 : 'border-blue-400/50 bg-blue-500/10'
//             }`}>
//               <div className="flex items-center gap-2">
//                 <div className={`w-2 h-2 rounded-full animate-pulse ${
//                   countryData[selectedCountry.toLowerCase()] ? 'bg-cyan-400' : 'bg-blue-400'
//                 }`}></div>
//                 <div>
//                   <div className="text-white font-bold text-sm">{selectedCountry}</div>
//                   <div className={`text-xs ${
//                     countryData[selectedCountry.toLowerCase()] ? 'text-cyan-300' : 'text-blue-300'
//                   }`}>
//                     {countryData[selectedCountry.toLowerCase()] 
//                       ? `${Object.keys(countryData[selectedCountry.toLowerCase()]).length} datasets` 
//                       : "No data"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Quick Stats Overlay */}
//           <div className="absolute bottom-4 left-4 backdrop-blur-xl rounded-xl p-3 bg-blue-900/30 border border-cyan-500/20">
//             <div className="text-white text-sm font-semibold">
//               {Object.keys(countryData).length} Countries • {' '}
//               {Object.values(countryData).reduce((acc, country) => acc + Object.keys(country).length, 0)} Datasets
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GlobeView;
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Globe from 'react-globe.gl';
import { geoCentroid } from 'd3-geo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import {
  setCountries,
  setHoverD,
  setSelectedCountry,
  setShowGraphOnGlobe,
  setGraphType,
} from '../store/globalViewSlice';
import {
  setLabelsData,
} from '../store/dataInputSlice';

const GlobeView = () => {
  const dispatch = useDispatch();
  // Updated to use the new slice structure
  const {
    countries,
    hoverD,
    selectedCountry,
    showGraphOnGlobe,
    graphType,
  } = useSelector(state => state.globalView);
  const {
    countryData,
    labelsData,
  } = useSelector(state => state.dataInput);
  
  const globeRef = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load GeoJSON once
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then((res) => res.json())
      .then((data) => {
        dispatch(setCountries(data.features));
      });
  }, [dispatch]);

  const handleCountryClick = (country) => {
    const countryName = country.properties.name;
    dispatch(setSelectedCountry(countryName));
    dispatch(setShowGraphOnGlobe(false));
  };

  const handleShowGraphOnGlobe = () => {
    if (selectedCountry) {
      const countryKey = selectedCountry.toLowerCase();
      if (countryData[countryKey]) {
        dispatch(setShowGraphOnGlobe(true));
      } else {
        alert(`No data available for ${selectedCountry}. Please enter data first using the form.`);
      }
    } else {
      alert("Please select a country first by clicking on it!");
    }
  };

  const handleHideGraphOnGlobe = () => {
    dispatch(setShowGraphOnGlobe(false));
  };

  // Memoize merged countries
  const mergedCountries = useMemo(() => {
    return countries.map((c) => ({
      ...c,
      data: countryData[c.properties.name.toLowerCase()] || {},
    }));
  }, [countries, countryData]);

  const getCountryGraphData = () => {
    if (!selectedCountry) return [];
    const countryKey = selectedCountry.toLowerCase();
    const countryInfo = countryData[countryKey] || {};
    
    return Object.entries(countryInfo).map(([key, value]) => ({
      name: key,
      value: isNaN(value) ? 0 : Number(value),
      [key]: isNaN(value) ? 0 : Number(value)
    }));
  };

  const graphData = getCountryGraphData();
  const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#1D4ED8', '#2563EB', '#1E40AF', '#1E3A8A'];

  const renderGraphOnGlobe = () => {
    if (graphData.length === 0) return null;

    switch (graphType) {
      case 'bar':
        return (
          <BarChart width={400} height={250} data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#93C5FD" fontSize={10} />
            <YAxis stroke="#93C5FD" fontSize={10} />
            <Tooltip 
              contentStyle={{
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '8px',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]}>
              {graphData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart width={400} height={250}>
            <Pie
              data={graphData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              innerRadius={40}
              dataKey="value"
            >
              {graphData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '8px',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart width={400} height={250} data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#93C5FD" fontSize={10} />
            <YAxis stroke="#93C5FD" fontSize={10} />
            <Tooltip 
              contentStyle={{
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '8px',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#60A5FA', stroke: '#1D4ED8', strokeWidth: 2 }}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-blue-900 to-black overflow-hidden relative">
      {/* Glitter Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-4 left-4 z-20 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/50 hover:scale-110 transition-all duration-300 ${
          sidebarOpen ? 'left-64' : 'left-4'
        }`}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* Sliding Sidebar */}
      <div className={`
        absolute left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-blue-900/90 to-slate-900 border-r border-cyan-500/30 
        backdrop-blur-xl z-10 shadow-2xl shadow-cyan-500/20 transition-all duration-500 ease-in-out
        ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'}
      `}>
        <div className={`h-full flex flex-col overflow-hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/50">
                🪐
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Globe Explorer</h2>
              <p className="text-blue-300 text-sm">Click countries to explore data</p>
            </div>

            {/* Selected Country - Compact Card */}
            {selectedCountry && (
              <div className="bg-gradient-to-br from-blue-800/40 to-cyan-800/30 rounded-xl p-4 border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <span className="text-white">📍</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">{selectedCountry}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      countryData[selectedCountry.toLowerCase()] 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {countryData[selectedCountry.toLowerCase()] 
                        ? `${Object.keys(countryData[selectedCountry.toLowerCase()]).length} datasets`
                        : 'No data'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleShowGraphOnGlobe}
                disabled={!selectedCountry || !countryData[selectedCountry.toLowerCase()]}
                className={`p-3 rounded-xl font-semibold text-xs transition-all duration-300 ${
                  selectedCountry && countryData[selectedCountry.toLowerCase()] 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:scale-105' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Show Graph
              </button>
              
              <Link 
                to="/graphs"
                className={`p-3 rounded-xl font-semibold text-xs text-center transition-all duration-300 ${
                  selectedCountry && countryData[selectedCountry.toLowerCase()] 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-lg hover:scale-105' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
              >
                Full View
              </Link>
            </div>

            {/* Chart Type Selector */}
            <div>
              <label className="block text-blue-200 text-xs font-semibold mb-2 uppercase">
                Chart Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'bar', label: 'Bar', icon: '📊' },
                  { value: 'pie', label: 'Pie', icon: '🔵' },
                  { value: 'line', label: 'Line', icon: '📈' }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => dispatch(setGraphType(type.value))}
                    className={`p-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      graphType === type.value
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                        : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/40'
                    }`}
                  >
                    <div className="text-base mb-1">{type.icon}</div>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-800/20 rounded-lg p-3 text-center border border-blue-500/20">
                <div className="text-cyan-300 text-lg font-bold">{Object.keys(countryData).length}</div>
                <div className="text-blue-300 text-xs">Countries</div>
              </div>
              <div className="bg-blue-800/20 rounded-lg p-3 text-center border border-blue-500/20">
                <div className="text-cyan-300 text-lg font-bold">
                  {Object.values(countryData).reduce((acc, country) => acc + Object.keys(country).length, 0)}
                </div>
                <div className="text-blue-300 text-xs">Datasets</div>
              </div>
            </div>

            {/* Legend - Compact */}
            <div>
              <h4 className="text-blue-200 text-sm font-semibold mb-3 flex items-center gap-2">
                <span>🎨</span>
                Colors
              </h4>
              <div className="space-y-2">
                {[
                  { color: 'bg-red-500', label: 'Has Data' },
                  { color: 'bg-green-500', label: 'Selected' },
                  { color: 'bg-blue-400', label: 'No Data' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${item.color} rounded-full shadow`}></div>
                    <span className="text-blue-200 text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Country List */}
            {Object.keys(countryData).length > 0 && (
              <div>
                <h4 className="text-blue-200 text-sm font-semibold mb-3 flex items-center gap-2">
                  <span>🌍</span>
                  Data Countries
                </h4>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {Object.keys(countryData).slice(0, 8).map(country => (
                    <span
                      key={country}
                      className="inline-block px-2 py-1 bg-blue-700/30 text-blue-200 rounded text-xs border border-blue-500/30 hover:border-cyan-500/50 transition-colors"
                    >
                      {country.slice(0, 3).toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-500/20">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Globe Area */}
      <div className={`flex-1 transition-all duration-500 ${
        sidebarOpen ? 'ml-80' : 'ml-0'
      }`}>
        <div className="relative w-full h-full">
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            backgroundColor="rgba(0,0,0,0)"
            polygonsData={mergedCountries}
            polygonCapColor={(d) =>
              d === hoverD
                ? "rgba(59, 130, 246, 1)"
                : d.properties.name === selectedCountry
                ? "rgba(34, 197, 94, 1)"
                : Object.keys(d.data).length
                ? "rgba(239, 68, 68, 1)"
                : "rgba(96, 165, 250, 0.4)"
            }
            polygonSideColor={() => "rgba(30, 58, 138, 0.3)"}
            polygonStrokeColor={() => "rgba(255, 255, 255, 0.3)"}
            polygonLabel={(d) => {
              const fieldsText =
                d.data && Object.keys(d.data).length
                  ? Object.entries(d.data)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join("<br/>")
                  : "No data available";
              return `
                <div style="
                  background: linear-gradient(135deg, #1e3a8a, #1e40af);
                  border: 1px solid rgba(59, 130, 246, 0.5);
                  border-radius: 12px;
                  padding: 12px;
                  color: white;
                  font-family: 'Inter', sans-serif;
                  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                  backdrop-filter: blur(10px);
                  max-width: 250px;
                ">
                  <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #93c5fd;">${d.properties.name}</div>
                  <div style="font-size: 12px; color: #bfdbfe; line-height: 1.4;">${fieldsText}</div>
                </div>
              `;
            }}
            onPolygonHover={(d) => dispatch(setHoverD(d))}
            onPolygonClick={handleCountryClick}
            polygonsTransitionDuration={500}
            polygonAltitude={0.025}
            labelsData={labelsData} 
            labelText="text"
            labelSize={1.2}
            labelDotRadius={0.5}
            labelColor={() => "rgba(255, 255, 255, 0.9)"}
            labelLabel={(d) =>
              `<div style="
                background: rgba(30, 41, 59, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 11px;
                color: white;
                font-family: 'Inter', sans-serif;
              ">${d.text.replace(/\n/g, "<br/>")}</div>`
            }
          />
          
          {/* Graph Display - Hovering near the globe */}
          {showGraphOnGlobe && graphData.length > 0 && (
            <div className="absolute bottom-4 right-4 backdrop-blur-xl rounded-2xl p-6 bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">
                  {selectedCountry} - {graphType.charAt(0).toUpperCase() + graphType.slice(1)} Chart
                </h3>
                <button 
                  onClick={handleHideGraphOnGlobe}
                  className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
                >
                  ×
                </button>
              </div>
              {renderGraphOnGlobe()}
            </div>
          )}
          
          {/* Floating Info Panel */}
          {selectedCountry && !showGraphOnGlobe && (
            <div className={`absolute top-4 right-4 backdrop-blur-xl rounded-xl p-3 border-2 shadow-xl ${
              countryData[selectedCountry.toLowerCase()] 
                ? 'border-cyan-400/50 bg-cyan-500/10' 
                : 'border-blue-400/50 bg-blue-500/10'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  countryData[selectedCountry.toLowerCase()] ? 'bg-cyan-400' : 'bg-blue-400'
                }`}></div>
                <div>
                  <div className="text-white font-bold text-sm">{selectedCountry}</div>
                  <div className={`text-xs ${
                    countryData[selectedCountry.toLowerCase()] ? 'text-cyan-300' : 'text-blue-300'
                  }`}>
                    {countryData[selectedCountry.toLowerCase()] 
                      ? `${Object.keys(countryData[selectedCountry.toLowerCase()]).length} datasets` 
                      : "No data"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-4 left-4 backdrop-blur-xl rounded-xl p-3 bg-blue-900/30 border border-cyan-500/20">
            <div className="text-white text-sm font-semibold">
              {Object.keys(countryData).length} Countries • {' '}
              {Object.values(countryData).reduce((acc, country) => acc + Object.keys(country).length, 0)} Datasets
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeView;