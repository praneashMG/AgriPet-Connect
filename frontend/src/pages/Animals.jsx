import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Animals = () => {
  const { user } = useContext(AuthContext);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    maxPrice: '',
  });

  const categories = ['Cow', 'Goat', 'Dog', 'Cat', 'Bird', 'Rabbit'];
  const categoryIcons = {
    Cow: '🐄',
    Goat: '🐐',
    Dog: '🐕',
    Cat: '🐈',
    Bird: '🐦',
    Rabbit: '🐇',
    Default: '🐾',
  };

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`http://localhost:5000/api/animals?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAnimals(data);
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Live query fetch
    const delayDebounceFn = setTimeout(() => {
      fetchAnimals();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      maxPrice: '',
    });
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Animals Directory</h1>
          <p className="text-gray-500 mt-1">Browse healthy farm animals and companion pets near you.</p>
        </div>
        {user && (
          <Link
            to="/add-animal"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition shadow-xs inline-flex items-center gap-2 self-start md:self-center cursor-pointer"
          >
            <span>➕</span> Post an Animal
          </Link>
        )}
      </div>

      {/* Main Container: Sidebar + Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs self-start lg:sticky lg:top-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <span>🔍</span> Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-5">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Search Keywords</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="e.g. Jersey, Cow, vaccine"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g. Bangalore"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Price Max input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="e.g. 100000"
                min="0"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : animals.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-xs">
              <span className="text-5xl block mb-4">😿</span>
              <h3 className="text-xl font-bold text-gray-900 mb-1">No Animals Found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {animals.map((animal) => {
                const icon = categoryIcons[animal.category] || categoryIcons.Default;
                const imageUrl = animal.image
                  ? (animal.image.startsWith('http') ? animal.image : `http://localhost:5000/uploads/${animal.image}`)
                  : null;

                return (
                  <div
                    key={animal.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col group"
                  >
                    {/* Image Container */}
                    <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={animal.animal_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-6xl mb-2">{icon}</span>
                          <span className="text-xs font-semibold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-md">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
                        {animal.category}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-950 text-lg group-hover:text-emerald-700 transition line-clamp-1">
                          {animal.animal_name}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Breed: {animal.breed || 'N/A'}</p>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-1">
                            <span>🎂</span> {animal.age ? `${animal.age} Yr` : 'Age N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⚖️</span> {animal.weight ? `${animal.weight} kg` : 'Weight N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⚧</span> {animal.gender || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <span>📍</span> {animal.location || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-gray-900 font-black text-lg">
                          ₹{parseFloat(animal.price).toLocaleString('en-IN')}
                        </div>
                        <Link
                          to={`/animals/${animal.id}`}
                          className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg transition cursor-pointer"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Animals;