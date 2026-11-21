import { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import VenueCard from './components/VenueCard';
import VenueDetailModal from './components/VenueDetailModal';
import BookingSuccessModal from './components/BookingSuccessModal';
import EventsSection from './components/EventsSection';
import HowItWorksSection from './components/HowItWorksSection';
import HostCallout from './components/HostCallout';
import Footer from './components/Footer';
import MyBookingsModal from './components/MyBookingsModal';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import { venueService } from './api/venueService';
import { mockVenues } from './data/mockVenues';
import { Sparkles, Building, Search, Frown } from 'lucide-react';
import './App.css';

function VenueVistaPlatform() {
  const {
    activeVenueModal,
    setActiveVenueModal,
    activeBookingSuccess,
    setActiveBookingSuccess,
    isMyBookingsOpen,
    setIsMyBookingsOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    searchParams,
    setSearchParams,
    savedVenues,
  } = useBooking();

  const [allVenues, setAllVenues] = useState(mockVenues);
  const [loading, setLoading] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState(50000);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial venues
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await venueService.getVenues();
        if (isMounted && data && data.length > 0) {
          setAllVenues(data);
        }
      } catch {
        // Fallback already handled in service
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered venues calculation
  const filteredVenues = useMemo(() => {
    return allVenues.filter((venue) => {
      // Category filter
      if (searchParams.category && searchParams.category !== 'All') {
        if (venue.category.toLowerCase() !== searchParams.category.toLowerCase()) {
          return false;
        }
      }

      // Location search (from Hero or filter)
      if (searchParams.location && searchParams.location.trim() !== '') {
        const loc = searchParams.location.toLowerCase();
        const matchesLoc =
          venue.city.toLowerCase().includes(loc) ||
          venue.state.toLowerCase().includes(loc) ||
          venue.address.toLowerCase().includes(loc);
        if (!matchesLoc) return false;
      }

      // Guests requirement
      if (searchParams.guests && Number(searchParams.guests) > 0) {
        if (venue.capacity < Number(searchParams.guests)) {
          return false;
        }
      }

      // Text query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          venue.name.toLowerCase().includes(q) ||
          venue.tagline.toLowerCase().includes(q) ||
          venue.city.toLowerCase().includes(q) ||
          venue.category.toLowerCase().includes(q) ||
          venue.amenities.some((a) => a.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Price filter
      if (venue.pricePerHour > priceFilter) {
        return false;
      }

      // Saved only toggle
      if (showSavedOnly) {
        if (!savedVenues.includes(venue.id)) {
          return false;
        }
      }

      return true;
    });
  }, [allVenues, searchParams, searchQuery, priceFilter, showSavedOnly, savedVenues]);

  const handleCategorySelect = (category) => {
    setSearchParams((prev) => ({ ...prev, category }));
  };

  const handleSelectVenue = (venue) => {
    setActiveVenueModal(venue);
  };

  const handleBookDirect = (venue) => {
    setActiveVenueModal(venue);
  };

  const handleResetFilters = () => {
    setSearchParams({
      searchQuery: '',
      category: 'All',
      location: '',
      date: '',
      guests: '',
      maxPrice: 50000,
    });
    setSearchQuery('');
    setPriceFilter(50000);
    setShowSavedOnly(false);
  };

  return (
    <div className="venuevista-root-app">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Main Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero onSearchSubmit={() => {}} />

      {/* Venues Showcase Section */}
      <section id="venues-section" className="venues-catalog-section">
        <div className="section-container">
          <div className="venues-section-header">
            <div className="title-area">
              <span className="section-super-label">
                <Sparkles size={14} /> Curated Portfolio
              </span>
              <h2 className="catalog-main-title">
                Exceptional Spaces for <span className="gradient-text">Extraordinary Events</span>
              </h2>
            </div>

            {/* Quick in-section text search */}
            <div className="inline-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Filter by name, vibe, or amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter venues by keyword"
              />
            </div>
          </div>

          {/* Category Filter Pills & Aux Controls */}
          <CategoryFilter
            selectedCategory={searchParams.category || 'All'}
            onSelectCategory={handleCategorySelect}
            showSavedOnly={showSavedOnly}
            onToggleSavedOnly={() => setShowSavedOnly(!showSavedOnly)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priceFilter={priceFilter}
            onPriceChange={setPriceFilter}
            totalResults={filteredVenues.length}
          />

          {/* Venues Grid */}
          {filteredVenues.length > 0 ? (
            <div className="venues-grid-layout">
              {filteredVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onSelectVenue={handleSelectVenue}
                  onBookDirect={handleBookDirect}
                />
              ))}
            </div>
          ) : (
            <div className="venues-empty-placeholder">
              <div className="empty-icon-box">
                <Building size={48} />
              </div>
              <h3>No spaces found matching your criteria</h3>
              <p>Try broadening your location, adjusting the price slider, or clearing filters.</p>
              <button
                type="button"
                className="btn-reset-filters"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Curated Events & Galas */}
      <EventsSection />

      {/* How it Works Section */}
      <HowItWorksSection />

      {/* Host Callout & Calculator */}
      <HostCallout />

      {/* Site Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      {activeVenueModal && (
        <VenueDetailModal
          venue={activeVenueModal}
          onClose={() => setActiveVenueModal(null)}
        />
      )}

      {activeBookingSuccess && (
        <BookingSuccessModal
          booking={activeBookingSuccess}
          onClose={() => setActiveBookingSuccess(null)}
        />
      )}

      {isMyBookingsOpen && (
        <MyBookingsModal
          onClose={() => setIsMyBookingsOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <VenueVistaPlatform />
      </BookingProvider>
    </AuthProvider>
  );
}
