import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';

interface FAQProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
}

export const FAQModern: React.FC<FAQProps> = ({ 
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
  const titleId = `${section.id}-faq-title`;
  const subtitleId = `${section.id}-faq-subtitle`;
  const accordionId = `${section.id}-faq-accordion`;
  const badgeId = `${section.id}-faq-badge`;
  const contactIconId = `${section.id}-faq-contact-icon`;
  const contactTitleId = `${section.id}-faq-contact-title`;
  const contactSubtitleId = `${section.id}-faq-contact-subtitle`;
  const contactButtonId = `${section.id}-faq-contact-button`;

  const getBadgeElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === badgeId);
    if (el) return el;
    return {
      id: badgeId,
      type: 'badge',
      content: { text: 'Support Center' },
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'rgba(255, 255, 255, 0.4)',
        padding: '6px',
        borderRadius: '9999px',
        fontSize: '10px',
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
        text: content.title || 'Frequently Asked Questions',
        htmlTag: 'h2'
      },
      style: {
        color: styles.titleColor || themeData?.heading || '',
        fontSize: '2.5rem',
        fontWeight: '800',
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
        text: content.subtitle || 'Everything you need to know about our product and service.',
        textSize: 'large'
      },
      style: {
        color: styles.subtitleColor || styles.textColor || themeData?.description || '',
        textAlign: 'center',
        opacity: 0.8,
        maxWidth: '600px',
        margin: '0 auto'
      }
    };
  };
  
  const getAccordionElement = (): WebsiteElement => {
    const accordionElement = section.elements?.find(e => e.id === accordionId);
    if (accordionElement) return accordionElement;
    return {
      id: accordionId,
      type: 'accordion',
      content: {
        items: content.items?.map(item => ({
          title: item.title,
          content: item.description
        })) || [
          { title: 'How do I get started?', content: 'You can get started by clicking the "Get Started" button in the hero section.' },
          { title: 'What are the pricing plans?', content: 'We offer various pricing plans to suit your needs, from basic to enterprise.' },
          { title: 'Can I cancel my subscription?', content: 'Yes, you can cancel your subscription at any time from your account settings.' }
        ]
      },
      style: {
        backgroundColor: 'transparent',
        borderColor: themeData?.overlay?.color || '#E5E7EB',
        borderRadius: '12px',
        color: themeData?.heading || '#000000'
      }
    };
  };

  const getContactIconElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === contactIconId);
    if (el) return el;
    return {
      id: contactIconId,
      type: 'icon',
      content: { icon: 'headset' },
      style: {
        color: '#FFFFFF',
        fontSize: '20px'
      }
    };
  };

  const getContactTitleElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === contactTitleId);
    if (el) return el;
    return {
      id: contactTitleId,
      type: 'text',
      content: { text: 'Still have questions?' },
      style: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'left'
      }
    };
  };

  const getContactSubtitleElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === contactSubtitleId);
    if (el) return el;
    return {
      id: contactSubtitleId,
      type: 'text',
      content: { text: 'Our team is here to help you 24/7.' },
      style: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'left'
      }
    };
  };

  const getContactButtonElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === contactButtonId);
    if (el) return el;
    return {
      id: contactButtonId,
      type: 'button',
      content: { text: 'Contact Support', link: '#' },
      style: {
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '14px'
      }
    };
  };

  const styleAny = styles as any;
  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || themeData?.heading,
    textColor: styles.textColor || themeData?.description,
    accentColor: styles.accentColor || themeData?.accent,
    cardBackgroundColor: styles.cardBackgroundColor || themeData?.surface || '#FFFFFF',
    cardBorderColor: styles.cardBorderColor || themeData?.overlay?.color || '#E5E7EB',
  };
  
  const badgeElement = getBadgeElement();
  const titleElement = getTitleElement();
  const subtitleElement = getSubtitleElement();
  const accordionElement = getAccordionElement();
  const contactIconElement = getContactIconElement();
  const contactTitleElement = getContactTitleElement();
  const contactSubtitleElement = getContactSubtitleElement();
  const contactButtonElement = getContactButtonElement();
  
  return (
    <div className="relative w-full py-24 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 blur-[120px] pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-500"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-purple-500"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
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
          
          <div className="relative rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
            <ElementsSection
              section={{ ...section, elements: [accordionElement] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              buttonClass={buttonClass}
              readOnly={readOnly}
              isWrapped={false}
              themeColors={{...themeColors, textColor: '#FFFFFF', titleColor: '#FFFFFF'}}
            />
            
            {/* Contact Support CTA */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <ElementsSection
                    section={{ ...section, elements: [contactIconElement] }}
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
                <div className="text-left">
                  <ElementsSection
                    section={{ ...section, elements: [contactTitleElement] }}
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
                    section={{ ...section, elements: [contactSubtitleElement] }}
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
              <ElementsSection
                section={{ ...section, elements: [contactButtonElement] }}
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
