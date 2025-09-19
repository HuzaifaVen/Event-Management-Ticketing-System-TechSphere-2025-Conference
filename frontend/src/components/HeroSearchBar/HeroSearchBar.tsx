import { useState } from 'react';

interface HeroSearchBarProps {
  onSearch?: (query: string, location: string) => void;
}

const HeroSearchBar = ({ onSearch }: HeroSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, location);
    }
    console.log('Search query:', query, 'Location:', location);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* White Card with Heading */}
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full flex flex-col gap-4 ">
        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 w-full md:w-auto mb-4 md:mb-0">
          Search for Events
        </h2>

        {/* Search Bar */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
          <input
            type="text"
            placeholder="What event are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-2  py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          >
            <option value="">Select location</option>
            <option value="newyork">New York</option>
            <option value="london">London</option>
            <option value="paris">Paris</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSearchBar;
