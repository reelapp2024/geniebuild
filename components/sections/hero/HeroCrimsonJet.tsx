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
  const [isHovered, setIsHovered] = React.useState(false);
  
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
    { id: `${section.id}-btn1`, type: 'button', content: { text: content.ctaText || 'Get Started' }, style: { backgroundColor: theme.primaryButton, color: theme.primaryButtonText, borderRadius: '0.5rem', padding: '0.75rem 2rem' } },
    { id: `${section.id}-btn2`, type: 'button', content: { text: content.secondaryCtaText || 'Learn More' }, style: { backgroundColor: theme.secondaryButton, color: theme.secondaryButtonText, border: `2px solid ${theme.secondaryButtonBorder}`, borderRadius: '0.5rem', padding: '0.75rem 2rem' } }
  ] as WebsiteElement[];

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute -inset-4 bg-cover bg-center cursor-pointer z-0"
        style={{ backgroundImage: `url(${styles.backgroundImage || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'})` }}
        onClick={onImageClick}
      />
      <div className="absolute -inset-4 z-0" style={{ backgroundColor: theme.overlay }} />
      
      <div className="relative z-10 text-center max-w-4xl px-6 space-y-6">
        <h1 
          className="text-6xl font-extrabold" 
          style={{ color: theme.heading }}
          onClick={() => onElementSelect?.(elements[0].id, elements[0])}
        >
          {elements[0].content.text}
        </h1>
        <p 
          className="text-xl" 
          style={{ color: theme.description }}
          onClick={() => onElementSelect?.(elements[1].id, elements[1])}
        >
          {elements[1].content.text}
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <button 
            className="px-8 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: theme.primaryButton, color: theme.primaryButtonText }}
            onClick={() => onElementSelect?.(elements[2].id, elements[2])}
          >
            {elements[2].content.text}
          </button>
          <button 
            className="px-8 py-3 rounded-lg font-semibold transition-colors border-2"
            style={{ 
              backgroundColor: isHovered ? theme.secondaryButtonHover : theme.secondaryButton, 
              borderColor: theme.secondaryButtonBorder,
              color: theme.secondaryButtonText 
            }}
            onMouseEnter={() => {
              console.log('HeroCrimsonJet button style:', {
                bg: isHovered ? theme.secondaryButtonHover : theme.secondaryButton,
                border: `2px solid ${theme.secondaryButtonBorder}`,
                color: theme.secondaryButtonText
              });
              setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onElementSelect?.(elements[3].id, elements[3])}
          >
            {elements[3].content.text}
          </button>
        </div>
      </div>
    </div>
  );
};
