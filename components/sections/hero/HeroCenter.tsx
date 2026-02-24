import React from 'react';
import { Section } from '../../../types';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
}

export const HeroModern: React.FC<HeroProps> = ({ 
  section, 
  onTextEdit, 
  onImageClick, 
  buttonClass, 
  onElementSelect, 
  selectedElementId, 
  readOnly = false 
}) => {
  const { content, styles } = section;
  
  const isCustomColor = (value?: string) => value && (value.startsWith('#') || value.startsWith('rgb'));
  const styleAny = styles as any;

  // Typography Logic
  const headingTag = (styles.titleHeadingTag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const titleAlign = styleAny.titleAlign || styles.textAlign || 'center';
  const titleFontWeight = styleAny.titleFontWeight || styleAny.fontWeight || 'bold';
  const titleAlignClass = titleAlign === 'left' ? 'text-left' : titleAlign === 'right' ? 'text-right' : 'text-center';
  
  const titleFontWeightClass = 
    titleFontWeight === '300' ? 'font-light' : 
    titleFontWeight === '400' ? 'font-normal' : 
    titleFontWeight === '700' ? 'font-bold' : 
    titleFontWeight === '900' ? 'font-black' : 'font-extrabold';
  
  const hasCustomTitleSize = styles.titleSize && (styles.titleSize.includes('px') || styles.titleSize.includes('rem'));
  const titleFontFamily = (styleAny.titleFontFamily || styleAny.fontFamily);

  const titleStyle: React.CSSProperties = {
    ...(isCustomColor(styles.titleColor) ? { color: styles.titleColor } : {}),
    ...(hasCustomTitleSize ? { fontSize: styles.titleSize } : {}),
  };

  if (titleFontFamily && titleFontFamily.trim() !== '') {
    titleStyle.fontFamily = titleFontFamily;
  }

  // Subtitle Logic
  const subtitleStyle: React.CSSProperties = {
    color: styles.subtitleColor || styles.textColor,
    ...(styles.subtitleSize ? { fontSize: styles.subtitleSize } : {}),
  };

  // Selection IDs
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;
  const imageId = `${section.id}-hero-image`;

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (onElementSelect) onElementSelect(elementId);
  };

  const getSelectionStyles = (id: string) => {
    if (readOnly) return "";
    const isSelected = selectedElementId === id;
    return `transition-all duration-300 rounded-lg cursor-text ${
      isSelected 
        ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-transparent shadow-lg bg-blue-500/5' 
        : 'hover:bg-white/5 hover:ring-1 hover:ring-white/20'
    }`;
  };

  return (
    <div className="relative w-full overflow-hidden pt-12 pb-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className={`${styles.maxWidth || 'max-w-6xl'} mx-auto px-6 relative`}>
        {/* Main Content Wrapper */}
        <div className="flex flex-col items-center text-center">
          
          {/* Section Accent (Badge style) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            Featured Presentation
          </div>

          {/* Title */}
          {React.createElement(
            headingTag,
            {
              className: `max-w-4xl text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] ${titleFontWeightClass} ${titleAlignClass} ${getSelectionStyles(titleId)} px-6 py-2 mb-6`,
              style: titleStyle,
              contentEditable: !readOnly,
              suppressContentEditableWarning: !readOnly,
              onBlur: !readOnly ? (e: any) => onTextEdit('title', e.currentTarget.textContent || '') : undefined,
              onClick: !readOnly ? (e: React.MouseEvent) => handleElementClick(e, titleId) : undefined
            },
            content.title
          )}

          {/* Subtitle */}
          <div className="max-w-2xl mx-auto mb-10">
            <p 
              className={`text-lg md:text-xl opacity-60 leading-relaxed ${getSelectionStyles(subtitleId)} px-4 py-2`} 
              style={subtitleStyle}
              contentEditable={!readOnly}
              suppressContentEditableWarning={!readOnly}
              onBlur={!readOnly ? (e) => onTextEdit('subtitle', e.currentTarget.textContent || '') : undefined}
              onClick={!readOnly ? (e) => handleElementClick(e, subtitleId) : undefined}
            >
              {content.subtitle}
            </p>
          </div>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <button 
              className={`${buttonClass} group relative overflow-hidden text-lg px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-blue-500/20 ${getSelectionStyles(buttonId)}`} 
              contentEditable={!readOnly}
              suppressContentEditableWarning={!readOnly}
              onBlur={!readOnly ? (e) => onTextEdit('ctaText', e.currentTarget.textContent || '') : undefined}
              onClick={!readOnly ? (e) => handleElementClick(e, buttonId) : undefined}
            >
              <span className="relative z-10 flex items-center gap-2">
                {content.ctaText}
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Hero Image with "Browser Frame" Effect */}
          {content.imageUrl && (
            <div 
              className={`relative w-full max-w-5xl mx-auto perspective-1000 group/img cursor-pointer ${
                selectedElementId === imageId ? 'ring-2 ring-blue-500 ring-offset-8 ring-offset-transparent' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick(e, imageId);
                onImageClick();
              }}
            >
              {/* Image Shadow/Glow Background */}
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] opacity-0 group-hover/img:opacity-40 transition-opacity duration-700 rounded-full scale-75" />
              
              {/* Browser Mockup Frame */}
              <div className="relative bg-[#1a1a1a] rounded-t-xl border-x border-t border-white/10 p-3 flex items-center gap-1.5 shadow-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <div className="ml-4 h-4 w-32 bg-white/5 rounded-md" />
              </div>

              <div className="relative overflow-hidden rounded-b-xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover/img:scale-[1.01]">
                <img 
                  src={content.imageUrl} 
                  alt="Hero" 
                  className="w-full h-auto object-cover block" 
                />
                
                {/* Overlay on hover */}
                {!readOnly && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all">
                    <div className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover/img:translate-y-0 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Replace Visual Asset
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};