import { useState } from 'react';
import {
  Compass,
  Heart,
  Ticket,
  User,
  PlusCircle,
  Menu,
  X,
  LogOut,
  Calendar,
  Sparkles,
  ChevronDown,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function Navbar({ onNavigateSection }) {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const {
    savedVenues,
    bookings,
    setIsAuthModalOpen,
    setAuthModalTab,
    setIsMyBookingsOpen,
    setIsHostModalOpen,
    setSearchParams
  } = useBooking();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenAuth = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterSaved = () => {
    setIsMobileMenuOpen(false);
    handleNavClick('venues-section');
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('hero-section')}>
          <div className="brand-logo-icon">
            <Sparkles size={20} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Venue<span className="brand-accent">Vista</span></span>
            <span className="brand-badge">PREMIER SPACES</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick('venues-section')}
          >
            <Compass size={17} />
            <span>Explore Spaces</span>
          </button>

          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick('events-section')}
          >
            <Calendar size={17} />
            <span>Events</span>
          </button>

          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick('how-it-works-section')}
          >
            <span>How it Works</span>
          </button>

          <button
            type="button"
            className="nav-link host-nav-link"
            onClick={() => setIsHostModalOpen(true)}
          >
            <PlusCircle size={17} />
            <span>List Your Space</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Saved Venues Button */}
          <button
            type="button"
            className="action-icon-btn"
            onClick={handleFilterSaved}
            title="Saved Venues"
            aria-label="Saved Venues"
          >
            <Heart size={20} className={savedVenues.length > 0 ? 'heart-filled' : ''} />
            {savedVenues.length > 0 && (
              <span className="action-badge-count">{savedVenues.length}</span>
            )}
          </button>

          {/* My Bookings / Tickets Button */}
          <button
            type="button"
            className="action-icon-btn bookings-btn"
            onClick={() => setIsMyBookingsOpen(true)}
            title="My Bookings & QR Passes"
            aria-label="My Bookings"
          >
            <Ticket size={20} />
            {bookings.length > 0 && (
              <span className="action-badge-count green">{bookings.length}</span>
            )}
            <span className="btn-label-desktop">Bookings</span>
          </button>

          {/* User Auth Profile / Button */}
          {isAuthenticated && user ? (
            <div className="user-profile-menu-wrapper">
              <button
                type="button"
                className="user-avatar-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.name}
                  className="user-avatar-img"
                />
                <span className="user-firstname">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown-card">
                  <div className="dropdown-user-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                    <span className="dropdown-role-tag">{user.role || 'Member'}</span>
                  </div>

                  <div className="dropdown-divider"></div>

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsMyBookingsOpen(true);
                    }}
                  >
                    <Ticket size={16} />
                    <span>My Reservations & Passes</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsHostModalOpen(true);
                    }}
                  >
                    <Building size={16} />
                    <span>Host Dashboard / List Venue</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-demo-section">
                    <span className="dropdown-section-title">Switch Demo Identity</span>
                    <div className="demo-switch-buttons">
                      <button
                        type="button"
                        className="demo-chip-btn"
                        onClick={() => {
                          loginAsDemo('planner');
                          setIsUserMenuOpen(false);
                        }}
                      >
                        Planner
                      </button>
                      <button
                        type="button"
                        className="demo-chip-btn"
                        onClick={() => {
                          loginAsDemo('host');
                          setIsUserMenuOpen(false);
                        }}
                      >
                        Host
                      </button>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <button
                    type="button"
                    className="dropdown-item logout"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <button
                type="button"
                className="btn-text-login"
                onClick={() => handleOpenAuth('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn-primary-join"
                onClick={() => handleOpenAuth('register')}
              >
                Join Free
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleNavClick('venues-section')}
          >
            <Compass size={18} />
            <span>Explore Spaces</span>
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleNavClick('events-section')}
          >
            <Calendar size={18} />
            <span>Upcoming Events</span>
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsHostModalOpen(true);
            }}
          >
            <PlusCircle size={18} />
            <span>List Your Space</span>
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsMyBookingsOpen(true);
            }}
          >
            <Ticket size={18} />
            <span>My Bookings ({bookings.length})</span>
          </button>

          <div className="mobile-drawer-auth">
            {!isAuthenticated ? (
              <div className="mobile-auth-grid">
                <button
                  type="button"
                  className="btn-mobile-auth"
                  onClick={() => handleOpenAuth('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn-mobile-auth primary"
                  onClick={() => handleOpenAuth('register')}
                >
                  Create Account
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mobile-nav-link logout"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut size={18} />
                <span>Sign Out ({user?.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
