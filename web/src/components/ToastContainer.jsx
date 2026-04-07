import { X } from "lucide-react";

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div className="list-item-header">
            <strong>{toast.title}</strong>
            <button type="button" className="button-ghost" onClick={() => onDismiss(toast.id)}>
              <X size={14} />
            </button>
          </div>
          <p className="muted">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
