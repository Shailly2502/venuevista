import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useBooking();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-floating-container" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'warning') Icon = AlertTriangle;

        return (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <Icon size={20} className="toast-icon" />
            <div className="toast-text-box">
              {toast.title && <h5 className="toast-title">{toast.title}</h5>}
              <p className="toast-message">{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
