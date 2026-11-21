import { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function AuthModal({ onClose }) {
  const { login, register, loginAsDemo, loading } = useAuth();
  const { authModalTab, setAuthModalTab, addToast } = useBooking();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Event Organizer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authModalTab === 'login') {
      const res = await login(email, password);
      if (res?.success) {
        addToast('success', 'Welcome Back!', `Logged in successfully as ${email}.`);
        onClose();
      } else {
        setError('Invalid credentials. Please verify your details.');
      }
    } else {
      const res = await register({ name, email, password, role });
      if (res?.success) {
        addToast('success', 'Account Created!', 'Welcome to VenueVista.');
        onClose();
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const handleDemoSelect = async (type) => {
    await loginAsDemo(type);
    addToast('success', 'Demo Session Activated', `Now signed in as a demo ${type === 'host' ? 'Venue Host' : 'Event Planner'}.`);
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-container-card auth-modal-card"
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

        <div className="auth-modal-header">
          <div className="auth-icon-badge">
            <Sparkles size={22} />
          </div>
          <h2>{authModalTab === 'login' ? 'Welcome to VenueVista' : 'Create Your Account'}</h2>
          <p>
            {authModalTab === 'login'
              ? 'Sign in to access your reservations, saved spaces, and tickets.'
              : 'Join elite organizers, producers, and property hosts.'}
          </p>
        </div>

        {/* 1-Click Demo Profiles for Frictionless Review */}
        <div className="demo-login-quickbar">
          <span className="demo-label">Instant 1-Click Demo Profiles:</span>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="btn-demo-profile"
              onClick={() => handleDemoSelect('planner')}
            >
              <User size={15} />
              <span>Event Planner Demo</span>
            </button>
            <button
              type="button"
              className="btn-demo-profile"
              onClick={() => handleDemoSelect('host')}
            >
              <Building size={15} />
              <span>Venue Host Demo</span>
            </button>
          </div>
        </div>

        <div className="auth-divider-or">
          <span>or continue with email</span>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-switcher">
          <button
            type="button"
            className={`auth-tab-btn ${authModalTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setAuthModalTab('login');
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${authModalTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setAuthModalTab('register');
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form-body">
          {authModalTab === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="auth-name">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="field-icon" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="e.g. Jordan Hayes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="auth-role">I am a...</label>
                <select
                  id="auth-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Event Organizer">Event Organizer / Planner</option>
                  <option value="Venue Host">Venue Host / Property Owner</option>
                  <option value="Attendee">Event Guest / Attendee</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="auth-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth-submit"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{authModalTab === 'login' ? 'Sign In to Account' : 'Register Free'}</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <div className="auth-security-footnote">
            <ShieldCheck size={14} />
            <span>256-bit encryption & secure JWT session token</span>
          </div>
        </form>
      </div>
    </div>
  );
}
