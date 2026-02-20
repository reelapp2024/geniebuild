
import React, { useState } from 'react';
import { Section, WebsiteElement } from '../types';
import { SectionRouter } from './sections/SectionRouter';
// Removed getHeadingSizeClass - using CSS defaults with inline style overrides

interface SectionRendererProps {
  section: Section;
  onUpdate: (id: string, updates: Partial<Section>) => void;
  isSelected: boolean;
  readOnly?: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onUpload?: (sectionId: string, field: string) => void;
  // New props for deep selection
  onElementSelect?: (elementId: string) => void;
  selectedElementId?: string | null;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  section, 
  onUpdate, 
  isSelected, 
  readOnly = false,
  onClick, 
  onDelete,
  onMoveUp,
  onMoveDown,
  onUpload,
  onElementSelect,
  selectedElementId
}) => {
  const { type, content, styles } = section;

  const handleTextEdit = (key: keyof typeof content, value: string) => {
    if (readOnly) return;
    onUpdate(section.id, {
      content: { ...content, [key]: value }
    });
  };

  const handleItemEdit = (itemId: string, updates: any) => {
    if (readOnly) return;
    const newItems = content.items?.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdate(section.id, { content: { ...content, items: newItems } });
  };

  const handleElementUpdate = (elementId: string, updates: Partial<WebsiteElement>) => {
    if (readOnly) return;
    const newElements = section.elements?.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
    );
    onUpdate(section.id, { elements: newElements });
  };

  const handleLinkEdit = (index: number, newLabel: string) => {
    if (readOnly) return;
    const links = content.links || [];
    const newLinks = [...links];
    if(newLinks[index]) {
        newLinks[index] = { ...newLinks[index], label: newLabel };
        onUpdate(section.id, { content: { ...content, links: newLinks } });
    }
  };

  const addItem = () => {
    if (readOnly) return;
    const newItem = {
      id: `item-${Date.now()}`,
      title: 'New Item',
      description: 'Add a description here.',
      icon: '✨',
      price: '$29',
      features: ['Feature 1', 'Feature 2'],
      author: 'Name',
      role: 'Role',
      avatar: 'https://i.pravatar.cc/150'
    };
    onUpdate(section.id, { content: { ...content, items: [...(content.items || []), newItem] } });
  };

  const removeItem = (id: string) => {
    if (readOnly) return;
    onUpdate(section.id, { content: { ...content, items: content.items?.filter(i => i.id !== id) } });
  };

  const handleImageClick = () => {
    if (readOnly) return;
    if (onUpload) {
        onUpload(section.id, 'imageUrl');
    } else {
        const newUrl = prompt('Enter image URL:', content.imageUrl || '');
        if (newUrl !== null) {
          handleTextEdit('imageUrl', newUrl);
        }
    }
  };
  
  const handleLogoClick = () => {
    if (readOnly) return;
    if (onUpload) {
        onUpload(section.id, 'logoImageUrl');
    } else {
        const newUrl = prompt('Enter Logo URL:', content.logoImageUrl || '');
        if (newUrl !== null) {
          handleTextEdit('logoImageUrl', newUrl);
        }
    }
  };

  // Helper to detect if a string is likely a Tailwind class
  // Broadened to include common spacing prefixes
  const isTailwindClass = (val?: string) => {
    if (!val) return false;
    const prefixes = ['text-', 'pt-', 'pb-', 'pl-', 'pr-', 'px-', 'py-', 'mt-', 'mb-', 'ml-', 'mr-', 'mx-', 'my-', 'bg-', 'font-', 'rounded-', 'shadow-', 'border-'];
    return prefixes.some(p => val.startsWith(p)) && !val.includes('px') && !val.includes('rem') && !val.includes('%');
  };
  const isCustomColor = (value?: string) => value && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'));

  const inlineStyles: React.CSSProperties = {
    ...(isCustomColor(styles.backgroundColor) ? { backgroundColor: styles.backgroundColor } : {}),
    ...(isCustomColor(styles.textColor) ? { color: styles.textColor } : {}),
    ...(styles.backgroundImage ? { backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
    // Explicit mappings for non-tailwind style values
    ...(!isTailwindClass(styles.marginTop) ? { marginTop: styles.marginTop } : {}),
    ...(!isTailwindClass(styles.marginBottom) ? { marginBottom: styles.marginBottom } : {}),
    ...(!isTailwindClass(styles.marginLeft) ? { marginLeft: styles.marginLeft } : {}),
    ...(!isTailwindClass(styles.marginRight) ? { marginRight: styles.marginRight } : {}),
    ...(!isTailwindClass(styles.paddingTop) ? { paddingTop: styles.paddingTop } : {}),
    ...(!isTailwindClass(styles.paddingBottom) ? { paddingBottom: styles.paddingBottom } : {}),
    ...(!isTailwindClass(styles.paddingLeft) ? { paddingLeft: styles.paddingLeft } : {}),
    ...(!isTailwindClass(styles.paddingRight) ? { paddingRight: styles.paddingRight } : {}),
  };

  const bgClass = !isCustomColor(styles.backgroundColor) ? styles.backgroundColor : '';
  const textClass = !isCustomColor(styles.textColor) ? styles.textColor : '';
  
  // Collect all potential Tailwind classes
  const spacingClasses = [
      isTailwindClass(styles.paddingTop) ? styles.paddingTop : '',
      isTailwindClass(styles.paddingBottom) ? styles.paddingBottom : '',
      isTailwindClass(styles.paddingLeft) ? styles.paddingLeft : '',
      isTailwindClass(styles.paddingRight) ? styles.paddingRight : '',
      isTailwindClass(styles.marginTop) ? styles.marginTop : '',
      isTailwindClass(styles.marginBottom) ? styles.marginBottom : '',
      isTailwindClass(styles.marginLeft) ? styles.marginLeft : '',
      isTailwindClass(styles.marginRight) ? styles.marginRight : ''
  ].filter(Boolean).join(' ');
  
  const containerClass = `relative group transition-all duration-300 ${bgClass} ${textClass} ${spacingClasses} ${!readOnly && isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black z-10 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : (!readOnly ? 'hover:ring-1 hover:ring-white/20 cursor-pointer' : '')}`;

  const formatColorClass = (prefix: string, val?: string) => {
    if (!val) return '';
    if (val.startsWith('#') || val.startsWith('rgb')) return `${prefix}-[${val}]`;
    return val;
  };

  const btnBg = formatColorClass('bg', styles.buttonBackgroundColor) || 'bg-white';
  const btnText = formatColorClass('text', styles.buttonTextColor) || 'text-black';

  const buttonBase = `${btnBg} ${btnText} px-6 py-2 transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-current/20`;
  
  let borderRadius = 'rounded-lg';
  if (styles.borderRadius) {
      borderRadius = styles.borderRadius; 
  } else if (styles.buttonStyle === 'pill') {
      borderRadius = 'rounded-full';
  } else if (styles.buttonStyle === 'square') {
      borderRadius = 'rounded-none';
  }

  const buttonClass = `${buttonBase} ${borderRadius}`;
  
  // Get heading tag - default sizes are applied via CSS, but can be overridden by titleSize
  const headingTag = (styles.titleHeadingTag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // If titleSize is provided, use it (allows individual override)
  // Otherwise, default CSS classes will apply
  const hasCustomSize = styles.titleSize && (styles.titleSize.includes('px') || styles.titleSize.includes('rem') || styles.titleSize.includes('em'));
  
  const titleClass = `font-bold mb-6 ${!isCustomColor(styles.titleColor) ? styles.titleColor || '' : ''}`;
  
  const titleStyle = {
    ...(isCustomColor(styles.titleColor) ? { color: styles.titleColor } : {}),
    // Only apply fontSize if it's a custom override (px/rem/em), otherwise let CSS handle it
    ...(hasCustomSize ? { fontSize: styles.titleSize } : {})
  };

  const isFixedSection = type === 'navbar' || type === 'footer';

  let overlayStyle: React.CSSProperties = {};
  let overlayClass = '';

  if (styles.overlayOpacity && (styles.overlayOpacity.startsWith('bg-') || styles.overlayOpacity.startsWith('opacity-'))) {
      overlayClass = styles.overlayOpacity;
  } else if (styles.overlayOpacity && styles.overlayOpacity.startsWith('rgba')) {
      overlayStyle = { backgroundColor: styles.overlayOpacity };
  } 
  
  if (styles.overlayColor) {
      overlayStyle = { 
          backgroundColor: styles.overlayColor,
          opacity: styles.overlayOpacityValue ? (parseFloat(styles.overlayOpacityValue) > 1 ? parseFloat(styles.overlayOpacityValue)/100 : parseFloat(styles.overlayOpacityValue)) : (styles.overlayColor.startsWith('rgba') ? 1 : 0.5),
          mixBlendMode: (styles.overlayBlendMode as any) || 'normal'
      };
      overlayClass = '';
  }


  const renderContent = () => {
    // Use common SectionRouter - it handles all section types and variants using the registry
    return (
      <SectionRouter
        section={section}
        onTextEdit={handleTextEdit}
        onImageClick={handleImageClick}
        onLinkEdit={handleLinkEdit}
        onLogoClick={handleLogoClick}
        onItemEdit={handleItemEdit}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onUpload={onUpload}
        onElementUpdate={handleElementUpdate}
        onElementSelect={onElementSelect}
        selectedElementId={selectedElementId}
        buttonClass={buttonClass}
        isSelected={isSelected}
        titleClass={titleClass}
        titleStyle={titleStyle}
        readOnly={readOnly}
      />
    );
  };

  return (
    <div className={containerClass} style={inlineStyles} onClick={(e) => { if(!readOnly) { e.stopPropagation(); onClick(); }}}>
      {styles.backgroundImage && (
          <div 
            className={`absolute inset-0 z-0 ${overlayClass}`} 
            style={overlayStyle}
          ></div>
      )}
      {isSelected && !readOnly && (
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-black/90 backdrop-blur-md p-1.5 rounded-lg shadow-2xl border border-white/10">
            <div className="px-3 text-[10px] font-black uppercase tracking-widest text-white">Section {type}</div>
            
            {!isFixedSection && (
                <>
                <button onClick={(e) => { e.stopPropagation(); onMoveUp(section.id); }} className="p-2 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors" title="Move Up">
                <i className="fa-solid fa-arrow-up text-xs"></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onMoveDown(section.id); }} className="p-2 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors" title="Move Down">
                <i className="fa-solid fa-arrow-down text-xs"></i>
                </button>
                </>
            )}

            <div className="w-px h-6 bg-white/20 mx-1"></div>

            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(section.id); }}
              className="bg-red-500/10 text-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white transition-all" 
              title="Delete Section"
            >
               <i className="fa-solid fa-trash-can text-xs"></i>
            </button>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default SectionRenderer;
