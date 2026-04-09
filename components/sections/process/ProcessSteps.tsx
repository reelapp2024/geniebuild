
import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { useTheme } from '@ui/blocks';
import { ElementsSection } from '../ElementsSection';
import { motion } from 'motion/react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface ProcessProps {
  section: Section;
  isSelected: boolean;
  onTextEdit: (key: any, value: string) => void;
  onItemEdit: (itemId: string, updates: any) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  readOnly?: boolean;
  onElementSelect?: (elementId: string, element?: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  themeColors?: any;
}

export const ProcessSteps: React.FC<ProcessProps> = ({
  section,
  isSelected,
  onTextEdit,
  onItemEdit,
  onAddItem,
  onRemoveItem,
  readOnly,
  onElementSelect,
  onElementUpdate,
  selectedElementId,
  themeColors: passedThemeColors
}) => {
  const { content, styles } = section;
  const { themeData } = useTheme();

  const titleColor = styles.titleColor || passedThemeColors?.titleColor || themeData?.heading || '#111827';
  const textColor = styles.textColor || passedThemeColors?.textColor || themeData?.description || '#4B5563';
  const accentColor = styles.accentColor || passedThemeColors?.accentColor || themeData?.accent || '#3b82f6';
  const surfaceColor = styles.backgroundColor || passedThemeColors?.backgroundColor || themeData?.surface || '#FFFFFF';
  const subheadingColor = styles.subheadingColor || passedThemeColors?.subheadingColor || themeData?.subheading || themeData?.description || '#4B5563';
  const iconBgColor = styles.iconBgColor || passedThemeColors?.iconBgColor || themeData?.iconBg || accentColor;
  const secondaryHeadingColor = styles.secondaryHeadingColor || passedThemeColors?.secondaryHeadingColor || themeData?.secondaryHeading || titleColor;

  const themeColors = {
    ...styles,
    titleColor,
    textColor,
    accentColor,
    backgroundColor: surfaceColor,
    subheadingColor,
    iconBgColor,
    secondaryHeadingColor,
  };

  const titleId = `${section.id}-title`;
  const subtitleId = `${section.id}-subtitle`;
  const badgeId = `${section.id}-badge`;

  const getBadgeElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === badgeId);
    if (el) return el;
    return {
      id: badgeId,
      type: 'badge',
      content: { text: content.badge || 'Workflow' },
      style: { 
        backgroundColor: `${accentColor}15`, 
        color: accentColor, 
        fontSize: '12px', 
        fontWeight: '600', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '4px 12px',
        borderRadius: '9999px',
        display: 'inline-block'
      }
    };
  };

  const getTitleElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === titleId);
    if (el) return el;
    return {
      id: titleId,
      type: 'heading',
      content: { text: content.title || 'Our Process', htmlTag: 'h2' },
      style: { color: titleColor, textAlign: 'center', fontSize: '48px', fontWeight: '800', letterSpacing: '-0.02em' }
    };
  };

  const getSubtitleElement = (): WebsiteElement => {
    const el = section.elements?.find(e => e.id === subtitleId);
    if (el) return el;
    return {
      id: subtitleId,
      type: 'text',
      content: { text: content.subtitle || 'How we work', textSize: 'subheading' },
      style: { color: subheadingColor, textAlign: 'center', fontSize: '18px', fontWeight: '400' }
    };
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: surfaceColor }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${titleColor} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getBadgeElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
              buttonClass=""
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6"
          >
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getTitleElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
              buttonClass=""
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4"
          >
            <ElementsSection
              isWrapped={false}
              section={{ ...section, elements: [getSubtitleElement()] }}
              onTextEdit={onTextEdit}
              onElementUpdate={onElementUpdate || (() => {})}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              readOnly={readOnly}
              themeColors={themeColors}
              buttonClass=""
            />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 relative">
          {content.items?.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Step Number Background */}
              <div className="absolute -top-10 -left-6 text-[120px] font-black opacity-[0.03] select-none pointer-events-none leading-none" style={{ color: titleColor }}>
                0{index + 1}
              </div>

              <div className="relative z-10">
                {isSelected && (
                  <button 
                    onClick={(e) => {e.stopPropagation(); onRemoveItem(item.id);}} 
                    className="absolute -top-4 -right-4 bg-red-500 text-white w-10 h-10 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-600 z-30 border border-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                {/* Icon Container */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3 relative"
                  style={{ backgroundColor: iconBgColor, boxShadow: `0 20px 25px -5px ${iconBgColor}20` }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-20 blur-xl" style={{ backgroundColor: iconBgColor }} />
                  <div className="relative z-10" style={{ color: accentColor }}>
                    {/* Fallback to number if no icon */}
                    <span className="text-2xl font-bold">{index + 1}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="w-full mb-4">
                  <ElementsSection
                    isWrapped={false}
                    section={{
                      ...section,
                      elements: [{
                        id: `${item.id}-title`,
                        type: 'heading',
                        content: { text: item.title || '', htmlTag: 'h3' },
                        style: { color: secondaryHeadingColor, fontSize: '22px', fontWeight: '700', textAlign: 'left', letterSpacing: '-0.01em' }
                      }]
                    }}
                    onElementSelect={onElementSelect}
                    selectedElementId={selectedElementId}
                    onElementUpdate={onElementUpdate || (() => {})}
                    onTextEdit={onTextEdit}
                    readOnly={readOnly}
                    themeColors={themeColors}
                    buttonClass=""
                  />
                </div>

                {/* Description */}
                <div className="w-full">
                  <ElementsSection
                    isWrapped={false}
                    section={{
                      ...section,
                      elements: [{
                        id: `${item.id}-description`,
                        type: 'text',
                        content: { text: item.description || '' },
                        style: { color: textColor, fontSize: '16px', textAlign: 'left', lineHeight: '1.6', opacity: 0.8 }
                      }]
                    }}
                    onElementSelect={onElementSelect}
                    selectedElementId={selectedElementId}
                    onElementUpdate={onElementUpdate || (() => {})}
                    onTextEdit={onTextEdit}
                    readOnly={readOnly}
                    themeColors={themeColors}
                    buttonClass=""
                  />
                </div>

                {/* Connector Arrow (Desktop) */}
                {index < (content.items?.length || 0) - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-6" style={{ color: textColor, opacity: 0.2 }}>
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed rounded-3xl transition-all group cursor-pointer"
              style={{ borderColor: `${textColor}20`, backgroundColor: `${textColor}05` }}
              onClick={(e) => {e.stopPropagation(); onAddItem();}}
            >
              <div className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: accentColor, color: '#FFFFFF' }}>
                <Plus size={24} />
              </div>
              <span className="mt-4 text-sm font-bold uppercase tracking-widest transition-colors" style={{ color: textColor, opacity: 0.5 }}>Add Step</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
