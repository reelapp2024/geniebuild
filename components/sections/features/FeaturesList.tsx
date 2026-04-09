
import React from 'react';
import { Section } from '../../../types';
import { getHeadingSizeClass } from '../../../utils/headingSizeUtils';
import { ElementsSection } from '../ElementsSection';

interface FeaturesProps {
  section: Section;
  isSelected: boolean;
  onTextEdit: (key: any, value: string) => void;
  onItemEdit: (itemId: string, updates: any) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  titleStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  readOnly?: boolean;
  onElementSelect?: (elementId: string, element?: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  themeColors?: any;
}

export const FeaturesList: React.FC<FeaturesProps> = ({ 
  section, 
  isSelected, 
  onTextEdit, 
  onItemEdit, 
  onAddItem, 
  onRemoveItem, 
  titleStyle, 
  subtitleStyle, 
  descriptionStyle, 
  readOnly, 
  onElementSelect, 
  onElementUpdate,
  selectedElementId, 
  themeColors: passedThemeColors 
}) => {
  const { content, styles } = section;
  
  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || passedThemeColors?.titleColor,
    textColor: styles.textColor || passedThemeColors?.textColor,
    accentColor: styles.accentColor || passedThemeColors?.accentColor,
    iconColor: styles.iconColor || passedThemeColors?.iconColor,
    iconBgColor: styles.iconBgColor || passedThemeColors?.iconBgColor,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 relative z-10">
      {(() => {
        const headingTag = (styles.titleHeadingTag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return (
          <div className="mb-12">
            <ElementsSection
              isWrapped={false}
              section={{
                ...section,
                elements: [{
                  id: `${section.id}-title`,
                  type: 'heading',
                  content: { text: content.title || '', htmlTag: headingTag },
                  style: { 
                    color: themeColors.titleColor || titleStyle?.color,
                    textAlign: 'center',
                    fontSize: styles.titleFontSize || styles.titleSize || '2.25rem',
                    fontWeight: styles.titleFontWeight || '700'
                  }
                }]
              }}
              onTextEdit={onTextEdit}
              onElementSelect={onElementSelect}
              onElementUpdate={onElementUpdate || (() => {})}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
            />
          </div>
        );
      })()}
      <div className="flex flex-col gap-6">
        {content.items?.map((item) => {
          const itemStyle = item.style || {};
          return (
            <div 
              key={item.id} 
              className={`relative group/item p-2 rounded-xl transition-all ${selectedElementId === item.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            >
              {isSelected && (
                <button 
                  onClick={(e) => {e.stopPropagation(); onRemoveItem(item.id);}} 
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-xs z-20 shadow-lg"
                >
                  ×
                </button>
              )}
              
              <ElementsSection
                isWrapped={false}
                section={{
                  ...section,
                  elements: [{
                    id: `${item.id}-feature`,
                    type: 'feature-box',
                    content: { 
                      icon: item.icon || 'star',
                      text: item.title || '',
                      subText: item.description || '',
                      iconPosition: 'left'
                    },
                    style: { 
                      ...itemStyle,
                      textAlign: 'left',
                      iconPosition: 'left',
                      iconColor: itemStyle.iconColor || themeColors.iconColor,
                      iconBackgroundColor: itemStyle.iconBackgroundColor || themeColors.iconBgColor,
                      titleColor: itemStyle.titleColor || themeColors.titleColor,
                      descriptionColor: itemStyle.descriptionColor || themeColors.textColor,
                      padding: '1.5rem',
                      backgroundColor: itemStyle.backgroundColor || 'transparent',
                      borderRadius: itemStyle.borderRadius || '12px',
                      border: itemStyle.border || '1px solid transparent'
                    }
                  }]
                }}
                onElementSelect={onElementSelect}
                selectedElementId={selectedElementId}
                onElementUpdate={(id, updates) => {
                  if (id.endsWith('-feature')) {
                    const itemId = id.replace('-feature', '');
                    const itemUpdates: any = {};
                    const content = updates.content || {};
                    if (content.text !== undefined) itemUpdates.title = content.text;
                    if (content.subText !== undefined) itemUpdates.description = content.subText;
                    if (content.icon !== undefined) itemUpdates.icon = content.icon;
                    if (updates.style !== undefined) itemUpdates.style = { ...(item.style || {}), ...updates.style };
                    if (Object.keys(itemUpdates).length > 0) onItemEdit(itemId, itemUpdates);
                  } else if (onElementUpdate) {
                    onElementUpdate(id, updates);
                  }
                }}
                onTextEdit={onTextEdit}
                readOnly={readOnly}
                themeColors={themeColors}
              />
            </div>
          );
        })}
        {isSelected && (
          <button 
            onClick={(e) => {e.stopPropagation(); onAddItem();}} 
            className="border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-white/40 hover:bg-white/5 transition text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Add Feature
          </button>
        )}
      </div>
    </div>
  );
};

