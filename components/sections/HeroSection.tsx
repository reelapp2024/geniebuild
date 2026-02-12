
import React from 'react';
import { Section } from '../../types';
import { HeroCenter } from './hero/HeroCenter';
import { HeroSplitRight } from './hero/HeroSplitRight';
import { HeroSplitLeft } from './hero/HeroSplitLeft';

interface HeroSectionProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
}

export const HeroSection: React.FC<HeroSectionProps> = (props) => {
  const variant = props.section.styles.variant || 'center';

  switch (variant) {
    case 'split-right':
      return <HeroSplitRight {...props} />;
    case 'split-left':
      return <HeroSplitLeft {...props} />;
    case 'center':
    default:
      return <HeroCenter {...props} />;
  }
};
