import React, { useRef } from 'react';
import { 
  Printer, 
  Undo, 
  Redo, 
  PaintRoller, 
  ZoomIn, 
  MousePointer2, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Minus, 
  Bold,
  Italic,
  Underline,
  Link,
  MessageSquare,
  AlignLeft,
  List,
  ChevronDown,
  Baseline,
  Download,
  Upload
} from 'lucide-react';

interface ToolbarProps {
    onPrint: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onPaintFormat: () => void;
    onZoom: () => void;
    onSelectMode: () => void;
    onAddText: () => void;
    onAddImage: (file: File) => void;
    onAddShape: () => void;
    onAddLine: () => void;
    onBackground: () => void;
    onLayout: () => void;
    onTheme: () => void;
    onTransition: () => void;
    onFontFamily: (font: string) => void;
    onFontSize: (size: number) => void;
    onFormat: (type: string, value?: string) => void;
    onLink: () => void;
    onComment: () => void;
    onAlign: () => void;
    onList: () => void;
    onDownloadJSON: () => void;
    onLoadJSON: (file: File) => void;
    onExportPNG: () => void;
    currentFontFamily: string;
    currentFontSize: number;
    currentColor: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
}

export const Toolbar = ({ 
    onPrint, onUndo, onRedo, onPaintFormat, onZoom, onSelectMode,
    onAddText, onAddShape, onAddImage, onAddLine,
    onBackground, onLayout, onTheme, onTransition,
    onFontFamily, onFontSize, onFormat,
    onLink, onComment, onAlign, onList,
    onDownloadJSON, onLoadJSON, onExportPNG,
    currentFontFamily, currentFontSize, currentColor,
    isBold, isItalic, isUnderline
}: ToolbarProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full bg-[#f5f5f5] border-b border-[#d9d9d9] select-none">
      {/* Top Toolbar - Main Actions */}
      <div className="flex items-center px-1 py-1 space-x-0.5 overflow-x-auto h-[34px]">
        <ToolbarButton icon={<Printer size={15} />} onClick={onPrint} tooltip="Print" />
        <ToolbarButton icon={<Undo size={15} />} onClick={onUndo} tooltip="Undo" />
        <ToolbarButton icon={<Redo size={15} />} onClick={onRedo} tooltip="Redo" />
        <ToolbarButton icon={<PaintRoller size={15} />} onClick={onPaintFormat} tooltip="Paint format" />
        
        <div className="w-[1px] h-4 bg-[#d9d9d9] mx-1" />
        
        <ToolbarButton 
            label="100%" 
            icon={<ZoomIn size={15} className="mr-1" />} 
            showArrow 
            onClick={onZoom}
            tooltip="Zoom" 
        />
        
        <div className="w-[1px] h-4 bg-[#d9d9d9] mx-1" />
        
        <ToolbarButton icon={<MousePointer2 size={15} />} onClick={onSelectMode} active tooltip="Select" />
        <ToolbarButton icon={<Type size={15} />} onClick={onAddText} tooltip="Text box" />
        
        {/* Image Upload Button */}
        <button 
            onClick={() => imageInputRef.current?.click()}
            title="Image"
            className="flex items-center justify-center px-1 h-[26px] min-w-[28px] rounded-[2px] border border-transparent hover:bg-[#e8e8e8] hover:border-[#d9d9d9] transition-all duration-75 group mx-[1px]"
        >
            <span className="text-[#444] opacity-80 group-hover:opacity-100"><ImageIcon size={15} /></span>
            <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        onAddImage(e.target.files[0]);
                        e.target.value = ''; // Reset
                    }
                }} 
            />
        </button>

        <ToolbarButton icon={<Square size={15} />} onClick={onAddShape} tooltip="Shape" />
        <ToolbarButton icon={<Minus size={15} />} onClick={onAddLine} tooltip="Line" />
        
        <div className="w-[1px] h-4 bg-[#d9d9d9] mx-1" />
        
        <ToolbarTextButton label="Background..." onClick={onBackground} />
        <ToolbarTextButton label="Layout" showArrow onClick={onLayout} />
        <ToolbarTextButton label="Theme..." onClick={onTheme} />
        <ToolbarTextButton label="Transition..." onClick={onTransition} />

        <div className="w-[1px] h-4 bg-[#d9d9d9] mx-1" />
        
        {/* File Operations */}
        <ToolbarButton icon={<Download size={15} />} onClick={onDownloadJSON} tooltip="Save (JSON)" />
        <button 
            onClick={() => jsonInputRef.current?.click()}
            title="Open (JSON)"
            className="flex items-center justify-center px-1 h-[26px] min-w-[28px] rounded-[2px] border border-transparent hover:bg-[#e8e8e8] hover:border-[#d9d9d9] transition-all duration-75 group mx-[1px]"
        >
            <span className="text-[#444] opacity-80 group-hover:opacity-100"><Upload size={15} /></span>
            <input 
                type="file" 
                ref={jsonInputRef} 
                className="hidden" 
                accept=".json" 
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        onLoadJSON(e.target.files[0]);
                        e.target.value = ''; // Reset
                    }
                }} 
            />
        </button>
        <ToolbarTextButton label="Export PNG" onClick={onExportPNG} />
      </div>

      {/* Bottom Toolbar - Text Formatting */}
      <div className="flex items-center px-1 py-1 space-x-0.5 border-t border-[#e0e0e0] overflow-x-auto h-[34px]">
         <select 
            value={currentFontFamily}
            onChange={(e) => onFontFamily(e.target.value)}
            className="h-[26px] bg-white border border-[#d9d9d9] hover:border-[#b0b0b0] rounded-[2px] px-1 cursor-pointer mx-[2px] shadow-[0_1px_0_rgba(0,0,0,0.05)] text-[13px] font-sans text-[#333] outline-none"
            style={{ width: 100 }}
         >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
         </select>

         <select 
            value={currentFontSize}
            onChange={(e) => onFontSize(Number(e.target.value))}
            className="h-[26px] bg-white border border-[#d9d9d9] hover:border-[#b0b0b0] rounded-[2px] px-1 cursor-pointer mx-[2px] shadow-[0_1px_0_rgba(0,0,0,0.05)] text-[13px] font-sans text-[#333] outline-none"
            style={{ width: 50 }}
         >
            {[8, 10, 12, 14, 18, 24, 36, 48, 64, 72, 96].map(size => (
                <option key={size} value={size}>{size}</option>
            ))}
         </select>
         
         <div className="w-[1px] h-4 bg-[#d9d9d9] mx-1" />
         
         <ToolbarButton icon={<Bold size={15} />} onClick={() => onFormat('bold')} active={isBold} tooltip="Bold" />
         <ToolbarButton icon={<Italic size={15} />} onClick={() => onFormat('italic')} active={isItalic} tooltip="Italic" />
         <ToolbarButton icon={<Underline size={15} />} onClick={() => onFormat('underline')} active={isUnderline} tooltip="Underline" />
         
         {/* Color Picker */}
         <div className="relative flex items-center justify-center px-1 h-[26px] min-w-[28px] rounded-[2px] border border-transparent hover:bg-[#e8e8e8] hover:border-[#d9d9d9] transition-all duration-75 group mx-[1px]">
             <span className="text-[#444] opacity-80 group-hover:opacity-100 relative">
                 <Baseline size={15} />
                 <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ backgroundColor: currentColor }} />
             </span>
             <input 
                type="color" 
                ref={colorInputRef}
                value={currentColor}
                onChange={(e) => onFormat('color', e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Text color"
             />
         </div>
         
         <div className="w-[1px] h-4 bg-[#d9d9d9] mx-1" />
         
         <ToolbarButton icon={<Link size={15} />} onClick={onLink} tooltip="Insert link" />
         <ToolbarButton icon={<MessageSquare size={15} />} onClick={onComment} tooltip="Add comment" />
         
         <div className="w-[1px] h-4 bg-[#d9d9d9] mx-1" />
         
         <ToolbarButton icon={<AlignLeft size={15} />} showArrow onClick={onAlign} tooltip="Align" />
         <ToolbarButton icon={<List size={15} />} showArrow onClick={onList} tooltip="Line spacing" />
         
         <div className="w-[1px] h-4 bg-[#d9d9d9] mx-1" />
         
         <ToolbarButton label="More" showArrow />
      </div>
    </div>
  );
};

const ToolbarButton = ({ 
    icon, 
    label, 
    showArrow, 
    active, 
    onClick,
    tooltip,
    className = ""
}: { 
    icon?: React.ReactNode, 
    label?: string, 
    showArrow?: boolean, 
    active?: boolean,
    onClick?: () => void,
    tooltip?: string,
    className?: string
}) => (
  <button 
    onClick={onClick}
    title={tooltip}
    className={`
      flex items-center justify-center px-1 h-[26px] min-w-[28px] rounded-[2px] border border-transparent
      ${active ? 'bg-[#e8e8e8] border-[#d9d9d9] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]' : 'hover:bg-[#e8e8e8] hover:border-[#d9d9d9]'}
      transition-all duration-75 group mx-[1px]
      ${className}
    `}
  >
    {icon && <span className="text-[#444] opacity-80 group-hover:opacity-100">{icon}</span>}
    {label && <span className="text-[11px] font-bold text-[#444] px-1">{label}</span>}
    {showArrow && <ChevronDown size={10} className="text-[#444] ml-0.5 opacity-80" />}
  </button>
);

const ToolbarTextButton = ({ label, showArrow, onClick }: { label: string, showArrow?: boolean, onClick?: () => void }) => (
    <button 
        onClick={onClick}
        className="flex items-center px-2 h-[26px] hover:bg-[#e8e8e8] hover:border hover:border-[#d9d9d9] rounded-[2px] border border-transparent mx-[1px]"
    >
        <span className="text-[13px] font-medium text-[#444]">{label}</span>
        {showArrow && <ChevronDown size={10} className="text-[#444] ml-1 opacity-80" />}
    </button>
);

