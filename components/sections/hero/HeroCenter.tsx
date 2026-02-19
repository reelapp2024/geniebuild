
import React from 'react';
import { Section } from '../../../types';
import { getHeadingSizeClass } from '../../../utils/headingSizeUtils';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  selectedElementId?: string | null;
}

export const HeroCenter: React.FC<HeroProps> = ({ section, onTextEdit, onImageClick, buttonClass, onElementSelect, selectedElementId }) => {
  const { content, styles } = section;
  
  const isTailwindClass = (val?: string) => val && val.startsWith('text-') && !val.includes('px') && !val.includes('rem');
  const isCustomColor = (value?: string) => value && (value.startsWith('#') || value.startsWith('rgb'));

  // Get heading tag from styles, default to h1 for hero
  const headingTag = (styles.titleHeadingTag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // Default to responsive class if specific size not provided or not responsive
  const baseTitleSize = styles.titleSize || 'text-4xl md:text-6xl';
  const titleSize = getHeadingSizeClass(headingTag, baseTitleSize);
  const titleIsClass = isTailwindClass(titleSize);
  
  // Get alignment and font weight from styles
  const styleAny = styles as any;
  const titleAlign = styleAny.titleAlign || styles.textAlign || 'center';
  const titleFontWeight = styleAny.titleFontWeight || styleAny.fontWeight || 'bold';
  const titleAlignClass = titleAlign === 'left' ? 'text-left' : titleAlign === 'right' ? 'text-right' : titleAlign === 'justify' ? 'text-justify' : 'text-center';
  const titleFontWeightClass = titleFontWeight === '300' ? 'font-light' : titleFontWeight === '400' ? 'font-normal' : titleFontWeight === '700' ? 'font-bold' : titleFontWeight === '900' ? 'font-black' : 'font-bold';
  
  const titleStyle = {
    ...(isCustomColor(styles.titleColor) ? { color: styles.titleColor } : {}),
    ...(!titleIsClass ? { fontSize: titleSize } : {}),
    ...(titleAlign && !titleAlignClass.includes(titleAlign) ? { textAlign: titleAlign as any } : {})
  };
  const titleClass = `${titleIsClass ? titleSize : ''} ${titleFontWeightClass} mb-6 leading-tight ${titleAlignClass} ${!isCustomColor(styles.titleColor) ? styles.titleColor || '' : ''}`;

  // Subtitle alignment and font weight
  const subtitleSize = styles.subtitleSize || styleAny.fontSize || 'text-lg md:text-xl';
  const subtitleAlign = styleAny.subtitleAlign || styles.textAlign || 'center';
  const subtitleFontWeight = styleAny.subtitleFontWeight || styleAny.fontWeight || '400';
  const subtitleAlignClass = subtitleAlign === 'left' ? 'text-left' : subtitleAlign === 'right' ? 'text-right' : subtitleAlign === 'justify' ? 'text-justify' : 'text-center';
  const subtitleFontWeightClass = subtitleFontWeight === '300' ? 'font-light' : subtitleFontWeight === '400' ? 'font-normal' : subtitleFontWeight === '700' ? 'font-bold' : subtitleFontWeight === '900' ? 'font-black' : 'font-normal';
  const subtitleStyle = {
    color: styles.subtitleColor || styles.textColor,
    ...(subtitleAlign && !subtitleAlignClass.includes(subtitleAlign) ? { textAlign: subtitleAlign as any } : {})
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
    <div className={`${styles.maxWidth || 'max-w-5xl'} mx-auto px-6 text-center relative z-10`}>
      {React.createElement(
        headingTag,
        {
          key: `hero-title-${headingTag}-${section.id}`, // Force re-render when tag changes
          className: `${titleClass} outline-none focus:ring-2 ring-white rounded px-2 ${isTitleSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20'}`,
          style: titleStyle,
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: (e: any) => onTextEdit('title', e.currentTarget.textContent || ''),
          onClick: (e: React.MouseEvent) => handleElementClick(e, titleId)
        },
        content.title
      )}
      <p 
        className={`${subtitleSize} ${subtitleFontWeightClass} ${subtitleAlignClass} opacity-80 mb-10 mx-auto max-w-2xl outline-none focus:ring-2 ring-white rounded px-2 min-h-[1.5em] ${isSubtitleSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20'}`} 
        style={subtitleStyle}
        contentEditable 
        suppressContentEditableWarning 
        onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}
        onClick={(e) => handleElementClick(e, subtitleId)}
      >
        {content.subtitle}
      </p>
      <div className={`flex flex-wrap justify-center gap-4 mb-10`}>
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
          className={`relative group/img cursor-pointer w-full mt-8 max-w-4xl mx-auto ${isImageSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20'}`} 
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
