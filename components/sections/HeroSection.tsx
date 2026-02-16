
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
  const variant = props.section.styles.variant || 'HeroCenter';

  switch (variant) {
    case 'HeroSplitRight':
      return <HeroSplitRight {...props} />;
    case 'HeroSplitLeft':
      return <HeroSplitLeft {...props} />;
    case 'HeroCenter':
    default:
      return <HeroCenter {...props} />;
  }
};
