
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
  const variant = props.section.styles.variant || 'grid';

  switch (variant) {
    case 'list':
      return <FeaturesList {...props} />;
    case 'cards-minimal':
      return <FeaturesCards {...props} />;
    case 'grid':
    default:
      return <FeaturesGrid {...props} />;
  }
};
