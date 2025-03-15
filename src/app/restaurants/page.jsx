"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import restaurantService from "@/services/restaurantService";

// Restaurant card component
const RestaurantCard = ({
  name,
  description,
  category,
  rating,
  address,
  availableTables,
  maxTableCount,
  waitlistCount,
}) => {
  // Calculate available tables based on maxTableCount if availableTables isn't provided
  const tables =
    availableTables !== undefined
      ? availableTables
      : Math.floor(Math.random() * maxTableCount);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
          {category}
        </div>
        {rating && (
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 font-semibold">{rating}</span>
          </div>
        )}
      </div>
      <h3 className="mb-2 text-xl font-bold">{name}</h3>
      {description && <p className="text-gray-600 mb-2">{description}</p>}
      <p className="text-gray-600 mb-4">{address}</p>
      <div className="flex justify-between items-center mt-4">
        <div
          className={`font-medium ${
            tables > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {tables > 0
            ? `${tables} / ${maxTableCount} tables available`
            : waitlistCount > 0
            ? `Waitlist: ${waitlistCount} people waiting`
            : "Currently unavailable"}
        </div>
        <button
          className={`px-4 py-2 rounded-md cursor-pointer ${
            tables > 0
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {tables > 0 ? "Reserve" : "Join Waitlist"}
        </button>
      </div>
    </div>
  );
};

const RestaurantGallery = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");

  // Unique categories from fetched data
  const [categories, setCategories] = useState([]);

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const searchParams = {
          name: searchTerm || undefined,
          category: selectedCategory || undefined,
          address: locationFilter || undefined,
        };

        const response = await restaurantService.searchRestaurants(
          searchParams
        );

        if (response && Array.isArray(response)) {
          setRestaurants(response);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(response.map((restaurant) => restaurant.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          setRestaurants([]);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchTerm, selectedCategory, locationFilter]);

  // Filter restaurants based on availability if needed
  const filteredRestaurants = showOnlyAvailable
    ? restaurants.filter((restaurant) => {
        // If availableTables isn't in the API, we can use a formula based on maxTableCount
        // This is just a placeholder - adjust according to your actual data structure
        const availableTables =
          restaurant.availableTables !== undefined
            ? restaurant.availableTables
            : Math.floor(Math.random() * restaurant.maxTableCount);
        return availableTables > 0;
      })
    : restaurants;

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Restaurant List</h1>

        {/* Search and filtering section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search restaurant name"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="block w-full sm:w-auto py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All cuisine types</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Filter by location"
              className="block w-full sm:w-auto py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="available-only"
                className="mr-2"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              />
              <label htmlFor="available-only" className="text-gray-700">
                Available tables only
              </label>
            </div>
          </div> */}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        )}

        {/* Result count */}
        {!loading && !error && (
          <p className="mb-4 text-gray-600">
            {filteredRestaurants.length} restaurants found.
          </p>
        )}

        {/* Restaurant card grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id || restaurant._id}
                name={restaurant.name}
                description={restaurant.description}
                address={restaurant.address}
                category={restaurant.category}
                rating={restaurant.rating}
                maxTableCount={restaurant.maxTableCount}
                availableTables={restaurant.availableTables}
                waitlistCount={restaurant.waitlistCount || 0}
              />
            ))}
          </div>
        )}

        {/* When no results */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              No restaurants match your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantGallery;
