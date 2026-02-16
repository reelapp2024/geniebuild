
import React from 'react';
import { Section } from '../../types';
import { NavbarSimple } from './navbar/NavbarSimple';
import { NavbarCentered } from './navbar/NavbarCentered';
import { NavbarMinimal } from './navbar/NavbarMinimal';
import { NavbarApi } from './navbar/NavbarApi';

interface NavbarSectionProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onLinkEdit: (index: number, value: string) => void;
  onLogoClick: () => void;
  buttonClass: string;
  readOnly?: boolean;
}

export const NavbarSection: React.FC<NavbarSectionProps> = (props) => {
  const variant = props.section.styles.variant || 'NavbarSimple';

  switch (variant) {
    case 'NavbarApi':
        return <NavbarApi section={props.section} readOnly={props.readOnly} />;
    case 'NavbarCentered':
        return <NavbarCentered {...props} />;
    case 'NavbarMinimal':
        return <NavbarMinimal {...props} />;
    case 'NavbarSimple':
    default:
        return <NavbarSimple {...props} />;
  }
};
