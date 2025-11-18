import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { geoCentroid } from 'd3-geo';
import { useEffect } from 'react';
import {
  setFields,
  setCountry,
  setCountryData,
  setLabelsData,
  setEditingField,
  addField,
  updateField,
  updateCountryData,
  deleteCountryData,
  fetchUserCountryData,
  createUserCountryData, 
  updateUserCountryData,
  deleteUserCountryData,
} from '../store/dataInputSlice';
import {
  setSelectedCountry,
  setCountries,
} from '../store/globalViewSlice';

const DataInput = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Updated to use new slice structure
  const { countries } = useSelector(state => state.globalView);
  const {
    fields,
    country,
    countryData,
    labelsData,
    selectedCountry,
    editingField,
    isLoading,
    error,
  } = useSelector(state => state.dataInput);

  // Load user data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    dispatch(fetchUserCountryData());
  }, [dispatch, navigate]);

  // Load countries data
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then((res) => res.json())
      .then((data) => {
        dispatch(setCountries(data.features));
      });
  }, [dispatch]);

  const handleFieldChange = (i, key, val) => {
    dispatch(updateField({ index: i, key, value: val }));
  };

  const handleAddField = () => {
    dispatch(addField());
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  const countryName = country.trim();
  if (!countryName) return alert("Please enter a valid country name");

  const dataObj = {};
  fields.forEach(f => { 
    if (f.name.trim() && f.value.trim()) dataObj[f.name] = f.value 
  });
  if (Object.keys(dataObj).length === 0) return alert("Please add data fields");

  const countryKey = countryName.toLowerCase();
  const countryFeature = countries.find(c => c.properties.name.toLowerCase() === countryKey);
  if (!countryFeature) return alert("Country not found");

  try {
    const [lng, lat] = geoCentroid(countryFeature);
    
    // ✅ FIX: Create ONLY ONE label for this country (replace duplicates)
    const newLabel = { 
      lat, 
      lng, 
      name: countryFeature.properties.name, 
      text: `${countryFeature.properties.name}\n${Object.entries(dataObj).map(([k, v]) => `${k}: ${v}`).join("\n")}` 
    };

    console.log('💾 Creating label for:', countryName);

    // Create new document with ONLY current country's data
    await dispatch(createUserCountryData({
      fields: fields.filter(f => f.name.trim() && f.value.trim()),
      country: countryName,
      countryData: { [countryKey]: dataObj },
      labelsData: [newLabel], // ✅ Only ONE label per country
      editingField: null
    })).unwrap();

    // REFETCH to update UI
    await dispatch(fetchUserCountryData());

    dispatch(setFields([{ name: "gpa", value: "" }]));
    dispatch(setCountry(""));
    alert(`✅ Data for ${countryName} saved!`);
    
  } catch (error) {
    const msg = typeof error === 'string' ? error : error?.message || 'Error';
    alert(`❌ Failed: ${msg}`);
  }
};

  // Edit country data - load existing data into form
  const handleEditCountry = (countryKey) => {
    const countryName = countryKey.charAt(0).toUpperCase() + countryKey.slice(1);
    const countryFields = countryData[countryKey];
    
    if (countryFields) {
      // Convert country data back to form fields
      const formFields = Object.entries(countryFields).map(([name, value]) => ({
        name,
        value
      }));
      
      dispatch(setFields(formFields));
      dispatch(setCountry(countryName));
      dispatch(setSelectedCountry(countryName));
      
      // Scroll to form
      document.getElementById('data-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Delete a specific field from country data
  const handleDeleteField = (fieldName) => {
    if (selectedCountry) {
      const countryKey = selectedCountry.toLowerCase();
      const updatedData = { ...countryData[countryKey] };
      delete updatedData[fieldName];
      
      // Update local state immediately
      const updatedCountryData = {
        ...countryData,
        [countryKey]: updatedData
      };
      
      dispatch(setCountryData(updatedCountryData));

      // Update labels
      const countryFeature = countries.find(c => c.properties.name.toLowerCase() === countryKey);
      if (countryFeature) {
        const newLabelsData = [
          ...labelsData.filter(label => label.name !== countryFeature.properties.name),
          {
            lat: countryFeature.properties.latlng?.[0] || 0,
            lng: countryFeature.properties.latlng?.[1] || 0,
            name: countryFeature.properties.name,
            text: `${countryFeature.properties.name}\n${Object.entries(updatedData)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")}`,
          },
        ];
        dispatch(setLabelsData(newLabelsData));
        
        // Save to backend
        dispatch(updateUserCountryData({
          countryData: updatedCountryData,
          labelsData: newLabelsData
        }));
      }
    }
  };

  // Update a specific field value
  const handleUpdateField = (fieldName, newValue) => {
    if (selectedCountry) {
      const countryKey = selectedCountry.toLowerCase();
      const updatedData = { 
        ...countryData[countryKey],
        [fieldName]: newValue
      };
      
      // Update local state immediately
      const updatedCountryData = {
        ...countryData,
        [countryKey]: updatedData
      };
      
      dispatch(setCountryData(updatedCountryData));

      // Update labels
      const countryFeature = countries.find(c => c.properties.name.toLowerCase() === countryKey);
      if (countryFeature) {
        const newLabelsData = [
          ...labelsData.filter(label => label.name !== countryFeature.properties.name),
          {
            lat: countryFeature.properties.latlng?.[0] || 0,
            lng: countryFeature.properties.latlng?.[1] || 0,
            name: countryFeature.properties.name,
            text: `${countryFeature.properties.name}\n${Object.entries(updatedData)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")}`,
          },
        ];
        dispatch(setLabelsData(newLabelsData));
        
        // Save to backend
        dispatch(updateUserCountryData({
          countryData: updatedCountryData,
          labelsData: newLabelsData
        }));
      }
      
      dispatch(setEditingField(null));
    }
  };

  // Delete entire country data
  const handleDeleteCountryData = (countryKeyToDelete = null) => {
    const countryKey = countryKeyToDelete || selectedCountry?.toLowerCase();
    const countryName = countryKey?.charAt(0).toUpperCase() + countryKey?.slice(1);
    
    if (countryKey && confirm(`Are you sure you want to delete all data for ${countryName}?`)) {
      // Update local state immediately
      const updatedCountryData = { ...countryData };
      delete updatedCountryData[countryKey];
      
      dispatch(setCountryData(updatedCountryData));

      // Remove label
      const newLabelsData = labelsData.filter(label => label.name.toLowerCase() !== countryKey);
      dispatch(setLabelsData(newLabelsData));

      // Save to backend
      dispatch(deleteUserCountryData(countryKey));

      // Clear selection if this was the selected country
      if (selectedCountry?.toLowerCase() === countryKey) {
        dispatch(setSelectedCountry(null));
      }
      
      alert(`Data for ${countryName} deleted successfully!`);
    }
  };

  // View country on globe
  const handleViewOnGlobe = (countryKey) => {
    const countryName = countryKey.charAt(0).toUpperCase() + countryKey.slice(1);
    dispatch(setSelectedCountry(countryName));
    navigate('/globe');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black relative overflow-hidden">
      {/* Glitter Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="inline-flex items-center gap-3 text-blue-300 hover:text-white transition-all duration-300 group"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">◀</span>
              <span className="font-bold text-sm uppercase tracking-wider">Back to Dashboard</span>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Data Hub
            </h1>
            <p className="text-blue-300 text-sm font-medium uppercase tracking-wider mt-2">
              Manage Country Data & Analytics
            </p>
          </div>
          
          <div className="w-24"></div> 
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="text-red-300 font-semibold">Error: {error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="xl:col-span-2 space-y-8">
            {/* Data Input Card */}
            <div id="data-form" className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-lg shadow-2xl shadow-cyan-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/50">
                  📝
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Data Input Form</h2>
                  <p className="text-blue-200/80 text-sm">
                    Add or edit country data to visualize on the interactive globe
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Country Input */}
                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-3 uppercase tracking-wide">
                    Country Name
                  </label>
                  <input
                    placeholder="Enter country name..."
                    value={country}
                    onChange={(e) => dispatch(setCountry(e.target.value))}
                    className="w-full bg-blue-900/40 border-2 border-blue-500/30 rounded-xl px-4 py-4 text-white font-medium placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    required
                  />
                </div>

                {/* Dynamic Fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-blue-200 text-sm font-semibold uppercase tracking-wide">
                      Data Fields
                    </label>
                    <button 
                      type="button" 
                      onClick={handleAddField}
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
                    >
                      <span>+</span>
                      Add Field
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {fields.map((f, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <input
                          placeholder="Field name (e.g., GDP, Population)"
                          value={f.name}
                          onChange={(e) => handleFieldChange(i, "name", e.target.value)}
                          className="flex-1 bg-blue-900/40 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white font-medium placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                        <input
                          placeholder="Value"
                          value={f.value}
                          onChange={(e) => handleFieldChange(i, "value", e.target.value)}
                          className="flex-1 bg-blue-900/40 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white font-medium placeholder-blue-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : '📊 Save Country Data'}
                </button>
              </form>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-lg shadow-2xl shadow-cyan-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📈</span>
                </div>
                Global Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-800/30 rounded-2xl p-6 border border-blue-500/20 text-center hover:border-cyan-500/40 transition-all duration-300">
                  <div className="text-cyan-300 text-4xl font-bold mb-2">
                    {Object.keys(countryData).length}
                  </div>
                  <div className="text-blue-300 text-sm font-semibold uppercase tracking-wider">
                    Countries with Data
                  </div>
                </div>
                
                <div className="bg-blue-800/30 rounded-2xl p-6 border border-blue-500/20 text-center hover:border-cyan-500/40 transition-all duration-300">
                  <div className="text-cyan-300 text-4xl font-bold mb-2">
                    {Object.values(countryData).reduce((acc, country) => acc + Object.keys(country).length, 0)}
                  </div>
                  <div className="text-blue-300 text-sm font-semibold uppercase tracking-wider">
                    Total Data Points
                  </div>
                </div>
              </div>
              
              {/* Recent Countries */}
              {Object.keys(countryData).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-blue-200 font-semibold mb-3">Recently Updated</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(countryData).slice(0, 6).map(country => (
                      <span
                        key={country}
                        className="px-3 py-2 bg-blue-700/40 border border-blue-500/30 rounded-xl text-blue-200 text-sm font-medium hover:bg-blue-600/40 hover:border-cyan-500/40 transition-all duration-300"
                      >
                        {country.charAt(0).toUpperCase() + country.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Data Management */}
          <div className="space-y-8">
            {/* All Countries Data Management */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-lg shadow-2xl shadow-cyan-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🌍</span>
                </div>
                All Countries Data
              </h3>

              {Object.keys(countryData).length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-blue-200 font-semibold text-lg">
                      Managed Countries ({Object.keys(countryData).length})
                    </h4>
                    <div className="text-cyan-300 text-sm font-semibold">
                      {Object.values(countryData).reduce((acc, country) => acc + Object.keys(country).length, 0)} total datasets
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {Object.entries(countryData).map(([countryKey, countryFields]) => (
                      <div 
                        key={countryKey} 
                        className={`bg-blue-800/20 rounded-xl p-4 border transition-all duration-300 cursor-pointer hover:scale-105 ${
                          selectedCountry?.toLowerCase() === countryKey 
                            ? 'border-cyan-500/50 bg-cyan-500/10' 
                            : 'border-blue-500/20 hover:border-cyan-500/30'
                        }`}
                        onClick={() => dispatch(setSelectedCountry(countryKey.charAt(0).toUpperCase() + countryKey.slice(1)))}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">📍</span>
                              </div>
                              <div>
                                <div className="text-white font-semibold">
                                  {countryKey.charAt(0).toUpperCase() + countryKey.slice(1)}
                                </div>
                                <div className="text-cyan-300 text-sm">
                                  {Object.keys(countryFields).length} datasets
                                </div>
                              </div>
                            </div>
                            
                            {/* Show first few fields as preview */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {Object.entries(countryFields).slice(0, 3).map(([fieldName, fieldValue]) => (
                                <span 
                                  key={fieldName}
                                  className="px-2 py-1 bg-blue-700/30 text-blue-200 rounded text-xs border border-blue-500/30"
                                >
                                  {fieldName}: {fieldValue}
                                </span>
                              ))}
                              {Object.keys(countryFields).length > 3 && (
                                <span className="px-2 py-1 bg-blue-700/30 text-blue-200 rounded text-xs border border-blue-500/30">
                                  +{Object.keys(countryFields).length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOnGlobe(countryKey);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors duration-300 text-sm"
                              title="View on Globe"
                            >
                              veiw
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCountry(countryKey);
                              }}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded-lg transition-colors duration-300 text-sm"
                              title="Edit Data"
                            >
                            Edit
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCountryData(countryKey);
                              }}
                              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg transition-colors duration-300 text-sm"
                              title="Delete Data"
                            >
                            Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-800/30 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                    📊
                  </div>
                  <p className="text-blue-200 mb-2">No country data available</p>
                  <p className="text-blue-300/80 text-sm">Use the form to add data for countries</p>
                </div>
              )}
            </div>

            {/* Selected Country Details */}
            {selectedCountry && countryData[selectedCountry.toLowerCase()] && (
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-lg shadow-2xl shadow-cyan-500/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  {selectedCountry} Details
                </h3>

                <div className="space-y-6">
                  {/* Country Header */}
                  <div className="bg-gradient-to-r from-blue-600/40 to-cyan-600/30 rounded-2xl p-6 border border-cyan-500/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                        <span className="text-white text-lg">📍</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{selectedCountry}</h4>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mt-1 bg-green-500/20 text-green-300 border border-green-500/30">
                          ● {Object.keys(countryData[selectedCountry.toLowerCase()]).length} datasets
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fields Management */}
                  {Object.keys(countryData[selectedCountry.toLowerCase()]).length > 0 && (
                    <div className="space-y-4">
                      <h5 className="text-blue-200 font-semibold text-lg">Manage Fields</h5>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {Object.entries(countryData[selectedCountry.toLowerCase()]).map(([fieldName, fieldValue]) => (
                          <div key={fieldName} className="bg-blue-800/20 rounded-xl p-4 border border-blue-500/20 hover:border-cyan-500/30 transition-all duration-300">
                            {editingField === fieldName ? (
                              <div className="flex gap-3">
                                <input
                                  value={fieldValue}
                                  onChange={(e) => handleUpdateField(fieldName, e.target.value)}
                                  className="flex-1 bg-blue-900/40 border-2 border-cyan-500/30 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-400"
                                />
                                <button 
                                  onClick={() => dispatch(setEditingField(null))}
                                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-white font-semibold">{fieldName}</div>
                                  <div className="text-cyan-300 text-sm">{fieldValue}</div>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => dispatch(setEditingField(fieldName))}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded-lg transition-colors duration-300 text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteField(fieldName)}
                                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg transition-colors duration-300 text-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Delete All Button */}
                      <button 
                        onClick={() => handleDeleteCountryData()}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-500 hover:to-pink-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-pink-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Deleting...' : `🗑️ Delete All Data for ${selectedCountry}`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 border border-cyan-500/30 rounded-3xl p-6 backdrop-blur-lg shadow-2xl shadow-cyan-500/20">
              <h4 className="text-lg font-bold text-white mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Link 
                  to="/globe"
                  className="flex items-center gap-3 bg-blue-800/30 hover:bg-blue-700/40 border border-blue-500/30 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-lg">🪐</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">View Globe</div>
                    <div className="text-blue-300 text-sm">Explore 3D visualization</div>
                  </div>
                </Link>
                
                <Link 
                  to="/graphs"
                  className="flex items-center gap-3 bg-blue-800/30 hover:bg-blue-700/40 border border-blue-500/30 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-lg">📈</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Analytics</div>
                    <div className="text-blue-300 text-sm">View detailed charts</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInput;