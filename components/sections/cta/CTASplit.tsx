
import React from 'react';
import { Section } from '../../../types';

interface CTAProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  titleClass: string;
  titleStyle?: React.CSSProperties;
  buttonClass: string;
}

export const CTASplit: React.FC<CTAProps> = ({ section, onTextEdit, titleClass, titleStyle, buttonClass }) => {
  const { content } = section;
  return (
    <div className="mx-auto px-6 relative z-10 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
       <div className="max-w-2xl">
            <h2 className={`${titleClass} outline-none focus:ring-2 ring-white rounded px-2`} style={titleStyle} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('title', e.currentTarget.textContent || '')}>{content.title}</h2>
            <p className="text-lg md:text-xl opacity-90 outline-none focus:ring-2 ring-white rounded px-2" contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}>{content.subtitle}</p>
       </div>
       <div className="shrink-0">
            <button className={`${buttonClass} px-12 py-4 text-xl font-bold shadow-2xl`} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('ctaText', e.currentTarget.textContent || '')}>{content.ctaText}</button>
       </div>
    </div>
  );
};
