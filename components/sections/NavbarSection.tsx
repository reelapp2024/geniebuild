
import React from 'react';
import { Section } from '../../types';
import { NavbarSimple } from './navbar/NavbarSimple';
import { NavbarCentered } from './navbar/NavbarCentered';
import { NavbarMinimal } from './navbar/NavbarMinimal';

interface NavbarSectionProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onLinkEdit: (index: number, value: string) => void;
  onLogoClick: () => void;
  buttonClass: string;
}

export const NavbarSection: React.FC<NavbarSectionProps> = (props) => {
  const variant = props.section.styles.variant || 'simple';

  switch (variant) {
    case 'centered':
        return <NavbarCentered {...props} />;
    case 'minimal':
        return <NavbarMinimal {...props} />;
    case 'simple':
    default:
        return <NavbarSimple {...props} />;
  }
};
