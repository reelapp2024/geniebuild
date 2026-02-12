
import React from 'react';
import { Section } from '../../../types';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
}

export const HeroSplitRight: React.FC<HeroProps> = ({ section, onTextEdit, onImageClick, buttonClass }) => {
  const { content, styles } = section;
  
  const isTailwindClass = (val?: string) => val && val.startsWith('text-') && !val.includes('px') && !val.includes('rem');
  const isCustomColor = (value?: string) => value && (value.startsWith('#') || value.startsWith('rgb'));

  const titleSize = styles.titleSize || 'text-4xl md:text-6xl';
  const titleStyle = {
    ...(isCustomColor(styles.titleColor) ? { color: styles.titleColor } : {}),
    ...(!isTailwindClass(titleSize) ? { fontSize: titleSize } : {})
  };

  return (
    <div className={`${styles.maxWidth || 'max-w-7xl'} mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left`}>
      <div>
        <h1 
            className={`font-bold mb-6 leading-tight ${isTailwindClass(titleSize) ? titleSize : ''} outline-none focus:ring-2 ring-white rounded px-2`} 
            style={titleStyle}
            contentEditable 
            suppressContentEditableWarning 
            onBlur={(e) => onTextEdit('title', e.currentTarget.textContent || '')}
        >
            {content.title}
        </h1>
        <p className="text-lg md:text-xl opacity-80 mb-8 outline-none focus:ring-2 ring-white rounded px-2" contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}>
            {content.subtitle}
        </p>
        <button className={`${buttonClass} text-lg px-8 py-3 font-bold`} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('ctaText', e.currentTarget.textContent || '')}>{content.ctaText}</button>
      </div>
      {content.imageUrl && (
        <div className="relative group/img cursor-pointer w-full" onClick={onImageClick}>
          <img src={content.imageUrl} alt="Hero" className="rounded-2xl shadow-2xl w-full object-cover" />
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
              <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">Change Image</span>
          </div>
        </div>
      )}
    </div>
  );
};
