import { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Users,
  Maximize2,
  Clock,
  ShieldCheck,
  Check,
  Heart,
  Calendar,
  Sparkles,
  CreditCard,
  Building,
  Info
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

export default function VenueDetailModal({ venue, onClose }) {
  const { createBooking, isFavorite, toggleFavorite, setIsAuthModalOpen } = useBooking();
  const { isAuthenticated } = useAuth();

  const [activePhoto, setActivePhoto] = useState(0);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    return tomorrow.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('17:00');
  const [duration, setDuration] = useState(venue?.minHours || 4);
  const [guests, setGuests] = useState(Math.min(venue?.capacity || 100, 75));
  const [eventType, setEventType] = useState('Corporate Event');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!venue) return null;

  const favorited = isFavorite(venue.id);

  const addOnOptions = [
    {
      id: 'catering',
      name: 'Chef-Curated Royal Catering Service',
      pricePerGuest: 2500,
      type: 'per_guest',
      desc: 'Multi-course gourmet Indian & international live food stations'
    },
    {
      id: 'av_engineer',
      name: 'Dedicated A/V & Intelligent Lighting Specialist',
      flatPrice: 25000,
      type: 'flat',
      desc: 'On-site acoustics, stage rigging, and lighting technician throughout event'
    },
    {
      id: 'valet',
      name: 'White-Glove Valet Parking',
      flatPrice: 20000,
      type: 'flat',
      desc: 'Uniformed attendants and managed premium parking lot access'
    },
    {
      id: 'security',
      name: 'Licensed Private Security Detail',
      flatPrice: 18000,
      type: 'flat',
      desc: 'Certified event safety specialists and entry gate bouncers'
    }
  ];

  const handleToggleAddOn = (addOnId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  // Pricing math
  const baseSubtotal = venue.pricePerHour * duration;

  let addOnsTotal = 0;
  selectedAddOns.forEach((id) => {
    const opt = addOnOptions.find((o) => o.id === id);
    if (!opt) return;
    if (opt.type === 'per_guest') {
      addOnsTotal += opt.pricePerGuest * Number(guests);
    } else {
      addOnsTotal += opt.flatPrice;
    }
  });

  const serviceFee = Math.round((baseSubtotal + addOnsTotal) * 0.08);
  const grandTotal = baseSubtotal + addOnsTotal + serviceFee;

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    const chosenAddOnNames = selectedAddOns.map(
      (id) => addOnOptions.find((o) => o.id === id)?.name
    );

    setTimeout(() => {
      createBooking({
        venueId: venue.id,
        date,
        startTime,
        durationHours: duration,
        guests,
        eventType,
        addOns: chosenAddOnNames,
        totalAmount: grandTotal,
      });

      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-container-card venue-detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-icon-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header-section">
          <div className="modal-title-row">
            <span className="category-pill-tag">{venue.category}</span>
            <div className="modal-header-actions">
              <button
                type="button"
                className={`heart-toggle-btn ${favorited ? 'active' : ''}`}
                onClick={() => toggleFavorite(venue.id)}
              >
                <Heart size={18} className={favorited ? 'fill-current' : ''} />
                <span>{favorited ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          <h2 className="modal-venue-title">{venue.name}</h2>

          <div className="modal-meta-row">
            <div className="meta-item">
              <Star size={16} className="star-icon" />
              <strong>{venue.rating}</strong>
              <span className="text-muted">({venue.reviewCount} verified reviews)</span>
            </div>
            <span className="dot-sep">•</span>
            <div className="meta-item">
              <MapPin size={16} />
              <span>{venue.address}, {venue.city}, {venue.state}</span>
            </div>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="modal-gallery-showcase">
          <div className="gallery-main-view">
            <img
              src={venue.images[activePhoto] || venue.images[0]}
              alt={`${venue.name} view ${activePhoto + 1}`}
              className="gallery-main-img"
            />
          </div>

          <div className="gallery-thumbs-row">
            {venue.images.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`thumb-btn ${activePhoto === i ? 'active' : ''}`}
                onClick={() => setActivePhoto(i)}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content & Booking Form Grid */}
        <div className="modal-columns-grid">
          {/* Left Column: Details, Specs, Amenities, Host */}
          <div className="modal-left-content">
            {/* Tagline */}
            <blockquote className="venue-tagline-quote">
              &ldquo;{venue.tagline}&rdquo;
            </blockquote>

            {/* Space Dimensions & Capacity Stats */}
            <div className="venue-quick-metrics-grid">
              <div className="metric-box">
                <Users size={22} className="box-icon" />
                <span className="box-num">{venue.capacity}</span>
                <span className="box-lbl">Max Capacity</span>
              </div>
              <div className="metric-box">
                <Maximize2 size={22} className="box-icon" />
                <span className="box-num">{venue.sqft?.toLocaleString()}</span>
                <span className="box-lbl">Square Footage</span>
              </div>
              <div className="metric-box">
                <Clock size={22} className="box-icon" />
                <span className="box-num">{venue.minHours}h</span>
                <span className="box-lbl">Minimum Booking</span>
              </div>
            </div>

            {/* About the Space */}
            <div className="detail-section">
              <h3 className="section-heading">About this Space</h3>
              <p className="description-text">{venue.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="detail-section">
              <h3 className="section-heading">Included Amenities & Services</h3>
              <div className="amenities-full-grid">
                {venue.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity-item-check">
                    <Check size={16} className="check-icon" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Space Guidelines & Rules */}
            <div className="detail-section">
              <h3 className="section-heading">Space Guidelines & Sound Policy</h3>
              <div className="rules-callout-box">
                <Info size={18} className="info-icon" />
                <p>{venue.rules}</p>
              </div>
            </div>

            {/* Host Profile */}
            <div className="detail-section host-card-section">
              <h3 className="section-heading">Space Host</h3>
              <div className="host-profile-card">
                <img
                  src={venue.host.avatar}
                  alt={venue.host.name}
                  className="host-avatar-lg"
                />
                <div className="host-info">
                  <div className="host-name-row">
                    <h4>{venue.host.name}</h4>
                    {venue.host.isSuperhost && (
                      <span className="superhost-badge">
                        <Sparkles size={12} /> Superhost
                      </span>
                    )}
                  </div>
                  <p className="host-stats">
                    Response rate: <strong>{venue.host.responseRate}</strong> • Responds{' '}
                    <strong>{venue.host.responseTime}</strong>
                  </p>
                  <p className="host-blurb text-muted">
                    Verified commercial property partner on VenueVista since 2024.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Booking Widget */}
          <div className="modal-right-sidebar">
            <div className="booking-widget-card">
              <div className="widget-header">
                <div className="widget-price">
                  <span className="price-big">₹{venue.pricePerHour?.toLocaleString('en-IN')}</span>
                  <span className="price-unit">/ hour</span>
                </div>
                <div className="widget-min">
                  <span>{venue.minHours} hour min</span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                {/* Date Picker */}
                <div className="form-group">
                  <label htmlFor="booking-date">Event Date</label>
                  <div className="input-with-icon">
                    <Calendar size={18} className="field-icon" />
                    <input
                      id="booking-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Start Time & Duration */}
                <div className="form-row-dual">
                  <div className="form-group">
                    <label htmlFor="booking-time">Start Time</label>
                    <input
                      id="booking-time"
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="booking-duration">Duration (Hours)</label>
                    <select
                      id="booking-duration"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    >
                      {[venue.minHours, venue.minHours + 1, venue.minHours + 2, 6, 8, 10, 12].map(
                        (h) => (
                          <option key={h} value={h}>
                            {h} hours
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Guests & Event Type */}
                <div className="form-row-dual">
                  <div className="form-group">
                    <label htmlFor="booking-guests">Estimated Guests</label>
                    <input
                      id="booking-guests"
                      type="number"
                      min="1"
                      max={venue.capacity}
                      required
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="booking-type">Event Type</label>
                    <select
                      id="booking-type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                    >
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Wedding / Reception">Wedding / Reception</option>
                      <option value="Private Gala / Party">Private Gala / Party</option>
                      <option value="Photo / Film Production">Photo / Film Production</option>
                      <option value="Product Showcase">Product Showcase</option>
                    </select>
                  </div>
                </div>

                {/* Add-ons Checklist */}
                <div className="form-group">
                  <label className="label-addons">Enhance Your Reservation</label>
                  <div className="addons-list">
                    {addOnOptions.map((addon) => {
                      const isChecked = selectedAddOns.includes(addon.id);
                      const costStr =
                        addon.type === 'per_guest'
                          ? `+₹${addon.pricePerGuest.toLocaleString('en-IN')}/guest`
                          : `+₹${addon.flatPrice.toLocaleString('en-IN')}`;

                      return (
                        <div
                          key={addon.id}
                          className={`addon-option-row ${isChecked ? 'selected' : ''}`}
                          onClick={() => handleToggleAddOn(addon.id)}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAddOn(addon.id)}
                            aria-label={addon.name}
                          />
                          <div className="addon-texts">
                            <div className="addon-header">
                              <span className="addon-title">{addon.name}</span>
                              <span className="addon-cost">{costStr}</span>
                            </div>
                            <span className="addon-desc">{addon.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="pricing-breakdown-card">
                  <div className="breakdown-row">
                    <span>
                      ₹{venue.pricePerHour?.toLocaleString('en-IN')} &times; {duration} hours
                    </span>
                    <span>₹{baseSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {addOnsTotal > 0 && (
                    <div className="breakdown-row">
                      <span>Selected Add-ons</span>
                      <span>+₹{addOnsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="breakdown-row">
                    <span>Platform & Insurance Fee (8%)</span>
                    <span>+₹{serviceFee.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="breakdown-divider"></div>

                  <div className="breakdown-row total-row">
                    <strong>Total Amount</strong>
                    <strong className="grand-total-amount">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* Instant Reserve CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-reserve-instant"
                >
                  <ShieldCheck size={18} />
                  <span>
                    {isSubmitting
                      ? 'Generating Cryptographic Pass...'
                      : 'Reserve Space & Get QR Pass'}
                  </span>
                </button>

                <p className="instant-guarantee-note">
                  🔒 You will not be charged until the host accepts. Instant digital gate pass generated upon confirmation.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
