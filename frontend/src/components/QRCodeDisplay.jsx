import { useState } from 'react';
import { CheckCircle2, Copy, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';

export default function QRCodeDisplay({ payload, ticketCode, venueName, date, time }) {
  const [copied, setCopied] = useState(false);
  const [simulatedScan, setSimulatedScan] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketCode || payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateScan = () => {
    setSimulatedScan(true);
    setTimeout(() => setSimulatedScan(false), 4000);
  };

  // Generate deterministic QR-style dot grid pattern for visual realism
  const generateQrMatrix = (seed) => {
    const size = 21;
    const matrix = [];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        // Position detection corner squares (standard QR corners)
        const inTopLeft = r < 7 && c < 7;
        const inTopRight = r < 7 && c >= size - 7;
        const inBottomLeft = r >= size - 7 && c < 7;
        const inCenterLogo = r >= 8 && r <= 12 && c >= 8 && c <= 12;

        if (inTopLeft) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          row.push(isBorder || isCenter);
        } else if (inTopRight) {
          const isBorder = r === 0 || r === 6 || c === size - 7 || c === size - 1;
          const isCenter = r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3;
          row.push(isBorder || isCenter);
        } else if (inBottomLeft) {
          const isBorder = r === size - 7 || r === size - 1 || c === 0 || c === 6;
          const isCenter = r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4;
          row.push(isBorder || isCenter);
        } else if (inCenterLogo) {
          row.push(false);
        } else {
          // Semi-random pattern derived from seed
          const val = Math.sin((r * 13 + c * 17 + hash) % 31) > 0.15;
          row.push(val);
        }
      }
      matrix.push(row);
    }
    return matrix;
  };

  const matrix = generateQrMatrix(payload || ticketCode || 'VENUEVISTA-PASS');

  return (
    <div className="qr-pass-container">
      <div className="qr-ticket-card">
        <div className="qr-ticket-header">
          <div className="qr-brand-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>VENUEVISTA VERIFIED PASS</span>
          </div>
          <span className="qr-badge-status">
            <span className="status-dot live"></span> Valid Entry
          </span>
        </div>

        <div className="qr-body">
          {/* QR Code SVG */}
          <div className="qr-code-wrapper">
            <svg
              viewBox="0 0 210 210"
              className="qr-svg"
              shapeRendering="crispEdges"
              aria-label="Digital QR Ticket"
            >
              <rect width="210" height="210" fill="#ffffff" rx="12" />
              {matrix.map((row, r) =>
                row.map((cell, c) => {
                  if (!cell) return null;
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={c * 10}
                      y={r * 10}
                      width={9.2}
                      height={9.2}
                      rx={2}
                      fill="#0f172a"
                    />
                  );
                })
              )}
              {/* Center Emblem overlay */}
              <circle cx="105" cy="105" r="22" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
              <text
                x="105"
                y="110"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#6366f1"
                fontFamily="system-ui"
              >
                VV
              </text>
            </svg>

            {simulatedScan && (
              <div className="qr-scan-overlay">
                <CheckCircle2 size={42} className="scan-success-icon" />
                <p>Pass Verified & Checked In!</p>
              </div>
            )}
          </div>

          <div className="qr-ticket-details">
            <div className="detail-row">
              <span className="detail-label">Code</span>
              <span className="detail-value mono">{ticketCode || 'VV-2026-ENTRY'}</span>
            </div>
            {venueName && (
              <div className="detail-row">
                <span className="detail-label">Space</span>
                <span className="detail-value">{venueName}</span>
              </div>
            )}
            {date && (
              <div className="detail-row">
                <span className="detail-label">Date & Time</span>
                <span className="detail-value">{date} {time ? `• ${time}` : ''}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Security</span>
              <span className="detail-value security-tag">
                <ShieldCheck size={14} /> Cryptographic Token
              </span>
            </div>
          </div>
        </div>

        <div className="qr-ticket-footer">
          <button
            type="button"
            className="qr-btn-secondary"
            onClick={handleCopy}
            title="Copy verification code"
          >
            {copied ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            className="qr-btn-primary"
            onClick={handleSimulateScan}
            title="Simulate scanning at the venue gate"
          >
            <Smartphone size={16} />
            <span>Test Gate Scan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
