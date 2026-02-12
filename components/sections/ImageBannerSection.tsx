
import React from 'react';
import { Section } from '../../types';

// Ideally these would be in components/sections/image-banner/
// But for this change block I will include the logic in separate components defined here or imported.
// Let's create the separate files to remain consistent with the "no code in one file" request.
import { BannerCenter } from './image-banner/BannerCenter';
import { BannerBottomLeft } from './image-banner/BannerBottomLeft';
import { BannerSplit } from './image-banner/BannerSplit';

interface ImageBannerSectionProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  buttonClass: string;
  titleClass: string;
  titleStyle?: React.CSSProperties;
}

export const ImageBannerSection: React.FC<ImageBannerSectionProps> = (props) => {
  const variant = props.section.styles.variant || 'center';

  switch (variant) {
    case 'bottom-left':
        return <BannerBottomLeft {...props} />;
    case 'split':
        return <BannerSplit {...props} />;
    case 'center':
    default:
        return <BannerCenter {...props} />;
  }
};
