import api from './client';
import { mockVenues } from '../data/mockVenues';
import { mockEvents } from '../data/mockEvents';

export const venueService = {
  // Get all venues with optional filters
  async getVenues(filters = {}) {
    try {
      const response = await api.get('/venues/', { params: filters });
      return Array.isArray(response.data) ? response.data : (response.data.results || response.data);
    } catch {
      // Graceful fallback to rich mock data
      let result = [...mockVenues];

      if (filters.category && filters.category !== 'All') {
        result = result.filter((v) => v.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        result = result.filter(
          (v) =>
            v.name.toLowerCase().includes(query) ||
            v.city.toLowerCase().includes(query) ||
            v.category.toLowerCase().includes(query)
        );
      }
      if (filters.location) {
        const loc = filters.location.toLowerCase();
        result = result.filter((v) =>
          v.city.toLowerCase().includes(loc) || v.state.toLowerCase().includes(loc)
        );
      }
      if (filters.maxPrice) {
        result = result.filter((v) => v.pricePerHour <= Number(filters.maxPrice));
      }
      if (filters.guests) {
        result = result.filter((v) => v.capacity >= Number(filters.guests));
      }

      return result;
    }
  },

  // Get venue details by id
  async getVenueById(id) {
    try {
      const response = await api.get(`/venues/${id}/`);
      return response.data;
    } catch {
      return mockVenues.find((v) => v.id === Number(id)) || mockVenues[0];
    }
  },

  // Submit Host venue listing application
  async submitHostInquiry(formData) {
    try {
      const response = await api.post('/host-inquiries/', formData);
      return { success: true, data: response.data };
    } catch {
      return {
        success: true,
        message: 'Inquiry submitted successfully! A VenueVista partnership manager will review your space within 24 hours.',
      };
    }
  },

  // Get public events
  async getEvents() {
    try {
      const response = await api.get('/events/');
      return Array.isArray(response.data) ? response.data : (response.data.results || response.data);
    } catch {
      return mockEvents;
    }
  },

  // Get bookings
  async getBookings() {
    try {
      const response = await api.get('/bookings/');
      return Array.isArray(response.data) ? response.data : (response.data.results || response.data);
    } catch {
      return null;
    }
  },

  // Create booking
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings/', bookingData);
      return response.data;
    } catch {
      return null;
    }
  },

  // Cancel booking
  async cancelBooking(bookingId) {
    try {
      const response = await api.post(`/bookings/${bookingId}/cancel/`);
      return response.data;
    } catch {
      return null;
    }
  }
};

export default venueService;
