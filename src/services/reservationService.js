// services/reservationService.js
import apiClient from "./apiClient";

/**
 * Service for handling reservation-related API requests
 */
class ReservationService {
  /**
   * Create a new reservation
   * @param {number} restaurantId - ID of the restaurant
   * @param {Object} reservationData - Reservation data
   * @param {string} reservationData.reservationTime - ISO date string for reservation time
   * @returns {Promise<Object>} - Created reservation data
   */
  async createReservation(restaurantId, reservationData) {
    try {
      // 서버 요청은 원래 형식 그대로 사용
      const response = await apiClient.post(
        `/api/v3/reservations/${restaurantId}`,
        reservationData
      );
      return response;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  }
}

// Export a singleton instance
const reservationService = new ReservationService();
export default reservationService;
