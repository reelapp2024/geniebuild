
import React from 'react';
import { Section } from '../../../types';

interface BannerProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  buttonClass: string;
  titleClass: string;
  titleStyle?: React.CSSProperties;
}

export const BannerCenter: React.FC<BannerProps> = ({ section, onTextEdit, buttonClass, titleClass, titleStyle }) => {
  const { content } = section;
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className={`${titleClass} outline-none focus:ring-2 ring-white rounded px-2`} style={titleStyle} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('title', e.currentTarget.textContent || '')}>{content.title}</h2>
        <p className="text-xl mb-10 opacity-90 outline-none focus:ring-2 ring-white rounded px-2 max-w-2xl mx-auto" contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}>{content.subtitle}</p>
        <button className={buttonClass + ' px-12 py-4 text-xl font-bold shadow-2xl'} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('ctaText', e.currentTarget.textContent || '')}>{content.ctaText}</button>
    </div>
  );
};
