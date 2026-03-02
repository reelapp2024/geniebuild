
import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
}

export const HeroSplitLeft: React.FC<HeroProps> = ({ section, onTextEdit, onImageClick, buttonClass, onElementSelect, onElementUpdate, selectedElementId, readOnly = false }) => {
  const { content, styles } = section;
  
  const isCustomColor = (value?: string) => value && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'));
  
  // Element IDs - unique per section instance
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;
  const imageId = `${section.id}-hero-image`;
  
  // Get button element from section.elements
  const buttonElement = section.elements?.find(e => e.id === buttonId);
  
  // Theme colors for ElementsSection - pass complete section.styles for unified styling
  const styleAny = styles as any;
  const themeColors = {
    ...styles, // Include all section.styles properties
    // Explicitly map button style properties for clarity
    buttonFontWeight: styleAny.buttonFontWeight || styleAny.fontWeight,
    buttonFontSize: styleAny.buttonSize || styleAny.buttonFontSize || styleAny.fontSize,
    buttonAlign: styleAny.buttonAlign || styles.textAlign,
    buttonFontFamily: styleAny.buttonFontFamily || styleAny.fontFamily,
  };
  
  // Get heading tag from styles, default to h1 for hero
  const headingTag = (styles.titleHeadingTag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // Get alignment and font weight from styles
  const titleAlign = styleAny.titleAlign || styles.textAlign || 'left';
  const titleFontWeight = styleAny.titleFontWeight || styleAny.fontWeight || 'bold';
  const titleAlignClass = titleAlign === 'left' ? 'text-left' : titleAlign === 'right' ? 'text-right' : titleAlign === 'justify' ? 'text-justify' : 'text-center';
  const titleFontWeightClass = titleFontWeight === '300' ? 'font-light' : titleFontWeight === '400' ? 'font-normal' : titleFontWeight === '700' ? 'font-bold' : titleFontWeight === '900' ? 'font-black' : 'font-bold';
  
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
  const titleClass = `${titleFontWeightClass} mb-6 leading-tight ${titleAlignClass}`;

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
      <div className="order-2 md:order-1">
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
            </div>
        )}
      </div>
      <div className="order-1 md:order-2">
        {(() => {
          return React.createElement(
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
          );
        })()}
        {(() => {
          const subtitleAlign = styleAny.subtitleAlign || styles.textAlign || 'left';
          const subtitleFontWeight = styleAny.subtitleFontWeight || styleAny.fontWeight || '400';
          const subtitleAlignClass = subtitleAlign === 'left' ? 'text-left' : subtitleAlign === 'right' ? 'text-right' : subtitleAlign === 'justify' ? 'text-justify' : 'text-center';
          const subtitleFontWeightClass = subtitleFontWeight === '300' ? 'font-light' : subtitleFontWeight === '400' ? 'font-normal' : subtitleFontWeight === '700' ? 'font-bold' : subtitleFontWeight === '900' ? 'font-black' : 'font-normal';
          
          // Check if custom fontSize is provided for subtitle (px/rem/em) - if not, CSS defaults apply
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
          
          return (
            <p 
              className={`${subtitleFontWeightClass} ${subtitleAlignClass} opacity-80 mb-8 ${!readOnly ? 'outline-none focus:ring-2 ring-white rounded px-2' : ''} ${!readOnly && isSubtitleSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : !readOnly ? 'hover:ring-1 hover:ring-white/20' : ''}`} 
              style={subtitleStyle}
              contentEditable={!readOnly}
              suppressContentEditableWarning={!readOnly}
              onBlur={!readOnly ? (e) => onTextEdit('subtitle', e.currentTarget.textContent || '') : undefined}
              onClick={!readOnly ? (e) => handleElementClick(e, subtitleId) : undefined}
            >
                {content.subtitle}
            </p>
          );
        })()}
        {/* Render Button using headless ElementsSection */}
        <div className="w-full mb-8">
          <ElementsSection 
            isWrapped={false}
            section={{
              ...section,
              elements: [buttonElement || {
                id: buttonId,
                type: 'button',
                content: { text: content.ctaText || 'Click Here', link: content.ctaHref || '' },
                style: {
                  backgroundColor: styles.buttonBackgroundColor,
                  color: styles.buttonTextColor,
                  textAlign: (styles as any).buttonAlign || styles.textAlign || 'left',
                  fontWeight: (styles as any).buttonFontWeight || (styles as any).fontWeight || 'bold',
                  fontSize: (styles as any).buttonFontSize || '1.125rem'
                }
              }]
            }}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            onElementUpdate={onElementUpdate || (() => {})}
            onTextEdit={onTextEdit}
            buttonClass={buttonClass}
            readOnly={readOnly}
            themeColors={themeColors}
          />
        </div>
      </div>
    </div>
  );
};
