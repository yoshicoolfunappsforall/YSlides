import React from 'react';
import { MessageSquare, Share2, Play } from 'lucide-react';
import { GoogleSlidesLogo } from './Logo';

interface HeaderProps {
    onShare: () => void;
    onComments: () => void;
    onPresent: () => void;
}

export const Header = ({ onShare, onComments, onPresent }: HeaderProps) => {
  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="mr-4 cursor-pointer">
            <GoogleSlidesLogo />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <input 
                type="text" 
                defaultValue="Google Practice Presentation" 
                className="text-[16px] font-medium text-[#444] border border-transparent hover:border-[#d9d9d9] px-1 rounded-sm focus:outline-none focus:border-[#4d90fe] w-64 truncate"
              />
              <span className="text-[#888] text-[14px] ml-2 cursor-pointer hover:text-[#444]">☆</span>
              <span className="text-[#888] text-[14px] ml-2 cursor-pointer hover:text-[#444]">📁</span>
            </div>
            <div className="flex items-center mt-0.5">
              {['File', 'Edit', 'View', 'Insert', 'Slide', 'Format', 'Arrange', 'Tools', 'Table', 'Help'].map((menu) => (
                <div key={menu} className="px-1.5 py-0.5 text-[13px] text-[#333] cursor-pointer hover:bg-[#eee] rounded-[2px] select-none">
                  {menu}
                </div>
              ))}
              <span className="text-[11px] text-[#888] ml-4 select-none">All changes saved in Drive</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
            <div className="flex bg-[#f8f8f8] border border-[#d9d9d9] rounded-[2px] hover:shadow-sm mr-2 cursor-pointer hover:bg-[#f0f0f0] transition-colors">
                <button 
                    onClick={onPresent}
                    className="px-3 py-1 text-[13px] font-bold text-[#444] border-r border-[#d9d9d9]"
                >
                    Present
                </button>
                <button className="px-1 py-1 text-[10px] text-[#444]">
                    ▼
                </button>
            </div>

            <button 
                onClick={onComments}
                className="flex items-center px-3 py-1 bg-[#f8f8f8] border border-[#d9d9d9] rounded-[2px] text-[13px] font-bold text-[#444] hover:bg-[#f0f0f0] hover:shadow-sm transition-colors mr-2"
            >
                <MessageSquare size={14} className="mr-1.5 text-[#666]" />
                Comments
            </button>

            <button 
                onClick={onShare}
                className="flex items-center px-4 py-1.5 bg-gradient-to-b from-[#4d90fe] to-[#4787ed] hover:from-[#357ae8] hover:to-[#357ae8] text-white rounded-[2px] shadow-sm transition-colors border border-[#3079ed]"
            >
                <Share2 size={14} className="mr-2" />
                <span className="text-[13px] font-bold">Share</span>
            </button>
            
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer ml-2 border border-white shadow-sm">
                T
            </div>
        </div>
      </div>
    </div>
  );
};
