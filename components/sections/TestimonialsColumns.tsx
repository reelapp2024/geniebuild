
import React from 'react';
import { Section, WebsiteElement } from '../../types';
import { ElementsSection } from './ElementsSection';

interface TestimonialsColumnsProps {
  section: Section;
  isSelected: boolean;
  onTextEdit: (key: any, value: string) => void;
  onItemEdit: (itemId: string, updates: any) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  titleClass: string;
  titleStyle?: React.CSSProperties;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  selectedElementId?: string | null;
  readOnly?: boolean;
  buttonClass?: string;
}

export const TestimonialsColumns: React.FC<TestimonialsColumnsProps> = ({ 
  section, 
  isSelected, 
  onTextEdit, 
  onItemEdit, 
  onRemoveItem, 
  onAddItem,
  titleClass,
  titleStyle,
  onElementSelect,
  onElementUpdate,
  selectedElementId,
  readOnly = false,
  buttonClass = ''
}) => {
  const { content, styles } = section;

  // Element IDs for section title and subtitle
  const titleId = `${section.id}-testimonials-title`;
  const subtitleId = `${section.id}-testimonials-subtitle`;

  // Get elements from section.elements (they exist after first edit)
  const titleElement = section.elements?.find(e => e.id === titleId);
  const subtitleElement = section.elements?.find(e => e.id === subtitleId);
  
  // Theme colors for ElementsSection - pass complete section.styles for unified styling
  const styleAny = styles as any;
  const themeColors = {
    ...styles,
    // Map heading style properties
    titleFontWeight: styleAny.titleFontWeight || styleAny.fontWeight,
    titleFontSize: styleAny.titleSize || styleAny.fontSize,
    titleAlign: styleAny.titleAlign || styles.textAlign,
    titleFontFamily: styleAny.titleFontFamily || styleAny.fontFamily,
    // Map text/subtitle style properties
    subtitleFontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight,
    subtitleFontSize: styleAny.subtitleSize || styleAny.fontSize,
    subtitleAlign: styleAny.subtitleAlign || styles.textAlign,
    subtitleFontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily,
    // Global fallback properties
    fontWeight: styleAny.fontWeight,
    fontSize: styleAny.fontSize,
    textAlign: styles.textAlign,
    fontFamily: styleAny.fontFamily,
  };
  
  // Helper to create fallback element if it doesn't exist
  const getTitleElement = (): WebsiteElement => {
    if (titleElement) return titleElement;
    
    const styleAny = styles as any;
    return {
      id: titleId,
      type: 'heading',
      content: {
        text: content.title || '',
        htmlTag: (styles.titleHeadingTag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      },
      style: {
        color: styles.titleColor || '',
        fontSize: styles.titleSize || '',
        fontWeight: styleAny.titleFontWeight || styleAny.fontWeight || 'bold',
        textAlign: (styleAny.titleAlign || styles.textAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
        fontFamily: styleAny.titleFontFamily || styleAny.fontFamily || undefined,
      }
    };
  };
  
  const getSubtitleElement = (): WebsiteElement => {
    if (subtitleElement) return subtitleElement;
    
    const styleAny = styles as any;
    return {
      id: subtitleId,
      type: 'text',
      content: {
        text: content.subtitle || '',
        textSize: 'base' as 'base' | 'small' | 'large' | 'xl'
      },
      style: {
        color: styles.subtitleColor || styles.textColor || '',
        fontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight || '400',
        textAlign: (styleAny.subtitleAlign || styles.textAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
        fontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || undefined,
      }
    };
  };

  // Helper functions for testimonial item elements
  const getStarsElement = (itemIndex: number, item: any): WebsiteElement => {
    const elementId = `${section.id}-testim-${itemIndex}-stars`;
    const existingElement = section.elements?.find(e => e.id === elementId);
    if (existingElement) return existingElement;
    
    return {
      id: elementId,
      type: 'star-rating',
      content: {
        rating: 5 // Default rating
      },
      style: {}
    };
  };

  const getQuoteElement = (itemIndex: number, item: any): WebsiteElement => {
    const elementId = `${section.id}-testim-${itemIndex}-quote`;
    const existingElement = section.elements?.find(e => e.id === elementId);
    if (existingElement) return existingElement;
    
    return {
      id: elementId,
      type: 'text',
      content: {
        text: item.description || ''
      },
      style: {
        fontStyle: 'italic',
        opacity: '0.8'
      }
    };
  };

  const getAvatarElement = (itemIndex: number, item: any): WebsiteElement => {
    const elementId = `${section.id}-testim-${itemIndex}-avatar`;
    const existingElement = section.elements?.find(e => e.id === elementId);
    if (existingElement) return existingElement;
    
    return {
      id: elementId,
      type: 'image',
      content: {
        imageUrl: item.avatar || '',
        alt: item.author || 'Avatar'
      },
      style: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        objectFit: 'cover'
      }
    };
  };

  const getNameElement = (itemIndex: number, item: any): WebsiteElement => {
    const elementId = `${section.id}-testim-${itemIndex}-name`;
    const existingElement = section.elements?.find(e => e.id === elementId);
    if (existingElement) return existingElement;
    
    return {
      id: elementId,
      type: 'heading',
      content: {
        text: item.author || '',
        htmlTag: 'h6' as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      },
      style: {
        fontWeight: 'bold'
      }
    };
  };

  const getRoleElement = (itemIndex: number, item: any): WebsiteElement => {
    const elementId = `${section.id}-testim-${itemIndex}-role`;
    const existingElement = section.elements?.find(e => e.id === elementId);
    if (existingElement) return existingElement;
    
    return {
      id: elementId,
      type: 'text',
      content: {
        text: item.role || '',
        textSize: 'small' as 'base' | 'small' | 'large' | 'xl'
      },
      style: {
        opacity: '0.5'
      }
    };
  };

  // Default items if empty
  const items = content.items && content.items.length > 0 
    ? content.items 
    : [
        { id: 'default-1', author: 'John Doe', role: 'CEO', description: 'Great product!', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'default-2', author: 'Jane Smith', role: 'Designer', description: 'Amazing service!', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'default-3', author: 'Bob Johnson', role: 'Developer', description: 'Highly recommended!', avatar: 'https://i.pravatar.cc/150?img=3' }
      ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Render Title using ElementsSection - unwrapped for custom layout */}
      <div className="mb-4 text-center">
        <ElementsSection
          section={{
            ...section,
            elements: [getTitleElement()]
          }}
          onTextEdit={onTextEdit}
          onElementUpdate={onElementUpdate || (() => {})}
          onElementSelect={onElementSelect}
          selectedElementId={selectedElementId}
          buttonClass={buttonClass}
          readOnly={readOnly}
          isWrapped={false}
          themeColors={themeColors}
        />
      </div>
      
      {/* Render Subtitle using ElementsSection - unwrapped for custom layout */}
      {content.subtitle && (
        <div className="mb-16 text-center opacity-70 max-w-2xl mx-auto">
          <ElementsSection
            section={{
              ...section,
              elements: [getSubtitleElement()]
            }}
            onTextEdit={onTextEdit}
            onElementUpdate={onElementUpdate || (() => {})}
            onElementSelect={onElementSelect}
            selectedElementId={selectedElementId}
            buttonClass={buttonClass}
            readOnly={readOnly}
            isWrapped={false}
            themeColors={themeColors}
          />
        </div>
      )}

      {/* Testimonials Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="relative group/item pl-6 border-l-2 border-white/10"
          >
            {isSelected && !readOnly && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }} 
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-xs z-20"
              >
                ×
              </button>
            )}
            
            {/* Stars Rating */}
            <div className="mb-4">
              <ElementsSection
                isWrapped={false}
                section={{
                  ...section,
                  elements: [getStarsElement(index, item)]
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
            
            {/* Quote/Description */}
            <div className="mb-6">
              <ElementsSection
                isWrapped={false}
                section={{
                  ...section,
                  elements: [getQuoteElement(index, item)]
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
            
            {/* Author Info Row */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative group/avatar">
                <ElementsSection
                  isWrapped={false}
                  section={{
                    ...section,
                    elements: [getAvatarElement(index, item)]
                  }}
                  onElementSelect={onElementSelect}
                  selectedElementId={selectedElementId}
                  onElementUpdate={onElementUpdate || (() => {})}
                  onTextEdit={onTextEdit}
                  buttonClass={buttonClass}
                  readOnly={readOnly}
                  themeColors={themeColors}
                />
                {!readOnly && (
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-[8px] uppercase font-bold tracking-tighter cursor-pointer">
                    Edit
                  </div>
                )}
              </div>
              
              {/* Name and Role */}
              <div className="text-left flex-1">
                <div className="mb-1">
                  <ElementsSection
                    isWrapped={false}
                    section={{
                      ...section,
                      elements: [getNameElement(index, item)]
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
                <div>
                  <ElementsSection
                    isWrapped={false}
                    section={{
                      ...section,
                      elements: [getRoleElement(index, item)]
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
            </div>
          </div>
        ))}
        
        {/* Add Testimonial Button */}
        {isSelected && !readOnly && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddItem();
            }} 
            className="border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition flex flex-col items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs gap-2 min-h-[200px] rounded-lg py-8 w-full"
          >
            <span className="text-2xl">+</span>
            Add Testimonial
          </button>
        )}
      </div>
    </div>
  );
};
