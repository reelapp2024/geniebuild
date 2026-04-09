import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';
import { PRESET_THEMES } from '../../../constants';
import { motion } from 'motion/react';

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

export const HeroPlumbing1: React.FC<HeroProps> = ({ 
  section, onTextEdit, onImageClick, buttonClass, onElementSelect, onElementUpdate, selectedElementId, readOnly = false,
  themeColors: fontThemeColors
}) => {
  const { themeData } = useTheme();
  const { content, styles } = section;
  
  const activeTheme = PRESET_THEMES.find(t => t.elements.surface.toLowerCase() === (themeData?.elements?.surface || themeData?.surface || '').toLowerCase()) || PRESET_THEMES[0];
  
  const styleAny = styles as any;
  
  const theme = React.useMemo(() => {
    const elements = themeData?.elements || themeData || activeTheme.elements;
    return {
      heading: styles.titleColor || elements.heading || (styles.themeMode === 'light' ? '#111827' : '#F8FAFC'),
      description: styles.textColor || elements.description || (styles.themeMode === 'light' ? '#4B5563' : '#C7CDD6'),
      primaryButton: styles.buttonBackgroundColor || elements.primaryButton?.bg || '#E11D48',
      primaryButtonText: styles.buttonTextColor || elements.primaryButton?.text || '#FFFFFF',
      secondaryButton: elements.secondaryButton?.bg || 'transparent',
      secondaryButtonText: elements.secondaryButton?.text || (styles.themeMode === 'light' ? (styles.buttonBackgroundColor || elements.primaryButton?.bg || '#E11D48') : '#F8FAFC'),
      secondaryButtonBorder: elements.secondaryButton?.border || styles.secondaryButtonBorderColor || styles.buttonBackgroundColor || elements.primaryButton?.bg || '#F43F5E',
      secondaryButtonHover: elements.secondaryButton?.hover || 'rgba(244,63,94,0.10)',
      overlay: styles.overlayColor || elements.overlay?.color || 'rgba(14, 18, 20, 0.75)',
      accent: elements.accent || '#F59E0B',
      secondaryHeadingColor: styleAny.secondaryHeadingColor || styles.buttonBackgroundColor || elements.primaryButton?.bg || elements.accent || '#F59E0B',
      badge: elements.badge || { text: '#F8FAFC', background: 'rgba(225,29,72,0.15)' },
      trust: elements.trust || { text: '#C7CDD6', dot1: '#22C55E', dot2: '#3B82F6', dot3: '#F59E0B' },
      ring: elements.ring || '#F43F5E',
      surface: styles.backgroundColor || elements.surface || (styles.themeMode === 'light' ? '#FFFFFF' : '#0E1214')
    };
  }, [themeData, activeTheme, styles, styleAny.secondaryHeadingColor]);

  const themeColors = {
    ...styles,
    titleColor: theme.heading,
    textColor: theme.description,
    subtitleColor: styles.subtitleColor || theme.description,
    buttonFontWeight: styleAny.buttonFontWeight || styleAny.fontWeight,
    buttonFontSize: styleAny.buttonSize || styleAny.buttonFontSize || styleAny.fontSize,
    buttonAlign: styleAny.buttonAlign || styles.textAlign,
    buttonFontFamily: styleAny.buttonFontFamily || styleAny.fontFamily || fontThemeColors?.buttonFontFamily,
    titleFontWeight: styleAny.titleFontWeight || styleAny.fontWeight || '800',
    titleFontSize: styleAny.titleSize || styleAny.fontSize,
    titleAlign: styleAny.titleAlign || (styles.textAlign === 'center' ? undefined : styles.textAlign),
    titleFontFamily: styleAny.titleFontFamily || styleAny.fontFamily || fontThemeColors?.titleFontFamily,
    subtitleFontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight,
    subtitleFontSize: styleAny.subtitleSize || styleAny.fontSize,
    subtitleAlign: styleAny.subtitleAlign || (styles.textAlign === 'center' ? undefined : styles.textAlign),
    subtitleFontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || fontThemeColors?.subtitleFontFamily,
    descriptionFontFamily:
      styleAny.descriptionFontFamily || styleAny.fontFamily || fontThemeColors?.descriptionFontFamily,
    fontWeight: styleAny.fontWeight,
    fontSize: styleAny.fontSize,
    textAlign: styles.textAlign === 'center' ? undefined : styles.textAlign,
    fontFamily: styleAny.fontFamily,
  };

  const getBadgeElement = (): WebsiteElement => {
    if (section.elements?.find(e => e.id === `${section.id}-badge`)) return section.elements.find(e => e.id === `${section.id}-badge`)!;
    return { 
      id: `${section.id}-badge`, 
      type: 'badge', 
      content: { 
        text: 'Licensed • Insured • 24/7 Emergency', 
        icon: 'shield-check'
      }, 
      style: { 
        color: theme.primaryButtonText, 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        letterSpacing: '0.15em',
        backgroundColor: theme.badge.background,
        padding: '0.6rem 1.2rem',
        borderRadius: '0.5rem',
        display: 'flex',
        width: 'fit-content',
        alignItems: 'center',
        gap: '0.6rem',
        boxShadow: `0 10px 15px -3px ${theme.primaryButton}4D`,
        fontSize: '0.7rem'
      } 
    };
  };

  const getTitleElement = (): WebsiteElement => {
    const id = `${section.id}-title`;
    const existing = section.elements?.find(e => e.id === id);
    let titleText = existing?.content?.text || content.title || 'Expert Plumbing Solutions for Your Home.';
    const isLight = styles.themeMode === 'light' || styles.backgroundColor === '#FFFFFF';
    
    // Ensure any existing span color matches the current accent color
    if (titleText.includes('<span')) {
      titleText = titleText.replace(/style\s*=\s*["']color:\s*[^"';]*["']/gi, `style="color: ${theme.secondaryHeadingColor}"`);
    } else if (isLight && titleText.includes(' ')) {
      // If it's light mode and no span exists, highlight the last word
      const words = titleText.split(' ');
      const lastWord = words.pop();
      titleText = `${words.join(' ')} <span style="color: ${theme.secondaryHeadingColor}">${lastWord}</span>`;
    }

    return { 
      ...(existing || { id, type: 'heading', content: { text: titleText, htmlTag: (styles.titleHeadingTag || 'h1') as any } }),
      content: {
        ...(existing?.content || {}),
        text: titleText,
        htmlTag: (styles.titleHeadingTag || 'h1') as any
      },
      style: { 
        ...(existing?.style || {}),
        fontSize: styles.titleSize || 'text-4xl md:text-5xl lg:text-6xl', 
        color: existing?.style?.color || theme.heading, 
        textAlign: 'inherit' as any 
      } 
    };
  };

  const getDescElement = (): WebsiteElement => {
    const id = `${section.id}-desc`;
    const existing = section.elements?.find(e => e.id === id);
    return { 
      ...(existing || { id, type: 'text', content: { text: content.subtitle || 'From leaky faucets to full pipe replacements, our licensed plumbers provide reliable, fast, and affordable service you can trust.', textSize: 'xl' } }),
      style: {
        ...(existing?.style || {}),
        color: existing?.style?.color || theme.description,
        textAlign: 'inherit' as any
      }
    };
  };

  const getBtn1Element = (): WebsiteElement => {
    const id = `${section.id}-btn1`;
    const existing = section.elements?.find(e => e.id === id);
    return { 
      ...(existing || { id, type: 'button', content: { text: content.ctaText || 'Get a Free Quote', link: content.ctaHref || '' } }),
      style: { 
        borderRadius: '0.375rem', 
        padding: '0.875rem 2.5rem', 
        backgroundColor: theme.primaryButton,
        color: theme.primaryButtonText,
        ...(existing?.style || {}),
      } 
    };
  };

  const getBtn2Element = (): WebsiteElement => {
    const id = `${section.id}-btn2`;
    const existing = section.elements?.find(e => e.id === id);
    return { 
      ...(existing || { id, type: 'button', content: { text: content.secondaryCtaText || 'View Services', link: '' } }),
      style: { 
        borderStyle: 'solid', 
        borderWidth: '2px', 
        borderRadius: '0.375rem', 
        padding: '0.875rem 2.5rem',
        borderColor: theme.secondaryButtonBorder,
        backgroundColor: theme.secondaryButton,
        color: theme.secondaryButtonText,
        ...(existing?.style || {}),
      } 
    };
  };

  const getHeroImageElement = (): WebsiteElement => {
    if (section.elements?.find(e => e.id === `${section.id}-hero-image`)) return section.elements.find(e => e.id === `${section.id}-hero-image`)!;
    return { id: `${section.id}-hero-image`, type: 'image', content: { imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', imageAlt: 'Plumbing Service' }, style: { borderRadius: '1rem', aspectRatio: '4/3', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } };
  };

  const getStat1NumElement = (): WebsiteElement => {
    const id = `${section.id}-stat1-num`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'heading',
        content: { text: '15+', htmlTag: 'h3' },
      }),
      style: { 
        ...(existing?.style || {}),
        fontSize: existing?.style?.fontSize || '1.5rem', 
        fontWeight: existing?.style?.fontWeight || '800', 
        color: existing?.style?.color || theme.heading, 
        textAlign: 'inherit' as any 
      }
    };
  };

  const getStat1LabelElement = (): WebsiteElement => {
    const id = `${section.id}-stat1-label`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'text',
        content: { text: 'Years Experience', textSize: 'small' },
      }),
      style: { 
        ...(existing?.style || {}),
        color: existing?.style?.color || theme.description, 
        fontWeight: existing?.style?.fontWeight || '600', 
        textTransform: existing?.style?.textTransform || 'capitalize', 
        letterSpacing: existing?.style?.letterSpacing || '0.1em', 
        fontSize: existing?.style?.fontSize || '0.65rem', 
        textAlign: 'inherit' as any 
      }
    };
  };

  const getStat2NumElement = (): WebsiteElement => {
    const id = `${section.id}-stat2-num`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'heading',
        content: { text: '5000+', htmlTag: 'h3' },
      }),
      style: { 
        ...(existing?.style || {}),
        fontSize: existing?.style?.fontSize || '1.5rem', 
        fontWeight: existing?.style?.fontWeight || '800', 
        color: existing?.style?.color || theme.heading, 
        textAlign: 'inherit' as any 
      }
    };
  };

  const getStat2LabelElement = (): WebsiteElement => {
    const id = `${section.id}-stat2-label`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'text',
        content: { text: 'Happy Clients', textSize: 'small' },
      }),
      style: { 
        ...(existing?.style || {}),
        color: existing?.style?.color || theme.description, 
        fontWeight: existing?.style?.fontWeight || '600', 
        textTransform: existing?.style?.textTransform || 'capitalize', 
        letterSpacing: existing?.style?.letterSpacing || '0.1em', 
        fontSize: existing?.style?.fontSize || '0.65rem', 
        textAlign: 'inherit' as any 
      }
    };
  };

  const getStat3NumElement = (): WebsiteElement => {
    const id = `${section.id}-stat3-num`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'heading',
        content: { text: '4.9/5', htmlTag: 'h3' },
      }),
      style: { 
        ...(existing?.style || {}),
        fontSize: existing?.style?.fontSize || '1.5rem', 
        fontWeight: existing?.style?.fontWeight || '800', 
        color: existing?.style?.color || theme.heading, 
        textAlign: 'inherit' as any 
      }
    };
  };

  const getStat3LabelElement = (): WebsiteElement => {
    const id = `${section.id}-stat3-label`;
    const existing = section.elements?.find(e => e.id === id);
    return {
      ...(existing || {
        id,
        type: 'text',
        content: { text: 'Customer Rating', textSize: 'small' },
      }),
      style: { 
        ...(existing?.style || {}),
        color: existing?.style?.color || theme.description, 
        fontWeight: existing?.style?.fontWeight || '600', 
        textTransform: existing?.style?.textTransform || 'capitalize', 
        letterSpacing: existing?.style?.letterSpacing || '0.1em', 
        fontSize: existing?.style?.fontSize || '0.65rem', 
        textAlign: 'inherit' as any 
      }
    };
  };

  const badgeElement = getBadgeElement();
  const titleElement = getTitleElement();
  const descElement = getDescElement();
  const btn1Element = getBtn1Element();
  const btn2Element = getBtn2Element();
  const heroImageElement = getHeroImageElement();
  const stat1NumElement = getStat1NumElement();
  const stat1LabelElement = getStat1LabelElement();
  const stat2NumElement = getStat2NumElement();
  const stat2LabelElement = getStat2LabelElement();
  const stat3NumElement = getStat3NumElement();
  const stat3LabelElement = getStat3LabelElement();

  const renderPattern = () => {
    const pattern = styles.backgroundPattern || 'blueprint';
    
    switch (pattern) {
      case 'dots-grid':
        return (
          <>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${theme.heading} 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(${theme.heading} 1px, transparent 1px), linear-gradient(90deg, ${theme.heading} 1px, transparent 1px)`, backgroundSize: '100px 100px' }}></div>
          </>
        );
      case 'diagonal-lines':
        return (
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${theme.heading}, ${theme.heading} 1px, transparent 1px, transparent 20px)` }}></div>
        );
      case 'plus-signs':
        return (
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${theme.heading} 2px, transparent 2px), radial-gradient(${theme.heading} 2px, transparent 2px)`, backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
              <defs>
                <pattern id="plus" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 20 10 L 20 30 M 10 20 L 30 20" stroke={theme.heading} strokeWidth="1" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#plus)" />
            </svg>
          </div>
        );
      case 'circuit':
        return (
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${theme.heading} 1px, transparent 0)`, backgroundSize: '24px 24px' }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
              <defs>
                <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z M 30 30 L 70 30 L 70 70 L 30 70 Z" stroke={theme.heading} strokeWidth="0.5" fill="none" />
                  <circle cx="10" cy="10" r="2" fill={theme.heading} />
                  <circle cx="90" cy="10" r="2" fill={theme.heading} />
                  <circle cx="90" cy="90" r="2" fill={theme.heading} />
                  <circle cx="10" cy="90" r="2" fill={theme.heading} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)" />
            </svg>
          </div>
        );
      case 'topography':
        return (
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 10 Q 25 0 50 10 T 100 10 M0 30 Q 25 20 50 30 T 100 30 M0 50 Q 25 40 50 50 T 100 50 M0 70 Q 25 60 50 70 T 100 70 M0 90 Q 25 80 50 90 T 100 90' stroke='${encodeURIComponent(theme.heading)}' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }}></div>
        );
      case 'honeycomb':
        return (
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l11-6.35 11 6.35v12.7l-11 6.35-11-6.35V17.9z' fill='${encodeURIComponent(theme.heading)}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '56px 98px' }}></div>
        );
      case 'polka-dots':
        return (
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(${theme.heading} 2px, transparent 2px)`, backgroundSize: '20px 20px' }}></div>
        );
      case 'zig-zag':
        return (
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40 L20 20 L40 40' stroke='${encodeURIComponent(theme.heading)}' fill='none' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }}></div>
        );
      case 'blueprint':
        return (
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${theme.heading} 1px, transparent 1px), linear-gradient(90deg, ${theme.heading} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${theme.heading} 2px, transparent 2px), linear-gradient(90deg, ${theme.heading} 2px, transparent 2px)`, backgroundSize: '100px 100px' }}></div>
          </div>
        );
      case 'sparkles':
        return (
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0 L42 38 L80 40 L42 42 L40 80 L38 42 L0 40 L38 38 Z' fill='${encodeURIComponent(theme.heading)}'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px', backgroundPosition: 'center' }}></div>
        );
      case 'water-ripple':
        return (
          <div className="absolute inset-0 opacity-[0.08]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ripple" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="40" stroke={theme.heading} strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="30" stroke={theme.heading} strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="20" stroke={theme.heading} strokeWidth="0.5" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ripple)" />
            </svg>
          </div>
        );
      case 'none':
      default:
        return null;
    }
  };

  const renderBackgroundEffects = () => {
    const enableShapes = styles.enableBackgroundShapes ?? false;
    if (!enableShapes) return null;

    const shapeType = styles.backgroundShapeType || 'blobs';
    const isAnimated = styles.enableBackgroundAnimation ?? true;
    const speed = styles.backgroundAnimationSpeed || 'normal';
    const duration = speed === 'slow' ? 25 : speed === 'fast' ? 8 : 15;

    if (shapeType === 'circles') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-[10%] -left-[10%] w-[40%] aspect-square rounded-full opacity-20 blur-[100px]"
            style={{ background: `radial-gradient(circle, ${theme.primaryButton} 0%, ${theme.primaryButton}80 50%, transparent 100%)` }}
            animate={isAnimated ? {
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: duration, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[20%] -right-[15%] w-[50%] aspect-square rounded-full opacity-15 blur-[120px]"
            style={{ background: `radial-gradient(circle, ${theme.accent} 0%, ${theme.accent}80 50%, transparent 100%)` }}
            animate={isAnimated ? {
              x: [0, -60, 0],
              y: [0, 80, 0],
              scale: [1, 1.2, 1],
            } : {}}
            transition={{ duration: duration * 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-[15%] left-[20%] w-[35%] aspect-square rounded-full opacity-10 blur-[80px]"
            style={{ background: `radial-gradient(circle, ${theme.ring} 0%, ${theme.ring}80 50%, transparent 100%)` }}
            animate={isAnimated ? {
              x: [0, 40, 0],
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
            } : {}}
            transition={{ duration: duration * 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      );
    }

    if (shapeType === 'blobs') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[-15%] right-[-10%] w-[60%] aspect-square opacity-20 blur-[100px]"
            style={{ 
              background: `linear-gradient(135deg, ${theme.primaryButton} 0%, ${theme.accent} 100%)`,
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' 
            }}
            animate={isAnimated ? {
              borderRadius: [
                '60% 40% 30% 70% / 60% 30% 70% 40%',
                '30% 60% 70% 30% / 50% 60% 30% 60%',
                '60% 40% 30% 70% / 60% 30% 70% 40%'
              ],
              rotate: [0, 45, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ duration: duration * 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-20%] left-[-15%] w-[50%] aspect-square opacity-15 blur-[100px]"
            style={{ 
              background: `linear-gradient(225deg, ${theme.accent} 0%, ${theme.primaryButton} 100%)`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' 
            }}
            animate={isAnimated ? {
              borderRadius: [
                '30% 70% 70% 30% / 30% 30% 70% 70%',
                '70% 30% 30% 70% / 60% 70% 30% 40%',
                '30% 70% 70% 30% / 30% 30% 70% 70%'
              ],
              rotate: [0, -30, 0],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: duration * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      );
    }

    if (shapeType === 'geometric') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.08]">
            <motion.div
              className="absolute top-[15%] left-[15%] w-[15%] aspect-square border rounded-2xl"
              style={{ borderColor: `${theme.primaryButton}66` }}
              animate={isAnimated ? { rotate: 360, x: [0, 30, 0], y: [0, 20, 0] } : {}}
              transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-[45%] right-[20%] w-[20%] aspect-square border rounded-full"
              style={{ borderColor: `${theme.accent}66` }}
              animate={isAnimated ? { scale: [1, 1.15, 1], x: [0, -30, 0] } : {}}
              transition={{ duration: duration * 1.3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[25%] left-[25%] w-[10%] aspect-square border rotate-45"
              style={{ borderColor: `${theme.ring}66` }}
              animate={isAnimated ? { rotate: -360, scale: [1, 1.1, 1] } : {}}
              transition={{ duration: duration * 1.7, repeat: Infinity, ease: "linear" }}
            />
            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ 
                  top: `${15 + Math.random() * 70}%`, 
                  left: `${10 + Math.random() * 80}%`,
                  backgroundColor: `${theme.heading}4D` // white/30 equivalent if heading is white
                }}
                animate={isAnimated ? {
                  y: [0, -80, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0]
                } : {}}
                transition={{ 
                  duration: duration * (0.6 + Math.random() * 0.4), 
                  repeat: Infinity, 
                  delay: i * 0.4,
                  ease: "easeInOut" 
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderDivider = (position: 'top' | 'bottom') => {
    const shape = position === 'top' ? styles.topDividerShape : styles.bottomDividerShape;
    const height = (position === 'top' ? styles.topDividerHeight : styles.bottomDividerHeight) || 100;
    const color = (position === 'top' ? styles.topDividerColor : styles.bottomDividerColor) || 'currentColor';
    
    if (!shape || shape === 'none') return null;

    const isTop = position === 'top';
    const containerClasses = `absolute left-0 right-0 z-20 pointer-events-none ${isTop ? 'top-0' : 'bottom-0'}`;
    const svgClasses = `w-full block ${isTop ? '' : 'rotate-180'}`;

    return (
      <div className={containerClasses} style={{ height: `${height}px` }}>
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className={svgClasses}
          style={{ height: '100%', fill: color }}
        >
          {shape === 'slant' && <path d="M1200 120L0 120L0 0Z" />}
          {shape === 'curve' && <path d="M0 0 C 400 120 800 120 1200 0 L 1200 120 L 0 120 Z" />}
          {shape === 'wave' && <path d="M0 0 C 300 120 600 -120 1200 0 L 1200 120 L 0 120 Z" />}
          {shape === 'triangle' && <path d="M600 0 L 1200 120 L 0 120 Z" />}
        </svg>
      </div>
    );
  };

  return (
    <div 
      className="relative w-full flex items-center overflow-hidden" 
      style={{ 
        backgroundColor: theme.surface,
        borderColor: styles.borderColor,
        borderWidth: styles.borderWidth,
        borderStyle: styles.borderStyle,
        borderRadius: styles.borderRadius
      }}
    >
      {renderDivider('top')}
      {/* Background Pattern */}
      {renderPattern()}
      {renderBackgroundEffects()}
      
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <div className="space-y-6 w-full flex flex-col items-center lg:items-start">
              <div className="flex justify-center lg:justify-start w-full">
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
              </div>

              <div className="w-full">
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

              <div className="w-full">
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
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4 w-full">
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
                  themeColors={{ ...themeColors, buttonBackgroundColor: theme.primaryButton, buttonTextColor: theme.primaryButtonText, buttonBorderColor: styles.borderColor || theme.primaryButton }}
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

            {/* Trust Badges / Stats */}
            <div className="pt-12 border-t w-full" style={{ borderColor: `${theme.description}1A` }}>
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                {/* Stat 1 */}
                <div className="flex flex-col items-center lg:items-start">
                  <ElementsSection
                    section={{ ...section, elements: [stat1NumElement] }}
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
                    section={{ ...section, elements: [stat1LabelElement] }}
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

                {/* Stat 2 */}
                <div className="flex flex-col items-center lg:items-start">
                  <ElementsSection
                    section={{ ...section, elements: [stat2NumElement] }}
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
                    section={{ ...section, elements: [stat2LabelElement] }}
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

                {/* Stat 3 */}
                <div className="flex flex-col items-center lg:items-start">
                  <ElementsSection
                    section={{ ...section, elements: [stat3NumElement] }}
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
                    section={{ ...section, elements: [stat3LabelElement] }}
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
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative background element */}
            {(styles.enableBackgroundShapes ?? false) && (
              <>
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: `${theme.primaryButton}33` }}></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: `${theme.accent}1A` }}></div>
              </>
            )}
            
            <div className="relative z-10">
              <ElementsSection
                section={{ ...section, elements: [heroImageElement] }}
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
        </div>
      </div>
      {renderDivider('bottom')}
    </div>
  );
};
