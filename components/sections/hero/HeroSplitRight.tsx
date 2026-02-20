
import React from 'react';
import { Section } from '../../../types';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  selectedElementId?: string | null;
}

export const HeroSplitRight: React.FC<HeroProps> = ({ section, onTextEdit, onImageClick, buttonClass, onElementSelect, selectedElementId }) => {
  const { content, styles } = section;
  
  const isCustomColor = (value?: string) => value && (value.startsWith('#') || value.startsWith('rgb'));

  // Get heading tag from styles, default to h1 for hero
  const headingTag = (styles.titleHeadingTag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // Check if custom fontSize is provided (px/rem/em) - if so, use it; otherwise CSS defaults apply
  const hasCustomFontSize = styles.titleSize && (styles.titleSize.includes('px') || styles.titleSize.includes('rem') || styles.titleSize.includes('em'));
  
  // Get alignment and font weight from styles
  const styleAny = styles as any;
  const titleAlign = styleAny.titleAlign || styles.textAlign || 'left';
  const titleFontWeight = styleAny.titleFontWeight || styleAny.fontWeight || 'bold';
  const titleAlignClass = titleAlign === 'left' ? 'text-left' : titleAlign === 'right' ? 'text-right' : titleAlign === 'justify' ? 'text-justify' : 'text-center';
  const titleFontWeightClass = titleFontWeight === '300' ? 'font-light' : titleFontWeight === '400' ? 'font-normal' : titleFontWeight === '700' ? 'font-bold' : titleFontWeight === '900' ? 'font-black' : 'font-bold';
  
  const titleStyle = {
    ...(isCustomColor(styles.titleColor) ? { color: styles.titleColor } : {}),
    // Only apply fontSize if it's a custom override (px/rem/em), otherwise let CSS handle it
    ...(hasCustomFontSize ? { fontSize: styles.titleSize } : {}),
    ...(titleAlign && !titleAlignClass.includes(titleAlign) ? { textAlign: titleAlign as any } : {})
  };

  // Element IDs - unique per section instance
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;
  const imageId = `${section.id}-hero-image`;

  // Handle element click
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (onElementSelect) {
      onElementSelect(elementId);
    }
  };

  // Check if elements are selected
  const isTitleSelected = selectedElementId === titleId;
  const isSubtitleSelected = selectedElementId === subtitleId;
  const isButtonSelected = selectedElementId === buttonId;
  const isImageSelected = selectedElementId === imageId;

  return (
    <div className={`${styles.maxWidth || 'max-w-7xl'} mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left`}>
      <div>
        {(() => {
          return React.createElement(
            headingTag,
            {
              key: `hero-title-${headingTag}-${section.id}`, // Force re-render when tag changes
              className: `${titleFontWeightClass} ${titleAlignClass} mb-6 leading-tight outline-none focus:ring-2 ring-white rounded px-2 ${isTitleSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20'}`,
              style: titleStyle,
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e: any) => onTextEdit('title', e.currentTarget.textContent || ''),
              onClick: (e: React.MouseEvent) => handleElementClick(e, titleId)
            },
            content.title
          );
        })()}
        {(() => {
          const subtitleAlign = styleAny.subtitleAlign || styles.textAlign || 'left';
          const subtitleFontWeight = styleAny.subtitleFontWeight || styleAny.fontWeight || '400';
          const subtitleAlignClass = subtitleAlign === 'left' ? 'text-left' : subtitleAlign === 'right' ? 'text-right' : subtitleAlign === 'justify' ? 'text-justify' : 'text-center';
          const subtitleFontWeightClass = subtitleFontWeight === '300' ? 'font-light' : subtitleFontWeight === '400' ? 'font-normal' : subtitleFontWeight === '700' ? 'font-bold' : subtitleFontWeight === '900' ? 'font-black' : 'font-normal';
          
          // Check if custom fontSize is provided for subtitle (px/rem/em) - if not, CSS defaults apply
          const hasCustomSubtitleSize = styles.subtitleSize && (styles.subtitleSize.includes('px') || styles.subtitleSize.includes('rem') || styles.subtitleSize.includes('em'));
          
          const subtitleStyle = {
            color: styles.subtitleColor || styles.textColor,
            ...(hasCustomSubtitleSize ? { fontSize: styles.subtitleSize } : {}),
            ...(subtitleAlign && !subtitleAlignClass.includes(subtitleAlign) ? { textAlign: subtitleAlign as any } : {})
          };
          
          return (
            <p 
              className={`${subtitleFontWeightClass} ${subtitleAlignClass} opacity-80 mb-8 outline-none focus:ring-2 ring-white rounded px-2 ${isSubtitleSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20'}`} 
              style={subtitleStyle}
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}
              onClick={(e) => handleElementClick(e, subtitleId)}
            >
                {content.subtitle}
            </p>
          );
        })()}
        <button 
          className={`${buttonClass} text-lg px-8 py-3 font-bold ${isButtonSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20'}`} 
          contentEditable 
          suppressContentEditableWarning 
          onBlur={(e) => onTextEdit('ctaText', e.currentTarget.textContent || '')}
          onClick={(e) => handleElementClick(e, buttonId)}
        >
          {content.ctaText}
        </button>
      </div>
      {content.imageUrl && (
        <div 
          className={`relative group/img cursor-pointer w-full ${isImageSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20'}`} 
          onClick={(e) => {
            e.stopPropagation();
            handleElementClick(e, imageId);
            onImageClick();
          }}
        >
          <img src={content.imageUrl} alt="Hero" className="rounded-2xl shadow-2xl w-full object-cover" />
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
              <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">Change Image</span>
          </div>
        </div>
      )}
    </div>
  );
};
