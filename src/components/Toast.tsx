import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#131b2e] text-white font-medium text-sm shadow-2xl flex items-center gap-3 transition-all animate-bounce">
      <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">
        {type === 'error' ? 'error' : 'check_circle'}
      </span>
      <span>{message}</span>
    </div>
  );
};
