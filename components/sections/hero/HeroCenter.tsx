
import React from 'react';
import { Section } from '../../../types';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onImageClick: () => void;
  buttonClass: string;
}

export const HeroCenter: React.FC<HeroProps> = ({ section, onTextEdit, onImageClick, buttonClass }) => {
  const { content, styles } = section;
  
  const isTailwindClass = (val?: string) => val && val.startsWith('text-') && !val.includes('px') && !val.includes('rem');
  const isCustomColor = (value?: string) => value && (value.startsWith('#') || value.startsWith('rgb'));

  // Default to responsive class if specific size not provided or not responsive
  const titleSize = styles.titleSize || 'text-4xl md:text-6xl';
  const titleIsClass = isTailwindClass(titleSize);
  const titleStyle = {
    ...(isCustomColor(styles.titleColor) ? { color: styles.titleColor } : {}),
    ...(!titleIsClass ? { fontSize: titleSize } : {})
  };
  const titleClass = `${titleIsClass ? titleSize : ''} font-bold mb-6 leading-tight ${!isCustomColor(styles.titleColor) ? styles.titleColor || '' : ''}`;

  return (
    <div className={`${styles.maxWidth || 'max-w-5xl'} mx-auto px-6 text-center relative z-10`}>
      <h1 
        className={`${titleClass} outline-none focus:ring-2 ring-white rounded px-2`} 
        style={titleStyle}
        contentEditable 
        suppressContentEditableWarning 
        onBlur={(e) => onTextEdit('title', e.currentTarget.textContent || '')}
      >
        {content.title}
      </h1>
      <p 
        className={`text-lg md:text-xl opacity-80 mb-10 mx-auto max-w-2xl outline-none focus:ring-2 ring-white rounded px-2 min-h-[1.5em]`} 
        style={{ color: styles.subtitleColor }}
        contentEditable 
        suppressContentEditableWarning 
        onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}
      >
        {content.subtitle}
      </p>
      <div className={`flex flex-wrap justify-center gap-4 mb-10`}>
        <button className={`${buttonClass} text-lg px-8 py-3 font-bold`} contentEditable suppressContentEditableWarning onBlur={(e) => onTextEdit('ctaText', e.currentTarget.textContent || '')}>{content.ctaText}</button>
      </div>
      {content.imageUrl && (
        <div className="relative group/img cursor-pointer w-full mt-8 max-w-4xl mx-auto" onClick={onImageClick}>
          <img src={content.imageUrl} alt="Hero" className="rounded-2xl shadow-2xl w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
              <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">Change Image</span>
          </div>
        </div>
      )}
    </div>
  );
};
