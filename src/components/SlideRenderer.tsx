import React from 'react';
import { Slide } from '../types';
import { SlideElementRenderer } from './SlideElementRenderer';

interface SlideRendererProps {
  slide: Slide;
  scale?: number;
  selectedElementId?: string | null;
  onElementMouseDown?: (e: React.MouseEvent, elementId: string) => void;
  onElementChange?: (id: string, content: string) => void;
  onElementResize?: (id: string, width: number, height: number, x: number, y: number) => void;
}

export const SlideRenderer = ({ 
  slide, 
  scale = 1, 
  selectedElementId, 
  onElementMouseDown,
  onElementChange,
  onElementResize
}: SlideRendererProps) => {
  return (
    <div 
      className="relative bg-white shadow-sm overflow-hidden"
      style={{
        width: `${800 * scale}px`,
        height: `${450 * scale}px`,
        backgroundColor: slide.background
      }}
    >
      {slide.elements.map(element => (
        <SlideElementRenderer
          key={element.id}
          element={element}
          scale={scale}
          isSelected={selectedElementId === element.id}
          onMouseDown={onElementMouseDown}
          onChange={onElementChange}
          onResize={onElementResize}
        />
      ))}
    </div>
  );
};
