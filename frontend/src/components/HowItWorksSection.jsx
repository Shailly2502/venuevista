import { Search, Sliders, ShieldCheck, QrCode, ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function HowItWorksSection() {
  const { setIsHostModalOpen } = useBooking();

  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Discover Curated Spaces',
      desc: 'Browse verified ballrooms, lofts, rooftop terraces, and conservatories with authentic high-res galleries and layout specs.'
    },
    {
      num: '02',
      icon: Sliders,
      title: 'Customize Your Event',
      desc: 'Select hours, guest counts, and optional certified add-ons like chef catering, lighting technicians, and valet service.'
    },
    {
      num: '03',
      icon: ShieldCheck,
      title: 'Guaranteed Reservation',
      desc: 'Transparent pricing with zero hidden fees. Protected by our ₹15 Crore property safety guarantee and host SLA.'
    },
    {
      num: '04',
      icon: QrCode,
      title: 'Instant QR Gate Pass',
      desc: 'Receive an authenticated digital pass with a cryptographic QR code for rapid, frictionless attendee and organizer check-in.'
    }
  ];

  return (
    <section id="how-it-works-section" className="how-it-works-section">
      <div className="section-header-centered">
        <div className="section-micro-badge">
          <span>Seamless Logistics</span>
        </div>
        <h2 className="section-main-title">
          How Venue<span className="gradient-text">Vista</span> Works
        </h2>
        <p className="section-subtext">
          From discovery to day-of check-in, experience an event production workflow designed for discerning organizers and hosts.
        </p>
      </div>

      <div className="how-it-works-grid">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="step-card">
              <div className="step-num-badge">{step.num}</div>
              <div className="step-icon-box">
                <Icon size={24} />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
