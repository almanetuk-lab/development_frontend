// src/components/chatsystem/AdvancedSearch.jsx
import React, { useState } from "react";

export default function AdvancedSearch() {
  const [activeTab, setActiveTab] = useState("basic");
  const [filters, setFilters] = useState({
    // Basic Search
    basicSearch: "",
    
    // Advanced Search
    gender: '',
    seeking: '',
    ageFrom: '',
    ageTo: '',
    country: '',
    state: '',
    city: '',
    
    // Near Me
    distance: '10',
    showOnline: true
  });

  // Dummy Search History Data - Waisa hi jaise aapne image mein dikhaya tha
  const [searchHistory, setSearchHistory] = useState([
    { 
      id: 1, 
      searchName: "India", 
      searchType: "Advanced Search", 
      timestamp: "10/22/2025 6:45 PM",
      query: "India",
      type: "advanced"
    },
    { 
      id: 2, 
      searchName: "#zahou", 
      searchType: "Basic Search", 
      timestamp: "10/22/2025 6:30 PM",
      query: "#zahou",
      type: "basic"
    },
    { 
      id: 3, 
      searchName: "Pari Subramanian", 
      searchType: "Basic Search", 
      timestamp: "10/22/2025 6:15 PM",
      query: "Pari Subramanian",
      type: "basic"
    },
    { 
      id: 4, 
      searchName: "Doctor Mumbai", 
      searchType: "Advanced Search", 
      timestamp: "10/22/2025 5:55 PM",
      query: "Doctor Mumbai",
      type: "advanced"
    },
    { 
      id: 5, 
      searchName: "Women 25-30 Delhi", 
      searchType: "Advanced Search", 
      timestamp: "10/22/2025 5:40 PM",
      query: "Women 25-30 Delhi",
      type: "advanced"
    }
  ]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Tab Content Components
  const BasicSearchTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Search</h3>
        <p className="text-gray-600">Find matches with simple keywords</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by name, profession, or interests
          </label>
          <input
            type="text"
            placeholder="e.g. Doctor, Mumbai, Traveling..."
            value={filters.basicSearch}
            onChange={(e) => handleFilterChange('basicSearch', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <select
              value={filters.ageFrom}
              onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Any Age</option>
              <option value="18">18-25</option>
              <option value="26">26-30</option>
              <option value="31">31-35</option>
              <option value="36">36+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const AdvancedSearchTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Search</h3>
        <p className="text-gray-600">Filter matches with detailed criteria</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">I Am</label>
            <div className="flex gap-3">
              {['Man', 'Woman'].map(gender => (
                <button
                  key={gender}
                  onClick={() => handleFilterChange('gender', gender)}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                    filters.gender === gender 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md' 
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Seeking a</label>
            <div className="flex gap-3">
              {['Woman', 'Man'].map(seeking => (
                <button
                  key={seeking}
                  onClick={() => handleFilterChange('seeking', seeking)}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                    filters.seeking === seeking 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md' 
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {seeking}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Age Range: {filters.ageFrom || '18'} - {filters.ageTo || '60'}
            </label>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.ageFrom}
                  onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="To"
                  value={filters.ageTo}
                  onChange={(e) => handleFilterChange('ageTo', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">State</label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select State</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">City</label>
              <input
                type="text"
                placeholder="Enter city"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NearMeTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Nearby Matches</h3>
        <p className="text-gray-600">Connect with people in your area</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Distance: Within {filters.distance} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.distance}
            onChange={(e) => handleFilterChange('distance', e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-800">Show Online Users Only</p>
            <p className="text-sm text-gray-600">Filter users who are currently active</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showOnline}
              onChange={(e) => handleFilterChange('showOnline', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">📍</span>
            </div>
            <div>
              <p className="font-medium text-blue-800">Location Access</p>
              <p className="text-sm text-blue-600">Allow location access to find matches near you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SearchHistoryTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Search History</h3>
        <p className="text-gray-600">Your recent search activities</p>
      </div>

      {/* Search History Table - Jaise aapke image mein tha */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 px-6 py-4 border-b border-gray-200 font-medium text-gray-700">
          <div>Search Name</div>
          <div>Search Type</div>
          <div className="text-center">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {searchHistory.length > 0 ? (
            searchHistory.map((item) => (
              <div key={item.id} className="grid grid-cols-3 px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-200">
                <div className="font-medium text-gray-800">{item.searchName}</div>
                <div className="text-gray-600">{item.searchType}</div>
                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => handleSearchFromHistory(item)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                  >
                    View In Search
                  </button>
                  <button 
                    onClick={() => deleteSearchHistory(item.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No search history yet</p>
              <p className="text-sm text-gray-400 mt-1">Your searches will appear here</p>
            </div>
          )}
        </div>
      </div>

      {searchHistory.length > 0 && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={clearAllHistory}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
          >
            Clear All History
          </button>
        </div>
      )}
    </div>
  );

  const handleSearch = () => {
    // Search logic based on active tab
    console.log("Searching with:", filters, "Active Tab:", activeTab);
    alert(`Searching with ${activeTab} filters!`);
    
    // Auto-save to search history (dummy for now)
    if (filters.basicSearch || activeTab === 'advanced') {
      const newSearch = {
        id: Date.now(),
        searchName: filters.basicSearch || "Advanced Search",
        searchType: activeTab === 'basic' ? 'Basic Search' : 'Advanced Search',
        timestamp: new Date().toLocaleString(),
        query: filters.basicSearch,
        type: activeTab
      };
      setSearchHistory(prev => [newSearch, ...prev.slice(0, 9)]); // Keep only last 10
    }
  };

  const handleSearchFromHistory = (historyItem) => {
    // Set filters based on history item and switch to appropriate tab
    if (historyItem.type === 'basic') {
      setActiveTab('basic');
      handleFilterChange('basicSearch', historyItem.query);
    } else {
      setActiveTab('advanced');
      // Yahan advanced filters set kar sakte hain agar data structured ho
    }
    alert(`Searching for: ${historyItem.searchName}`);
  };

  const deleteSearchHistory = (id) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Your Match</h2>
      
      {/* Tabs Navigation - Search History Added Near Me ke pass */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: "basic", label: "🔍 Basic Search" },
          { id: "advanced", label: "⚡ Advanced Search" },
          { id: "nearme", label: "📍 Near Me" },
          { id: "history", label: "📚 Search History" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === "basic" && <BasicSearchTab />}
        {activeTab === "advanced" && <AdvancedSearchTab />}
        {activeTab === "nearme" && <NearMeTab />}
        {activeTab === "history" && <SearchHistoryTab />}
      </div>

      {/* Search Button - Hide for History Tab */}
      {activeTab !== "history" && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSearch}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium text-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            🔍 Search {activeTab === "basic" ? "Matches" : activeTab === "advanced" ? "Advanced" : "Nearby"} 
          </button>
        </div>
      )}
    </div>
  );
}






















































































