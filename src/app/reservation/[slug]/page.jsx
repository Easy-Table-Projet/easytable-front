"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import reservationService from "@/services/reservationService";
import restaurantService from "@/services/restaurantService";

export default function Home() {
  const { slug } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [reservationResult, setReservationResult] = useState(null);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);
  const timerRef = useRef(null);

  // 컴포넌트 마운트 시 실시간 시간 업데이트 시작
  useEffect(() => {
    // 1초마다 현재 시간 업데이트
    timerRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 레스토랑 정보 가져오기
  useEffect(() => {
    async function fetchRestaurantInfo() {
      if (!slug) {
        setError("Restaurant ID is required");
        setIsLoadingRestaurant(false);
        return;
      }

      try {
        const restaurantId = parseInt(slug, 10);
        const restaurantData = await restaurantService.getRestaurantById(
          restaurantId
        );
        setRestaurant(restaurantData);
      } catch (error) {
        console.error("Error fetching restaurant information:", error);
        setError(error.message || "Failed to load restaurant information");
      } finally {
        setIsLoadingRestaurant(false);
      }
    }

    fetchRestaurantInfo();
  }, [slug]);

  // 예약 생성 함수
  const handleCreateReservation = async () => {
    if (!slug) {
      setError("Restaurant ID is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const restaurantId = parseInt(slug, 10);

      // 현재 날짜/시간 객체
      const now = new Date();

      // 현재 시간에서 10분 추가
      now.setMinutes(now.getMinutes() + 10);

      // 백엔드 LocalDateTime에 맞는 형식 생성 (공백 사용)
      // yyyy-MM-dd HH:mm:ss 형식 (T 제거, 밀리초 제거)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      // 형식: "2025-03-15 23:37:42" (T 대신 공백 사용)
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const reservationData = {
        reservationTime: formattedTime,
      };

      const result = await reservationService.createReservation(
        restaurantId,
        reservationData
      );
      setReservationResult(result);
    } catch (error) {
      console.error("Error creating reservation:", error);
      setError(
        error.message || "An error occurred while making the reservation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 시간으로부터 10분 뒤 시간 계산
  const tenMinutesLater = new Date(currentTime.getTime() + 10 * 60000);
  // 10분 뒤 시간을 위한 가독성 있는 형식
  const formattedReservationTime = tenMinutesLater.toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {isLoadingRestaurant ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading restaurant information...
              </p>
            </div>
          </div>
        ) : error && !restaurant ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
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
        ) : (
          <div className="max-w-3xl mx-auto">
            {restaurant && (
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-3 relative inline-block">
                  {restaurant.name}
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-orange-500 rounded-full"></div>
                </h1>

                <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-left">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-500 font-medium">
                            Address
                          </p>
                          <p className="text-gray-800">{restaurant.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-500 font-medium">
                            Category
                          </p>
                          <p className="text-gray-800">{restaurant.category}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-left md:text-right flex flex-col justify-center">
                      <div className="bg-orange-50 p-4 rounded-lg inline-block md:ml-auto">
                        <p className="text-sm text-gray-500 font-medium mb-1">
                          Available Tables
                        </p>
                        <div className="flex items-center justify-center">
                          <span className="text-3xl font-bold text-orange-600">
                            {restaurant.remainingTableCount}
                          </span>
                          <span className="text-gray-500 mx-2">/</span>
                          <span className="text-2xl text-gray-600">
                            {restaurant.maxTableCount}
                          </span>
                        </div>

                        {restaurant.remainingTableCount === 0 && (
                          <div className="mt-2 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              No tables available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-orange-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  Make a Reservation
                </h2>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reservation Time
                  </label>
                  <div className="flex items-center bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <svg
                      className="w-5 h-5 text-orange-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="text-gray-800 font-medium">
                      {formattedReservationTime}
                    </span>
                    <span className="ml-2 text-orange-600 text-sm">
                      (10 minutes from now)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCreateReservation}
                  disabled={
                    isLoading ||
                    (restaurant && restaurant.remainingTableCount === 0)
                  }
                  className="w-full py-3 px-4 flex justify-center items-center text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow transition-colors duration-300 disabled:opacity-50 disabled:bg-gray-400 font-medium cursor-pointer hover:cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Reserve Now
                    </>
                  )}
                </button>

                {error && !isLoadingRestaurant && (
                  <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-red-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {reservationResult && (
                  <div className="mt-6 bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                        <svg
                          className="h-6 w-6 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="ml-3 text-lg font-bold text-green-800">
                        Reservation Completed!
                      </h3>
                    </div>

                    <div className="bg-white rounded-md p-4 border border-green-100">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Reservation ID:</span>
                          <span className="font-medium">
                            {reservationResult.reservationId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <span className="font-medium">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {reservationResult.status}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Reservation Time:
                          </span>
                          <span className="font-medium">
                            {new Date(
                              reservationResult.reservationTime
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
