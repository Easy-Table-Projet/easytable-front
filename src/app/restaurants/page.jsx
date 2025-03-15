"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import restaurantService from "@/services/restaurantService";
import { useRouter } from "next/navigation";

// Restaurant card component
const RestaurantCard = ({
  id,
  name,
  description,
  category,
  rating,
  address,
  maxTableCount,
  remainingTableCount,
  waitlistCount,
}) => {
  const router = useRouter();

  const handleReserveClick = () => {
    router.push(`/reservation/${id}`);
  };

  const handleWaitlistClick = () => {
    router.push(`/reservation/${id}?waitlist=true`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="relative">
        {/* Placeholder for restaurant image - could be replaced with actual image */}
        <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-500"></div>

        {/* Category and rating badges positioned over the "image" */}
        <div className="absolute top-3 left-3">
          <div className="px-3 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full shadow-sm">
            {category}
          </div>
        </div>

        {rating && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center px-2 py-1 bg-white bg-opacity-90 rounded-full shadow-sm">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 font-semibold text-gray-800">{rating}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
          {name}
        </h3>
        {description && (
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center text-gray-500 mb-4 text-sm">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span className="truncate">{address}</span>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center">
            <div
              className={`font-medium text-sm ${
                remainingTableCount > 0 ? "text-green-600" : "text-orange-600"
              }`}
            >
              {remainingTableCount > 0 ? (
                <span className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  {remainingTableCount} / {maxTableCount} tables
                </span>
              ) : waitlistCount > 0 ? (
                <span className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                  Waitlist: {waitlistCount} people
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Unavailable
                </span>
              )}
            </div>

            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                remainingTableCount > 0
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-orange-400 hover:bg-orange-500 text-white"
              }`}
              onClick={
                remainingTableCount > 0
                  ? handleReserveClick
                  : handleWaitlistClick
              }
            >
              {remainingTableCount > 0 ? "Reserve" : "Join Waitlist"}
            </button>
          </div>
        </div>
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

        if (response && response.content && Array.isArray(response.content)) {
          setRestaurants(response.content);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(
              response.content.map((restaurant) => restaurant.category)
            ),
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
    ? restaurants.filter((restaurant) => restaurant.remainingTableCount > 0)
    : restaurants;

  // Handle search input change with debounce
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setDebouncedSearchTerm(e.target.value);
  };

  // Debounce search term to avoid too many API requests
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(debouncedSearchTerm);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(timerId);
    };
  }, [debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 relative inline-block">
            Find Your Table
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-orange-500 rounded-full"></div>
          </h1>
          <p className="text-gray-600 mt-4">
            Discover and reserve at the best restaurants in your area
          </p>
        </div>

        {/* Search section */}
        <div className="max-w-2xl mx-auto mb-12 bg-white p-4 rounded-xl shadow-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-orange-400" />
            </div>
            <input
              type="text"
              placeholder="Search for restaurants by name..."
              className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={debouncedSearchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">
                Finding the best restaurants for you...
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="max-w-2xl mx-auto my-12 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Result count */}
        {!loading && !error && (
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600 font-medium">
              <span className="text-orange-500 font-bold">
                {filteredRestaurants.length}
              </span>{" "}
              restaurants found
            </p>
          </div>
        )}

        {/* Restaurant card grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                description={restaurant.description}
                address={restaurant.address}
                category={restaurant.category}
                rating={restaurant.rating}
                maxTableCount={restaurant.maxTableCount}
                remainingTableCount={restaurant.remainingTableCount}
                waitlistCount={restaurant.waitlistCount || 0}
              />
            ))}
          </div>
        )}

        {/* When no results */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 text-orange-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later for new
              options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantGallery;
