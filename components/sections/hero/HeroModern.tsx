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

export const HeroModern: React.FC<HeroProps> = ({ 
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
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;
  const secondaryButtonId = `${section.id}-hero-secondary-button`;
  const badgeId = `${section.id}-hero-badge`;
  const trustTextId = `${section.id}-hero-trust-text`;
  const logoCloudId = `${section.id}-hero-logos`;
  const imageId = `${section.id}-hero-image`;
  const statCard1Id = `${section.id}-hero-stat-card-1`;
  const statCard2Id = `${section.id}-hero-stat-card-2`;

  const getBadgeElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === badgeId);
    if (el) return el;
    return {
      id: badgeId,
      type: 'badge',
      content: { text: content.badgeText || 'New for 2026' },
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'rgba(255, 255, 255, 0.6)',
        padding: '6px',
        borderRadius: '9999px',
        fontSize: '10px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)'
      }
    };
  };

  const getTitleElement = (): WebsiteElement => {
    const titleElement = section.elements?.find(e => e.id === titleId);
    if (titleElement) return titleElement;
    return {
      id: titleId,
      type: 'heading',
      content: {
        text: content.title || 'Modern Hero Title',
        htmlTag: (styles.titleHeadingTag || 'h1') as any
      },
      style: {
        color: styles.titleColor || themeData?.heading || '',
        fontSize: styles.titleSize || '4rem',
        fontWeight: '800',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        textAlign: 'left'
      }
    };
  };
  
  const getSubtitleElement = (): WebsiteElement => {
    const subtitleElement = section.elements?.find(e => e.id === subtitleId);
    if (subtitleElement) return subtitleElement;
    return {
      id: subtitleId,
      type: 'text',
      content: {
        text: content.subtitle || 'Experience the future of web design with our modern hero section.',
        textSize: 'xl'
      },
      style: {
        color: styles.subtitleColor || styles.textColor || themeData?.description || '',
        textAlign: 'left',
        opacity: 0.8
      }
    };
  };
  
  const getButtonElement = (): WebsiteElement => {
    const buttonElement = section.elements?.find(e => e.id === buttonId);
    if (buttonElement) return buttonElement;
    return {
      id: buttonId,
      type: 'button',
      content: {
        text: content.ctaText || 'Get Started',
        link: content.ctaHref || '#'
      },
      style: {
        backgroundColor: styles.buttonBackgroundColor || themeData?.primaryButton?.bg || '#3b82f6',
        color: styles.buttonTextColor || themeData?.primaryButton?.text || '#ffffff',
        padding: '12px 32px',
        borderRadius: '9999px',
        fontWeight: '600',
        textAlign: 'left'
      }
    };
  };

  const getSecondaryButtonElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === secondaryButtonId);
    const activeTheme = PRESET_THEMES.find(t => t.elements.surface.toLowerCase() === themeData?.surface?.toLowerCase());
    const secondaryButton = {
      bg: themeData?.elements?.secondaryButton?.bg || activeTheme?.elements?.secondaryButton?.bg || 'transparent',
      text: themeData?.elements?.secondaryButton?.text || activeTheme?.elements?.secondaryButton?.text || themeData?.heading || '#ffffff',
      border: themeData?.elements?.secondaryButton?.border || activeTheme?.elements?.secondaryButton?.border || themeData?.accent || 'rgba(255, 255, 255, 0.2)'
    };

    if (el) {
      return {
        ...el,
        style: {
          ...el.style,
          backgroundColor: el.style?.backgroundColor || secondaryButton.bg,
          color: el.style?.color || secondaryButton.text,
          border: el.style?.border || `1px solid ${secondaryButton.border}`
        }
      };
    }

    return {
      id: secondaryButtonId,
      type: 'button',
      content: {
        text: 'Watch Demo',
        link: '#'
      },
      style: {
        backgroundColor: secondaryButton.bg,
        color: secondaryButton.text,
        padding: '12px 32px',
        borderRadius: '9999px',
        fontWeight: '600',
        border: `1px solid ${secondaryButton.border}`,
        backdropFilter: 'blur(12px)',
        textAlign: 'left'
      }
    };
  };

  const getTrustTextElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === trustTextId);
    if (el) return el;
    return {
      id: trustTextId,
      type: 'text',
      content: { text: 'Trusted by industry leaders' },
      style: {
        fontSize: '10px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'rgba(255, 255, 255, 0.3)',
        textAlign: 'left'
      }
    };
  };

  const getLogoCloudElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === logoCloudId);
    if (el) return el;
    return {
      id: logoCloudId,
      type: 'logo-cloud',
      content: {
        items: [
          { src: 'https://cdn.worldvectorlogo.com/logos/google-2015.svg', alt: 'Google' },
          { src: 'https://cdn.worldvectorlogo.com/logos/apple-11.svg', alt: 'Apple' },
          { src: 'https://cdn.worldvectorlogo.com/logos/amazon-2.svg', alt: 'Amazon' },
          { src: 'https://cdn.worldvectorlogo.com/logos/microsoft-5.svg', alt: 'Microsoft' }
        ]
      },
      style: {
        opacity: 0.4,
        textAlign: 'left',
        justifyContent: 'flex-start'
      }
    };
  };
  
  const getImageElement = (): WebsiteElement => {
    const imageElement = section.elements?.find(e => e.id === imageId);
    if (imageElement) return imageElement;
    return {
      id: imageId,
      type: 'image',
      content: {
        imageUrl: content.imageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Modern Hero'
      },
      style: {
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }
    };
  };

  const getStatCard1Element = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === statCard1Id);
    if (el) {
      return {
        ...el,
        style: {
          ...el.style,
          position: 'absolute',
          bottom: '-24px',
          left: '-24px',
          zIndex: 30
        }
      };
    }
    return {
      id: statCard1Id,
      type: 'stat-card',
      content: {
        text: 'Growth',
        value: '+142%',
        subText: 'Revenue increase this quarter',
        icon: 'chart-line'
      },
      style: {
        width: '180px',
        position: 'absolute',
        bottom: '-24px',
        left: '-24px',
        zIndex: 30
      }
    };
  };

  const getStatCard2Element = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === statCard2Id);
    if (el) {
      return {
        ...el,
        style: {
          ...el.style,
          position: 'absolute',
          top: '-24px',
          right: '-24px',
          zIndex: 30
        }
      };
    }
    return {
      id: statCard2Id,
      type: 'user-avatars',
      content: {
        targetNumber: 12,
        items: [
          { src: 'https://picsum.photos/seed/user1/32/32' },
          { src: 'https://picsum.photos/seed/user2/32/32' },
          { src: 'https://picsum.photos/seed/user3/32/32' }
        ]
      },
      style: {
        position: 'absolute',
        top: '-24px',
        right: '-24px',
        zIndex: 30
      }
    };
  };

  const styleAny = styles as any;
  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || themeData?.heading,
    textColor: styles.textColor || themeData?.description,
    accentColor: styles.accentColor || themeData?.accent,
    buttonBackgroundColor: styles.buttonBackgroundColor || themeData?.primaryButton?.bg,
    buttonTextColor: styles.buttonTextColor || themeData?.primaryButton?.text,
    titleFontFamily: styleAny.titleFontFamily || styleAny.fontFamily || fontThemeColors?.titleFontFamily,
    subtitleFontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || fontThemeColors?.subtitleFontFamily,
    descriptionFontFamily: styleAny.descriptionFontFamily || styleAny.fontFamily || fontThemeColors?.descriptionFontFamily,
    buttonFontFamily: styleAny.buttonFontFamily || styleAny.fontFamily || fontThemeColors?.buttonFontFamily,
  };
  
  const badgeElement = getBadgeElement();
  const titleElement = getTitleElement();
  const subtitleElement = getSubtitleElement();
  const buttonElement = getButtonElement();
  const secondaryButtonElement = getSecondaryButtonElement();
  const trustTextElement = getTrustTextElement();
  const logoCloudElement = getLogoCloudElement();
  const imageElement = getImageElement();
  const statCard1Element = getStatCard1Element();
  const statCard2Element = getStatCard2Element();
  
  return (
    <div className="relative w-full min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      <div className="container mx-auto px-6 relative z-10 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-8">
            <ElementsSection 
              section={{ ...section, elements: [badgeElement] }} 
              onTextEdit={onTextEdit} 
              onElementUpdate={onElementUpdate || (() => {})} 
              onElementSelect={onElementSelect} 
              selectedElementId={selectedElementId} 
              buttonClass={buttonClass}
              readOnly={readOnly} 
              isWrapped={false} 
              themeColors={themeColors} 
            />
            
            <div className="space-y-4">
              <ElementsSection 
                section={{ ...section, elements: [titleElement] }} 
                onTextEdit={onTextEdit} 
                onElementUpdate={onElementUpdate || (() => {})} 
                onElementSelect={onElementSelect} 
                selectedElementId={selectedElementId} 
                buttonClass={buttonClass}
                readOnly={readOnly} 
                isWrapped={false} 
                themeColors={{...themeColors, titleFontWeight: '900', titleFontSize: '7xl'}} 
              />
              <ElementsSection 
                section={{ ...section, elements: [subtitleElement] }} 
                onTextEdit={onTextEdit} 
                onElementUpdate={onElementUpdate || (() => {})} 
                onElementSelect={onElementSelect} 
                selectedElementId={selectedElementId} 
                buttonClass={buttonClass}
                readOnly={readOnly} 
                isWrapped={false} 
                themeColors={{...themeColors, subtitleFontSize: 'lg'}} 
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <ElementsSection 
                section={{ ...section, elements: [buttonElement] }} 
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
                section={{ ...section, elements: [secondaryButtonElement] }} 
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
            
            {/* Trust Badges */}
            <div className="pt-8 flex flex-col gap-4">
              <ElementsSection 
                section={{ ...section, elements: [trustTextElement] }} 
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
                section={{ ...section, elements: [logoCloudElement] }} 
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

          {/* Right Visual Column - Bento Style */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-20 rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
              <ElementsSection 
                section={{ ...section, elements: [imageElement] }} 
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
            
            {/* Floating Glass Cards */}
            <div className="hidden sm:block">
              <ElementsSection 
                section={{ ...section, elements: [statCard1Element] }} 
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
                section={{ ...section, elements: [statCard2Element] }} 
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
      </div>
    </div>
  );
};
