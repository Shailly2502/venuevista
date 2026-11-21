import {
  Sparkles,
  Building2,
  Sunset,
  Trees,
  Palette,
  Presentation,
  Waves,
  Heart,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { venueCategories } from '../data/mockVenues';
import { useBooking } from '../context/BookingContext';

const ICON_MAP = {
  Sparkles,
  Building2,
  Sunset,
  Trees,
  Palette,
  Presentation,
  Waves,
};

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  showSavedOnly,
  onToggleSavedOnly,
  searchQuery,
  onSearchChange,
  priceFilter,
  onPriceChange,
  totalResults
}) {
  const { savedVenues } = useBooking();

  return (
    <div className="category-filter-section">
      <div className="filter-top-bar">
        {/* Category Pills Slider */}
        <div className="category-scroll-container">
          {venueCategories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Sparkles;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                className={`category-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <IconComponent size={17} className="cat-icon" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Toggles: Saved & Quick Price Slider */}
        <div className="filter-auxiliary-actions">
          {/* Wishlist only button */}
          <button
            type="button"
            className={`aux-filter-btn ${showSavedOnly ? 'active-saved' : ''}`}
            onClick={onToggleSavedOnly}
            title="Filter by saved venues"
          >
            <Heart size={16} className={showSavedOnly ? 'heart-active' : ''} />
            <span>Saved ({savedVenues.length})</span>
          </button>

          {/* Quick max price slider */}
          <div className="price-slider-pill">
            <SlidersHorizontal size={14} />
            <span className="price-label">Max ₹{priceFilter.toLocaleString('en-IN')}/hr</span>
            <input
              type="range"
              min="10000"
              max="50000"
              step="2500"
              value={priceFilter}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              aria-label="Filter by maximum price per hour"
            />
          </div>
        </div>
      </div>

      {/* Query Search / Active Filters indicator */}
      <div className="active-filter-indicator">
        <span className="result-count">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'exceptional space' : 'exceptional spaces'}
        </span>

        {(searchQuery || selectedCategory !== 'All' || showSavedOnly || priceFilter < 600) && (
          <div className="active-tag-pills">
            {selectedCategory !== 'All' && (
              <span className="filter-tag">
                Type: {selectedCategory}
                <button type="button" onClick={() => onSelectCategory('All')}>
                  <X size={12} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="filter-tag">
                &ldquo;{searchQuery}&rdquo;
                <button type="button" onClick={() => onSearchChange('')}>
                  <X size={12} />
                </button>
              </span>
            )}

            {showSavedOnly && (
              <span className="filter-tag">
                Saved only
                <button type="button" onClick={onToggleSavedOnly}>
                  <X size={12} />
                </button>
              </span>
            )}

            {priceFilter < 50000 && (
              <span className="filter-tag">
                &le; ₹{priceFilter.toLocaleString('en-IN')}/hr
                <button type="button" onClick={() => onPriceChange(50000)}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
