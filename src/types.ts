export type ElementType = 'text' | 'image' | 'shape';

export interface ElementStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface SlideElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string; // For text or image URL
  style: ElementStyle;
  rotation?: number;
}

export interface Slide {
  id: string;
  elements: SlideElement[];
  background: string;
}

export interface Presentation {
  title: string;
  slides: Slide[];
}
