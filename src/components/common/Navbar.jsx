"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
// Lucide 아이콘 import
import { User, Store, Clock } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const {
    user,
    isAuthenticated,
    logout,
    loading,
    tokenRemainingTime,
    getFormattedRemainingTime,
  } = useAuth();

  // State for token remaining time display
  const [formattedTime, setFormattedTime] = useState("");

  // Update token remaining time
  useEffect(() => {
    if (isAuthenticated && tokenRemainingTime !== null) {
      setFormattedTime(getFormattedRemainingTime());

      // Update every second within the component (for smooth UI)
      const intervalId = setInterval(() => {
        setFormattedTime(getFormattedRemainingTime());
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, tokenRemainingTime, getFormattedRemainingTime]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // 역할에 따른 아이콘과 툴팁 텍스트 설정
  const getRoleIcon = (role) => {
    if (!role) return null;

    if (role === "OWNER" || role === "ROLE_OWNER") {
      return {
        icon: <Store size={16} className="text-orange-500" />,
        tooltip: "Restaurant Owner",
      };
    }

    if (role === "USER" || role === "ROLE_USER") {
      return {
        icon: <User size={16} className="text-orange-500" />,
        tooltip: "Customer",
      };
    }

    return null;
  };

  const roleInfo = getRoleIcon(user?.role);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Restaurants", href: "/restaurants" },
  ];

  // Add owner-specific links if user is an owner
  if (user?.role === "OWNER" || user?.role === "ROLE_OWNER") {
    navLinks.push({ name: "Add Restaurant", href: "/owner/restaurants" });
    // navLinks.push({ name: "Manage Bookings", href: "/owner/bookings" });
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/easytable-logo.png"
                    alt="Easy Table logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-bold text-xl text-gray-900">
                  EasyTable
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === link.href
                      ? "border-orange-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500">
                      {user?.email || "My Profile"}
                    </p>
                    {/* 역할 아이콘 (툴팁 있음) */}
                    {roleInfo && (
                      <div className="group relative">
                        {roleInfo.icon}
                        <span className="absolute -top-8 right-0 w-24 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                          {roleInfo.tooltip}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Token expiration time display */}
                  {tokenRemainingTime !== null && (
                    <div className="flex items-center gap-1">
                      <Clock
                        size={12}
                        className={
                          tokenRemainingTime <= 300
                            ? "text-red-500"
                            : "text-gray-400"
                        }
                      />
                      <p
                        className={`text-xs ${
                          tokenRemainingTime <= 300
                            ? "text-red-500 font-bold"
                            : "text-gray-400"
                        }`}
                      >
                        {formattedTime}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className={`bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium ${
                    loading.logout ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading.logout}
                >
                  {loading.logout ? "Loading..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname === link.href
                    ? "bg-orange-50 border-orange-500 text-orange-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <p>{user?.email || "My Profile"}</p>
                    {/* 모바일 메뉴에 역할 아이콘 */}
                    {roleInfo && roleInfo.icon}
                  </div>
                  {/* Token expiration time in mobile menu */}
                  {tokenRemainingTime !== null && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock
                        size={12}
                        className={
                          tokenRemainingTime <= 300
                            ? "text-red-500"
                            : "text-gray-400"
                        }
                      />
                      <p
                        className={`text-xs ${
                          tokenRemainingTime <= 300
                            ? "text-red-500 font-bold"
                            : "text-gray-400"
                        }`}
                      >
                        {formattedTime}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading.logout}
                  className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 ${
                    loading.logout ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading.logout ? "Loading..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/auth/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
