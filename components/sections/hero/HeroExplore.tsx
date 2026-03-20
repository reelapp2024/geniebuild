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
}

export const HeroExplore: React.FC<HeroProps> = ({
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
  const { themeData } = useTheme();

  // Element IDs - must match what App.tsx expects
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;
  const imageId = `${section.id}-hero-image`;
  const badgeId = `${section.id}-hero-badge`;
  const ratingNumberId = `${section.id}-hero-rating-number`;
  const ratingStarsId = `${section.id}-hero-rating-stars`;
  const ratingTextId = `${section.id}-hero-rating-text`;

  // Get elements from section.elements (they exist after first edit)
  const titleElement = section.elements?.find(e => e.id === titleId);
  const subtitleElement = section.elements?.find(e => e.id === subtitleId);
  const buttonElement = section.elements?.find(e => e.id === buttonId);
  const imageElement = section.elements?.find(e => e.id === imageId);
  const badgeElement = section.elements?.find(e => e.id === badgeId);
  const ratingNumberElement = section.elements?.find(e => e.id === ratingNumberId);
  const ratingStarsElement = section.elements?.find(e => e.id === ratingStarsId);
  const ratingTextElement = section.elements?.find(e => e.id === ratingTextId);

  // Theme colors for ElementsSection - pass complete section.styles for unified styling
  const styleAny = styles as any;
  const themeColors = {
    ...styles, // Include all section.styles properties
    // Merge theme data for fallbacks
    titleColor: styles.titleColor || themeData?.heading,
    textColor: styles.textColor || themeData?.description,
    subtitleColor: styles.subtitleColor || styles.textColor || themeData?.description,
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

  const align = styles.textAlign || 'center';
  const alignItems = align === 'center' ? 'items-center' : align === 'right' ? 'items-end' : 'items-start';
  const textAlignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  const justifyClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';
  const bgGradientStops = (styles.background?.type === 'gradient' && styles.background.gradient?.stops) || [];
  const bgGradientFrom = bgGradientStops[0]?.color || styleAny.backgroundGradientFrom || themeData?.gradient?.from || styles.backgroundColor || themeData?.surface || '#1E1B4B';
  const bgGradientTo = bgGradientStops[bgGradientStops.length - 1]?.color || styleAny.backgroundGradientTo || themeData?.gradient?.to || themeData?.surface || '#0E1214';
  const bgGradientDirection = (styles.background?.type === 'gradient' && styles.background.gradient?.direction) || 135;
  const imageOverlayColor =
    styleAny.imageOverlayColor ||
    styleAny.overlayColor ||
    styles.background?.image?.overlay?.color ||
    styles.background?.overlay?.color ||
    themeData?.overlay?.color ||
    '#000000';
  const overlayOpacityRaw =
    styleAny.imageOverlayOpacity ??
    styles.background?.image?.overlay?.opacity ??
    styles.background?.overlay?.opacity ??
    styleAny.overlayOpacityValue ??
    styleAny.overlayOpacity ??
    '0.14';
  const parsedOverlayOpacity = typeof overlayOpacityRaw === 'number'
    ? overlayOpacityRaw
    : parseFloat(String(overlayOpacityRaw));
  const imageOverlayOpacity = Number.isFinite(parsedOverlayOpacity)
    ? Math.min(1, Math.max(0, parsedOverlayOpacity))
    : 0.14;

  const withAlign = (element: WebsiteElement, forceAlign?: string): WebsiteElement => ({
    ...element,
    style: {
      ...element.style,
      textAlign: forceAlign || align,
    }
  });

  // Helper to create fallback element if it doesn't exist
  const getBadgeElement = (): WebsiteElement => {
    if (badgeElement) return badgeElement;
    return {
      id: badgeId,
      type: 'badge',
      content: { text: 'HANDYMAN FOR ALL', variant: 'primary' },
      style: { color: themeData?.accent || '#F97316' }
    };
  };

  const getTitleElement = (): WebsiteElement => {
    if (titleElement) return titleElement;
    return {
      id: titleId,
      type: 'heading',
      content: {
        text: content.title || 'Fast Fixing Experts',
        htmlTag: (styles.titleHeadingTag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      },
      style: {
        color: styles.titleColor || themeData?.heading || '#FFFFFF',
        fontSize: styles.titleSize
      }
    };
  };

  const getSubtitleElement = (): WebsiteElement => {
    if (subtitleElement) return subtitleElement;
    return {
      id: subtitleId,
      type: 'text',
      content: {
        text: content.subtitle || 'Expert repairs done right every time. Customer satisfaction is our highest priority, and we strive to exceed expectations',
        textSize: 'base' as 'base' | 'small' | 'large' | 'xl'
      },
      style: {
        color: styles.subtitleColor || styles.textColor || themeData?.description || '#E2E8F0'
      }
    };
  };

  const getRatingNumberElement = (): WebsiteElement => {
    if (ratingNumberElement) return ratingNumberElement;
    return {
      id: ratingNumberId,
      type: 'heading',
      content: {
        text: '4.95',
        htmlTag: 'h2'
      },
      style: {
        color: themeData?.heading || '#FFFFFF',
        fontSize: '3rem',
        fontWeight: 'bold',
        lineHeight: '1'
      }
    };
  };

  const getRatingStarsElement = (): WebsiteElement => {
    if (ratingStarsElement) return ratingStarsElement;
    return {
      id: ratingStarsId,
      type: 'star-rating',
      content: { rating: 5, maxRating: 5 },
      style: { color: themeData?.accent || '#F97316', fontSize: '1rem' }
    };
  };

  const getRatingTextElement = (): WebsiteElement => {
    if (ratingTextElement) return ratingTextElement;
    return {
      id: ratingTextId,
      type: 'text',
      content: { text: 'Google Rating', textSize: 'small' },
      style: { color: themeData?.heading || '#FFFFFF', fontWeight: 'bold' }
    };
  };

  const getButtonElement = (): WebsiteElement => {
    if (buttonElement) return buttonElement;
    return {
      id: buttonId,
      type: 'button',
      content: {
        text: content.ctaText || 'Read More →',
        link: content.ctaHref || '#'
      },
      style: {
        backgroundColor: styles.buttonBackgroundColor || themeData?.primaryButton?.bg || '#F97316',
        color: styles.buttonTextColor || themeData?.primaryButton?.text || '#FFFFFF'
      }
    };
  };

  const getImageElement = (): WebsiteElement => {
    const baseElement = imageElement || {
      id: imageId,
      type: 'image',
      content: {
        imageUrl: content.imageUrl || 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Hero Image'
      },
      style: {}
    };
    
    // Force image to cover full height and width of its container
    return {
      ...baseElement,
      style: {
        ...baseElement.style,
        width: '100%',
        height: '100%',
        minHeight: '100%',
        objectFit: 'cover'
      }
    };
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden"
      style={{ backgroundImage: `linear-gradient(${bgGradientDirection}deg, ${bgGradientFrom} 0%, ${bgGradientTo} 100%)` }}
    >
      {/* Left Side: Image */}
      <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-0">
        <div className="absolute inset-0 w-full h-full [&>div]:h-full [&>div>div]:h-full [&_img]:min-h-full [&_img]:object-cover">
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: imageOverlayColor, opacity: imageOverlayOpacity }}
        />
      </div>

      {/* Right Side: Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 xl:p-24 relative z-10">
        <div className={`w-full max-w-xl flex flex-col ${alignItems} ${textAlignClass} gap-6`}>
          
          <ElementsSection
            section={{ ...section, elements: [withAlign(getBadgeElement())] }}
            onTextEdit={onTextEdit}
            onElementUpdate={onElementUpdate || (() => {})}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            buttonClass={buttonClass}
            readOnly={readOnly}
            isWrapped={false}
            themeColors={themeColors}
          />
          
          <ElementsSection
            section={{ ...section, elements: [withAlign(getTitleElement())] }}
            onTextEdit={onTextEdit}
            onElementUpdate={onElementUpdate || (() => {})}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            buttonClass={buttonClass}
            readOnly={readOnly}
            isWrapped={false}
            themeColors={themeColors}
          />
          
          <div className="opacity-80">
            <ElementsSection
              section={{ ...section, elements: [withAlign(getSubtitleElement())] }}
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
          
          {/* Rating Row */}
          <div className={`flex items-center gap-4 mt-2 mb-2 ${justifyClass} w-full`}>
            <ElementsSection
              section={{ ...section, elements: [withAlign(getRatingNumberElement(), 'left')] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              buttonClass={buttonClass}
              readOnly={readOnly}
              isWrapped={false}
              themeColors={themeColors}
            />
            <div className="flex flex-col items-start gap-1">
              <ElementsSection
                section={{ ...section, elements: [withAlign(getRatingStarsElement(), 'left')] }}
                onTextEdit={onTextEdit}
                onElementUpdate={onElementUpdate || (() => {})}
                onElementSelect={onElementSelect}
                selectedElementId={selectedElementId}
                buttonClass={buttonClass}
                readOnly={readOnly}
                isWrapped={false}
                themeColors={themeColors}
              />
              <ElementsSection
                section={{ ...section, elements: [withAlign(getRatingTextElement(), 'left')] }}
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

          <div className={`mt-4 w-full flex ${justifyClass}`}>
            <ElementsSection 
              isWrapped={false}
              section={{ ...section, elements: [withAlign(getButtonElement())] }}
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
  );
};
