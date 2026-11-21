import { useState } from 'react';
import { Sparkles, Send, CheckCircle2, Shield, Heart } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Footer() {
  const { addToast, setIsHostModalOpen } = useBooking();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      addToast('success', 'Subscribed to VenueVista Privé', 'You will receive private previews of newly onboarded architectural spaces.');
      setEmail('');
    }
  };

  return (
    <footer className="footer-site">
      <div className="footer-container">
        {/* Top Newsletter / Brand Banner */}
        <div className="footer-newsletter-banner">
          <div className="banner-left">
            <div className="banner-badge">
              <Sparkles size={14} />
              <span>VENUEVISTA PRIVÉ</span>
            </div>
            <h3>Get Private Previews of New Architectural Spaces</h3>
            <p>Curated monthly digest of landmark properties, invitation-only galas, and venue host insights.</p>
          </div>

          <form className="banner-form" onSubmit={handleSubscribe}>
            <div className="subscribe-input-group">
              <input
                type="email"
                placeholder="Enter your executive email..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-subscribe">
                {subscribed ? (
                  <>
                    <CheckCircle2 size={16} /> Subscribed
                  </>
                ) : (
                  <>
                    <span>Join Privé</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Links Navigation Grid */}
        <div className="footer-links-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="brand-logo-icon">
                <Sparkles size={18} />
              </div>
              <span className="brand-name">Venue<span className="brand-accent">Vista</span></span>
            </div>
            <p className="brand-desc">
              The premier marketplace connecting extraordinary venues with visionary event creators. 100% physically vetted, transparent pricing, and instant QR entry.
            </p>
            <div className="trust-cert-pill">
              <Shield size={15} />
              <span>₹15 Crore Verified Host Protection</span>
            </div>
          </div>

          {/* Column 1: Explore Spaces */}
          <div className="footer-col">
            <h4>Explore Spaces</h4>
            <ul>
              <li><a href="#venues-section">Grand Ballrooms</a></li>
              <li><a href="#venues-section">Skyline Glass Rooftops</a></li>
              <li><a href="#venues-section">Botanical Conservatories</a></li>
              <li><a href="#venues-section">Industrial Artist Lofts</a></li>
              <li><a href="#venues-section">High-Tech Auditoriums</a></li>
              <li><a href="#venues-section">Waterfront Pavilions</a></li>
            </ul>
          </div>

          {/* Column 2: Venue Hosts */}
          <div className="footer-col">
            <h4>Venue Hosts</h4>
            <ul>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setIsHostModalOpen(true)}
                >
                  List Your Property
                </button>
              </li>
              <li><a href="#host-callout-section">Earnings Calculator</a></li>
              <li><a href="#host-callout-section">Host Protection Insurance</a></li>
              <li><a href="#how-it-works-section">Verification Guidelines</a></li>
              <li><a href="#how-it-works-section">Smart Gate Check-in</a></li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div className="footer-col">
            <h4>VenueVista</h4>
            <ul>
              <li><a href="#how-it-works-section">How it Works</a></li>
              <li><a href="#events-section">Public Galas & Events</a></li>
              <li><a href="#">Safety & Security Standards</a></li>
              <li><a href="#">Cancellation Policies</a></li>
              <li><a href="#">Developer API & Integrations</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; 2026 VenueVista Inc. All rights reserved. Crafted for extraordinary experiences.
          </p>

          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
            <span>•</span>
            <a href="#">Trust & Insurance</a>
            <span>•</span>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
