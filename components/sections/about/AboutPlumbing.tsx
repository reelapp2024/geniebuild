import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { motion } from 'motion/react';

import { useTheme } from '@ui/blocks';

interface AboutProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  buttonClass: string;
  onElementSelect?: (elementId: string, element?: WebsiteElement) => void;
  onElementUpdate?: (elementId: string, updates: Partial<WebsiteElement>) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
  themeColors?: any;
}

export const AboutPlumbing: React.FC<AboutProps> = ({ 
  section, onTextEdit, buttonClass, onElementSelect, onElementUpdate, selectedElementId, readOnly = false, themeColors: passedThemeColors 
}) => {
  const content = section.content || {};
  const styles = section.styles || {};
  const { themeData } = useTheme();

  const themeColors = {
    titleColor: styles.titleColor || passedThemeColors?.titleColor || themeData?.heading || (styles.themeMode === 'light' ? '#111827' : '#F8FAFC'),
    textColor: styles.textColor || passedThemeColors?.textColor || themeData?.description || (styles.themeMode === 'light' ? '#4B5563' : '#C7CDD6'),
    subtitleColor: (styles as any).subheadingColor || (styles as any).subtitleColor || passedThemeColors?.subheadingColor || passedThemeColors?.subtitleColor || themeData?.accent,
    subheadingColor: (styles as any).subheadingColor || passedThemeColors?.subheadingColor || themeData?.accent,
    accentColor: styles.accentColor || passedThemeColors?.accentColor || themeData?.accent,
    buttonBackgroundColor: (styles as any).buttonBackgroundColor || passedThemeColors?.buttonBackgroundColor || themeData?.primaryButton?.bg,
    secondaryHeadingColor: (styles as any).secondaryHeadingColor || (styles as any).buttonBackgroundColor || passedThemeColors?.buttonBackgroundColor || themeData?.primaryButton?.bg || themeData?.accent,
    titleFontFamily: passedThemeColors?.titleFontFamily,
    subtitleFontFamily: passedThemeColors?.subtitleFontFamily,
    descriptionFontFamily: passedThemeColors?.descriptionFontFamily,
    buttonFontFamily: passedThemeColors?.buttonFontFamily,
  };

  const getBadgeElement = (): WebsiteElement => {
    const id = `${section.id}-about-badge`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'text',
        content: { text: 'About Our Company', textSize: 'small' },
      }),
      style: { 
        ...(existing?.style || {}),
        color: existing?.style?.color || themeColors.subheadingColor || themeColors.accentColor, 
        fontWeight: existing?.style?.fontWeight || '800', 
        textTransform: existing?.style?.textTransform || 'uppercase', 
        letterSpacing: existing?.style?.letterSpacing || '0.2em',
        backgroundColor: existing?.style?.backgroundColor || `${themeColors.accentColor}1A`, // 10% opacity
        padding: existing?.style?.padding || '0.5rem 1.25rem',
        borderRadius: existing?.style?.borderRadius || '4px',
        display: existing?.style?.display || 'inline-block',
        borderLeft: existing?.style?.borderLeft || `2px solid ${styles.borderColor || themeColors.accentColor}`
      }
    };
  };

  const getTitleElement = (): WebsiteElement => {
    const id = `${section.id}-about-title`;
    const existing = section.elements?.find(e => e.id === id);
    
    let titleText = existing?.content?.text || content.title || 'Reliable Plumbing Services Since 1998';
    let textBefore = existing?.content?.textBefore || '';
    let highlightedText = existing?.content?.highlightedText || existing?.content?.secondaryText || '';
    let textAfter = existing?.content?.textAfter || '';
    
    // If no multi-part fields exist and no manual span exists, try to extract the last word
    if (!highlightedText && !textBefore && !textAfter && !titleText.includes('<span')) {
      const words = titleText.trim().split(' ');
      if (words.length > 1) {
        highlightedText = words.pop() || '';
        textBefore = words.join(' ');
      }
    }

    return {
      ...(existing || {
        id,
        type: 'heading',
        content: { text: titleText, textBefore, highlightedText, textAfter, htmlTag: 'h2' },
      }),
      content: {
        ...(existing?.content || { htmlTag: 'h2' }),
        text: titleText,
        textBefore,
        highlightedText,
        textAfter
      },
      style: { 
        ...(existing?.style || {}),
        fontSize: existing?.style?.fontSize || 'text-4xl md:text-6xl', 
        fontWeight: existing?.style?.fontWeight || '900', 
        color: existing?.style?.color || themeColors.titleColor, 
        letterSpacing: existing?.style?.letterSpacing || '-0.02em', 
        lineHeight: existing?.style?.lineHeight || '1.1' 
      }
    };
  };

  const getDescElement = (): WebsiteElement => {
    const id = `${section.id}-about-desc`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'text',
        content: { text: content.subtitle || 'We are a family-owned plumbing business dedicated to providing top-quality service to our community. With over 25 years of experience, our licensed professionals handle everything from minor leaks to major installations with precision and care.', textSize: 'base' },
      }),
      style: { 
        ...(existing?.style || {}),
        color: existing?.style?.color || themeColors.textColor, 
        lineHeight: existing?.style?.lineHeight || '1.8', 
        fontSize: existing?.style?.fontSize || '1.125rem' 
      }
    };
  };

  const getFeature1Element = (): WebsiteElement => {
    const id = `${section.id}-about-f1`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'feature-box',
        content: { 
          icon: 'user-shield',
          text: 'Licensed & Insured',
          subText: 'Fully certified professionals you can trust in your home.'
        },
      }),
      style: { 
        ...(existing?.style || {}),
        backgroundColor: existing?.style?.backgroundColor || 'transparent',
        border: existing?.style?.border || 'none',
        padding: existing?.style?.padding || '0',
        titleFontSize: existing?.style?.titleFontSize || '0.9rem',
        descriptionFontSize: existing?.style?.descriptionFontSize || '0.75rem',
        titleColor: existing?.style?.titleColor || themeColors.titleColor,
        descriptionColor: existing?.style?.descriptionColor || themeColors.textColor,
        accentColor: existing?.style?.accentColor || themeColors.accentColor
      }
    };
  };

  const getFeature2Element = (): WebsiteElement => {
    const id = `${section.id}-about-f2`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'feature-box',
        content: { 
          icon: 'clock-rotate-left',
          text: '24/7 Emergency Service',
          subText: 'We\'re available day or night for your urgent plumbing needs.'
        },
      }),
      style: { 
        ...(existing?.style || {}),
        backgroundColor: existing?.style?.backgroundColor || 'transparent',
        border: existing?.style?.border || 'none',
        padding: existing?.style?.padding || '0',
        titleFontSize: existing?.style?.titleFontSize || '0.9rem',
        descriptionFontSize: existing?.style?.descriptionFontSize || '0.75rem',
        titleColor: existing?.style?.titleColor || themeColors.titleColor,
        descriptionColor: existing?.style?.descriptionColor || themeColors.textColor,
        accentColor: existing?.style?.accentColor || themeColors.accentColor
      }
    };
  };

  const getImageElement = (): WebsiteElement => {
    const id = `${section.id}-about-image`;
    if (section.elements?.find(e => e.id === id)) return section.elements.find(e => e.id === id)!;
    return {
      id,
      type: 'image',
      content: { imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', imageAlt: 'Our Team' },
      style: { borderRadius: '12px', aspectRatio: '4/5', objectFit: 'cover', filter: 'contrast(105%)' }
    };
  };

  const getExperienceElement = (): WebsiteElement => {
    const id = `${section.id}-about-exp`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'stat-card',
        content: { 
          value: '25+', 
          text: 'Years of Mastery',
          subText: 'Master Plumbers'
        },
      }),
      style: { 
        ...(existing?.style || {}),
        position: 'absolute', 
        bottom: '-3rem', 
        left: '-3rem', 
        width: '260px', 
        zIndex: 20,
        backgroundColor: existing?.style?.backgroundColor || themeColors.accentColor,
        color: existing?.style?.color || '#FFFFFF',
        borderColor: existing?.style?.borderColor || '#FFFFFF',
        borderWidth: existing?.style?.borderWidth || '2px',
        borderRadius: existing?.style?.borderRadius || '1rem',
        boxShadow: existing?.style?.boxShadow || `0 25px 50px -12px ${themeColors.accentColor}80`
      }
    };
  };

  const getFounderImageElement = (): WebsiteElement => {
    const id = `${section.id}-about-founder-img`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'image',
        content: { imageUrl: 'https://i.pravatar.cc/150?u=plumber', imageAlt: 'Founder' },
      }),
      style: { 
        ...(existing?.style || {}),
        width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${styles.borderColor || themeColors.accentColor}`, filter: 'grayscale(100%)', padding: '2px' 
      }
    };
  };

  const getFounderNameElement = (): WebsiteElement => {
    const id = `${section.id}-about-founder-name`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'text',
        content: { text: 'Johnathan Miller', textSize: 'large' },
      }),
      style: { 
        ...(existing?.style || {}),
        fontWeight: existing?.style?.fontWeight || '900', 
        color: existing?.style?.color || themeColors.titleColor, 
        letterSpacing: existing?.style?.letterSpacing || '-0.025em' 
      }
    };
  };

  const getFounderTitleElement = (): WebsiteElement => {
    const id = `${section.id}-about-founder-title`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'text',
        content: { text: 'Founder & Master Plumber', textSize: 'small' },
      }),
      style: { 
        ...(existing?.style || {}),
        color: existing?.style?.color || themeColors.accentColor, 
        textTransform: existing?.style?.textTransform || 'uppercase', 
        letterSpacing: existing?.style?.letterSpacing || '0.25em', 
        fontWeight: existing?.style?.fontWeight || '900', 
        fontSize: existing?.style?.fontSize || '10px' 
      }
    };
  };

  const getWrenchIconElement = (): WebsiteElement => {
    const id = `${section.id}-about-wrench`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'icon',
        content: { icon: 'wrench', iconSize: '1.25rem' },
      }),
      style: { 
        ...(existing?.style || {}),
        color: existing?.style?.color || '#FFFFFF',
        backgroundColor: existing?.style?.backgroundColor || themeColors.accentColor,
        padding: existing?.style?.padding || '0.75rem',
        borderRadius: existing?.style?.borderRadius || '8px',
        boxShadow: existing?.style?.boxShadow || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transform: existing?.style?.transform || 'rotate(12deg)'
      }
    };
  };

  const badgeElement = getBadgeElement();
  const titleElement = getTitleElement();
  const descElement = getDescElement();
  const f1Element = getFeature1Element();
  const f2Element = getFeature2Element();
  const imageElement = getImageElement();
  const expElement = getExperienceElement();
  const founderImageElement = getFounderImageElement();
  const founderNameElement = getFounderNameElement();
  const founderTitleElement = getFounderTitleElement();
  const wrenchElement = getWrenchIconElement();

  return (
    <div className="relative w-full py-24 lg:py-40 overflow-hidden" style={{ backgroundColor: styles.backgroundColor || (styles.themeMode === 'light' ? '#FFFFFF' : '#0B1720') }}>
      {/* Technical Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05]" style={{ backgroundImage: `radial-gradient(${styles.textColor || '#000000'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-50 to-transparent opacity-30"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full blur-[120px]" style={{ backgroundColor: `${themeColors.accentColor}1A` }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`space-y-12 order-2 lg:order-1 ${styles.textAlign === 'center' ? 'text-center flex flex-col items-center' : 'text-left'}`}
          >
            <div className={`space-y-8 w-full ${styles.textAlign === 'center' ? 'flex flex-col items-center' : ''}`}>
              <ElementsSection
                section={{ ...section, elements: [badgeElement] }}
                onTextEdit={onTextEdit}
                onElementUpdate={onElementUpdate || (() => {})}
                onElementSelect={onElementSelect}
                selectedElementId={selectedElementId}
                readOnly={readOnly}
                isWrapped={false}
                buttonClass={buttonClass}
                themeColors={themeColors}
              />
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

            {/* Features List */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 w-full`}>
              <ElementsSection
                section={{ ...section, elements: [f1Element] }}
                onTextEdit={onTextEdit}
                onElementUpdate={onElementUpdate || (() => {})}
                onElementSelect={onElementSelect}
                selectedElementId={selectedElementId}
                readOnly={readOnly}
                isWrapped={false}
                buttonClass={buttonClass}
                themeColors={themeColors}
              />
              <ElementsSection
                section={{ ...section, elements: [f2Element] }}
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
          </motion.div>

          {/* Right: Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative z-10 rounded-xl overflow-hidden border" style={{ borderColor: styles.borderColor || (styles.themeMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)') }}>
              <ElementsSection
                section={{ ...section, elements: [imageElement] }}
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
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-t-2 border-r-2 rounded-tr-3xl opacity-20" style={{ borderColor: styles.borderColor || themeColors.accentColor }}></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 border-b-2 border-l-2 rounded-bl-3xl opacity-20" style={{ borderColor: styles.borderColor || themeColors.accentColor }}></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
