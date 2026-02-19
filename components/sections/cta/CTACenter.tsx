
import React from 'react';
import { Section } from '../../../types';
import { getHeadingSizeClass } from '../../../utils/headingSizeUtils';

interface CTAProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  titleClass: string;
  titleStyle?: React.CSSProperties;
  buttonClass: string;
}

export const CTACenter: React.FC<CTAProps> = ({ section, onTextEdit, titleClass, titleStyle, buttonClass }) => {
  const { content, styles } = section;
  const headingTag = (styles.titleHeadingTag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // Extract size from titleClass and adjust based on heading tag
  const baseSize = styles.titleSize || 'text-3xl md:text-5xl';
  const adjustedSizeClass = getHeadingSizeClass(headingTag, baseSize);
  
  // Replace the size in titleClass with adjusted size
  const adjustedTitleClass = titleClass.replace(/text-\w+(\s+md:text-\w+)?/g, adjustedSizeClass);
  
  return (
    <div className="mx-auto px-6 relative z-10 max-w-4xl text-center">
        {React.createElement(
          headingTag,
          {
            key: `cta-title-${headingTag}-${section.id}`, // Force re-render when tag changes
            className: `${adjustedTitleClass} outline-none focus:ring-2 ring-white rounded px-2`,
            style: titleStyle,
            contentEditable: true,
            suppressContentEditableWarning: true,
            onBlur: (e: any) => onTextEdit('title', e.currentTarget.textContent || '')
          },
          content.title
        )}
        <p className="text-xl opacity-90 outline-none focus:ring-2 ring-white rounded px-2 mb-10" contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}>{content.subtitle}</p>
        <button className={`${buttonClass} px-12 py-4 text-xl font-bold shadow-2xl`} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('ctaText', e.currentTarget.textContent || '')}>{content.ctaText}</button>
    </div>
  );
};
