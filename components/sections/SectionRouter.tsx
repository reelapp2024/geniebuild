/**
 * SectionRouter.tsx
 * 
 * COMMON ROUTER for ALL sections - Uses SectionsAndVariantRegistry.tsx
 * 
 * This replaces all individual router files (HeroSection.tsx, NavbarSection.tsx, etc.)
 * 
 * How it works:
 * 1. Reads section type and variant from section prop
 * 2. Uses registry to find available variants
 * 3. Routes to the correct variant component based on registry
 */

import React, { useState } from 'react';
import { Section } from '../../types';
import { getDefaultVariant, isValidVariant } from '../SectionsAndVariantRegistry';
import { getHeadingSizeClass } from '../../utils/headingSizeUtils';

// Import all variant components
// Hero variants
import { HeroCenter } from './hero/HeroCenter';
import { HeroSplitLeft } from './hero/HeroSplitLeft';
import { HeroSplitRight } from './hero/HeroSplitRight';

// Navbar variants
import { NavbarSimple } from './navbar/NavbarSimple';
import { NavbarCentered } from './navbar/NavbarCentered';
import { NavbarMinimal } from './navbar/NavbarMinimal';
import { NavbarApi } from './navbar/NavbarApi';

// Features variants
import { FeaturesGrid } from './features/FeaturesGrid';
import { FeaturesList } from './features/FeaturesList';
import { FeaturesCards } from './features/FeaturesCards';

// CTA variants
import { CTACenter } from './cta/CTACenter';
import { CTASplit } from './cta/CTASplit';

// Footer variants
import { FooterColumns } from './footer/FooterColumns';
import { FooterCentered } from './footer/FooterCentered';
import { FooterMinimal } from './footer/FooterMinimal';
import { FooterApi } from './footer/FooterApi';

// Pricing variants
import { PricingCards } from './pricing/PricingCards';
import { PricingMinimal } from './pricing/PricingMinimal';

// Image Banner variants
import { BannerCenter } from './image-banner/BannerCenter';
import { BannerSplit } from './image-banner/BannerSplit';
import { BannerBottomLeft } from './image-banner/BannerBottomLeft';

// Single-component sections
import { TestimonialsSection } from './TestimonialsSection';
import { ElementsSection } from './ElementsSection';

interface SectionRouterProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick?: () => void;
  onLinkEdit?: (index: number, value: string) => void;
  onLogoClick?: () => void;
  onItemEdit?: (itemId: string, updates: any) => void;
  onAddItem?: () => void;
  onRemoveItem?: (id: string) => void;
  onUpload?: (sectionId: string, field: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  onElementSelect?: (elementId: string) => void;
  selectedElementId?: string | null;
  buttonClass: string;
  isSelected?: boolean;
  titleClass?: string;
  titleStyle?: React.CSSProperties;
  readOnly?: boolean;
}

/**
 * Common Section Router - Routes to correct variant based on registry
 */
export const SectionRouter: React.FC<SectionRouterProps> = (props) => {
  const { section } = props;
  const sectionType = section.type as string; // Cast to string to handle 'faq' type
  const variant = section.styles?.variant || getDefaultVariant(sectionType);

  // Handle FAQ (inline component, no file) - check before validation since 'faq' is not in SectionType enum
  if (sectionType === 'faq') {
    const FAQSection: React.FC<{
      section: Section;
      titleClass: string;
      titleStyle: React.CSSProperties;
      readOnly: boolean;
    }> = ({ section, titleClass, titleStyle, readOnly }) => {
      const { content, styles } = section;
      const faqItems = content.items || [];
      const [openIndex, setOpenIndex] = useState<number | null>(null);

      return (
        <div className={`${styles.maxWidth || 'max-w-4xl'} mx-auto px-6`}>
          {content.title && (() => {
            const headingTag = (styles.titleHeadingTag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            return React.createElement(
              headingTag,
              { 
                key: `faq-title-${headingTag}-${section.id}`,
                className: titleClass.replace(/text-\w+(\s+md:text-\w+)?/g, getHeadingSizeClass(headingTag, section.styles.titleSize || 'text-3xl md:text-5xl')), 
                style: titleStyle 
              },
              content.title
            );
          })()}
          <div className="space-y-4 mt-8">
            {faqItems.map((item: any, idx: number) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ color: styles.titleColor || styles.textColor }}
                    type="button"
                  >
                    <span className="font-semibold">{item.question}</span>
                    <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} transition-transform`}></i>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-0" style={{ color: styles.textColor || styles.descriptionColor }}>
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <FAQSection
        section={section}
        titleClass={props.titleClass || ''}
        titleStyle={props.titleStyle || {}}
        readOnly={props.readOnly || false}
      />
    );
  }

  // Route to correct variant component based on section type and variant
  const baseProps = {
    section: props.section,
    onTextEdit: props.onTextEdit,
    buttonClass: props.buttonClass,
    readOnly: props.readOnly,
    isSelected: props.isSelected,
    titleClass: props.titleClass,
    titleStyle: props.titleStyle,
    onElementSelect: props.onElementSelect,
    selectedElementId: props.selectedElementId,
  };

  // Route based on section type and variant
  switch (sectionType) {
    case 'hero':
      switch (variant) {
        case 'HeroCenter':
          return <HeroCenter {...baseProps} onImageClick={props.onImageClick} onElementSelect={props.onElementSelect} selectedElementId={props.selectedElementId} />;
        case 'HeroSplitLeft':
          return <HeroSplitLeft {...baseProps} onImageClick={props.onImageClick} onElementSelect={props.onElementSelect} selectedElementId={props.selectedElementId} />;
        case 'HeroSplitRight':
          return <HeroSplitRight {...baseProps} onImageClick={props.onImageClick} onElementSelect={props.onElementSelect} selectedElementId={props.selectedElementId} />;
        default:
          return <HeroCenter {...baseProps} onImageClick={props.onImageClick} onElementSelect={props.onElementSelect} selectedElementId={props.selectedElementId} />;
      }

    case 'navbar':
      switch (variant) {
        case 'NavbarApi':
          return <NavbarApi section={props.section} readOnly={props.readOnly} />;
        case 'NavbarCentered':
          return <NavbarCentered {...baseProps} onLinkEdit={props.onLinkEdit} onLogoClick={props.onLogoClick} />;
        case 'NavbarMinimal':
          return <NavbarMinimal {...baseProps} onLinkEdit={props.onLinkEdit} onLogoClick={props.onLogoClick} />;
        case 'NavbarSimple':
        default:
          return <NavbarSimple {...baseProps} onLinkEdit={props.onLinkEdit} onLogoClick={props.onLogoClick} />;
      }

    case 'features':
      switch (variant) {
        case 'FeaturesList':
          return (
            <FeaturesList
              {...baseProps}
              onItemEdit={props.onItemEdit}
              onAddItem={props.onAddItem}
              onRemoveItem={props.onRemoveItem}
            />
          );
        case 'FeaturesCards':
          return (
            <FeaturesCards
              {...baseProps}
              onItemEdit={props.onItemEdit}
              onAddItem={props.onAddItem}
              onRemoveItem={props.onRemoveItem}
            />
          );
        case 'FeaturesGrid':
        default:
          return (
            <FeaturesGrid
              {...baseProps}
              onItemEdit={props.onItemEdit}
              onAddItem={props.onAddItem}
              onRemoveItem={props.onRemoveItem}
            />
          );
      }

    case 'cta':
      switch (variant) {
        case 'CTASplit':
          return <CTASplit {...baseProps} />;
        case 'CTACenter':
        default:
          return <CTACenter {...baseProps} />;
      }

    case 'footer':
      switch (variant) {
        case 'FooterApi':
          return <FooterApi section={props.section} readOnly={props.readOnly} />;
        case 'FooterCentered':
          return <FooterCentered {...baseProps} onLinkEdit={props.onLinkEdit} onLogoClick={props.onLogoClick} />;
        case 'FooterMinimal':
          return <FooterMinimal {...baseProps} onLinkEdit={props.onLinkEdit} onLogoClick={props.onLogoClick} />;
        case 'FooterColumns':
        default:
          return <FooterColumns {...baseProps} onLinkEdit={props.onLinkEdit} onLogoClick={props.onLogoClick} />;
      }

    case 'pricing':
      switch (variant) {
        case 'PricingMinimal':
          return (
            <PricingMinimal
              {...baseProps}
              onItemEdit={props.onItemEdit}
              onRemoveItem={props.onRemoveItem}
              onAddItem={props.onAddItem}
            />
          );
        case 'PricingCards':
        default:
          return (
            <PricingCards
              {...baseProps}
              onItemEdit={props.onItemEdit}
              onRemoveItem={props.onRemoveItem}
              onAddItem={props.onAddItem}
            />
          );
      }

    case 'testimonials':
      return (
        <TestimonialsSection
          {...baseProps}
          onItemEdit={props.onItemEdit}
          onRemoveItem={props.onRemoveItem}
          onAddItem={props.onAddItem}
        />
      );

    case 'elements':
      return (
        <ElementsSection
          {...baseProps}
          onUpload={props.onUpload}
          onElementUpdate={props.onElementUpdate}
          onElementSelect={props.onElementSelect}
          selectedElementId={props.selectedElementId}
        />
      );

    case 'image-banner':
      switch (variant) {
        case 'BannerBottomLeft':
          return <BannerBottomLeft {...baseProps} />;
        case 'BannerSplit':
          return <BannerSplit {...baseProps} />;
        case 'BannerCenter':
        default:
          return <BannerCenter {...baseProps} />;
      }

    default:
      return <div className="p-10 text-center">Unsupported Section Type: {sectionType}</div>;
  }
};
