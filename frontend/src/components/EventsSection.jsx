import { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket, Sparkles, ArrowRight, Clock, Users } from 'lucide-react';
import { mockEvents } from '../data/mockEvents';
import { venueService } from '../api/venueService';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

export default function EventsSection() {
  const { createEventTicketBooking, setIsAuthModalOpen } = useBooking();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allEvents, setAllEvents] = useState(mockEvents);

  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
      try {
        const events = await venueService.getEvents();
        if (isMounted && events && events.length > 0) {
          setAllEvents(events);
        }
      } catch {
        // Fallback to mockEvents
      }
    }
    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', 'Technology', 'Music & Dining', 'Fashion & Art', 'Live Music'];

  const filteredEvents = selectedCategory === 'All'
    ? allEvents
    : allEvents.filter((e) => e.category === selectedCategory);

  const handleBuyTicket = (event) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    createEventTicketBooking(event);
  };

  return (
    <section id="events-section" className="events-main-section">
      <div className="section-header-centered">
        <div className="section-micro-badge">
          <Sparkles size={14} />
          <span>Curated Experiences</span>
        </div>
        <h2 className="section-main-title">
          Premier Public <span className="gradient-text">Events & Galas</span>
        </h2>
        <p className="section-subtext">
          Exclusive summits, black-tie galas, and live acoustic sessions hosted at premier VenueVista partner spaces.
          Direct digital ticketing with instant cryptographic check-in.
        </p>

        {/* Category switcher */}
        <div className="event-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`event-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-cards-grid">
        {filteredEvents.map((event) => {
          const percentSold = Math.round((event.attendees / event.capacity) * 100);

          return (
            <div key={event.id} className="event-card">
              <div className="event-card-media">
                <img src={event.image} alt={event.title} className="event-img" />
                <span className="event-badge-tag">{event.badge}</span>
                <div className="event-date-chip">
                  <Calendar size={13} />
                  <span>{event.date}</span>
                </div>
              </div>

              <div className="event-card-body">
                <span className="event-category-name">{event.category}</span>
                <h3 className="event-title">{event.title}</h3>

                <p className="event-description">{event.description}</p>

                <div className="event-info-rows">
                  <div className="info-row">
                    <MapPin size={14} />
                    <span>{event.venueName} • {event.city}</span>
                  </div>
                  <div className="info-row">
                    <Clock size={14} />
                    <span>{event.time}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="event-capacity-bar-wrapper">
                  <div className="capacity-text-row">
                    <span>Tickets sold</span>
                    <span>{event.attendees} / {event.capacity} ({percentSold}%)</span>
                  </div>
                  <div className="capacity-bar-track">
                    <div
                      className="capacity-bar-fill"
                      style={{ width: `${percentSold}%` }}
                    ></div>
                  </div>
                </div>

                {/* Footer: Price & Ticket Action */}
                <div className="event-card-footer">
                  <div className="event-price">
                    <span className="price-tag">₹{event.price.toLocaleString('en-IN')}</span>
                    <span className="price-sub">/ pass</span>
                  </div>

                  <button
                    type="button"
                    className="btn-get-ticket"
                    onClick={() => handleBuyTicket(event)}
                  >
                    <Ticket size={16} />
                    <span>Get Ticket</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
