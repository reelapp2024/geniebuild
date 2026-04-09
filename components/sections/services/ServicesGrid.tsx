import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { getHeadingSizeClass } from '../../../utils/headingSizeUtils';
import { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ElementsSection } from '../ElementsSection';
import { useTheme } from '@ui/blocks';

interface ServicesProps {
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
  buttonStyle?: React.CSSProperties;
  readOnly?: boolean;
  onElementSelect?: (elementId: string, element?: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  themeColors?: {
    titleColor?: string;
    textColor?: string;
    accentColor?: string;
    cardBackgroundColor?: string;
    cardBorderColor?: string;
    titleFontFamily?: string;
    subtitleFontFamily?: string;
    descriptionFontFamily?: string;
    buttonFontFamily?: string;
  };
}

export const ServicesGrid: React.FC<ServicesProps> = ({ 
  section, 
  isSelected, 
  onTextEdit, 
  onItemEdit, 
  onRemoveItem, 
  onAddItem, 
  titleClass, 
  titleStyle, 
  subtitleStyle, 
  descriptionStyle,
  buttonStyle,
  readOnly,
  onElementSelect,
  onElementUpdate,
  selectedElementId,
  themeColors: passedThemeColors
}) => {
  const { content, styles } = section;
  const { themeData } = useTheme();
  
  const titleColor = styles.titleColor || passedThemeColors?.titleColor || titleStyle?.color;
  const textColor = styles.textColor || passedThemeColors?.textColor || descriptionStyle?.color;
  const accentColor = styles.accentColor || passedThemeColors?.accentColor || '#3b82f6';
  
  // Determine if we are in light mode
  const styleAny = styles as any;
  const isLight = styles.themeMode === 'light';
  
  const themeColors = {
    ...styles,
    titleColor: styles.titleColor || passedThemeColors?.titleColor || themeData?.heading || (isLight ? '#111827' : '#F8FAFC'),
    textColor: styles.textColor || passedThemeColors?.textColor || themeData?.description || (isLight ? '#4B5563' : '#D1D5DB'),
    subtitleColor: styles.subheadingColor || passedThemeColors?.subheadingColor || themeData?.subheading || themeData?.accent || (isLight ? '#E11D48' : '#F43F5E'),
    accentColor: styles.accentColor || passedThemeColors?.accentColor || themeData?.accent || '#E11D48',
    iconColor: styles.iconColor || passedThemeColors?.iconColor || themeData?.icon || themeData?.accent || '#E11D48',
    iconBgColor: styles.iconBgColor || passedThemeColors?.iconBgColor || themeData?.iconBg || (isLight ? 'rgba(225,29,72,0.1)' : 'rgba(225,29,72,0.15)'),
    secondaryHeadingColor: styles.secondaryHeadingColor || passedThemeColors?.secondaryHeadingColor || themeData?.secondaryHeading || themeData?.accent || '#E11D48',
    titleFontFamily: styleAny.titleFontFamily || styleAny.fontFamily || passedThemeColors?.titleFontFamily,
    subtitleFontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || passedThemeColors?.subtitleFontFamily,
    descriptionFontFamily: styleAny.descriptionFontFamily || styleAny.fontFamily || passedThemeColors?.descriptionFontFamily,
  };

  const cardBg = isLight 
    ? (styles.cardBackgroundColor || '#FFFFFF') 
    : (styles.cardBackgroundColor || styles.backgroundColor || 'rgba(255, 255, 255, 0.05)');
    
  const cardBorder = isLight
    ? (styles.cardBorderColor || 'rgba(0, 0, 0, 0.08)')
    : (styles.cardBorderColor || 'rgba(255, 255, 255, 0.1)');

  const subtitleId = `${section.id}-subtitle`;
  const titleId = `${section.id}-title`;
  const descriptionId = `${section.id}-description`;

  const subtitleElement = section.elements?.find(e => e.id === subtitleId);
  const titleElement = section.elements?.find(e => e.id === titleId);
  const descriptionElement = section.elements?.find(e => e.id === descriptionId);

  // Resolved styles for items
  const resolvedTitleStyle = {
    fontFamily: themeColors.titleFontFamily || titleStyle?.fontFamily,
    color: themeColors.titleColor || titleStyle?.color
  };

  const resolvedDescriptionStyle = {
    fontFamily: themeColors.descriptionFontFamily || descriptionStyle?.fontFamily,
    color: themeColors.textColor || descriptionStyle?.color
  };

  const buttonClass = (styles as any).buttonClass || '';

  const getSubtitleElement = (): WebsiteElement => {
    if (subtitleElement) return subtitleElement;
    return {
      id: subtitleId,
      type: 'text',
      content: { text: content.subtitle || '', textSize: 'subheading' },
      style: {
        color: themeColors.subtitleColor,
        fontSize: styles.subtitleFontSize,
        fontWeight: styles.subtitleFontWeight || '600',
        fontFamily: styles.subtitleFontFamily || themeColors.subtitleFontFamily,
        textTransform: (styles.subtitleTextTransform || 'uppercase') as any,
        letterSpacing: styles.subtitleLetterSpacing || '0.1em',
        textAlign: 'center'
      }
    };
  };

  const getTitleElement = (): WebsiteElement => {
    if (titleElement) return titleElement;
    
    // Default title with a span for secondary color if not already present
    let defaultTitle = content.title || 'Our Premium Services';
    if (!defaultTitle.includes('<span')) {
        const words = defaultTitle.split(' ');
        if (words.length > 1) {
            const lastWord = words.pop();
            defaultTitle = `${words.join(' ')} <span style="color: ${themeColors.secondaryHeadingColor}">${lastWord}</span>`;
        }
    }

    return {
      id: titleId,
      type: 'heading',
      content: { 
        text: defaultTitle,
        htmlTag: (styles.titleHeadingTag || 'h2') as any
      },
      style: {
        color: styles.titleColor || themeColors.titleColor,
        fontSize: styles.titleFontSize || styles.titleSize || '48px',
        fontWeight: styles.titleFontWeight || '800',
        fontFamily: styles.titleFontFamily || themeColors.titleFontFamily,
        textTransform: styles.titleTextTransform as any,
        letterSpacing: styles.titleLetterSpacing || '-0.02em',
        textAlign: 'center'
      }
    };
  };

  const getDescriptionElement = (): WebsiteElement => {
    if (descriptionElement) return descriptionElement;
    return {
      id: descriptionId,
      type: 'text',
      content: { text: content.description || '' },
      style: {
        color: styles.descriptionColor || textColor,
        fontSize: styles.descriptionFontSize,
        fontWeight: styles.descriptionFontWeight,
        fontFamily: styles.descriptionFontFamily || themeColors.descriptionFontFamily,
        textTransform: styles.descriptionTextTransform as any,
        letterSpacing: styles.descriptionLetterSpacing,
        textAlign: 'center'
      }
    };
  };

  const paddingTop = styles.paddingTop || 'pt-24';
  const paddingBottom = styles.paddingBottom || 'pb-24';
  const paddingX = styles.paddingX || 'px-6';

  return (
    <div className={`max-w-7xl mx-auto ${paddingX} ${paddingTop} ${paddingBottom}`}>
      <div className="text-center mb-16">
        {content.subtitle && (
          <div className="mb-4 inline-block">
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getSubtitleElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
            />
          </div>
        )}
        
        <div className="mb-6">
          <ElementsSection
            isWrapped={false}
            section={{ ...section, elements: [getTitleElement()] }}
            onTextEdit={onTextEdit}
            onElementUpdate={onElementUpdate || (() => {})}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            readOnly={readOnly}
            themeColors={themeColors}
          />
        </div>

        {content.description && (
          <div className="mt-6 max-w-2xl mx-auto opacity-80">
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getDescriptionElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.items?.map((item) => {
          const itemStyle = item.style || {};
          
          return (
            <div 
              key={item.id} 
              className={`group relative p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${isLight ? 'shadow-sm' : ''} ${selectedElementId === item.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              style={{ 
                backgroundColor: itemStyle.backgroundColor || cardBg,
                borderColor: itemStyle.borderColor || cardBorder
              }}
            >
              {isSelected && (
                <button 
                  onClick={(e) => {e.stopPropagation(); onRemoveItem(item.id);}}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs z-20 shadow-lg"
                >
                  ×
                </button>
              )}
              
              <div className="flex flex-col items-center">
                <ElementsSection
                  isWrapped={false}
                  section={{
                    ...section,
                    elements: [{
                      id: `${item.id}-feature`,
                      type: 'feature-box',
                      content: { 
                        icon: item.icon || '',
                        text: item.title || '',
                        subText: item.description || '',
                        iconPosition: item.iconPosition || itemStyle.iconPosition || 'top'
                      },
                      style: { 
                        textAlign: itemStyle.textAlign || 'center',
                        iconPosition: item.iconPosition || itemStyle.iconPosition || 'top',
                        iconColor: itemStyle.iconColor || themeColors.iconColor,
                        iconBackgroundColor: itemStyle.iconBackgroundColor || itemStyle.iconBgColor || themeColors.iconBgColor,
                        iconBorder: itemStyle.iconBorder,
                        iconBorderRadius: itemStyle.iconBorderRadius,
                        iconShadow: itemStyle.iconShadow,
                        iconSize: itemStyle.iconSize,
                        iconContainerSize: itemStyle.iconContainerSize,
                        titleColor: itemStyle.titleColor || resolvedTitleStyle.color,
                        titleFontSize: itemStyle.titleFontSize || '20px',
                        titleFontWeight: itemStyle.titleFontWeight || '700',
                        titleFontFamily: itemStyle.titleFontFamily || resolvedTitleStyle.fontFamily,
                        descriptionColor: itemStyle.descriptionColor || itemStyle.textColor || resolvedDescriptionStyle.color,
                        descriptionFontSize: itemStyle.descriptionFontSize || '14px',
                        descriptionFontFamily: itemStyle.descriptionFontFamily || resolvedDescriptionStyle.fontFamily,
                        padding: '0'
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
                      if (content.iconPosition !== undefined) itemUpdates.iconPosition = content.iconPosition;
                      if (updates.style !== undefined) itemUpdates.style = { ...(item.style || {}), ...updates.style };
                      if (Object.keys(itemUpdates).length > 0) onItemEdit(itemId, itemUpdates);
                    } else if (onElementUpdate) {
                      onElementUpdate(id, updates);
                    }
                  }}
                  onTextEdit={onTextEdit}
                  buttonClass={buttonClass}
                  readOnly={readOnly}
                  themeColors={themeColors}
                />
              </div>
            </div>
          );
        })}

        {isSelected && (
          <button 
            onClick={(e) => {e.stopPropagation(); onAddItem();}}
            className="border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-400 group"
            style={{ borderColor: cardBorder }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">+</span>
            </div>
            <span className="font-bold uppercase tracking-widest text-xs" style={{ fontFamily: buttonStyle?.fontFamily }}>Add Service</span>
          </button>
        )}
      </div>
    </div>
  );
};
