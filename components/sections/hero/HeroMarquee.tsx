import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';

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

export const HeroMarquee: React.FC<HeroProps> = ({
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
  const styleAny = styles as any;

  const defaultTitleSizesByTag: Record<string, string> = {
    h1: '3rem',
    h2: '2.5rem',
    h3: '2rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1rem'
  };

  const badgeId = `${section.id}-hero-badge`;
  const titleId = `${section.id}-hero-title`;
  const marqueeId = `${section.id}-hero-marquee`;

  const badgeElement = section.elements?.find(e => e.id === badgeId);
  const titleElement = section.elements?.find(e => e.id === titleId);
  const marqueeElement = section.elements?.find(e => e.id === marqueeId);

  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || themeData?.heading,
    textColor: styles.textColor || themeData?.description,
    subtitleColor: styles.subtitleColor || styles.textColor || themeData?.description,
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
      content: {
        text: content.badgeText || 'WordPress Theme',
        variant: 'primary'
      },
      style: { padding: '6px 12px' }
    };
  };

  const getTitleElement = (): WebsiteElement => {
    if (titleElement) return titleElement;
    const titleTag = (styles.titleHeadingTag || 'h1') as keyof typeof defaultTitleSizesByTag;
    const resolvedTitleSize =
      styles.titleSize && String(styles.titleSize).trim() !== ''
        ? styles.titleSize
        : defaultTitleSizesByTag[titleTag] || defaultTitleSizesByTag.h2;
    return {
      id: titleId,
      type: 'heading',
      content: {
        text: content.title || 'Dancing School & Studio',
        htmlTag: (styles.titleHeadingTag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      },
      style: {
        color: styles.titleColor || '#FFFFFF',
        fontSize: resolvedTitleSize,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: '-0.03em',
        lineHeight: '0.95'
      }
    };
  };

  const getMarqueeElement = (): WebsiteElement => {
    if (marqueeElement) return marqueeElement;
    return {
      id: marqueeId,
      type: 'text',
      content: {
        text: content.subtitle || 'CHOREOGRAPHY • BALLET STUDIO • MODERN DANCE • HIP HOP • DANCE LESSONS • DANCE SCHOOL •',
        textSize: 'small',
        enableMarquee: true,
        marqueeSpeed: '4x',
        marqueeDirection: 'left'
      },
      style: {
        color: styles.titleColor || '#FFFFFF',
        backgroundColor: 'rgba(3, 11, 31, 0.65)',
        textTransform: 'uppercase',
        fontWeight: '700',
        letterSpacing: '0.08em',
        padding: '10px 20px',
        width: '100%',
        margin: '0',
        borderRadius: '0'
      }
    };
  };

  return (
    <div className="relative w-full min-h-[80vh] md:min-h-[90vh] overflow-hidden">
      <div className="relative z-10 w-full h-full flex flex-col items-center text-center px-6 pt-12 md:pt-20 pb-28 md:pb-32">
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

        <div className="w-full mb-0">
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
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-20">
        <div className="w-full">
          <ElementsSection
            section={{ ...section, elements: [getMarqueeElement()] }}
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
      </div>
    </div>
  );
};
