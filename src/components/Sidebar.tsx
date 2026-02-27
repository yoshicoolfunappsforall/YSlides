import React from 'react';
import { Slide } from '../types';
import { SlideRenderer } from './SlideRenderer';
import { Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  slides: Slide[];
  currentSlideId: string;
  onSelectSlide: (id: string) => void;
  onAddSlide: () => void;
  onDeleteSlide: (id: string) => void;
}

export const Sidebar = ({ 
  slides, 
  currentSlideId, 
  onSelectSlide, 
  onAddSlide,
  onDeleteSlide
}: SidebarProps) => {
  return (
    <div className="w-[220px] bg-[#e8e8e8] border-r border-[#d9d9d9] flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`flex mb-4 cursor-pointer group px-2 relative`}
            onClick={() => onSelectSlide(slide.id)}
          >
            <div className="w-6 flex flex-col items-center pt-1">
              <span className={`text-[11px] font-medium ${currentSlideId === slide.id ? 'text-[#dd4b39]' : 'text-[#666]'}`}>
                {index + 1}
              </span>
            </div>
            <div 
              className={`
                flex-1 relative transition-all
                ${currentSlideId === slide.id ? 'border-[2px] border-[#dd4b39]' : 'border border-[#ccc] group-hover:border-[#999]'}
              `}
            >
                {/* Mini Preview */}
                <div className="pointer-events-none">
                    <SlideRenderer slide={slide} scale={0.22} />
                </div>
            </div>
            
            {/* Delete button on hover */}
            <button 
                className="absolute right-1 top-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all"
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSlide(slide.id);
                }}
            >
                <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Add Slide Button Area */}
      <div className="p-2 border-t border-[#d9d9d9] bg-[#f0f0f0]">
        <button 
            onClick={onAddSlide}
            className="w-full flex items-center justify-center py-2 bg-white border border-[#ccc] hover:bg-[#f8f8f8] rounded-sm text-[#444] text-[13px] font-bold shadow-sm"
        >
            <Plus size={14} className="mr-2" />
            New Slide
        </button>
      </div>
    </div>
  );
};
