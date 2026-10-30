import React from 'react';
import { useCrm } from '../context/CrmContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useCrm();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="#10B981" />}
          {toast.type === 'danger' && <AlertCircle size={18} color="#F43F5E" />}
          {toast.type === 'info' && <Info size={18} color="#06B6D4" />}
          <span className="toast-text">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

