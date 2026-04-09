import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';

interface GuaranteeProps {
  section: Section;
  isSelected: boolean;
  onTextEdit: (key: any, value: string) => void;
  onItemEdit: (itemId: string, updates: any) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  titleClass: string;
  titleStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  readOnly?: boolean;
  onElementSelect?: (elementId: string, element?: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  themeColors?: {
    titleColor?: string;
    textColor?: string;
    accentColor?: string;
    subheadingColor?: string;
    secondaryHeadingColor?: string;
    titleFontFamily?: string;
    subtitleFontFamily?: string;
    descriptionFontFamily?: string;
    buttonFontFamily?: string;
  };
}

export const GuaranteeSimple: React.FC<GuaranteeProps> = ({ 
  section, 
  isSelected, 
  onTextEdit, 
  onItemEdit, 
  onRemoveItem, 
  onAddItem, 
  titleClass, 
  titleStyle, 
  subtitleStyle, 
  descriptionStyle,
  buttonStyle,
  readOnly,
  onElementSelect,
  onElementUpdate,
  selectedElementId,
  themeColors: passedThemeColors
}) => {
  const { content, styles } = section;
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

  const badgeId = `${section.id}-badge`;
  const titleId = `${section.id}-title`;
  const descriptionId = `${section.id}-description`;
  const iconId = `${section.id}-icon`;

  const badgeElement = section.elements?.find(e => e.id === badgeId);
  const titleElement = section.elements?.find(e => e.id === titleId);
  const descriptionElement = section.elements?.find(e => e.id === descriptionId);
  const iconElement = section.elements?.find(e => e.id === iconId);

  const getBadgeElement = (): WebsiteElement => {
    if (badgeElement) return badgeElement;
    return {
      id: badgeId,
      type: 'badge',
      content: { text: content.badgeText || '100% SATISFACTION GUARANTEE', variant: 'primary' },
      style: {
        backgroundColor: themeColors.accentColor,
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '700',
        padding: '6px 16px',
        borderRadius: '9999px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }
    };
  };

  const getTitleElement = (): WebsiteElement => {
    if (titleElement) return titleElement;
    return {
      id: titleId,
      type: 'heading',
      content: { 
        text: content.title || 'Our Quality <span style="color: #E11D48">Guarantee</span>',
        htmlTag: (styles.titleHeadingTag || 'h2') as any
      },
      style: {
        color: styles.titleColor || themeColors.titleColor,
        fontSize: styles.titleFontSize || styles.titleSize || '42px',
        fontWeight: styles.titleFontWeight || '800',
        fontFamily: styles.titleFontFamily || themeColors.titleFontFamily,
        textAlign: 'center',
        lineHeight: '1.2'
      }
    };
  };

  const getDescriptionElement = (): WebsiteElement => {
    if (descriptionElement) return descriptionElement;
    return {
      id: descriptionId,
      type: 'text',
      content: { text: content.description || 'We stand behind our work. If you are not completely satisfied with our service, we will make it right at no extra cost to you.' },
      style: {
        color: styles.descriptionColor || themeColors.textColor,
        fontSize: styles.descriptionFontSize || '18px',
        fontWeight: styles.descriptionFontWeight,
        fontFamily: styles.descriptionFontFamily || themeColors.descriptionFontFamily,
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }
    };
  };

  const getIconElement = (): WebsiteElement => {
    if (iconElement) return iconElement;
    return {
      id: iconId,
      type: 'icon',
      content: { icon: content.icon || 'ShieldCheck', iconSize: '64px' },
      style: {
        color: themeColors.accentColor,
        marginBottom: '24px'
      }
    };
  };

  const paddingTop = styles.paddingTop || 'pt-24';
  const paddingBottom = styles.paddingBottom || 'pb-24';
  const paddingX = styles.paddingX || 'px-6';

  return (
    <div className={`relative overflow-hidden ${paddingTop} ${paddingBottom} ${paddingX}`} style={{ backgroundColor: themeColors.backgroundColor }}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-current blur-[100px]" style={{ color: themeColors.accentColor }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-current blur-[100px]" style={{ color: themeColors.accentColor }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getIconElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
            />
          </div>

          <div className="mb-6">
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getBadgeElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
            />
          </div>

          <div className="mb-6">
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getTitleElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
            />
          </div>

          <div className="opacity-90">
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getDescriptionElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
            />
          </div>

          {content.ctaText && (
            <div className="mt-10">
               <button 
                className={`px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
                style={{ 
                  backgroundColor: themeColors.buttonBackgroundColor || themeColors.accentColor,
                  color: themeColors.buttonTextColor || '#FFFFFF',
                  ...buttonStyle
                }}
              >
                {content.ctaText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
