
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

export const HeroSplitRight: React.FC<HeroProps> = ({ section, onTextEdit, onImageClick, buttonClass, onElementSelect, onElementUpdate, selectedElementId, readOnly = false }) => {
  const { content, styles } = section;
  
  // Element IDs - must match what App.tsx expects
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;
  const imageId = `${section.id}-hero-image`;

  // Get elements from section.elements (they exist after first edit)
  const titleElement = section.elements?.find(e => e.id === titleId);
  const subtitleElement = section.elements?.find(e => e.id === subtitleId);
  const buttonElement = section.elements?.find(e => e.id === buttonId);
  const imageElement = section.elements?.find(e => e.id === imageId);
  
  // Theme colors for ElementsSection - pass complete section.styles for unified styling
  // This ensures all global styles are available as fallbacks
  const styleAny = styles as any;
  const themeColors = {
    ...styles, // Include all section.styles properties
    // Explicitly map button style properties for clarity
    buttonFontWeight: styleAny.buttonFontWeight || styleAny.fontWeight,
    buttonFontSize: styleAny.buttonSize || styleAny.buttonFontSize || styleAny.fontSize,
    buttonAlign: styleAny.buttonAlign || styles.textAlign,
    buttonFontFamily: styleAny.buttonFontFamily || styleAny.fontFamily,
    // Map heading style properties
    titleFontWeight: styleAny.titleFontWeight || styleAny.fontWeight,
    titleFontSize: styleAny.titleSize || styleAny.fontSize,
    titleAlign: styleAny.titleAlign || styles.textAlign,
    titleFontFamily: styleAny.titleFontFamily || styleAny.fontFamily,
    // Map text/subtitle style properties
    subtitleFontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight,
    subtitleFontSize: styleAny.subtitleSize || styleAny.fontSize,
    subtitleAlign: styleAny.subtitleAlign || styles.textAlign,
    subtitleFontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily,
    // Global fallback properties
    fontWeight: styleAny.fontWeight,
    fontSize: styleAny.fontSize,
    textAlign: styles.textAlign,
    fontFamily: styleAny.fontFamily,
  };
  
  // Helper to create fallback element if it doesn't exist (matches App.tsx virtual element pattern)
  const getTitleElement = (): WebsiteElement => {
    if (titleElement) return titleElement;
    
    const styleAny = styles as any;
    return {
      id: titleId,
      type: 'heading',
      content: {
        text: content.title || '',
        htmlTag: (styles.titleHeadingTag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      },
      style: {
        color: styles.titleColor || '',
        fontSize: styles.titleSize || '',
        fontWeight: styleAny.titleFontWeight || styleAny.fontWeight || 'bold',
        textAlign: (styleAny.titleAlign || styles.textAlign || 'left') as 'left' | 'center' | 'right' | 'justify',
        fontFamily: styleAny.titleFontFamily || styleAny.fontFamily || undefined,
      }
    };
  };
  
  const getSubtitleElement = (): WebsiteElement => {
    if (subtitleElement) return subtitleElement;
    
    const styleAny = styles as any;
    return {
      id: subtitleId,
      type: 'text',
      content: {
        text: content.subtitle || '',
        textSize: 'base' as 'base' | 'small' | 'large' | 'xl'
      },
      style: {
        color: styles.subtitleColor || styles.textColor || '',
        fontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight || '400',
        textAlign: (styleAny.subtitleAlign || styles.textAlign || 'left') as 'left' | 'center' | 'right' | 'justify',
        fontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || undefined,
      }
    };
  };
  
  const getButtonElement = (): WebsiteElement => {
    if (buttonElement) return buttonElement;
    
    const styleAny = styles as any;
    return {
      id: buttonId,
      type: 'button',
      content: {
        text: content.ctaText || '',
        link: content.ctaHref || ''
      },
      style: {
        backgroundColor: styles.buttonBackgroundColor || '',
        color: styles.buttonTextColor || '',
        textAlign: 'left' as 'left' | 'center' | 'right' | 'justify',
        fontWeight: styleAny.buttonFontWeight || styleAny.fontWeight || 'bold',
        fontSize: styleAny.buttonSize || styleAny.buttonFontSize || styleAny.fontSize || '1rem',
        padding: styleAny.buttonPadding || styleAny.padding || '',
        borderRadius: styleAny.buttonBorderRadius || styleAny.borderRadius || '',
        fontFamily: styleAny.buttonFontFamily || styleAny.fontFamily || undefined,
      }
    };
  };
  
  const getImageElement = (): WebsiteElement => {
    // If real element exists, use it (all styles come from element.style)
    if (imageElement) return imageElement;
    
    // Bare minimum fallback - only default structure, no section.styles mapping
    return {
      id: imageId,
      type: 'image',
      content: {
        imageUrl: content.imageUrl || '',
        imageAlt: 'Hero'
      },
      style: {
        width: '100%',
        objectFit: 'cover',
      }
    };
  };

  return (
    <div className={`${styles.maxWidth || 'max-w-7xl'} mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left`}>
      <div>
        {/* Render Title using ElementsSection - unwrapped for custom layout */}
        <div className="mb-6">
          <ElementsSection
            section={{
              ...section,
              elements: [getTitleElement()]
            }}
            onTextEdit={onTextEdit}
            onElementUpdate={onElementUpdate || (() => {})}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            buttonClass={buttonClass}
            readOnly={readOnly}
            isWrapped={false}
            themeColors={themeColors}
          />
        </div>
        
        {/* Render Subtitle using ElementsSection - unwrapped for custom layout */}
        <div className="mb-8 opacity-80">
          <ElementsSection
            section={{
              ...section,
              elements: [getSubtitleElement()]
            }}
            onTextEdit={onTextEdit}
            onElementUpdate={onElementUpdate || (() => {})}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            buttonClass={buttonClass}
            readOnly={readOnly}
            isWrapped={false}
            themeColors={themeColors}
          />
        </div>
        
        {/* Render Button using headless ElementsSection */}
        <div className="w-full mb-8">
          <ElementsSection 
            isWrapped={false}
            section={{
              ...section,
              elements: [getButtonElement()]
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
      {/* Render Image using headless ElementsSection */}
      {content.imageUrl && (
        <div className="w-full">
          <ElementsSection 
            isWrapped={false}
            section={{
              ...section,
              elements: [getImageElement()]
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
      )}
    </div>
  );
};
