
import React from 'react';

export const COLORS = {
  bg: '#f5eedb',
  sidebar: '#133020',
  accent: '#046241',
  saffron: '#FFB347',
  earthYellow: '#FFC370',
  white: '#ffffff',
  text: '#133020',
};

export const TOOLS = [
  { id: 'chat', name: 'GENERAL CHAT', icon: '💬', description: 'Standard AI interaction' },
  { id: 'image', name: 'GENERATE IMAGE', icon: '🖼️', description: 'Generate visual concepts' },
  { id: 'research', name: 'DEEP INSIGHT', icon: '🔍', description: 'Advanced research & data' },
  { id: 'canvas', name: 'DOCUMENT CANVAS', icon: '📝', description: 'Writing and structured data' },
  { id: 'maps', name: 'GLOBAL LOGISTICS', icon: '📍', description: 'Mapping and location data' },
];

export const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'FAST', description: 'Responsive and efficient' },
  { id: 'gemini-3-pro-preview', name: 'PRO', description: 'Advanced reasoning' },
];

export const LifewoodLogo: React.FC<{ className?: string; textClass?: string; showText?: boolean }> = ({ 
  className = "h-8", 
  textClass = "text-white",
  showText = true 
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg viewBox="0 0 100 120" className="h-full fill-[#FFB347]">
      <path d="M50 0 L90 30 L90 90 L50 120 L10 90 L10 30 Z" />
    </svg>
    {showText && <span className={`${textClass} font-bold text-xl tracking-tighter transition-colors duration-500`}>lifewood</span>}
  </div>
);

export const SparkleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FFB347" />
  </svg>
);
