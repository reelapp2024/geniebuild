
import React from 'react';
import { Section } from '../../types';
import { FooterColumns } from './footer/FooterColumns';
import { FooterCentered } from './footer/FooterCentered';
import { FooterMinimal } from './footer/FooterMinimal';
import { FooterApi } from './footer/FooterApi';

interface FooterSectionProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onLinkEdit: (index: number, value: string) => void;
  onLogoClick: () => void;
  buttonClass: string;
  readOnly?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = (props) => {
  const variant = props.section.styles.variant || 'FooterColumns';

  switch (variant) {
    case 'FooterApi':
        return <FooterApi section={props.section} readOnly={props.readOnly} />;
    case 'FooterMinimal':
        return <FooterMinimal {...props} />;
    case 'FooterCentered':
        return <FooterCentered {...props} />;
    case 'FooterColumns':
    default:
        return <FooterColumns {...props} />;
  }
};
