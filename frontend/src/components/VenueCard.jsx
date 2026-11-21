import { useState } from 'react';
import {
  Heart,
  Star,
  Users,
  Maximize2,
  MapPin,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function VenueCard({ venue, onSelectVenue, onBookDirect }) {
const { toggleFavorite, isFavorite } = useBooking();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const favorited = isFavorite(venue.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(venue.id);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    if (onBookDirect) {
      onBookDirect(venue);
    } else {
      onSelectVenue(venue);
    }
  };

  return (
    <article className="venue-card" onClick={() => onSelectVenue(venue)}>
      {/* Media & Image Gallery container */}
      <div className="venue-card-media">
        <img
          src={venue.images[activeImageIndex] || venue.images[0]}
          alt={venue.name}
          className="venue-card-img"
          loading="lazy"
        />

        {/* Status Badges */}
        <div className="venue-badges-wrapper">
          {venue.badge && (
            <span className="venue-badge primary">
              <Sparkles size={12} />
              {venue.badge}
            </span>
          )}
          {venue.verified && (
            <span className="venue-badge verified">
              <CheckCircle size={12} />
              Verified
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          className={`venue-card-favorite-btn ${favorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={18} className={favorited ? 'fill-current' : ''} />
        </button>

        {/* Image pagination dots if multiple images */}
        {venue.images.length > 1 && (
          <div className="venue-image-dots" onClick={(e) => e.stopPropagation()}>
            {venue.images.slice(0, 4).map((_, idx) => (
              <span
                key={idx}
                className={`image-dot ${activeImageIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="venue-card-body">
        <div className="venue-card-top-info">
          <span className="venue-category-label">{venue.category}</span>
          <div className="venue-rating">
            <Star size={15} className="star-icon" />
            <span className="rating-score">{venue.rating}</span>
            <span className="review-count">({venue.reviewCount})</span>
          </div>
        </div>

        <h3 className="venue-card-title">{venue.name}</h3>

        <div className="venue-location-row">
          <MapPin size={14} className="location-pin" />
          <span>{venue.city}, {venue.state}</span>
        </div>

        {/* Specs: Capacity & Sqft */}
        <div className="venue-specs-row">
          <div className="spec-item">
            <Users size={14} />
            <span>Up to {venue.capacity} guests</span>
          </div>
          <div className="spec-dot">•</div>
          <div className="spec-item">
            <Maximize2 size={14} />
            <span>{venue.sqft?.toLocaleString()} sq ft</span>
          </div>
        </div>

        {/* Amenities preview */}
        <div className="venue-amenities-preview">
          {venue.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="amenity-chip">
              {amenity}
            </span>
          ))}
          {venue.amenities.length > 3 && (
            <span className="amenity-chip more">
              +{venue.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer: Price & CTA buttons */}
        <div className="venue-card-footer">
          <div className="venue-pricing">
            <span className="price-amount">₹{venue.pricePerHour?.toLocaleString('en-IN')}</span>
            <span className="price-unit">/ hour</span>
            <span className="price-min">({venue.minHours}h min)</span>
          </div>

          <div className="venue-card-actions">
            <button
              type="button"
              className="btn-card-reserve"
              onClick={handleBookClick}
            >
              <span>Book Space</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
