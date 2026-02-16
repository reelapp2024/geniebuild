
import React from 'react';
import { Section } from '../../types';
import { PricingCards } from './pricing/PricingCards';
import { PricingMinimal } from './pricing/PricingMinimal';

interface PricingSectionProps {
  section: Section;
  isSelected: boolean;
  onTextEdit: (key: any, value: string) => void;
  onItemEdit: (itemId: string, updates: any) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  titleClass: string;
  titleStyle?: React.CSSProperties;
  buttonClass: string;
}

export const PricingSection: React.FC<PricingSectionProps> = (props) => {
  const variant = props.section.styles.variant || 'PricingCards';
  
  if (variant === 'PricingMinimal') {
      return <PricingMinimal {...props} />;
  }
  
  // Default uses Cards structure
  return <PricingCards {...props} />;
};
