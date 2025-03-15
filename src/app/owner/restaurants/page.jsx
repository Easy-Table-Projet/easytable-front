"use client";

import restaurantService from "@/services/restaurantService";
import React, { useState } from "react";

export default function AddRestaurantForm() {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    maxTableCount: 1,
    category: "KOREAN",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const categories = [
    { value: "KOREAN", label: "Korean" },
    { value: "CHINESE", label: "Chinese" },
    { value: "JAPANESE", label: "Japanese" },
    { value: "WESTERN", label: "Western" },
    { value: "ITALIAN", label: "Italian" },
    { value: "FRENCH", label: "French" },
    { value: "SPANISH", label: "Spanish" },
    { value: "AMERICAN", label: "American" },
    { value: "ASIAN", label: "Asian" },
    { value: "VIETNAMESE", label: "Vietnamese" },
    { value: "THAI", label: "Thai" },
    { value: "INDIAN", label: "Indian" },
    { value: "FUSION", label: "Fusion" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      [name]: name === "maxTableCount" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      // Call the actual restaurant service API
      const response = await restaurantService.addRestaurant(restaurant);

      setMessage({
        text: `Restaurant "${restaurant.name}" has been successfully added. It will appear in the list in 5 minutes.`,
        type: "success",
      });

      // Reset form
      setRestaurant({
        name: "",
        address: "",
        maxTableCount: 1,
        category: "KOREAN",
      });
    } catch (error) {
      setMessage({
        text: `Error: ${
          error.message || "There was a problem adding the restaurant."
        }`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Add New Restaurant
      </h2>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Restaurant Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={restaurant.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter restaurant name"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={restaurant.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter full address"
          />
        </div>

        <div>
          <label
            htmlFor="maxTableCount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Maximum Table Count
          </label>
          <input
            type="number"
            id="maxTableCount"
            name="maxTableCount"
            min="1"
            value={restaurant.maxTableCount}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={restaurant.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label} ({category.value})
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
              isSubmitting
                ? "bg-orange-400"
                : "bg-orange-600 hover:bg-orange-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200`}
          >
            {isSubmitting ? "Processing..." : "Add Restaurant"}
          </button>
        </div>
      </form>
    </div>
  );
}
