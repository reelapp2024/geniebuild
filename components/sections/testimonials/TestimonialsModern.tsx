import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';

interface TestimonialsProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
}

export const TestimonialsModern: React.FC<TestimonialsProps> = ({ 
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
  const titleId = `${section.id}-testimonials-title`;
  const subtitleId = `${section.id}-testimonials-subtitle`;
  const testimonialId = `${section.id}-testimonials-list`;
  const badgeId = `${section.id}-testimonials-badge`;
  const stat1Id = `${section.id}-testimonials-stat-1`;
  const stat2Id = `${section.id}-testimonials-stat-2`;
  const stat3Id = `${section.id}-testimonials-stat-3`;

  const getBadgeElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === badgeId);
    if (el) return el;
    return {
      id: badgeId,
      type: 'badge',
      content: { text: 'Social Proof' },
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
        text: content.title || 'What Our Customers Say',
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
        text: content.subtitle || 'Don\'t just take our word for it. Hear from our satisfied customers.',
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
  
  const getTestimonialElement = (): WebsiteElement => {
    const testimonialElement = section.elements?.find(e => e.id === testimonialId);
    if (testimonialElement) return testimonialElement;
    return {
      id: testimonialId,
      type: 'testimonial',
      content: {
        items: content.items?.map(item => ({
          title: item.title,
          content: item.description,
          author: item.author,
          role: item.role,
          avatar: item.avatar
        })) || [
          { author: 'Jane Cooper', role: 'CEO at TechFlow', content: 'This platform has completely transformed how we manage our projects. Highly recommended!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
          { author: 'John Smith', role: 'Founder of StartupX', content: 'The best investment we\'ve made this year. The support team is also fantastic.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
          { author: 'Sarah Jenkins', role: 'Marketing Director', content: 'Incredible results in such a short time. We\'ve seen a 40% increase in conversions.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' }
        ]
      },
      style: {
        backgroundColor: themeData?.surface || '#FFFFFF',
        borderColor: themeData?.overlay?.color || '#E5E7EB',
        borderRadius: '24px',
        color: themeData?.heading || '#000000',
        padding: '32px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    };
  };

  const getStat1Element = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === stat1Id);
    if (el) return el;
    return {
      id: stat1Id,
      type: 'stat-card',
      content: { text: 'Satisfaction Rate', value: '99%', subText: '' },
      style: { backgroundColor: 'transparent', border: 'none', padding: '0', textAlign: 'center' }
    };
  };

  const getStat2Element = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === stat2Id);
    if (el) return el;
    return {
      id: stat2Id,
      type: 'stat-card',
      content: { text: 'Active Users', value: '500k+', subText: '' },
      style: { backgroundColor: 'transparent', border: 'none', padding: '0', textAlign: 'center' }
    };
  };

  const getStat3Element = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === stat3Id);
    if (el) return el;
    return {
      id: stat3Id,
      type: 'stat-card',
      content: { text: 'Premium Support', value: '24/7', subText: '' },
      style: { backgroundColor: 'transparent', border: 'none', padding: '0', textAlign: 'center' }
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
  const testimonialElement = getTestimonialElement();
  const stat1Element = getStat1Element();
  const stat2Element = getStat2Element();
  const stat3Element = getStat3Element();
  
  return (
    <div className="relative w-full py-24 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
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
          
          <div className="relative">
            {/* Bento Grid Layout */}
            <ElementsSection
                section={{ ...section, elements: [testimonialElement] }}
                onTextEdit={onTextEdit}
                onElementUpdate={onElementUpdate || (() => {})}
                onElementSelect={onElementSelect}
                selectedElementId={selectedElementId}
                buttonClass={buttonClass}
                readOnly={readOnly}
                isWrapped={false}
                themeColors={{...themeColors, cardBackgroundColor: 'transparent', cardBorderColor: 'rgba(255, 255, 255, 0.1)', textColor: '#FFFFFF', titleColor: '#FFFFFF'}}
              />
            </div>
            
            {/* Decorative Stats Card */}
            <div className="mt-12 p-8 rounded-3xl border border-white/10 flex flex-wrap justify-center gap-12 md:gap-24">
              <ElementsSection
                section={{ ...section, elements: [stat1Element] }}
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
                section={{ ...section, elements: [stat2Element] }}
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
                section={{ ...section, elements: [stat3Element] }}
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
  );
};
