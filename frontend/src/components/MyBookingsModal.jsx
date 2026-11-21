import { useState } from 'react';
import {
  X,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Users,
  QrCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import QRCodeDisplay from './QRCodeDisplay';

export default function MyBookingsModal({ onClose }) {
  const { bookings, cancelBooking, setActiveVenueModal } = useBooking();
  const [expandedBookingId, setExpandedBookingId] = useState(bookings[0]?.id || null);

  const toggleExpand = (id) => {
    setExpandedBookingId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-container-card my-bookings-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="modal-close-icon-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="bookings-modal-header">
          <div className="header-icon-circle">
            <Ticket size={24} />
          </div>
          <div>
            <h2>My Reservations & Gate Passes</h2>
            <p>Access your cryptographic QR entrance codes and event itineraries.</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bookings-empty-state">
            <Ticket size={56} className="empty-icon" />
            <h3>No Active Reservations</h3>
            <p>You haven&apos;t booked any venues or registered for tickets yet.</p>
            <button
              type="button"
              className="btn-primary-explore"
              onClick={onClose}
            >
              Explore Exceptional Venues
            </button>
          </div>
        ) : (
          <div className="bookings-items-list">
            {bookings.map((item) => {
              const isExpanded = expandedBookingId === item.id;
              const isCancelled = item.status === 'Cancelled';

              return (
                <div
                  key={item.id}
                  className={`booking-card-item ${isExpanded ? 'expanded' : ''} ${isCancelled ? 'cancelled' : ''}`}
                >
                  <div
                    className="booking-card-summary"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <img
                      src={item.venueImage}
                      alt={item.venueName}
                      className="booking-thumb-img"
                    />

                    <div className="booking-main-info">
                      <div className="booking-title-row">
                        <h4>{item.venueName}</h4>
                        <span className={`booking-status-badge ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="booking-event-type">{item.eventType}</p>

                      <div className="booking-meta-line">
                        <span>
                          <Calendar size={13} /> {item.date}
                        </span>
                        <span>•</span>
                        <span>
                          <Clock size={13} /> {item.startTime}
                        </span>
                        <span>•</span>
                        <span>
                          <MapPin size={13} /> {item.venueCity}
                        </span>
                      </div>
                    </div>

                    <div className="booking-right-actions">
                      <div className="booking-price-chip">
                        ₹{item.totalAmount?.toLocaleString('en-IN')}
                      </div>
                      <button
                        type="button"
                        className="btn-toggle-expand"
                        aria-label="Expand details"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded QR Code & Full Ticket Pass */}
                  {isExpanded && (
                    <div className="booking-expanded-pass">
                      <div className="pass-qr-column">
                        <QRCodeDisplay
                          payload={item.qrPayload}
                          ticketCode={item.ticketCode}
                          venueName={item.venueName}
                          date={item.date}
                          time={item.startTime}
                        />
                      </div>

                      <div className="pass-details-column">
                        <h5>Reservation Specifications</h5>
                        <ul className="spec-checklist">
                          <li>
                            <span>Reference Code:</span> <strong>{item.id}</strong>
                          </li>
                          <li>
                            <span>Gate Ticket Pass:</span> <strong className="mono">{item.ticketCode}</strong>
                          </li>
                          <li>
                            <span>Attendee Count:</span> <strong>{item.guests} Guests</strong>
                          </li>
                          <li>
                            <span>Host / Organizer:</span> <strong>{item.hostName}</strong>
                          </li>
                          {item.addOns && item.addOns.length > 0 && (
                            <li>
                              <span>Included Add-ons:</span>
                              <div className="addons-tag-list">
                                {item.addOns.map((add, i) => (
                                  <span key={i} className="addon-tag-pill">{add}</span>
                                ))}
                              </div>
                            </li>
                          )}
                        </ul>

                        {!isCancelled && (
                          <div className="booking-actions-row">
                            <button
                              type="button"
                              className="btn-cancel-reservation"
                              onClick={() => cancelBooking(item.id)}
                            >
                              <Trash2 size={15} />
                              <span>Cancel Reservation</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
