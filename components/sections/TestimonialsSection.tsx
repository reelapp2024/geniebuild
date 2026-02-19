
import React from 'react';
import { Section } from '../../types';
import { getHeadingSizeClass } from '../../utils/headingSizeUtils';

interface TestimonialsSectionProps {
  section: Section;
  isSelected: boolean;
  onTextEdit: (key: any, value: string) => void;
  onItemEdit: (itemId: string, updates: any) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  titleClass: string;
  titleStyle?: React.CSSProperties;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ section, isSelected, onTextEdit, onItemEdit, onRemoveItem, onAddItem, titleClass, titleStyle }) => {
  const { content, styles } = section;
  const variant = styles.variant || 'grid';

  const handleAvatarClick = (itemId: string, currentUrl: string) => {
    // This could also use onUpload if we passed it, but keeping simple prompt or upgrading later
    const newUrl = prompt("Enter new avatar URL:", currentUrl);
    if (newUrl) {
      onItemEdit(itemId, { avatar: newUrl });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
       {(() => {
         const headingTag = (styles.titleHeadingTag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
         return React.createElement(
           headingTag,
           {
             key: `testimonials-title-${headingTag}-${section.id}`,
             className: `${titleClass.replace(/text-\w+(\s+md:text-\w+)?/g, getHeadingSizeClass(headingTag, styles.titleSize || 'text-3xl md:text-5xl'))} text-center outline-none focus:ring-2 ring-white rounded px-2 mb-4`,
             style: titleStyle,
             contentEditable: true,
             suppressContentEditableWarning: true,
             onBlur: (e: any) => onTextEdit('title', e.currentTarget.textContent || '')
           },
           content.title
         );
       })()}
       
       {content.subtitle && (
         <p 
            className="text-center opacity-70 max-w-2xl mx-auto mb-16 text-lg outline-none focus:ring-2 ring-white rounded px-2 min-h-[1.5em]" 
            style={{color: styles.subtitleColor}} 
            contentEditable 
            suppressContentEditableWarning 
            onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}
         >
            {content.subtitle}
         </p>
       )}

       <div className={`
         ${variant === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : ''}
         ${variant === 'centered' ? 'max-w-4xl mx-auto flex flex-col gap-12 text-center' : ''}
         ${variant === 'minimal' ? 'grid md:grid-cols-2 gap-4' : ''}
       `}>
         {content.items?.map((item) => (
           <div key={item.id} className={`
             relative group/item
             ${variant === 'grid' ? 'p-8 bg-white/5 rounded-2xl border border-white/5' : ''}
             ${variant === 'centered' ? 'py-8 border-b border-white/10 last:border-0' : ''}
             ${variant === 'minimal' ? 'p-6 border border-white/10 rounded-lg flex items-center gap-4' : ''}
           `}>
              {isSelected && (
                <button onClick={(e) => {e.stopPropagation(); onRemoveItem(item.id);}} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-xs z-20">×</button>
              )}
             
             {variant !== 'minimal' && <div className="text-6xl text-white/10 absolute top-4 left-4 font-serif">"</div>}
             
             <p className={`
                outline-none focus:ring-2 ring-white rounded px-1 mb-6 relative z-10
                ${variant === 'centered' ? 'text-2xl font-light leading-relaxed' : 'text-lg italic opacity-80'}
                ${variant === 'minimal' ? 'mb-0 text-sm flex-1' : ''}
             `} contentEditable suppressContentEditableWarning onBlur={(e) => onItemEdit(item.id, { description: e.currentTarget.textContent })}>{item.description}</p>
             
             <div className={`
                flex items-center gap-4
                ${variant === 'centered' ? 'justify-center' : ''}
                ${variant === 'minimal' ? 'border-l border-white/20 pl-4 shrink-0' : ''}
             `}>
                <div className="relative group/avatar cursor-pointer" onClick={() => handleAvatarClick(item.id, item.avatar || '')}>
                   <img src={item.avatar} className="w-10 h-10 rounded-full object-cover bg-slate-800" alt={item.author} />
                   <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-[8px] uppercase font-bold tracking-tighter">Edit</div>
                </div>
                <div className="text-left">
                  <div className="font-bold outline-none focus:ring-2 ring-white rounded px-1" contentEditable suppressContentEditableWarning onBlur={(e) => onItemEdit(item.id, { author: e.currentTarget.textContent })}>{item.author}</div>
                  <div className="text-xs opacity-50 outline-none focus:ring-2 ring-white rounded px-1" contentEditable suppressContentEditableWarning onBlur={(e) => onItemEdit(item.id, { role: e.currentTarget.textContent })}>{item.role}</div>
                </div>
             </div>
           </div>
         ))}
         
         {isSelected && (
           <button 
             onClick={(e) => {e.stopPropagation(); onAddItem();}} 
             className={`
                border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition flex flex-col items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs gap-2 min-h-[200px]
                ${variant === 'grid' ? 'rounded-2xl' : 'rounded-lg py-8 w-full'}
             `}
           >
             <span className="text-2xl">+</span> Add Testimonial
           </button>
         )}
       </div>
    </div>
  );
};
