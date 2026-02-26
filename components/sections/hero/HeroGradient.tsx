// components/sections/hero/HeroGradient.tsx
import React from 'react';
import { Section } from '../../../types';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
}

export const HeroGradient: React.FC<HeroProps> = ({ section, onTextEdit, buttonClass, onElementSelect, selectedElementId, readOnly = false }) => {
  const { content, styles } = section;
  
  const isCustomColor = (value?: string) => value && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'));

  // Get heading tag from styles, default to h1 for hero
  const headingTag = (styles.titleHeadingTag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // Get alignment and font weight from styles
  const styleAny = styles as any;
  const titleAlign = styleAny.titleAlign || styles.textAlign || 'center';
  const titleFontWeight = styleAny.titleFontWeight || styleAny.fontWeight || 'bold';
  const titleAlignClass = titleAlign === 'left' ? 'text-left' : titleAlign === 'right' ? 'text-right' : titleAlign === 'justify' ? 'text-justify' : 'text-center';
  const titleFontWeightClass = titleFontWeight === '300' ? 'font-light' : titleFontWeight === '400' ? 'font-normal' : titleFontWeight === '700' ? 'font-bold' : titleFontWeight === '900' ? 'font-black' : 'font-black';
  
  // Only apply custom fontSize if titleSize is set and doesn't match default (custom override)
  const hasCustomTitleSize = styles.titleSize && (styles.titleSize.includes('px') || styles.titleSize.includes('rem') || styles.titleSize.includes('em'));
  
  // Get fontFamily from titleFontFamily or fontFamily, only if explicitly set
  const titleFontFamily = (styleAny.titleFontFamily || styleAny.fontFamily);
  const titleStyle: React.CSSProperties = {
    ...(isCustomColor(styles.titleColor) ? { color: styles.titleColor } : {}),
    // Only apply fontSize if it's a custom override, otherwise CSS defaults apply
    ...(hasCustomTitleSize ? { fontSize: styles.titleSize } : {}),
    ...(titleAlign && !titleAlignClass.includes(titleAlign) ? { textAlign: titleAlign as any } : {})
  };
  // Only add fontFamily if it's explicitly set (not undefined, null, or empty string)
  if (titleFontFamily && titleFontFamily.trim() !== '') {
    titleStyle.fontFamily = titleFontFamily;
  }
  const titleClass = `${titleFontWeightClass} mb-6 leading-tight ${titleAlignClass} ${!isCustomColor(styles.titleColor) ? styles.titleColor || '' : ''}`;

  // Subtitle alignment and font weight - CSS handles font size via p tag defaults
  const subtitleAlign = styleAny.subtitleAlign || styles.textAlign || 'center';
  const subtitleFontWeight = styleAny.subtitleFontWeight || styleAny.fontWeight || '400';
  const subtitleAlignClass = subtitleAlign === 'left' ? 'text-left' : subtitleAlign === 'right' ? 'text-right' : subtitleAlign === 'justify' ? 'text-justify' : 'text-center';
  const subtitleFontWeightClass = subtitleFontWeight === '300' ? 'font-light' : subtitleFontWeight === '400' ? 'font-normal' : subtitleFontWeight === '700' ? 'font-bold' : subtitleFontWeight === '900' ? 'font-black' : 'font-normal';
  
  // Only apply custom fontSize if subtitleSize is set and is a custom override (px/rem/em)
  // Otherwise, CSS will handle it via p tag defaults or text size classes
  const hasCustomSubtitleSize = styles.subtitleSize && (styles.subtitleSize.includes('px') || styles.subtitleSize.includes('rem') || styles.subtitleSize.includes('em'));
  
  // Get fontFamily from subtitleFontFamily or fontFamily, only if explicitly set
  const subtitleFontFamily = (styleAny.subtitleFontFamily || styleAny.fontFamily);
  const subtitleStyle: React.CSSProperties = {
    color: styles.subtitleColor || styles.textColor,
    ...(hasCustomSubtitleSize ? { fontSize: styles.subtitleSize } : {}),
    ...(subtitleAlign && !subtitleAlignClass.includes(subtitleAlign) ? { textAlign: subtitleAlign as any } : {})
  };
  // Only add fontFamily if it's explicitly set (not undefined, null, or empty string)
  if (subtitleFontFamily && subtitleFontFamily.trim() !== '') {
    subtitleStyle.fontFamily = subtitleFontFamily;
  }

  // Element IDs - unique per section instance
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;

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

  // Get background styles from section
  const getBackgroundStyle = (): React.CSSProperties => {
    const bgStyle: React.CSSProperties = {};
    
    if (styles.background) {
      if (styles.background.type === 'color') {
        bgStyle.backgroundColor = styles.background.color || '#000000';
      } else if (styles.background.type === 'gradient') {
        const gradient = styles.background.gradient;
        if (gradient) {
          const stops = gradient.stops.map((stop: any) => `${stop.color} ${stop.position}%`).join(', ');
          if (gradient.type === 'linear') {
            bgStyle.backgroundImage = `linear-gradient(${gradient.direction || 90}deg, ${stops})`;
          } else {
            bgStyle.backgroundImage = `radial-gradient(circle, ${stops})`;
          }
        }
      } else if (styles.background.type === 'image' && styles.background.image?.url) {
        bgStyle.backgroundImage = `url(${styles.background.image.url})`;
        bgStyle.backgroundPosition = styles.background.image.position || 'center';
        bgStyle.backgroundSize = styles.background.image.size || 'cover';
        bgStyle.backgroundRepeat = styles.background.image.repeat || 'no-repeat';
        bgStyle.backgroundAttachment = styles.background.image.attachment || 'scroll';
      }
    } else {
      // Fallback to default gradient if no background is set
      bgStyle.backgroundImage = 'linear-gradient(135deg, #1e3a8a 0%, #000000 100%)';
    }
    
    return bgStyle;
  };

  const backgroundStyle = getBackgroundStyle();
  const hasImageOverlay = styles.background?.type === 'image' && styles.background.image?.overlay?.enabled;
  const overlayStyle = hasImageOverlay && styles.background.image?.overlay ? {
    backgroundColor: styles.background.image.overlay.color || '#000000',
    opacity: styles.background.image.overlay.opacity || 0.5,
    mixBlendMode: styles.background.image.overlay.blendMode || 'normal'
  } : {};

  return (
    <div className="relative py-24 px-6 overflow-hidden text-center" style={backgroundStyle}>
      {hasImageOverlay && (
        <div className="absolute inset-0 z-0" style={overlayStyle}></div>
      )}
      <div className="max-w-4xl mx-auto relative z-10">
        {React.createElement(
          headingTag,
          {
            key: `hero-title-${headingTag}-${section.id}`, // Force re-render when tag changes
            className: `${titleClass} ${!readOnly ? 'outline-none focus:ring-2 ring-white rounded px-2' : ''} ${!readOnly && isTitleSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : !readOnly ? 'hover:ring-1 hover:ring-white/20' : ''}`,
            style: titleStyle,
            contentEditable: !readOnly,
            suppressContentEditableWarning: !readOnly,
            onBlur: !readOnly ? (e: any) => onTextEdit('title', e.currentTarget.textContent || '') : undefined,
            onClick: !readOnly ? (e: React.MouseEvent) => handleElementClick(e, titleId) : undefined
          },
          content.title
        )}
        <p 
          className={`${subtitleFontWeightClass} ${subtitleAlignClass} opacity-80 mb-10 ${!readOnly ? 'outline-none focus:ring-2 ring-white rounded px-2' : ''} min-h-[1.5em] ${!readOnly && isSubtitleSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : !readOnly ? 'hover:ring-1 hover:ring-white/20' : ''}`} 
          style={subtitleStyle}
          contentEditable={!readOnly}
          suppressContentEditableWarning={!readOnly}
          onBlur={!readOnly ? (e) => onTextEdit('subtitle', e.currentTarget.textContent || '') : undefined}
          onClick={!readOnly ? (e) => handleElementClick(e, subtitleId) : undefined}
        >
          {content.subtitle}
        </p>
        <div className={`flex flex-wrap justify-center gap-4 mb-10`}>
          {content.ctaHref ? (
            <a
              href={content.ctaHref}
              target={content.ctaHref.startsWith('http') ? '_blank' : '_self'}
              rel={content.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={!readOnly ? (e) => {
                e.preventDefault();
                handleElementClick(e, buttonId);
              } : undefined}
              className="inline-block"
            >
              <button 
                className={`${buttonClass} text-lg px-8 py-3 font-bold ${!readOnly && isButtonSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : !readOnly ? 'hover:ring-1 hover:ring-white/20' : ''}`} 
                contentEditable={!readOnly}
                suppressContentEditableWarning={!readOnly}
                onBlur={!readOnly ? (e) => onTextEdit('ctaText', e.currentTarget.textContent || '') : undefined}
              >
                {content.ctaText}
              </button>
            </a>
          ) : (
            <button 
              className={`${buttonClass} text-lg px-8 py-3 font-bold ${!readOnly && isButtonSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : !readOnly ? 'hover:ring-1 hover:ring-white/20' : ''}`} 
              contentEditable={!readOnly}
              suppressContentEditableWarning={!readOnly}
              onBlur={!readOnly ? (e) => onTextEdit('ctaText', e.currentTarget.textContent || '') : undefined}
              onClick={!readOnly ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleElementClick(e, buttonId);
              } : undefined}
            >
              {content.ctaText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};