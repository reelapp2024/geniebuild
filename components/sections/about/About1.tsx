import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';

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
  const { themeData } = useTheme();
  
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
  
  const styleAny = styles as any;
  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || passedThemeColors?.titleColor || themeData?.heading || (styles.themeMode === 'dark' ? '#F8FAFC' : '#111827'),
    textColor: styles.textColor || passedThemeColors?.textColor || themeData?.description || (styles.themeMode === 'dark' ? '#C7CDD6' : '#4B5563'),
    subtitleColor: styles.subheadingColor || styles.subtitleColor || passedThemeColors?.subheadingColor || passedThemeColors?.subtitleColor || themeData?.accent,
    subheadingColor: styles.subheadingColor || passedThemeColors?.subheadingColor || themeData?.accent,
    accentColor: styles.accentColor || passedThemeColors?.accentColor || themeData?.accent,
    buttonBackgroundColor: styles.buttonBackgroundColor || passedThemeColors?.buttonBackgroundColor || themeData?.primaryButton?.bg,
    secondaryHeadingColor: styleAny.secondaryHeadingColor || styleAny.buttonBackgroundColor || passedThemeColors?.buttonBackgroundColor || themeData?.primaryButton?.bg || themeData?.accent,
    titleFontFamily: styleAny.titleFontFamily || styleAny.fontFamily || passedThemeColors?.titleFontFamily,
    subtitleFontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || passedThemeColors?.subtitleFontFamily,
    descriptionFontFamily: styleAny.descriptionFontFamily || styleAny.fontFamily || passedThemeColors?.descriptionFontFamily,
    titleFontSize: styleAny.titleFontSize || styleAny.titleSize || styleAny.fontSize,
    subtitleFontSize: styleAny.subtitleFontSize || styleAny.subtitleSize || styleAny.fontSize,
    descriptionFontSize: styleAny.descriptionFontSize || styleAny.descriptionSize || styleAny.fontSize,
    titleFontWeight: styleAny.titleFontWeight || styleAny.fontWeight,
    subtitleFontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight,
    descriptionFontWeight: styleAny.descriptionFontWeight || styleAny.fontWeight,
    titleLetterSpacing: styleAny.titleLetterSpacing,
    subtitleLetterSpacing: styleAny.subtitleLetterSpacing,
    descriptionLetterSpacing: styleAny.descriptionLetterSpacing,
  };
  
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
    <div className="w-full" style={{ backgroundColor: styles.backgroundColor || (styles.themeMode === 'dark' ? '#0E1214' : '#FFFFFF') }}>
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
                buttonBackgroundColor: styles.buttonBackgroundColor || themeData?.primaryButton?.bg,
                buttonTextColor: styles.buttonTextColor || themeData?.primaryButton?.text
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
