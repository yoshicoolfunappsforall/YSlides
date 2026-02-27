import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { SpeakerNotes } from './components/SpeakerNotes';
import { SlideRenderer } from './components/SlideRenderer';
import { Slide, SlideElement } from './types';
import { ContextMenu } from './components/ContextMenu';
import { Modal } from './components/Modal';
import { PresentationMode } from './components/PresentationMode';
import html2canvas from 'html2canvas';

// Initial Blank State
const initialSlides: Slide[] = [
  {
    id: 'slide-1',
    background: '#ffffff',
    elements: [
      {
        id: 'title-1',
        type: 'text',
        x: 100,
        y: 100,
        width: 600,
        height: 100,
        content: 'Click to add title',
        style: {
          fontSize: 44,
          textAlign: 'center',
          color: '#888',
          fontFamily: 'Arial'
        }
      },
      {
        id: 'subtitle-1',
        type: 'text',
        x: 100,
        y: 220,
        width: 600,
        height: 60,
        content: 'Click to add subtitle',
        style: {
          fontSize: 24,
          textAlign: 'center',
          color: '#888',
          fontFamily: 'Arial'
        }
      }
    ]
  }
];

export default function App() {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [history, setHistory] = useState<Slide[][]>([initialSlides]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [currentSlideId, setCurrentSlideId] = useState<string>(initialSlides[0].id);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: 'slide' | 'element' | 'canvas'; targetId?: string } | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<'share' | 'comments' | 'present' | 'background' | 'theme' | 'transition' | 'link' | null>(null);

  const slideRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides.find(s => s.id === currentSlideId) || slides[0];
  const selectedElement = currentSlide.elements.find(el => el.id === selectedElementId);

  // --- History Helper ---
  const updateSlidesWithHistory = (newSlides: Slide[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSlides);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSlides(newSlides);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSlides(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSlides(history[historyIndex + 1]);
    }
  };

  // --- Actions ---

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      background: '#ffffff',
      elements: []
    };
    const newSlides = [...slides, newSlide];
    updateSlidesWithHistory(newSlides);
    setCurrentSlideId(newSlide.id);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) return; // Prevent deleting last slide
    const newSlides = slides.filter(s => s.id !== id);
    updateSlidesWithHistory(newSlides);
    if (currentSlideId === id) {
      setCurrentSlideId(newSlides[0].id);
    }
  };

  const handleDuplicateSlide = (id: string) => {
    const slideToDuplicate = slides.find(s => s.id === id);
    if (!slideToDuplicate) return;

    const newSlide: Slide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}`,
      elements: slideToDuplicate.elements.map(el => ({ ...el, id: `${el.id}-copy` }))
    };
    
    const index = slides.findIndex(s => s.id === id);
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    updateSlidesWithHistory(newSlides);
    setCurrentSlideId(newSlide.id);
  };

  const handleDeleteElement = (elementId: string) => {
    const newSlides = slides.map(slide => {
      if (slide.id === currentSlideId) {
        return {
          ...slide,
          elements: slide.elements.filter(el => el.id !== elementId)
        };
      }
      return slide;
    });
    updateSlidesWithHistory(newSlides);
    setSelectedElementId(null);
  };

  const handleAddText = () => {
    const newElement: SlideElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 300,
      y: 200,
      width: 200,
      height: 50,
      content: 'New Text Box',
      style: {
        fontSize: 14,
        color: '#000000',
        textAlign: 'left',
        fontFamily: 'Arial'
      }
    };
    addElementToCurrentSlide(newElement);
  };

  const handleAddShape = () => {
    const newElement: SlideElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: 350,
      y: 150,
      width: 100,
      height: 100,
      content: '',
      style: {
        backgroundColor: '#cccccc'
      }
    };
    addElementToCurrentSlide(newElement);
  };

  const handleAddImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const newElement: SlideElement = {
            id: `img-${Date.now()}`,
            type: 'image',
            x: 250,
            y: 100,
            width: 300,
            height: 200,
            content: e.target?.result as string,
            style: {}
        };
        addElementToCurrentSlide(newElement);
    };
    reader.readAsDataURL(file);
  };

  const handleAddLine = () => {
      const newElement: SlideElement = {
          id: `line-${Date.now()}`,
          type: 'shape',
          x: 300,
          y: 200,
          width: 200,
          height: 2,
          content: '',
          style: {
              backgroundColor: '#000000'
          }
      };
      addElementToCurrentSlide(newElement);
  };

  const addElementToCurrentSlide = (element: SlideElement) => {
    const newSlides = slides.map(slide => {
      if (slide.id === currentSlideId) {
        return { ...slide, elements: [...slide.elements, element] };
      }
      return slide;
    });
    updateSlidesWithHistory(newSlides);
    setSelectedElementId(element.id);
  };

  const handleFormat = (type: string, value?: string) => {
    if (!selectedElementId) return;

    const newSlides = slides.map(slide => {
      if (slide.id === currentSlideId) {
        return {
          ...slide,
          elements: slide.elements.map(el => {
            if (el.id === selectedElementId) {
              const newStyle = { ...el.style };
              if (type === 'bold') newStyle.bold = !newStyle.bold;
              if (type === 'italic') newStyle.italic = !newStyle.italic;
              if (type === 'underline') newStyle.underline = !newStyle.underline;
              if (type === 'color' && value) newStyle.color = value;
              if (type === 'fontFamily' && value) newStyle.fontFamily = value;
              if (type === 'fontSize' && value) newStyle.fontSize = Number(value);
              return { ...el, style: newStyle };
            }
            return el;
          })
        };
      }
      return slide;
    });
    updateSlidesWithHistory(newSlides);
  };

  const handleElementChange = (id: string, content: string) => {
    // We don't want to push to history on every keystroke, so we update state directly
    // Ideally we'd debounce history updates or update on blur
    setSlides(slides.map(slide => {
      if (slide.id === currentSlideId) {
        return {
          ...slide,
          elements: slide.elements.map(el => {
            if (el.id === id) {
              return { ...el, content };
            }
            return el;
          })
        };
      }
      return slide;
    }));
  };

  const handleElementResize = (id: string, width: number, height: number, x: number, y: number) => {
    // Similar to content change, we update directly during drag
    setSlides(slides.map(slide => {
        if (slide.id === currentSlideId) {
            return {
                ...slide,
                elements: slide.elements.map(el => {
                    if (el.id === id) {
                        return { ...el, width, height, x, y };
                    }
                    return el;
                })
            };
        }
        return slide;
    }));
  };

  const handleElementResizeEnd = () => {
      // Push to history after resize ends
      updateSlidesWithHistory(slides);
  }

  // --- Ordering Logic ---
  const handleOrder = (direction: 'forward' | 'backward' | 'front' | 'back') => {
      if (!selectedElementId) return;
      
      const newSlides = slides.map(slide => {
          if (slide.id === currentSlideId) {
              const elements = [...slide.elements];
              const index = elements.findIndex(el => el.id === selectedElementId);
              if (index === -1) return slide;

              const [element] = elements.splice(index, 1);

              if (direction === 'forward') {
                  elements.splice(Math.min(index + 1, elements.length), 0, element);
              } else if (direction === 'backward') {
                  elements.splice(Math.max(index - 1, 0), 0, element);
              } else if (direction === 'front') {
                  elements.push(element);
              } else if (direction === 'back') {
                  elements.unshift(element);
              }

              return { ...slide, elements };
          }
          return slide;
      });
      updateSlidesWithHistory(newSlides);
  };

  // --- File Operations ---
  const handleDownloadJSON = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(slides));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "presentation.json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleLoadJSON = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const loadedSlides = JSON.parse(e.target?.result as string);
              if (Array.isArray(loadedSlides) && loadedSlides.length > 0) {
                  setSlides(loadedSlides);
                  setHistory([loadedSlides]);
                  setHistoryIndex(0);
                  setCurrentSlideId(loadedSlides[0].id);
              }
          } catch (err) {
              alert("Invalid JSON file");
          }
      };
      reader.readAsText(file);
  };

  const handleExportPNG = async () => {
      if (!slideRef.current) return;
      
      // Temporarily remove selection before taking screenshot
      const prevSelected = selectedElementId;
      setSelectedElementId(null);
      
      // Wait for React to re-render without selection handles
      await new Promise(resolve => setTimeout(resolve, 50));
      
      try {
          const canvas = await html2canvas(slideRef.current, { scale: 2 });
          const dataUrl = canvas.toDataURL("image/png");
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute("href", dataUrl);
          downloadAnchorNode.setAttribute("download", `slide-${currentSlideId}.png`);
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
      } catch (err) {
          console.error("Failed to export PNG", err);
      } finally {
          setSelectedElementId(prevSelected);
      }
  };

  // --- Dragging Logic ---

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation(); // Prevent deselecting
    
    // Check if right click
    if (e.button === 2) {
        setContextMenu({ x: e.clientX, y: e.clientY, type: 'element', targetId: elementId });
        return;
    }

    setSelectedElementId(elementId);
    setIsDragging(true);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, type: 'canvas' });
        return;
    }
    setSelectedElementId(null);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && selectedElementId) {
        setSlides(prevSlides => prevSlides.map(slide => {
          if (slide.id === currentSlideId) {
            return {
              ...slide,
              elements: slide.elements.map(el => {
                if (el.id === selectedElementId) {
                  return {
                    ...el,
                    x: el.x + e.movementX / scale, // Adjust for zoom
                    y: el.y + e.movementY / scale
                  };
                }
                return el;
              })
            };
          }
          return slide;
        }));
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
          setIsDragging(false);
          // We should ideally update history here, but since we don't have access to the *latest* slides state 
          // inside this closure easily without a ref or dependency, we'll skip for this simple demo.
          // A real app would use a ref for current slides or a robust state manager.
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedElementId, currentSlideId, scale]);

  // --- Context Menu Options ---
  const getContextMenuOptions = () => {
    if (!contextMenu) return [];

    if (contextMenu.type === 'element' && contextMenu.targetId) {
        return [
            { label: 'Cut', action: () => {}, shortcut: 'Ctrl+X', disabled: true },
            { label: 'Copy', action: () => {}, shortcut: 'Ctrl+C', disabled: true },
            { label: 'Paste', action: () => {}, shortcut: 'Ctrl+V', disabled: true },
            { separator: true, label: '', action: () => {} },
            { label: 'Delete', action: () => handleDeleteElement(contextMenu.targetId!), shortcut: 'Del' },
            { separator: true, label: '', action: () => {} },
            { label: 'Bring Forward', action: () => handleOrder('forward'), shortcut: 'Ctrl+↑' },
            { label: 'Send Backward', action: () => handleOrder('backward'), shortcut: 'Ctrl+↓' },
            { label: 'Bring to Front', action: () => handleOrder('front'), shortcut: 'Ctrl+Shift+↑' },
            { label: 'Send to Back', action: () => handleOrder('back'), shortcut: 'Ctrl+Shift+↓' },
        ];
    }

    // Default to canvas/slide options
    return [
        { label: 'New Slide', action: handleAddSlide, shortcut: 'Ctrl+M' },
        { label: 'Duplicate Slide', action: () => handleDuplicateSlide(currentSlideId), shortcut: 'Ctrl+D' },
        { label: 'Delete Slide', action: () => handleDeleteSlide(currentSlideId), disabled: slides.length <= 1 },
        { separator: true, label: '', action: () => {} },
        { label: 'Change Background...', action: () => setActiveModal('background') },
        { label: 'Apply Layout...', action: () => {} },
        { label: 'Change Theme...', action: () => setActiveModal('theme') },
        { label: 'Change Transition...', action: () => setActiveModal('transition') },
    ];
  };

  // --- Toolbar Handlers ---
  const handlePrint = () => window.print();
  const handleZoom = () => setScale(s => s === 1 ? 1.5 : s === 1.5 ? 0.5 : 1);
  const handleBackgroundChange = (color: string) => {
      const newSlides = slides.map(s => s.id === currentSlideId ? { ...s, background: color } : s);
      updateSlidesWithHistory(newSlides);
      setActiveModal(null);
  };
  const handleAlign = () => {
      if (!selectedElementId) return;
      const newSlides = slides.map(slide => {
          if (slide.id === currentSlideId) {
              return {
                  ...slide,
                  elements: slide.elements.map(el => {
                      if (el.id === selectedElementId) {
                          const alignments: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
                          const current = el.style.textAlign || 'left';
                          const next = alignments[(alignments.indexOf(current) + 1) % alignments.length];
                          return { ...el, style: { ...el.style, textAlign: next } };
                      }
                      return el;
                  })
              };
          }
          return slide;
      });
      updateSlidesWithHistory(newSlides);
  };

  return (
    <div 
        className="flex flex-col h-screen w-screen bg-[#e0e0e0] overflow-hidden font-sans"
        onContextMenu={(e) => e.preventDefault()}
    >
      <Header 
        onShare={() => setActiveModal('share')}
        onComments={() => setActiveModal('comments')}
        onPresent={() => setActiveModal('present')}
      />
      <Toolbar 
        onPrint={handlePrint}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPaintFormat={() => alert('Paint format copied')}
        onZoom={handleZoom}
        onSelectMode={() => setSelectedElementId(null)}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onAddShape={handleAddShape}
        onAddLine={handleAddLine}
        onBackground={() => setActiveModal('background')}
        onLayout={() => alert('Layout options coming soon')}
        onTheme={() => setActiveModal('theme')}
        onTransition={() => setActiveModal('transition')}
        onFontFamily={(font) => handleFormat('fontFamily', font)}
        onFontSize={(size) => handleFormat('fontSize', size.toString())}
        onFormat={handleFormat}
        onLink={() => setActiveModal('link')}
        onComment={() => setActiveModal('comments')}
        onAlign={handleAlign}
        onList={() => alert('List formatting coming soon')}
        onDownloadJSON={handleDownloadJSON}
        onLoadJSON={handleLoadJSON}
        onExportPNG={handleExportPNG}
        currentFontFamily={selectedElement?.style?.fontFamily || 'Arial'}
        currentFontSize={selectedElement?.style?.fontSize || 14}
        currentColor={selectedElement?.style?.color || '#000000'}
        isBold={!!selectedElement?.style?.bold}
        isItalic={!!selectedElement?.style?.italic}
        isUnderline={!!selectedElement?.style?.underline}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          slides={slides} 
          currentSlideId={currentSlideId} 
          onSelectSlide={setCurrentSlideId} 
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
        />
        
        <div className="flex-1 flex flex-col relative bg-[#eee] overflow-hidden">
          {/* Horizontal Ruler */}
          <div className="h-[18px] w-full bg-[#f5f5f5] border-b border-[#ccc] flex relative select-none">
             <div className="w-[18px] h-full bg-[#f5f5f5] border-r border-[#ccc] z-10"></div>
             <div className="flex-1 relative overflow-hidden">
                {/* Ruler ticks */}
                <div className="absolute top-0 left-0 w-full h-full flex">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex-1 h-full border-l border-[#ccc] relative">
                            <span className="absolute top-[2px] left-[2px] text-[9px] text-[#555] font-sans">{i}</span>
                            <div className="absolute bottom-0 left-1/2 w-[1px] h-[4px] bg-[#ccc]"></div>
                            <div className="absolute bottom-0 left-1/4 w-[1px] h-[2px] bg-[#ccc]"></div>
                            <div className="absolute bottom-0 left-3/4 w-[1px] h-[2px] bg-[#ccc]"></div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
          
          <div className="flex-1 overflow-auto flex relative bg-[#eee]" onMouseDown={handleCanvasMouseDown}>
             {/* Vertical Ruler */}
             <div className="w-[18px] h-full bg-[#f5f5f5] border-r border-[#ccc] relative flex-shrink-0 select-none">
                <div className="absolute top-0 left-0 w-full h-full flex flex-col">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex-1 w-full border-b border-[#ccc] relative">
                            <span className="absolute top-[2px] left-[2px] text-[9px] text-[#555] font-sans transform -rotate-90 origin-center translate-y-2">{i}</span>
                        </div>
                    ))}
                </div>
             </div>

             {/* Canvas Area */}
             <div className="flex-1 flex justify-center p-8 overflow-auto">
                 <div 
                    ref={slideRef}
                    onClick={(e) => e.stopPropagation()}
                    style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}
                 >
                    <SlideRenderer 
                        slide={currentSlide} 
                        scale={1}
                        selectedElementId={selectedElementId}
                        onElementMouseDown={handleElementMouseDown}
                        onElementChange={handleElementChange}
                        onElementResize={handleElementResize}
                    />
                 </div>
             </div>
          </div>

          <SpeakerNotes />
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu 
            x={contextMenu.x} 
            y={contextMenu.y} 
            onClose={() => setContextMenu(null)} 
            options={getContextMenuOptions()}
        />
      )}

      {/* Modals */}
      <Modal 
        title="Share with others" 
        isOpen={activeModal === 'share'} 
        onClose={() => setActiveModal(null)}
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-[#222] mb-1">Link to share</label>
                  <div className="flex">
                      <input 
                        type="text" 
                        readOnly 
                        value="https://docs.yoogle.com/presentation/d/123456789/edit" 
                        className="flex-1 border border-[#d9d9d9] px-2 py-1 text-sm bg-[#f5f5f5] text-[#444]"
                      />
                  </div>
              </div>
          </div>
      </Modal>

      <Modal 
        title="Comments" 
        isOpen={activeModal === 'comments'} 
        onClose={() => setActiveModal(null)}
      >
          <div className="h-64 flex items-center justify-center text-[#666] italic">
              No comments yet.
          </div>
      </Modal>

      {activeModal === 'present' && (
          <PresentationMode 
              slides={slides} 
              initialSlideId={currentSlideId} 
              onClose={() => setActiveModal(null)} 
          />
      )}

      <Modal 
        title="Background" 
        isOpen={activeModal === 'background'} 
        onClose={() => setActiveModal(null)}
      >
          <div className="flex space-x-2">
              <button onClick={() => handleBackgroundChange('#ffffff')} className="w-8 h-8 border border-gray-300 bg-white"></button>
              <button onClick={() => handleBackgroundChange('#fce5cd')} className="w-8 h-8 border border-gray-300 bg-[#fce5cd]"></button>
              <button onClick={() => handleBackgroundChange('#d9ead3')} className="w-8 h-8 border border-gray-300 bg-[#d9ead3]"></button>
              <button onClick={() => handleBackgroundChange('#c9daf8')} className="w-8 h-8 border border-gray-300 bg-[#c9daf8]"></button>
              <button onClick={() => handleBackgroundChange('#000000')} className="w-8 h-8 border border-gray-300 bg-black"></button>
          </div>
      </Modal>

      <Modal 
        title="Theme" 
        isOpen={activeModal === 'theme'} 
        onClose={() => setActiveModal(null)}
      >
          <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-white border border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500">Simple Light</div>
              <div className="h-20 bg-black text-white border border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500">Simple Dark</div>
          </div>
      </Modal>

      <Modal 
        title="Transition" 
        isOpen={activeModal === 'transition'} 
        onClose={() => setActiveModal(null)}
      >
          <div className="space-y-2">
              <select className="w-full border p-1">
                  <option>None</option>
                  <option>Fade</option>
                  <option>Slide from right</option>
              </select>
              <div className="text-sm text-gray-500">Apply to all slides</div>
          </div>
      </Modal>

      <Modal 
        title="Insert Link" 
        isOpen={activeModal === 'link'} 
        onClose={() => setActiveModal(null)}
      >
          <div className="space-y-2">
              <input type="text" placeholder="Text" className="w-full border p-1" />
              <input type="text" placeholder="Link" className="w-full border p-1" />
          </div>
      </Modal>

    </div>
  );
}
