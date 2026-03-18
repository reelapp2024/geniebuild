import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';

interface CTAProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
}

export const CTAModern: React.FC<CTAProps> = ({ 
  section, 
  onTextEdit, 
  buttonClass, 
  onElementSelect, 
  onElementUpdate, 
  selectedElementId, 
  readOnly = false 
}) => {
  const { content, styles } = section;
  const { themeData } = useTheme();
  
  // Element IDs
  const titleId = `${section.id}-cta-title`;
  const subtitleId = `${section.id}-cta-subtitle`;
  const buttonId = `${section.id}-cta-button`;
  const badgeId = `${section.id}-cta-badge`;
  const secondaryButtonId = `${section.id}-cta-secondary-button`;
  const footerTextId = `${section.id}-cta-footer-text`;

  const getBadgeElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === badgeId);
    if (el) return el;
    return {
      id: badgeId,
      type: 'badge',
      content: { text: 'Limited Time Offer' },
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.8)',
        padding: '6px 16px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        border: '1px solid rgba(255, 255, 255, 0.1)'
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
        text: content.title || 'Ready to transform your business?',
        htmlTag: 'h2'
      },
      style: {
        color: '#FFFFFF',
        fontSize: '3rem',
        fontWeight: '800',
        lineHeight: '1.2',
        textAlign: 'center'
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
        text: content.subtitle || 'Join thousands of satisfied customers who are already using our platform to grow their business.',
        textSize: 'large'
      },
      style: {
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 0.9,
        maxWidth: '800px',
        margin: '0 auto'
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
        text: content.ctaText || 'Get Started Now',
        link: content.ctaHref || '#'
      },
      style: {
        backgroundColor: '#FFFFFF',
        color: themeData?.primaryButton?.bg || '#000000',
        padding: '16px 40px',
        borderRadius: '9999px',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: '1.125rem'
      }
    };
  };

  const getSecondaryButtonElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === secondaryButtonId);
    if (el) return el;
    return {
      id: secondaryButtonId,
      type: 'button',
      content: {
        text: 'Learn more about our process',
        link: '#'
      },
      style: {
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '700',
        fontSize: '14px',
        textAlign: 'center'
      }
    };
  };

  const getFooterTextElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === footerTextId);
    if (el) return el;
    return {
      id: footerTextId,
      type: 'text',
      content: { text: 'No credit card required. Cancel anytime.' },
      style: {
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.3)',
        fontWeight: '500',
        textAlign: 'center'
      }
    };
  };

  const styleAny = styles as any;
  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || '#FFFFFF',
    textColor: styles.textColor || '#FFFFFF',
    accentColor: styles.accentColor || themeData?.accent,
    buttonBackgroundColor: styles.buttonBackgroundColor || '#FFFFFF',
    buttonTextColor: styles.buttonTextColor || themeData?.primaryButton?.bg || '#000000',
  };
  
  const badgeElement = getBadgeElement();
  const titleElement = getTitleElement();
  const subtitleElement = getSubtitleElement();
  const buttonElement = getButtonElement();
  const secondaryButtonElement = getSecondaryButtonElement();
  const footerTextElement = getFooterTextElement();
  
  return (
    <div className="relative w-full py-24 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 opacity-40 blur-[100px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${themeData?.accent || '#3B82F6'} 0%, transparent 50%), 
                      radial-gradient(circle at 80% 70%, ${themeData?.primaryButton?.bg || '#F43F5E'} 0%, transparent 50%)`
        }}
      ></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 p-12 md:p-20 text-center shadow-2xl">
            {/* Decorative inner glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-8 flex flex-col items-center">
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
                  themeColors={{...themeColors, titleFontSize: '5xl', titleFontWeight: '900'}}
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
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
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
              
              <ElementsSection
                section={{ ...section, elements: [footerTextElement] }}
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
