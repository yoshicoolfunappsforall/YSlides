import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ title, isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-sm shadow-xl w-[500px] max-w-[90vw] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
          <h2 className="text-[16px] font-bold text-[#222]">{title}</h2>
          <button onClick={onClose} className="text-[#666] hover:bg-[#eee] p-1 rounded-sm">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="flex justify-end px-4 py-3 border-t border-[#e0e0e0] bg-[#f5f5f5]">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-[#f5f5f5] border border-[#dcdcdc] rounded-[2px] text-[13px] font-bold text-[#444] hover:bg-[#f8f8f8] hover:shadow-sm mr-2"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-[#4d90fe] border border-[#3079ed] rounded-[2px] text-[13px] font-bold text-white hover:bg-[#357ae8]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
