import React, { useRef, useEffect, useState } from 'react';
import { SlideElement } from '../types';

interface SlideElementRendererProps {
  element: SlideElement;
  isSelected?: boolean;
  scale?: number;
  onMouseDown?: (e: React.MouseEvent, elementId: string) => void;
  onChange?: (id: string, content: string) => void;
  onResize?: (id: string, width: number, height: number, x: number, y: number) => void;
}

export const SlideElementRenderer = ({ 
  element, 
  isSelected = false, 
  scale = 1, 
  onMouseDown,
  onChange,
  onResize
}: SlideElementRendererProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  useEffect(() => {
    if (textRef.current && element.content !== textRef.current.innerText) {
        // Only update if different to avoid cursor jumping
    }
  }, [element.content]);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (onChange) {
      onChange(element.id, e.currentTarget.innerText);
    }
  };

  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x * scale}px`,
    top: `${element.y * scale}px`,
    width: `${element.width * scale}px`,
    height: `${element.height * scale}px`,
    transform: `rotate(${element.rotation || 0}deg)`,
    cursor: isSelected ? 'move' : 'default',
    border: isSelected ? '1px solid #4d90fe' : '1px solid transparent', // Selection border
    outline: 'none',
    ...element.style,
    fontSize: element.style.fontSize ? `${element.style.fontSize * scale}px` : undefined,
    borderWidth: element.style.borderWidth ? `${element.style.borderWidth * scale}px` : undefined,
    fontWeight: element.style.bold ? 'bold' : 'normal',
    fontStyle: element.style.italic ? 'italic' : 'normal',
    textDecoration: element.style.underline ? 'underline' : 'none',
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(e, element.id);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const startLeft = element.x;
    const startTop = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!onResize) return;

      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (handle.includes('e')) newWidth = Math.max(10, startWidth + deltaX);
      if (handle.includes('w')) {
        const w = Math.max(10, startWidth - deltaX);
        newX = startLeft + (startWidth - w);
        newWidth = w;
      }
      if (handle.includes('s')) newHeight = Math.max(10, startHeight + deltaY);
      if (handle.includes('n')) {
        const h = Math.max(10, startHeight - deltaY);
        newY = startTop + (startHeight - h);
        newHeight = h;
      }

      onResize(element.id, newWidth, newHeight, newX, newY);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const ResizeHandle = ({ position, cursor }: { position: string, cursor: string }) => (
    <div
      className={`absolute w-2 h-2 bg-[#4d90fe] border border-white z-10 ${position}`}
      style={{ cursor }}
      onMouseDown={(e) => handleResizeStart(e, position)}
    />
  );

  const renderHandles = () => (
    <>
      <ResizeHandle position="nw" cursor="nw-resize" />
      <ResizeHandle position="n" cursor="n-resize" />
      <ResizeHandle position="ne" cursor="ne-resize" />
      <ResizeHandle position="e" cursor="e-resize" />
      <ResizeHandle position="se" cursor="se-resize" />
      <ResizeHandle position="s" cursor="s-resize" />
      <ResizeHandle position="sw" cursor="sw-resize" />
      <ResizeHandle position="w" cursor="w-resize" />
    </>
  );

  // Helper to map simplified positions to CSS classes
  // We need to manually position them because Tailwind classes like '-top-1' might not be precise enough with scaling?
  // Actually, let's use style for handles to be safe with scaling.
  const Handle = ({ type, cursor }: { type: string, cursor: string }) => {
      const size = 6;
      const offset = -3;
      const style: React.CSSProperties = {
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: '#4d90fe',
          border: '1px solid white',
          zIndex: 20,
          cursor: cursor
      };

      if (type === 'nw') { style.top = offset; style.left = offset; }
      if (type === 'n') { style.top = offset; style.left = '50%'; style.transform = 'translateX(-50%)'; }
      if (type === 'ne') { style.top = offset; style.right = offset; }
      if (type === 'e') { style.top = '50%'; style.right = offset; style.transform = 'translateY(-50%)'; }
      if (type === 'se') { style.bottom = offset; style.right = offset; }
      if (type === 's') { style.bottom = offset; style.left = '50%'; style.transform = 'translateX(-50%)'; }
      if (type === 'sw') { style.bottom = offset; style.left = offset; }
      if (type === 'w') { style.top = '50%'; style.left = offset; style.transform = 'translateY(-50%)'; }

      return <div style={style} onMouseDown={(e) => handleResizeStart(e, type)} />;
  };

  const renderBetterHandles = () => (
      <>
        <Handle type="nw" cursor="nw-resize" />
        <Handle type="n" cursor="ns-resize" />
        <Handle type="ne" cursor="ne-resize" />
        <Handle type="e" cursor="ew-resize" />
        <Handle type="se" cursor="se-resize" />
        <Handle type="s" cursor="ns-resize" />
        <Handle type="sw" cursor="sw-resize" />
        <Handle type="w" cursor="ew-resize" />
      </>
  );

  if (element.type === 'text') {
    return (
      <div
        style={commonStyle}
        onMouseDown={handleMouseDown}
        className="group"
      >
        <div
          ref={textRef}
          contentEditable={isSelected} 
          suppressContentEditableWarning
          onBlur={handleBlur}
          className="w-full h-full outline-none break-words whitespace-pre-wrap overflow-hidden"
          style={{
            cursor: isSelected ? 'text' : 'default',
            pointerEvents: isSelected ? 'auto' : 'none',
          }}
        >
          {element.content}
        </div>
        {isSelected && renderBetterHandles()}
      </div>
    );
  }

  if (element.type === 'shape') {
      return (
          <div 
            style={{...commonStyle, backgroundColor: element.style.backgroundColor || '#cccccc'}}
            onMouseDown={handleMouseDown}
          >
              {isSelected && renderBetterHandles()}
          </div>
      )
  }

  if (element.type === 'image') {
      return (
          <div 
            style={commonStyle}
            onMouseDown={handleMouseDown}
          >
              <img 
                src={element.content} 
                alt="slide element" 
                className="w-full h-full object-cover pointer-events-none" 
                referrerPolicy="no-referrer"
              />
              {isSelected && renderBetterHandles()}
          </div>
      )
  }

  return null;
};
