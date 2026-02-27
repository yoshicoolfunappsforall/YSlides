import React, { useEffect, useState, useRef } from 'react';
import { Slide } from '../types';
import { SlideRenderer } from './SlideRenderer';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PresentationModeProps {
    slides: Slide[];
    initialSlideId: string;
    onClose: () => void;
}

export const PresentationMode = ({ slides, initialSlideId, onClose }: PresentationModeProps) => {
    const [currentIndex, setCurrentIndex] = useState(() => {
        const idx = slides.findIndex(s => s.id === initialSlideId);
        return idx >= 0 ? idx : 0;
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
                setCurrentIndex(prev => Math.min(prev + 1, slides.length - 1));
            } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
                setCurrentIndex(prev => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        // Request fullscreen
        if (containerRef.current) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error("Error attempting to enable fullscreen:", err);
            });
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.error(err));
            }
        };
    }, [slides.length, onClose]);

    const currentSlide = slides[currentIndex];

    // Calculate scale to fit screen
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const updateScale = () => {
            const slideWidth = 800; // Default slide width
            const slideHeight = 450; // Default slide height
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            const scaleX = windowWidth / slideWidth;
            const scaleY = windowHeight / slideHeight;
            setScale(Math.min(scaleX, scaleY) * 0.95); // 95% to leave a tiny margin
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none"
            onClick={(e) => {
                // Click to advance
                if ((e.target as HTMLElement).closest('button')) return;
                setCurrentIndex(prev => Math.min(prev + 1, slides.length - 1));
            }}
        >
            <div 
                style={{ 
                    transform: `scale(${scale})`, 
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-out'
                }}
                className="shadow-2xl"
            >
                <SlideRenderer 
                    slide={currentSlide} 
                    selectedElementId={null} 
                    onElementMouseDown={() => {}} 
                    onElementChange={() => {}} 
                    onElementResize={() => {}} 
                    scale={1}
                />
            </div>

            {/* Controls overlay (visible on hover) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full flex items-center space-x-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => Math.max(prev - 1, 0)); }}
                    disabled={currentIndex === 0}
                    className="p-1 hover:bg-white/20 rounded disabled:opacity-50"
                >
                    <ChevronLeft size={24} />
                </button>
                <span className="text-sm font-sans">
                    Slide {currentIndex + 1} of {slides.length}
                </span>
                <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => Math.min(prev + 1, slides.length - 1)); }}
                    disabled={currentIndex === slides.length - 1}
                    className="p-1 hover:bg-white/20 rounded disabled:opacity-50"
                >
                    <ChevronRight size={24} />
                </button>
                <div className="w-px h-6 bg-white/30 mx-2" />
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-1 hover:bg-white/20 rounded"
                    title="Exit Presentation"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};
