import { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Star,
  QrCode,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Hero({ onSearchSubmit }) {
  const { searchParams, setSearchParams } = useBooking();

  const [locationInput, setLocationInput] = useState(searchParams.location || '');
  const [categoryInput, setCategoryInput] = useState(searchParams.category || 'All');
  const [dateInput, setDateInput] = useState(searchParams.date || '');
  const [guestsInput, setGuestsInput] = useState(searchParams.guests || '');

  const popularCities = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Goa', 'Jaipur', 'Hyderabad'];

  const handleSubmit = (e) => {
    e?.preventDefault();
    setSearchParams((prev) => ({
      ...prev,
      location: locationInput,
      category: categoryInput,
      date: dateInput,
      guests: guestsInput,
    }));

    if (onSearchSubmit) {
      onSearchSubmit();
    } else {
      const el = document.getElementById('venues-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCitySelect = (city) => {
    setLocationInput(city);
    setSearchParams((prev) => ({
      ...prev,
      location: city,
    }));
    const el = document.getElementById('venues-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero-section" className="hero-hero-section">
      <div className="hero-glow-blob top-left"></div>
      <div className="hero-glow-blob bottom-right"></div>

      <div className="hero-content-wrapper">
        <div className="hero-badge-pill">
          <span className="badge-spark">✨</span>
          <span>Next-Generation Venue & Event Booking Platform</span>
        </div>

        <h1 className="hero-main-title">
          Where Exceptional Events Find Their <span className="gradient-text">Perfect Stage</span>
        </h1>

        <p className="hero-subtext">
          Browse vetted architectural ballrooms, skyline rooftops, sunlit lofts, and waterfront pavilions.
          Instant transparent pricing, immersive layouts, and instant cryptographic QR passes.
        </p>

        {/* Global Multi-field Search Bar */}
        <form className="hero-search-box" onSubmit={handleSubmit}>
          {/* Location field */}
          <div className="search-field">
            <div className="search-field-icon">
              <MapPin size={20} />
            </div>
            <div className="search-field-inputs">
              <label htmlFor="search-location">Location</label>
              <input
                id="search-location"
                type="text"
                placeholder="City or neighborhood (e.g. Mumbai, Goa)..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
            </div>
          </div>

          <div className="search-field-divider"></div>

          {/* Event Category field */}
          <div className="search-field">
            <div className="search-field-icon">
              <Building2 size={20} />
            </div>
            <div className="search-field-inputs">
              <label htmlFor="search-category">Space Type</label>
              <select
                id="search-category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
              >
                <option value="All">All Space Types</option>
                <option value="Ballrooms">Ballrooms</option>
                <option value="Rooftops">Rooftops</option>
                <option value="Garden Estates">Garden Estates</option>
                <option value="Lofts & Studios">Lofts & Studios</option>
                <option value="Conference Centers">Conference Centers</option>
                <option value="Waterfront">Waterfront</option>
              </select>
            </div>
          </div>

          <div className="search-field-divider"></div>

          {/* Date field */}
          <div className="search-field">
            <div className="search-field-icon">
              <Calendar size={20} />
            </div>
            <div className="search-field-inputs">
              <label htmlFor="search-date">Event Date</label>
              <input
                id="search-date"
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
              />
            </div>
          </div>

          <div className="search-field-divider"></div>

          {/* Guests field */}
          <div className="search-field">
            <div className="search-field-icon">
              <Users size={20} />
            </div>
            <div className="search-field-inputs">
              <label htmlFor="search-guests">Guests</label>
              <input
                id="search-guests"
                type="number"
                min="10"
                max="1000"
                step="10"
                placeholder="e.g. 150"
                value={guestsInput}
                onChange={(e) => setGuestsInput(e.target.value)}
              />
            </div>
          </div>

          {/* Search CTA */}
          <button type="submit" className="hero-search-submit-btn">
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>

        {/* Popular City Quick-links */}
        <div className="hero-quick-cities">
          <span className="quick-label">Trending destinations:</span>
          <div className="quick-city-chips">
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                className={`quick-chip ${locationInput.toLowerCase() === city.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Value Trust Grid */}
        <div className="hero-trust-metrics">
          <div className="metric-item">
            <div className="metric-icon-box">
              <ShieldCheck size={20} />
            </div>
            <div className="metric-details">
              <strong>1,450+ Verified Venues</strong>
              <span>100% physically inspected spaces</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon-box">
              <QrCode size={20} />
            </div>
            <div className="metric-details">
              <strong>Instant QR Gate Pass</strong>
              <span>Frictionless smartphone entry</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon-box">
              <Star size={20} />
            </div>
            <div className="metric-details">
              <strong>4.95 / 5.0 Rating</strong>
              <span>Trusted by 45,000+ event creators</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
