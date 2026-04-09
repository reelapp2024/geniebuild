import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';
import { PRESET_THEMES } from '../../../constants';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
  onElementSelect?: (elementId: string, element?: WebsiteElement) => void;
  onElementUpdate?: (elementId: string, updates: Partial<WebsiteElement>) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
  themeColors?: {
    titleFontFamily?: string;
    subtitleFontFamily?: string;
    descriptionFontFamily?: string;
    buttonFontFamily?: string;
  };
}

export const HeroCrimsonJet: React.FC<HeroProps> = ({ 
  section, onTextEdit, onImageClick, buttonClass, onElementSelect, onElementUpdate, selectedElementId, readOnly = false,
  themeColors: fontThemeColors
}) => {
  const { themeData } = useTheme();
  const { content, styles } = section;
  
  React.useEffect(() => {
    console.log('HeroCrimsonJet themeData changed:', themeData);
  }, [themeData]);
  
  const activeTheme = PRESET_THEMES.find(t => t.elements.surface.toLowerCase() === themeData?.surface?.toLowerCase());
  
  // Combine themeData and activeTheme to ensure we get the full secondaryButton object
  const secondaryButton = {
    bg: (themeData?.elements || themeData)?.secondaryButton?.bg || activeTheme?.elements?.secondaryButton?.bg || 'transparent',
    text: (themeData?.elements || themeData)?.secondaryButton?.text || activeTheme?.elements?.secondaryButton?.text || (styles.themeMode === 'light' ? (styles.buttonBackgroundColor || (themeData?.elements || themeData)?.primaryButton?.bg || '#E11D48') : '#F8FAFC'),
    border: (themeData?.elements || themeData)?.secondaryButton?.border || styles.secondaryButtonBorderColor || styles.buttonBackgroundColor || activeTheme?.elements?.secondaryButton?.border || '#F43F5E',
    hover: (themeData?.elements || themeData)?.secondaryButton?.hover || activeTheme?.elements?.secondaryButton?.hover || '#F43F5E'
  };

  React.useEffect(() => {
    console.log('HeroCrimsonJet themeData:', themeData);
    console.log('HeroCrimsonJet activeTheme:', activeTheme);
    console.log('HeroCrimsonJet secondaryButton:', secondaryButton);
  }, [themeData, activeTheme, secondaryButton]);

  // Defaulting to "Crimson Jet" theme
  const theme = React.useMemo(() => ({
    heading: styles.titleColor || themeData?.elements?.heading || '#F8FAFC',
    description: styles.textColor || themeData?.elements?.description || '#C7CDD6',
    primaryButton: themeData?.elements?.primaryButton?.bg || styles.buttonBackgroundColor || '#E11D48',
    primaryButtonText: themeData?.elements?.primaryButton?.text || styles.buttonTextColor || '#FFFFFF',
    secondaryButton: secondaryButton.bg,
    secondaryButtonText: secondaryButton.text,
    secondaryButtonBorder: secondaryButton.border,
    secondaryButtonHover: secondaryButton.hover,
    overlay: styles.overlayColor || themeData?.elements?.overlay?.color || 'rgba(14, 18, 20, 0.60)'
  }), [themeData, styles, secondaryButton]);

  const styleAny = styles as any;
  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || (fontThemeColors as any)?.titleColor || theme.heading,
    textColor: styles.textColor || (fontThemeColors as any)?.textColor || theme.description,
    subtitleColor: styles.subtitleColor || (fontThemeColors as any)?.subtitleColor || (fontThemeColors as any)?.textColor || theme.description,
    accentColor: styles.accentColor || (fontThemeColors as any)?.accentColor || themeData?.accent,
    buttonFontWeight: styleAny.buttonFontWeight || styleAny.fontWeight,
    buttonFontSize: styleAny.buttonSize || styleAny.buttonFontSize || styleAny.fontSize,
    buttonAlign: styleAny.buttonAlign || styles.textAlign,
    buttonFontFamily: styleAny.buttonFontFamily || styleAny.fontFamily || fontThemeColors?.buttonFontFamily,
    titleFontWeight: styleAny.titleFontWeight || styleAny.fontWeight || '800',
    titleFontSize: styleAny.titleSize || styleAny.fontSize,
    titleAlign: styleAny.titleAlign || styles.textAlign,
    titleFontFamily: styleAny.titleFontFamily || styleAny.fontFamily || fontThemeColors?.titleFontFamily,
    subtitleFontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight,
    subtitleFontSize: styleAny.subtitleSize || styleAny.fontSize,
    subtitleAlign: styleAny.subtitleAlign || styles.textAlign,
    subtitleFontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || fontThemeColors?.subtitleFontFamily,
    descriptionFontFamily:
      styleAny.descriptionFontFamily || styleAny.fontFamily || fontThemeColors?.descriptionFontFamily,
    fontWeight: styleAny.fontWeight,
    fontSize: styleAny.fontSize,
    textAlign: styles.textAlign,
    fontFamily: styleAny.fontFamily,
  };

  const getTitleElement = (): WebsiteElement => {
    if (section.elements?.find(e => e.id === `${section.id}-title`)) return section.elements.find(e => e.id === `${section.id}-title`)!;
    return { id: `${section.id}-title`, type: 'heading', content: { text: content.title || 'Experience the Power of Crimson Jet.', htmlTag: (styles.titleHeadingTag || 'h1') as any }, style: { fontSize: styles.titleSize } };
  };

  const getDescElement = (): WebsiteElement => {
    if (section.elements?.find(e => e.id === `${section.id}-desc`)) return section.elements.find(e => e.id === `${section.id}-desc`)!;
    return { id: `${section.id}-desc`, type: 'text', content: { text: content.subtitle || 'Unleash performance with our latest technology. Designed for speed, built for excellence.', textSize: 'xl' }, style: {} };
  };

  const getBtn1Element = (): WebsiteElement => {
    if (section.elements?.find(e => e.id === `${section.id}-btn1`)) return section.elements.find(e => e.id === `${section.id}-btn1`)!;
    return { id: `${section.id}-btn1`, type: 'button', content: { text: content.ctaText || 'Get Started', link: content.ctaHref || '' }, style: { borderRadius: '0.5rem', padding: '0.75rem 2rem' } };
  };

  const getBtn2Element = (): WebsiteElement => {
    if (section.elements?.find(e => e.id === `${section.id}-btn2`)) return section.elements.find(e => e.id === `${section.id}-btn2`)!;
    return { id: `${section.id}-btn2`, type: 'button', content: { text: content.secondaryCtaText || 'Learn More', link: '' }, style: { borderStyle: 'solid', borderWidth: '2px', borderRadius: '0.5rem', padding: '0.75rem 2rem' } };
  };

  const titleElement = getTitleElement();
  const descElement = getDescElement();
  const btn1Element = getBtn1Element();
  const btn2Element = getBtn2Element();

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      <div className="relative z-10 text-center max-w-4xl px-6 space-y-6 w-full">
        <div className="mx-auto max-w-3xl">
          <ElementsSection
            section={{ ...section, elements: [titleElement] }}
            onTextEdit={onTextEdit}
            onElementUpdate={onElementUpdate || (() => {})}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            readOnly={readOnly}
            isWrapped={false}
            buttonClass={buttonClass}
            themeColors={themeColors}
          />
        </div>
        <div className="mx-auto max-w-2xl">
          <ElementsSection
            section={{ ...section, elements: [descElement] }}
            onTextEdit={onTextEdit}
            onElementUpdate={onElementUpdate || (() => {})}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            readOnly={readOnly}
            isWrapped={false}
            buttonClass={buttonClass}
            themeColors={themeColors}
          />
        </div>
        
        <div className="flex gap-4 justify-center pt-4">
          <div className="inline-block">
            <ElementsSection
              section={{ ...section, elements: [btn1Element] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              isWrapped={false}
              buttonClass={buttonClass}
              themeColors={{ ...themeColors, buttonBackgroundColor: theme.primaryButton, buttonTextColor: theme.primaryButtonText }}
            />
          </div>
          <div className="inline-block">
            <ElementsSection
              section={{ ...section, elements: [btn2Element] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              isWrapped={false}
              buttonClass={buttonClass}
              themeColors={{ ...themeColors, buttonBackgroundColor: theme.secondaryButton, buttonTextColor: theme.secondaryButtonText, buttonBorderColor: theme.secondaryButtonBorder }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
