
import React from 'react';
import { Section } from '../../types';
import { FooterColumns } from './footer/FooterColumns';
import { FooterCentered } from './footer/FooterCentered';
import { FooterMinimal } from './footer/FooterMinimal';

interface FooterSectionProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onLinkEdit: (index: number, value: string) => void;
  onLogoClick: () => void;
  buttonClass: string;
}

export const FooterSection: React.FC<FooterSectionProps> = (props) => {
  const variant = props.section.styles.variant || 'columns';

  switch (variant) {
    case 'minimal':
        return <FooterMinimal {...props} />;
    case 'centered':
        return <FooterCentered {...props} />;
    case 'columns':
    default:
        return <FooterColumns {...props} />;
  }
};
