import { createContext, useContext, useState, useEffect } from 'react';
import { mockVenues } from '../data/mockVenues';
import { venueService } from '../api/venueService';

const BookingContext = createContext();

const INITIAL_BOOKINGS = [
  {
    id: 'BK-2026-8819',
    ticketCode: 'VV-8819-MUM-LUM',
    venueId: 1,
    venueName: 'The Grand Luminary Ballroom',
    venueCity: 'Mumbai, Maharashtra',
    venueImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80',
    date: '2026-12-18',
    startTime: '18:00',
    durationHours: 5,
    guests: 180,
    eventType: 'Corporate Annual Gala',
    baseRate: 35000,
    addOns: ['Chef-Curated Royal Catering Service', 'Dedicated A/V & Intelligent Lighting Specialist'],
    totalAmount: 245000,
    status: 'Confirmed',
    createdAt: '2026-11-15T14:20:00Z',
    hostName: 'Pooja Singhania',
    qrPayload: 'https://venuevista.internal/verify/BK-2026-8819?code=VV-8819-MUM-LUM'
  }
];

export function BookingProvider({ children }) {
  // Saved / Favorited Venues
  const [savedVenues, setSavedVenues] = useState(() => {
    try {
      const stored = localStorage.getItem('venuevista_saved');
      return stored ? JSON.parse(stored) : [1, 4];
    } catch {
      return [1, 4];
    }
  });

  // Bookings list (migrates old USD seed data if present)
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem('venuevista_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored booking is older USD format (under ₹10,000 for entire ballroom), reset to INR initial
        if (parsed.length > 0 && parsed[0].totalAmount < 10000 && parsed[0].venueCity?.includes('New York')) {
          return INITIAL_BOOKINGS;
        }
        return parsed;
      }
      return INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Global UI Modals & Panels
  const [activeVenueModal, setActiveVenueModal] = useState(null);
  const [activeBookingSuccess, setActiveBookingSuccess] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [activeEventTicketModal, setActiveEventTicketModal] = useState(null);

  // Search & Filter State
  const [searchParams, setSearchParams] = useState({
    searchQuery: '',
    category: 'All',
    location: '',
    date: '',
    guests: '',
    maxPrice: 50000,
  });

  // Toast System
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('venuevista_saved', JSON.stringify(savedVenues));
  }, [savedVenues]);

  useEffect(() => {
    localStorage.setItem('venuevista_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Sync bookings from backend if available
  useEffect(() => {
    async function fetchServerBookings() {
      try {
        const serverBookings = await venueService.getBookings();
        if (serverBookings && serverBookings.length > 0) {
          setBookings(serverBookings);
        }
      } catch {
        // Fall back to localStorage
      }
    }
    fetchServerBookings();
  }, []);

  const addToast = (type = 'info', title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFavorite = (venueId) => {
    const exists = savedVenues.includes(venueId);
    if (exists) {
      setSavedVenues((prev) => prev.filter((id) => id !== venueId));
      addToast('info', 'Removed from Wishlist', 'Venue was removed from your saved list.');
    } else {
      setSavedVenues((prev) => [...prev, venueId]);
      addToast('success', 'Saved to Wishlist', 'Venue added to your favorites.');
    }
  };

  const isFavorite = (venueId) => savedVenues.includes(venueId);

  const createBooking = (bookingData) => {
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BK-${new Date().getFullYear()}-${uniqueNum}`;
    const venue = mockVenues.find((v) => v.id === bookingData.venueId) || {};
    const cityCode = venue.city ? venue.city.slice(0, 3).toUpperCase() : 'IND';
    const venueCode = (venue.name || 'VENUE').slice(0, 3).toUpperCase();
    const code = `VV-${uniqueNum}-${cityCode}-${venueCode}`;

    const newBooking = {
      id: bookingId,
      ticketCode: code,
      venueId: bookingData.venueId,
      venueName: venue.name || 'Premier Venue Space',
      venueCity: `${venue.city || 'Mumbai'}, ${venue.state || 'Maharashtra'}`,
      venueImage: venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600',
      date: bookingData.date || new Date().toISOString().split('T')[0],
      startTime: bookingData.startTime || '14:00',
      durationHours: Number(bookingData.durationHours) || 4,
      guests: Number(bookingData.guests) || 50,
      eventType: bookingData.eventType || 'Private Event',
      baseRate: venue.pricePerHour || 30000,
      addOns: bookingData.addOns || [],
      totalAmount: bookingData.totalAmount || 150000,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      hostName: venue.host?.name || 'Verified Venue Host',
      qrPayload: `https://venuevista.internal/verify/${bookingId}?code=${code}`
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBookingSuccess(newBooking);
    addToast('success', 'Reservation Confirmed!', `Booking ${bookingId} has been secured with digital QR pass.`);
    // Sync to backend asynchronously
    venueService.createBooking(newBooking).catch(() => {});
    return newBooking;
  };

  const createEventTicketBooking = (event) => {
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `TKT-${new Date().getFullYear()}-${uniqueNum}`;
    const cityCode = event.city ? event.city.slice(0, 3).toUpperCase() : 'IND';
    const code = `TKT-${uniqueNum}-${cityCode}`;

    const newTicketBooking = {
      id: bookingId,
      ticketCode: code,
      venueId: event.venueId,
      venueName: event.venueName,
      venueCity: event.city,
      venueImage: event.image,
      date: event.date,
      startTime: event.time,
      durationHours: 4,
      guests: 1,
      eventType: `Ticket: ${event.title}`,
      baseRate: event.price,
      addOns: ['General Admission Entry', 'Complimentary Welcome Beverage'],
      totalAmount: event.price,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      hostName: 'VenueVista Official Event',
      qrPayload: `https://venuevista.internal/verify/${bookingId}?code=${code}`
    };

    setBookings((prev) => [newTicketBooking, ...prev]);
    setActiveBookingSuccess(newTicketBooking);
    addToast('success', 'Ticket Reserved!', `Your digital ticket for "${event.title}" is ready.`);
    // Sync to backend asynchronously
    venueService.createBooking(newTicketBooking).catch(() => {});
    return newTicketBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
    addToast('info', 'Booking Cancelled', `Reservation ${bookingId} has been cancelled.`);
    // Sync to backend asynchronously
    venueService.cancelBooking(bookingId).catch(() => {});
  };

  return (
    <BookingContext.Provider
      value={{
        savedVenues,
        toggleFavorite,
        isFavorite,
        bookings,
        createBooking,
        createEventTicketBooking,
        cancelBooking,
        activeVenueModal,
        setActiveVenueModal,
        activeBookingSuccess,
        setActiveBookingSuccess,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        isMyBookingsOpen,
        setIsMyBookingsOpen,
        isHostModalOpen,
        setIsHostModalOpen,
        activeEventTicketModal,
        setActiveEventTicketModal,
        searchParams,
        setSearchParams,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
