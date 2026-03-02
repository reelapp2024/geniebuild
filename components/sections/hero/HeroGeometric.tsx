import React from 'react';
import { Section, WebsiteElement } from '../../../types';
import { ElementsSection } from '../ElementsSection';

interface HeroProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  buttonClass: string;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
}

export const HeroGeometric: React.FC<HeroProps> = ({ 
  section, 
  onTextEdit, 
  buttonClass, 
  onElementSelect, 
  onElementUpdate,
  selectedElementId, 
  readOnly = false 
}) => {
  const { content, styles } = section;
  const styleAny = styles as any;

  // Selection Logic
  const titleId = `${section.id}-hero-title`;
  const subtitleId = `${section.id}-hero-subtitle`;
  const buttonId = `${section.id}-hero-button`;
  const badgeId = `${section.id}-hero-badge`;
  const iconId = `${section.id}-hero-icon`;

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (onElementSelect) onElementSelect(elementId);
  };
  
  // Check if geometry is enabled (default to true)
  const enableGeometry = styles.enableGeometry !== undefined ? styles.enableGeometry : true;
  
  // Get icon, badge, and button elements from section.elements
  const iconElement = section.elements?.find(e => e.id === iconId);
  const badgeElement = section.elements?.find(e => e.id === badgeId);
  const buttonElement = section.elements?.find(e => e.id === buttonId);
  
  // Get icon content and style from element or fallback to section content
  // Format icon class properly (handle both 'fa-icon' and 'icon' formats) - same as regular icon elements
  const iconValue = iconElement?.content.icon || content.icon || 'fa-wand-magic-sparkles';
  const iconClass = iconValue.startsWith('fa-') ? `fa-solid ${iconValue}` : `fa-solid fa-${iconValue}`;
  // Use iconSize from content OR fontSize from style (same as regular icon elements)
  const iconFontSize = iconElement?.content.iconSize || iconElement?.style?.fontSize || '128px';
  const iconColor = iconElement?.style?.color || 'rgba(255, 255, 255, 0.2)';
  
  // Get badge text from element or fallback to section content
  const badgeText = badgeElement?.content.text || content.badgeText || 'New Generation Builder';
  
  // Theme colors for ElementsSection - pass complete section.styles for unified styling
  const themeColors = {
    ...styles, // Include all section.styles properties
    // Explicitly map button style properties for clarity
    buttonFontWeight: styleAny.buttonFontWeight || styleAny.fontWeight,
    buttonFontSize: styleAny.buttonSize || styleAny.buttonFontSize || styleAny.fontSize,
    buttonAlign: styleAny.buttonAlign || styles.textAlign,
    buttonFontFamily: styleAny.buttonFontFamily || styleAny.fontFamily,
  };

  // Style Helpers
  const isCustomColor = (val?: string) => val && (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl'));
  
  const titleStyle: React.CSSProperties = {
    color: isCustomColor(styles.titleColor) ? styles.titleColor : undefined,
    fontSize: styles.titleSize && (styles.titleSize.includes('px') || styles.titleSize.includes('rem')) ? styles.titleSize : undefined,
    fontFamily: styleAny.titleFontFamily || styleAny.fontFamily || undefined,
  };

  const subtitleStyle: React.CSSProperties = {
    color: styles.subtitleColor || styles.textColor,
    fontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || undefined,
  };

  return (
    <div className="relative min-h-[80vh] flex items-center overflow-hidden py-20">
      {/* GEOMETRY OVERLAY - appears on top of section background (additional decorative elements for HeroGeometric) */}
      {enableGeometry && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {/* Large Gradient Orb - specific to HeroGeometric variant */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN: TEXT CONTENT */}
        <div className="lg:col-span-7 text-left">
          {/* Badge Decorator - Use element styles if available */}
          <div 
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 transition-all ${!readOnly ? 'outline-none cursor-text rounded-lg' : ''} ${selectedElementId === badgeId ? 'ring-2 ring-blue-500 bg-blue-500/10' : 'hover:bg-white/10'}`}
            style={{
              backgroundColor: badgeElement?.style?.backgroundColor || 'rgba(255, 255, 255, 0.05)',
              color: badgeElement?.style?.color || '#60a5fa',
              borderColor: badgeElement?.style?.borderColor || 'rgba(255, 255, 255, 0.1)',
              fontSize: badgeElement?.style?.fontSize || '10px',
              fontWeight: badgeElement?.style?.fontWeight || 'bold',
              textTransform: (badgeElement?.style?.textTransform as any) || 'uppercase',
              letterSpacing: badgeElement?.style?.letterSpacing || '0.2em',
              padding: (typeof badgeElement?.style?.padding === 'string' ? badgeElement.style.padding : '4px 12px') || '4px 12px',
              borderRadius: (typeof badgeElement?.style?.borderRadius === 'string' ? badgeElement.style.borderRadius : '9999px') || '9999px'
            } as React.CSSProperties}
            contentEditable={!readOnly}
            suppressContentEditableWarning={!readOnly}
            onClick={(e) => handleElementClick(e, badgeId)}
            onBlur={(e) => {
              const newText = e.currentTarget.textContent || '';
              // Update element if it exists, otherwise update section content
              if (badgeElement && onElementUpdate) {
                // Element exists, update it directly
                onElementUpdate(badgeId, { content: { text: newText } });
              } else {
                // Fallback to section content
                onTextEdit('badgeText', newText);
              }
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {badgeText}
          </div>

          <h1 
            className={`text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8 transition-all ${!readOnly ? 'outline-none cursor-text rounded-lg px-2' : ''} ${selectedElementId === titleId ? 'ring-2 ring-blue-500 bg-blue-500/5' : 'hover:bg-white/5'}`}
            style={titleStyle}
            contentEditable={!readOnly}
            suppressContentEditableWarning={!readOnly}
            onClick={(e) => handleElementClick(e, titleId)}
            onBlur={(e) => onTextEdit('title', e.currentTarget.textContent || '')}
          >
            {content.title}
          </h1>

          <p 
            className={`text-lg md:text-xl opacity-60 leading-relaxed max-w-xl mb-10 transition-all ${!readOnly ? 'outline-none cursor-text rounded-lg px-2' : ''} ${selectedElementId === subtitleId ? 'ring-2 ring-blue-500 bg-blue-500/5' : 'hover:bg-white/5'}`}
            style={subtitleStyle}
            contentEditable={!readOnly}
            suppressContentEditableWarning={!readOnly}
            onClick={(e) => handleElementClick(e, subtitleId)}
            onBlur={(e) => onTextEdit('subtitle', e.currentTarget.textContent || '')}
          >
            {content.subtitle}
          </p>

          {/* Render Button using headless ElementsSection */}
          <div className="w-full mb-10">
            <ElementsSection 
              isWrapped={false}
              section={{
                ...section,
                elements: [buttonElement || {
                  id: buttonId,
                  type: 'button',
                  content: { text: content.ctaText || 'Click Here', link: content.ctaHref || '' },
                  style: {
                    backgroundColor: styles.buttonBackgroundColor,
                    color: styles.buttonTextColor,
                    textAlign: (styles as any).buttonAlign || styles.textAlign || 'center',
                    fontWeight: (styles as any).buttonFontWeight || (styles as any).fontWeight || 'bold',
                    fontSize: (styles as any).buttonFontSize || '1.125rem'
                  }
                }]
              }}
              onElementSelect={onElementSelect}
              selectedElementId={selectedElementId}
              onElementUpdate={onElementUpdate || (() => {})}
              onTextEdit={onTextEdit}
              buttonClass={buttonClass}
              readOnly={readOnly}
              themeColors={themeColors}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: ABSTRACT VISUALS */}
        <div className="lg:col-span-5 hidden lg:block relative">
          <div className="relative w-full aspect-square">
            {/* Main Glass Card */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl transform rotate-3 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="w-full h-full opacity-20 bg-gradient-to-br from-blue-500 to-purple-600" />
                <div 
                  className={`absolute transition-all ${!readOnly ? 'cursor-pointer' : ''} ${selectedElementId === iconId ? 'ring-2 ring-blue-500 bg-blue-500/10 rounded-lg p-2' : 'hover:bg-white/5 rounded-lg p-2'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleElementClick(e, iconId);
                  }}
                  style={{ 
                    pointerEvents: readOnly ? 'none' : 'auto'
                  }}
                >
                  <i 
                    className={iconClass}
                    style={{ 
                      fontSize: iconFontSize,
                      color: iconColor
                    }}
                  />
                </div>
            </div>
            
            {/* Floating Mini Cards */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-600 rounded-2xl p-4 shadow-xl transform -rotate-6 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-8 h-1 bg-white/30 rounded mb-2" />
                <div className="w-12 h-1 bg-white/30 rounded" />
            </div>

            <div className="absolute -bottom-10 -right-6 w-48 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl transform rotate-12">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="mt-4 w-full h-2 bg-white/5 rounded" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};