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
}

export const HeroCrimsonJet: React.FC<HeroProps> = ({ 
  section, onTextEdit, onImageClick, buttonClass, onElementSelect, onElementUpdate, selectedElementId, readOnly = false 
}) => {
  const { themeData } = useTheme();
  const { content, styles } = section;
  
  React.useEffect(() => {
    console.log('HeroCrimsonJet themeData changed:', themeData);
  }, [themeData]);
  
  const activeTheme = PRESET_THEMES.find(t => t.elements.surface.toLowerCase() === themeData?.surface?.toLowerCase());
  
  // Combine themeData and activeTheme to ensure we get the full secondaryButton object
  const secondaryButton = {
    bg: themeData?.elements?.secondaryButton?.bg || activeTheme?.elements?.secondaryButton?.bg || 'transparent',
    text: themeData?.elements?.secondaryButton?.text || activeTheme?.elements?.secondaryButton?.text || '#F8FAFC',
    border: themeData?.elements?.secondaryButton?.border || activeTheme?.elements?.secondaryButton?.border || '#F43F5E',
    hover: themeData?.elements?.secondaryButton?.hover || activeTheme?.elements?.secondaryButton?.hover || '#F43F5E'
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

  React.useEffect(() => {
    console.log('HeroCrimsonJet themeData:', themeData);
    console.log('HeroCrimsonJet theme:', theme);
  }, [themeData, theme]);

  const elements = [
    { id: `${section.id}-title`, type: 'heading', content: { text: content.title || 'Experience the Power of Crimson Jet.', htmlTag: 'h1' }, style: { color: theme.heading, fontSize: '4rem', fontWeight: '800' } },
    { id: `${section.id}-desc`, type: 'text', content: { text: content.subtitle || 'Unleash performance with our latest technology. Designed for speed, built for excellence.' }, style: { color: theme.description, fontSize: '1.25rem' } },
    { id: `${section.id}-btn1`, type: 'button', content: { text: content.ctaText || 'Get Started', link: content.ctaHref || '' }, style: { backgroundColor: theme.primaryButton, color: theme.primaryButtonText, borderRadius: '0.5rem', padding: '0.75rem 2rem' } },
    { id: `${section.id}-btn2`, type: 'button', content: { text: content.secondaryCtaText || 'Learn More', link: '' }, style: { backgroundColor: theme.secondaryButton, color: theme.secondaryButtonText, borderStyle: 'solid', borderWidth: '2px', borderColor: theme.secondaryButtonBorder, borderRadius: '0.5rem', padding: '0.75rem 2rem' } }
  ] as WebsiteElement[];

  const titleElement = section.elements?.find(e => e.id === `${section.id}-title`) || elements[0];
  const descElement = section.elements?.find(e => e.id === `${section.id}-desc`) || elements[1];
  const btn1Element = section.elements?.find(e => e.id === `${section.id}-btn1`) || elements[2];
  const btn2Element = section.elements?.find(e => e.id === `${section.id}-btn2`) || elements[3];

  const themeColors = { ...styles, titleColor: theme.heading, textColor: theme.description };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      <div className="relative z-10 text-center max-w-4xl px-6 space-y-6 w-full">
        <div className="mx-auto max-w-3xl">
          <ElementsSection section={{ ...section, elements: [titleElement] }} onTextEdit={onTextEdit} onElementUpdate={onElementUpdate || (() => {})} onElementSelect={onElementSelect} selectedElementId={selectedElementId} readOnly={readOnly} isWrapped={false} themeColors={themeColors} />
        </div>
        <div className="mx-auto max-w-2xl">
          <ElementsSection section={{ ...section, elements: [descElement] }} onTextEdit={onTextEdit} onElementUpdate={onElementUpdate || (() => {})} onElementSelect={onElementSelect} selectedElementId={selectedElementId} readOnly={readOnly} isWrapped={false} themeColors={themeColors} />
        </div>
        
        <div className="flex gap-4 justify-center pt-4">
          <div className="inline-block">
            <ElementsSection section={{ ...section, elements: [btn1Element] }} onTextEdit={onTextEdit} onElementUpdate={onElementUpdate || (() => {})} onElementSelect={onElementSelect} selectedElementId={selectedElementId} readOnly={readOnly} isWrapped={false} themeColors={{ ...themeColors, buttonBackgroundColor: theme.primaryButton, buttonTextColor: theme.primaryButtonText }} />
          </div>
          <div className="inline-block">
            <ElementsSection section={{ ...section, elements: [btn2Element] }} onTextEdit={onTextEdit} onElementUpdate={onElementUpdate || (() => {})} onElementSelect={onElementSelect} selectedElementId={selectedElementId} readOnly={readOnly} isWrapped={false} themeColors={{ ...themeColors, buttonBackgroundColor: theme.secondaryButton, buttonTextColor: theme.secondaryButtonText }} />
          </div>
        </div>
      </div>
    </div>
  );
};
