import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

const ToastNotification = ({ type = 'info', message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-[#1F3D2B] text-white border-l-4 border-[#A8541F]',
    error: 'bg-[#7F1D1D] text-white border-l-4 border-red-400',
    warning: 'bg-[#A8541F] text-white border-l-4 border-amber-300',
    info: 'bg-[#2E5940] text-white border-l-4 border-[#F7F4EC]',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-300 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />,
    info: <CheckCircle2 className="w-5 h-5 text-amber-200 shrink-0" />,
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-lg shadow-xl flex items-center justify-between gap-3 ${styles[type] || styles.info}`}>
      <div className="flex items-center gap-3">
        {icons[type] || icons.info}
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:opacity-75 transition-opacity shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ToastNotification;
