import { CheckCircle2, X, Calendar, MapPin, Users, Ticket, ArrowRight, Printer } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';
import { useBooking } from '../context/BookingContext';

export default function BookingSuccessModal({ booking, onClose }) {
  const { setIsMyBookingsOpen } = useBooking();

  if (!booking) return null;

  const handleGoToMyBookings = () => {
    onClose();
    setIsMyBookingsOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-container-card success-pass-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="modal-close-icon-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="success-header-banner">
          <div className="success-badge-circle">
            <CheckCircle2 size={36} color="#10b981" />
          </div>
          <h2 className="success-title">Reservation Confirmed!</h2>
          <p className="success-sub">
            Your space has been locked in and your official digital entry pass has been generated.
          </p>
        </div>

        {/* Digital QR Boarding Pass Component */}
        <QRCodeDisplay
          payload={booking.qrPayload}
          ticketCode={booking.ticketCode}
          venueName={booking.venueName}
          date={booking.date}
          time={booking.startTime}
        />

        {/* Reservation Details Summary */}
        <div className="success-summary-box">
          <div className="summary-item">
            <span className="summary-label">Reference ID</span>
            <span className="summary-val mono">{booking.id}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Total Amount Paid</span>
            <span className="summary-val price-highlight">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Expected Attendees</span>
            <span className="summary-val">{booking.guests} Guests</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Event Format</span>
            <span className="summary-val">{booking.eventType}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="success-modal-actions">
          <button
            type="button"
            className="btn-print-pass"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Print Pass</span>
          </button>

          <button
            type="button"
            className="btn-view-all-bookings"
            onClick={handleGoToMyBookings}
          >
            <span>Go to My Reservations</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
