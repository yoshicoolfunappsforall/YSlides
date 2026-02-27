import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: {
    label: string;
    action: () => void;
    shortcut?: string;
    disabled?: boolean;
    separator?: boolean;
  }[];
}

export const ContextMenu = ({ x, y, onClose, options }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-[#ccc] shadow-[0_2px_4px_rgba(0,0,0,0.2)] py-1 min-w-[200px]"
      style={{ top: y, left: x }}
    >
      {options.map((option, index) => (
        option.separator ? (
          <div key={index} className="h-[1px] bg-[#ebebeb] my-1" />
        ) : (
          <div
            key={index}
            className={`
              px-4 py-1.5 flex items-center justify-between text-[13px] text-[#333]
              ${option.disabled ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-[#e8e8e8]'}
            `}
            onClick={() => {
              if (!option.disabled) {
                option.action();
                onClose();
              }
            }}
          >
            <span>{option.label}</span>
            {option.shortcut && <span className="text-[#999] ml-4">{option.shortcut}</span>}
          </div>
        )
      ))}
    </div>
  );
};
