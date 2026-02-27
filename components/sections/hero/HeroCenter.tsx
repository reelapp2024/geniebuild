
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

export const HeroCenter: React.FC<HeroProps> = ({ 
  section, 
  onTextEdit, 
  onImageClick, 
  buttonClass, 
  onElementSelect, 
  onElementUpdate, 
  selectedElementId, 
  readOnly = false 
}) => {
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
  
  // Theme colors for ElementsSection
  const themeColors = {
    titleColor: styles.titleColor,
    textColor: styles.textColor,
    accentColor: styles.accentColor,
    buttonBackgroundColor: styles.buttonBackgroundColor,
    buttonTextColor: styles.buttonTextColor,
    backgroundColor: styles.backgroundColor,
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
        textAlign: (styleAny.titleAlign || styles.textAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
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
        textAlign: (styleAny.subtitleAlign || styles.textAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
        fontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || undefined,
      }
    };
  };
  
  const getButtonElement = (): WebsiteElement => {
    if (buttonElement) return buttonElement;
    
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
        textAlign: 'center' as 'left' | 'center' | 'right' | 'justify',
      }
    };
  };
  
  // Handle element click for image
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onElementSelect) {
      onElementSelect(imageId);
    }
    onImageClick();
  };
  
  const isImageSelected = selectedElementId === imageId;

  return (
    <div className={`${styles.maxWidth || 'max-w-5xl'} mx-auto px-6 text-center relative z-10`}>
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
      <div className="mb-10 mx-auto max-w-2xl opacity-80">
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
      
      {/* Render Button using ElementsSection - unwrapped for custom layout */}
      <div className="mb-10">
        <ElementsSection
          section={{
            ...section,
            elements: [getButtonElement()]
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
      
      {/* Image - keep as is since it's not a standard element type */}
      {content.imageUrl && (
        <div 
          className={`relative group/img cursor-pointer w-full mt-8 max-w-4xl mx-auto ${isImageSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20'}`} 
          onClick={handleImageClick}
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
