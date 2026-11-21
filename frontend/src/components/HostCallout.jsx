import { useState } from 'react';
import { Building, Sparkles, DollarSign, ShieldCheck, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { venueService } from '../api/venueService';

export default function HostCallout() {
  const { isHostModalOpen, setIsHostModalOpen, addToast } = useBooking();

  // Calculator states
  const [spaceType, setSpaceType] = useState('Rooftop');
  const [hoursPerWeek, setHoursPerWeek] = useState(12);

  // Form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    venueName: '',
    category: 'Rooftops',
    city: '',
    address: '',
    capacity: 150,
    hourlyRate: 25000,
    email: '',
    phone: '',
    description: '',
  });

  const rateMultipliers = {
    Ballroom: 35000,
    Rooftop: 28000,
    'Garden Estate': 30000,
    'Loft & Studio': 15000,
    'Conference Center': 40000,
    Waterfront: 32000,
  };

  const estimatedHourly = rateMultipliers[spaceType] || 28000;
  const estimatedMonthly = Math.round(estimatedHourly * hoursPerWeek * 4.33);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await venueService.submitHostInquiry(formData);
    setFormSubmitted(true);
    addToast('success', 'Venue Application Received!', 'A VenueVista specialist will reach out within 24 hours to schedule verification.');
  };

  const handleCloseModal = () => {
    setIsHostModalOpen(false);
    setFormSubmitted(false);
  };

  return (
    <>
      <section id="host-callout-section" className="host-callout-section">
        <div className="host-callout-glow"></div>

        <div className="host-callout-grid">
          {/* Left Column: Pitch & Trust */}
          <div className="host-pitch-column">
            <div className="section-micro-badge">
              <Building size={14} />
              <span>For Venue Owners & Architects</span>
            </div>

            <h2 className="host-title">
              Turn Your Unique Space into a{' '}
              <span className="gradient-text">Premier Earning Asset</span>
            </h2>

            <p className="host-desc">
              Join thousands of historic ballrooms, penthouse rooftops, and industrial lofts hosting verified corporate summits, private weddings, and exclusive brand galas.
            </p>

            <div className="host-perks-list">
              <div className="perk-item">
                <CheckCircle2 size={18} className="perk-icon" />
                <div>
                  <strong>₹15 Crore Property Damage Guarantee</strong>
                  <p>Comprehensive event liability coverage on every single reservation.</p>
                </div>
              </div>

              <div className="perk-item">
                <CheckCircle2 size={18} className="perk-icon" />
                <div>
                  <strong>Cryptographic QR Gate Passes</strong>
                  <p>Eliminate unregistered attendees with real-time digital pass verification.</p>
                </div>
              </div>

              <div className="perk-item">
                <CheckCircle2 size={18} className="perk-icon" />
                <div>
                  <strong>Guaranteed Payouts</strong>
                  <p>Automatic direct deposit wire transfers 24 hours after event commencement.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-open-host-modal"
              onClick={() => setIsHostModalOpen(true)}
            >
              <span>List Your Property Free</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Column: Interactive Earnings Estimator */}
          <div className="host-calculator-card">
            <div className="calculator-header">
              <Sparkles size={20} className="sparkle-calc" />
              <h3>Venue Earnings Calculator</h3>
            </div>

            <div className="calculator-controls">
              <div className="calc-group">
                <label>Select Space Type</label>
                <div className="space-type-pills">
                  {['Rooftop', 'Ballroom', 'Garden Estate', 'Loft & Studio', 'Waterfront'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`type-chip ${spaceType === type ? 'selected' : ''}`}
                      onClick={() => setSpaceType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-label-row">
                  <label>Hours Booked Per Week</label>
                  <span className="calc-val-highlight">{hoursPerWeek} hrs / week</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="35"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="calc-slider"
                  aria-label="Hours booked per week"
                />
              </div>
            </div>

            {/* Estimated Earnings Display */}
            <div className="earnings-highlight-box">
              <span className="earnings-subtext">Estimated Potential Earnings</span>
              <div className="earnings-number-row">
                <span className="currency-symbol">₹</span>
                <span className="earnings-big">{estimatedMonthly.toLocaleString('en-IN')}</span>
                <span className="earnings-freq">/ month</span>
              </div>
              <p className="earnings-notes">
                Based on average booking rates in metropolitan centers. High-demand weekend dates may command higher peak rates.
              </p>
            </div>

            <button
              type="button"
              className="btn-start-listing"
              onClick={() => setIsHostModalOpen(true)}
            >
              Start Your Free Listing Application
            </button>
          </div>
        </div>
      </section>

      {/* Host Listing Application Modal */}
      {isHostModalOpen && (
        <div className="modal-backdrop-overlay" onClick={handleCloseModal}>
          <div
            className="modal-container-card host-listing-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="modal-close-icon-btn"
              onClick={handleCloseModal}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {!formSubmitted ? (
              <div className="host-modal-inner">
                <div className="host-modal-header">
                  <Building size={28} className="host-header-icon" />
                  <h2>List Your Space on VenueVista</h2>
                  <p>Complete your initial property profile. Our verification team will review details within 24 hours.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="host-onboard-form">
                  <div className="form-row-dual">
                    <div className="form-group">
                      <label htmlFor="venueName">Venue / Space Name</label>
                      <input
                        id="venueName"
                        name="venueName"
                        type="text"
                        placeholder="e.g. Apex Rooftop Lounge"
                        required
                        value={formData.venueName}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                      >
                        <option value="Ballrooms">Ballroom</option>
                        <option value="Rooftops">Rooftop</option>
                        <option value="Garden Estates">Garden Estate</option>
                        <option value="Lofts & Studios">Loft & Studio</option>
                        <option value="Conference Centers">Conference Center</option>
                        <option value="Waterfront">Waterfront</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-dual">
                    <div className="form-group">
                      <label htmlFor="city">City & State</label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="e.g. Bandra West, Mumbai"
                        required
                        value={formData.city}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="hourlyRate">Desired Rate (₹/hr)</label>
                      <input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="5000"
                        max="100000"
                        step="2500"
                        required
                        value={formData.hourlyRate}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="form-row-dual">
                    <div className="form-group">
                      <label htmlFor="capacity">Max Guest Capacity</label>
                      <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        min="10"
                        max="2000"
                        required
                        value={formData.capacity}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Contact Work Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="owner@luxuryvenue.com"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Space Highlights & Architecture</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      placeholder="Describe high ceilings, lighting rigs, panoramic views, catering access..."
                      value={formData.description}
                      onChange={handleFormChange}
                    ></textarea>
                  </div>

                  <div className="modal-actions-footer">
                    <button type="button" className="btn-secondary-cancel" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary-submit">
                      Submit Venue Application
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="host-success-screen">
                <CheckCircle2 size={56} color="#10b981" />
                <h3>Application Submitted Successfully!</h3>
                <p>
                  Thank you for submitting <strong>{formData.venueName || 'your space'}</strong>.
                  A VenueVista onboarding curator will contact you at <strong>{formData.email}</strong> to arrange a 3D scan and verify your listing.
                </p>
                <button type="button" className="btn-primary-submit" onClick={handleCloseModal}>
                  Return to Exploration
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
