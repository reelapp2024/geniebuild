
import React from 'react';
import { Section } from '../../types';
import { FeaturesGrid } from './features/FeaturesGrid';
import { FeaturesList } from './features/FeaturesList';
import { FeaturesCards } from './features/FeaturesCards';

interface FeaturesSectionProps {
  section: Section;
  isSelected: boolean;
  onTextEdit: (key: any, value: string) => void;
  onItemEdit: (itemId: string, updates: any) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = (props) => {
  const variant = props.section.styles.variant || 'FeaturesGrid';

  switch (variant) {
    case 'FeaturesList':
      return <FeaturesList {...props} />;
    case 'FeaturesCards':
      return <FeaturesCards {...props} />;
    case 'FeaturesGrid':
    default:
      return <FeaturesGrid {...props} />;
  }
};
