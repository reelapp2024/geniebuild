import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
  themeColors?: {
    titleFontFamily?: string;
    subtitleFontFamily?: string;
    descriptionFontFamily?: string;
    buttonFontFamily?: string;
  };
}

export const HeroOverlay: React.FC<HeroProps> = ({ 
  section, 
  onTextEdit, 
  onImageClick, 
  buttonClass, 
  onElementSelect, 
  onElementUpdate, 
  selectedElementId, 
  readOnly = false,
  themeColors: fontThemeColors
}) => {
  const { content, styles } = section;
  const { themeData } = useTheme();
  
  // Element IDs
  const badgeId = `${section.id}-hero-badge`;
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;
  const imageId = `${section.id}-hero-image`;

  // Get elements
  const badgeElement = section.elements?.find(e => e.id === badgeId);
  const titleElement = section.elements?.find(e => e.id === titleId);
  const subtitleElement = section.elements?.find(e => e.id === subtitleId);
  const buttonElement = section.elements?.find(e => e.id === buttonId);
  const imageElement = section.elements?.find(e => e.id === imageId);
  
  const styleAny = styles as any;
  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || '#FFFFFF',
    textColor: styles.textColor || '#FFFFFF',
    subtitleColor: styles.subtitleColor || styles.textColor || '#FFFFFF',
    buttonFontWeight: styleAny.buttonFontWeight || styleAny.fontWeight,
    buttonFontSize: styleAny.buttonSize || styleAny.buttonFontSize || styleAny.fontSize,
    buttonAlign: styleAny.buttonAlign || styles.textAlign || 'center',
    buttonFontFamily: styleAny.buttonFontFamily || styleAny.fontFamily || fontThemeColors?.buttonFontFamily,
    titleFontWeight: styleAny.titleFontWeight || styleAny.fontWeight,
    titleFontSize: styleAny.titleSize || styleAny.fontSize,
    titleAlign: styleAny.titleAlign || styles.textAlign || 'center',
    titleFontFamily: styleAny.titleFontFamily || styleAny.fontFamily || fontThemeColors?.titleFontFamily,
    subtitleFontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight,
    subtitleFontSize: styleAny.subtitleSize || styleAny.fontSize,
    subtitleAlign: styleAny.subtitleAlign || styles.textAlign || 'center',
    subtitleFontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || fontThemeColors?.subtitleFontFamily,
    descriptionFontFamily:
      styleAny.descriptionFontFamily || styleAny.fontFamily || fontThemeColors?.descriptionFontFamily,
    fontWeight: styleAny.fontWeight,
    fontSize: styleAny.fontSize,
    textAlign: styles.textAlign || 'center',
    fontFamily: styleAny.fontFamily,
  };
  
  const getBadgeElement = (): WebsiteElement => {
    if (badgeElement) return badgeElement;
    return {
      id: badgeId,
      type: 'badge',
      content: { text: content.badgeText || 'Your mental health is' },
      style: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        fontSize: '1.25rem',
        fontWeight: 'normal',
        textTransform: 'none',
        letterSpacing: 'normal',
        padding: '0'
      }
    };
  };

  const getTitleElement = (): WebsiteElement => {
    if (titleElement) return titleElement;
    return {
      id: titleId,
      type: 'heading',
      content: {
        text: content.title || 'our priority',
        htmlTag: (styles.titleHeadingTag || 'h1') as any
      },
      style: {
        color: styles.titleColor || '#FFFFFF',
        fontSize: styles.titleSize || '4rem',
        textTransform: 'uppercase'
      }
    };
  };
  
  const getSubtitleElement = (): WebsiteElement => {
    if (subtitleElement) return subtitleElement;
    return {
      id: subtitleId,
      type: 'text',
      content: {
        text: content.subtitle || 'Work with you in a honest, respectful and caring way to assist you to meet your goals and resolve difficulties.',
        textSize: 'base' as any
      },
      style: {
        color: styles.subtitleColor || '#FFFFFF'
      }
    };
  };
  
  const getButtonElement = (): WebsiteElement => {
    if (buttonElement) return buttonElement;
    return {
      id: buttonId,
      type: 'button',
      content: {
        text: content.ctaText || 'GET STARTED',
        link: content.ctaHref || ''
      },
      style: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '9999px',
        padding: '12px 32px'
      }
    };
  };
  
  return (
    <div className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Content Container */}
      <div className={`relative z-10 ${styles.maxWidth || 'max-w-4xl'} mx-auto px-8 md:px-12 text-center flex flex-col items-center`}>
        
        {/* Badge / Top Text */}
        <div className="mb-6">
          <ElementsSection
            section={{ ...section, elements: [getBadgeElement()] }}
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

        {/* Title */}
        <div className="mb-6">
          <ElementsSection
            section={{ ...section, elements: [getTitleElement()] }}
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
        
        {/* Subtitle / Paragraph */}
        <div className="mb-10 mx-auto max-w-2xl">
          <ElementsSection
            section={{ ...section, elements: [getSubtitleElement()] }}
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
        
        {/* Button */}
        <div className="w-full">
          <ElementsSection 
            isWrapped={false}
            section={{ ...section, elements: [getButtonElement()] }}
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
