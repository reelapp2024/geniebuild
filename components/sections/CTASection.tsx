
import React from 'react';
import { Section } from '../../types';
import { CTACenter } from './cta/CTACenter';
import { CTASplit } from './cta/CTASplit';

interface CTASectionProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  titleClass: string;
  titleStyle?: React.CSSProperties;
  buttonClass: string;
}

export const CTASection: React.FC<CTASectionProps> = (props) => {
  const variant = props.section.styles.variant || 'CTACenter';

  switch (variant) {
    case 'CTASplit':
        return <CTASplit {...props} />;
    case 'CTABoxed':
        return <CTABoxed {...props} />;
    case 'CTACenter':
    default:
        return <CTACenter {...props} />;
  }
};

// Inline Boxed component since I need it for the switch
const CTABoxed: React.FC<CTASectionProps> = ({ section, onTextEdit, titleClass, titleStyle, buttonClass }) => {
    const { content } = section;
    return (
      <div className="mx-auto px-6 relative z-10 max-w-6xl">
         <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center">
             <h2 className={`${titleClass} outline-none focus:ring-2 ring-white rounded px-2`} style={titleStyle} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('title', e.currentTarget.textContent || '')}>{content.title}</h2>
             <p className="text-xl opacity-90 outline-none focus:ring-2 ring-white rounded px-2 mb-10" contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}>{content.subtitle}</p>
             <button className={`${buttonClass} px-12 py-4 text-xl font-bold shadow-2xl`} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('ctaText', e.currentTarget.textContent || '')}>{content.ctaText}</button>
         </div>
      </div>
    );
};
