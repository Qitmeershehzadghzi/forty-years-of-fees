import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDanger ? 'bg-[#C75A5A]/10 text-[#C75A5A]' : 'bg-[#D6AD60]/15 text-[#D6AD60]'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#101C2C]">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-[#788391] hover:text-[#101C2C]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#788391] leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D6]">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-[#788391] hover:bg-[#F5F1E8]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold text-white shadow-sm cursor-pointer ${
              isDanger ? 'bg-[#C75A5A] hover:bg-[#a84444]' : 'bg-[#101C2C] hover:bg-[#1A2B40]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
