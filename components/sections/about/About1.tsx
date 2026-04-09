import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';

interface AboutProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick?: () => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
  themeColors?: any;
}

export const About1: React.FC<AboutProps> = ({ 
  section, 
  onTextEdit, 
  buttonClass, 
  onElementSelect, 
  onElementUpdate, 
  selectedElementId, 
  readOnly = false,
  themeColors: passedThemeColors
}) => {
  const content = section.content || {};
  const styles = section.styles || {};
  const isDark = styles.themeMode === 'dark';
  
  // 1. Strict Native Defaults (Perfect localhost:3000 look)
  const nativeBg = isDark ? '#0E1214' : '#FFFFFF';
  const nativeTitle = isDark ? '#F8FAFC' : '#111827';
  const nativeText = isDark ? '#C7CDD6' : '#4B5563';
  const nativeCardBg = isDark ? '#151515' : '#F9FAFB';
  const nativeCardBorder = isDark ? '#333333' : '#E5E7EB';

  // 2. Fetch User Customizations (Strictly isolated from passedThemeColors bleed)
  let finalBg = styles.backgroundColor || nativeBg;
  let finalTitle = styles.titleColor || nativeTitle;
  let finalText = styles.textColor || nativeText;
  let finalCardBg = styles.cardBackgroundColor || nativeCardBg;
  let finalCardBorder = styles.cardBorderColor || nativeCardBorder;

  // 3. Contrast Auto-Healer (Fixes corrupted DB bleed)
  const upperBg = finalBg.toUpperCase();
  const isBgLight = upperBg === '#FFFFFF' || upperBg === '#FFF' || upperBg.startsWith('RGB(255');
  if (isBgLight) {
      if (finalTitle.toUpperCase() === '#FFFFFF' || finalTitle.toUpperCase() === '#F8FAFC') finalTitle = '#111827';
      if (finalText.toUpperCase() === '#FFFFFF' || finalText.toUpperCase() === '#C7CDD6') finalText = '#4B5563';
  }

  const themeColors = {
      ...styles,
      backgroundColor: finalBg,
      titleColor: finalTitle,
      textColor: finalText,
      subtitleColor: styles.subtitleColor || passedThemeColors?.subtitleColor || '#3b82f6',
      accentColor: styles.accentColor || passedThemeColors?.accentColor || '#3b82f6',
      cardBackgroundColor: finalCardBg,
      cardBorderColor: finalCardBorder,
      buttonBackgroundColor: styles.buttonBackgroundColor || passedThemeColors?.buttonBackgroundColor,
      buttonTextColor: styles.buttonTextColor || passedThemeColors?.buttonTextColor
  };
  
  const titleId = `${section.id}-about-title`;
  const subtitleId = `${section.id}-about-subtitle`;
  const textId = `${section.id}-about-description`;
  const imageId = `${section.id}-about-image`;

  const getButtonElement = (): WebsiteElement => {
    if (section.elements?.find(e => e.id === `${section.id}-about-btn`)) return section.elements.find(e => e.id === `${section.id}-about-btn`)!;
    return {
      id: `${section.id}-about-btn`,
      type: 'button',
      content: { text: 'Learn More', link: '#' },
      style: { borderRadius: '0.5rem', padding: '0.75rem 2rem', borderStyle: 'solid' }
    };
  };

  const titleElement = section.elements?.find(e => e.id === titleId);
  const subtitleElement = section.elements?.find(e => e.id === subtitleId);
  const textElement = section.elements?.find(e => e.id === textId);
  const imageElement = section.elements?.find(e => e.id === imageId);
  const buttonElement = getButtonElement();
  
  const getTitleElement = (): WebsiteElement => {
    let titleText = titleElement?.content?.text || content.title || 'About Our Mission';
    let textBefore = titleElement?.content?.textBefore || '';
    let highlightedText = titleElement?.content?.highlightedText || titleElement?.content?.secondaryText || '';
    let textAfter = titleElement?.content?.textAfter || '';
    
    // If no multi-part fields exist and no manual span exists, try to extract the last word
    if (!highlightedText && !textBefore && !textAfter && !titleText.includes('<span')) {
      const words = titleText.trim().split(' ');
      if (words.length > 1) {
        highlightedText = words.pop() || '';
        textBefore = words.join(' ');
      }
    }

    return {
      ...(titleElement || { id: titleId, type: 'heading', content: { text: titleText, textBefore, highlightedText, textAfter, htmlTag: 'h2' } }),
      content: { 
        ...(titleElement?.content || { htmlTag: 'h2' }), 
        text: titleText,
        textBefore,
        highlightedText,
        textAfter
      },
      style: { 
        ...(titleElement?.style || {}),
        color: titleElement?.style?.color || themeColors.titleColor, 
        fontSize: titleElement?.style?.fontSize || styles.titleSize || '2.25rem', 
        fontWeight: titleElement?.style?.fontWeight || 'bold' 
      }
    };
  };
  
  const getSubtitleElement = (): WebsiteElement => {
    return {
      ...(subtitleElement || { id: subtitleId, type: 'text', content: { text: content.subtitle || 'Our Story', textSize: 'base' } }),
      style: { 
        ...(subtitleElement?.style || {}),
        color: subtitleElement?.style?.color || themeColors.subtitleColor, 
        fontWeight: subtitleElement?.style?.fontWeight || '600', 
        textTransform: subtitleElement?.style?.textTransform || 'uppercase', 
        letterSpacing: subtitleElement?.style?.letterSpacing || '0.1em' 
      }
    };
  };

  const getTextElement = (): WebsiteElement => {
    return {
      ...(textElement || { id: textId, type: 'text', content: { text: content.description || 'We are a team of passionate developers and designers dedicated to building the best web experiences.', textSize: 'base' } }),
      style: { 
        ...(textElement?.style || {}),
        color: textElement?.style?.color || themeColors.textColor, 
        lineHeight: textElement?.style?.lineHeight || '1.6' 
      }
    };
  };
  
  const getImageElement = (): WebsiteElement => {
    if (imageElement) return imageElement;
    return {
      id: imageId,
      type: 'image',
      content: { imageUrl: content.imageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', imageAlt: 'About Us' },
      style: { borderRadius: '1rem' }
    };
  };
  
  const paddingTop = styles.paddingTop || 'py-20';
  const paddingBottom = styles.paddingBottom || 'py-20';
  const paddingX = styles.paddingX || 'px-6';

  return (
    <div className="w-full" style={{ backgroundColor: themeColors.backgroundColor }}>
      <div className={`max-w-7xl mx-auto ${paddingX} ${paddingTop} ${paddingBottom}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className={styles.textAlign === 'right' ? 'order-2' : ''}>
          <div className="mb-2">
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
          <div className="opacity-80 mb-8">
            <ElementsSection
              section={{ ...section, elements: [getTextElement()] }}
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
          <div>
            <ElementsSection
              section={{ ...section, elements: [buttonElement] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              buttonClass={buttonClass}
              readOnly={readOnly}
              isWrapped={false}
              themeColors={{
                ...themeColors,
                buttonBackgroundColor: styles.buttonBackgroundColor || passedThemeColors?.buttonBackgroundColor,
                buttonTextColor: styles.buttonTextColor || passedThemeColors?.buttonTextColor
              }}
            />
          </div>
        </div>
        
        <div className={styles.textAlign === 'right' ? 'order-1' : ''}>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: styles.borderColor || (styles.themeMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)') }}>
            <ElementsSection 
              isWrapped={false}
              section={{ ...section, elements: [getImageElement()] }}
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
    </div>
  </div>
);
};
