
import React from 'react';
import { Section } from '../../../types';
import { getHeadingSizeClass } from '../../../utils/headingSizeUtils';

interface PricingProps {
  section: Section;
  isSelected: boolean;
  onTextEdit: (key: any, value: string) => void;
  onItemEdit: (itemId: string, updates: any) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  titleClass: string;
  titleStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  buttonClass: string;
  readOnly?: boolean;
  onElementSelect?: (elementId: string, element?: any) => void;
  selectedElementId?: string | null;
  themeColors?: {
    titleColor?: string;
    textColor?: string;
    accentColor?: string;
    cardBackgroundColor?: string;
    cardBorderColor?: string;
  };
}

export const PricingMinimal: React.FC<PricingProps> = ({ section, isSelected, onTextEdit, onItemEdit, onRemoveItem, onAddItem, titleClass, titleStyle, subtitleStyle, descriptionStyle, buttonClass, readOnly, onElementSelect, selectedElementId, themeColors }) => {
  const { content, styles } = section;
  const titleColor = styles.titleColor || themeColors?.titleColor || titleStyle?.color;
  const textColor = styles.textColor || themeColors?.textColor || descriptionStyle?.color;
  const accentColor = styles.accentColor || themeColors?.accentColor || '#3b82f6';

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        {(() => {
          const headingTag = (styles.titleHeadingTag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          return React.createElement(
            headingTag,
            {
              key: `pricing-title-${headingTag}-${section.id}`,
              className: `${titleClass.replace(/text-\w+(\s+md:text-\w+)?/g, getHeadingSizeClass(headingTag, styles.titleSize || 'text-3xl md:text-5xl'))} outline-none focus:ring-2 ring-white rounded px-2`,
              style: { ...titleStyle, color: titleColor },
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e: any) => onTextEdit('title', e.currentTarget.innerHTML || ''),
              dangerouslySetInnerHTML: { __html: content.title || '' }
            }
          );
        })()}
      </div>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {content.items?.map((item) => (
          <div 
            key={item.id} 
            className={`relative group/item flex flex-col md:flex-row items-center justify-between border-b border-white/10 p-6 hover:bg-white/5 transition-colors rounded-lg gap-4 text-center md:text-left ${selectedElementId === item.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            onClick={(e) => {
              if (!readOnly && onElementSelect) {
                e.stopPropagation();
                // Map the item to a pricing-item element structure for the sidebar editor
                onElementSelect(item.id, {
                  id: item.id,
                  type: 'pricing-item',
                  content: {
                    text: item.title,
                    subText: item.description,
                    price: item.price
                  }
                });
              }
            }}
          >
            {isSelected && <button onClick={(e) => {e.stopPropagation(); onRemoveItem(item.id);}} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-xs z-20">×</button>}
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 outline-none focus:ring-2 ring-white rounded px-1" style={{ ...titleStyle, color: titleColor }} contentEditable suppressContentEditableWarning onBlur={(e) => onItemEdit(item.id, { title: e.currentTarget.innerHTML })} dangerouslySetInnerHTML={{ __html: item.title || '' }} />
                <p className="opacity-60 text-sm outline-none focus:ring-2 ring-white rounded px-1" style={{ ...descriptionStyle, color: textColor }} contentEditable suppressContentEditableWarning onBlur={(e) => onItemEdit(item.id, { description: e.currentTarget.innerHTML })} dangerouslySetInnerHTML={{ __html: item.description || '' }} />
            </div>
            <div className="text-right flex flex-col md:items-end gap-2">
                <div className="text-3xl font-bold mb-0 outline-none focus:ring-2 ring-white rounded px-1" style={{ color: titleColor }} contentEditable suppressContentEditableWarning onBlur={(e) => onItemEdit(item.id, { price: e.currentTarget.innerHTML })} dangerouslySetInnerHTML={{ __html: item.price || '' }} />
                <button className={buttonClass + ' text-sm px-4 py-2'}>Select</button>
            </div>
          </div>
        ))}
        {isSelected && (
           <button 
             onClick={(e) => {e.stopPropagation(); onAddItem();}} 
             className="border-2 border-dashed border-white/20 rounded-lg p-4 hover:border-white/40 hover:bg-white/5 transition flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs gap-2"
           >
             <span className="text-xl">+</span> Add Plan
           </button>
         )}
      </div>
    </div>
  );
};
