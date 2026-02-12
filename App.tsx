
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { WebsiteData, Section, SectionType, WebsiteElement, ElementType } from './types';
import { INITIAL_TEMPLATE, SECTION_TEMPLATES, PRESET_THEMES } from './constants';
import { geminiService } from './services/geminiService';
import SectionRenderer from './components/SectionRenderer';
import { PreviewFrame } from './components/PreviewFrame';

// Helper lists for sidebar categorization
const BASIC_ELEMENTS: ElementType[] = ['heading', 'text', 'button', 'image', 'video', 'icon', 'icon-box', 'image-box', 'list', 'star-rating', 'badge', 'highlight-text', 'blockquote'];
const ADVANCED_ELEMENTS: ElementType[] = ['accordion', 'toggle', 'tabs', 'progress-bar', 'counter', 'testimonial', 'review-carousel', 'alert-box', 'pricing-table', 'flip-box', 'call-to-action', 'countdown-timer'];

// --- UI Components for Sidebar ---

const AccordionGroup = ({ title, children, defaultOpen = false }: { title: string, children?: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-white/5 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between w-full py-3 px-1 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
                <span>{title}</span>
                <i className={`fa-solid fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isOpen && <div className="pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
    );
};

const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const pickerValue = value && value.startsWith('#') && (value.length === 4 || value.length === 7) ? value : '#000000';
  return (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
        <div className="flex gap-2 items-center bg-[#151515] p-1 rounded border border-[#333] hover:border-[#444] transition-colors">
            <div className="relative w-5 h-5 rounded overflow-hidden flex-shrink-0 shadow-sm">
              <input 
                  type="color" 
                  className="absolute inset-[-4px] w-[150%] h-[150%] p-0 border-none cursor-pointer"
                  value={pickerValue}
                  onChange={(e) => onChange(e.target.value)}
              />
            </div>
            <input 
                type="text" 
                className="bg-transparent border-none text-white text-[10px] focus:outline-none flex-1 uppercase w-full font-mono"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="NONE"
            />
        </div>
    </div>
  );
};

const TextInput = ({ label, value, onChange, placeholder, isNumeric = false }: { label: string, value: string | undefined, onChange: (val: string) => void, placeholder?: string, isNumeric?: boolean }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isNumeric) return;
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentVal = value || '0';
      const num = parseInt(currentVal) || 0;
      const step = e.shiftKey ? 10 : 1;
      const nextNum = e.key === 'ArrowUp' ? num + step : num - step;
      // Keep unit if it exists, otherwise default to px
      const unit = currentVal.replace(/[0-9-]/g, '') || 'px';
      onChange(`${nextNum}${unit}`);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isNumeric && e.target.value && !isNaN(Number(e.target.value))) {
        onChange(`${e.target.value}px`);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
        <input 
            type="text"
            className="w-full bg-[#151515] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
        />
    </div>
  );
};

const SpacingInputGroup = ({ label, values, onChange }: { 
    label: string, 
    values: { top?: string, right?: string, bottom?: string, left?: string }, 
    onChange: (newValues: { top?: string, right?: string, bottom?: string, left?: string }) => void 
}) => {
    
    const updateAll = (val: string) => {
        const finalVal = (val && !isNaN(Number(val))) ? `${val}px` : val;
        onChange({ top: finalVal, right: finalVal, bottom: finalVal, left: finalVal });
    };

    const updateSide = (side: keyof typeof values, val: string) => {
        onChange({ ...values, [side]: val });
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</label>
                 <div className="flex items-center gap-1">
                     <span className="text-[8px] text-white/30 uppercase">All</span>
                     <input 
                        className="w-16 bg-[#151515] border border-[#333] rounded p-1 text-white text-xs focus:border-blue-500 focus:outline-none text-center"
                        placeholder="px"
                        onBlur={(e) => updateAll(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') updateAll(e.currentTarget.value);
                        }}
                     />
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <TextInput label="Top" value={values.top} onChange={(v) => updateSide('top', v)} placeholder="0px" isNumeric />
                <TextInput label="Right" value={values.right} onChange={(v) => updateSide('right', v)} placeholder="0px" isNumeric />
                <TextInput label="Bottom" value={values.bottom} onChange={(v) => updateSide('bottom', v)} placeholder="0px" isNumeric />
                <TextInput label="Left" value={values.left} onChange={(v) => updateSide('left', v)} placeholder="0px" isNumeric />
            </div>
        </div>
    );
};

const TextAreaInput = ({ label, value, onChange, rows = 3 }: { label: string, value: string | undefined, onChange: (val: string) => void, rows?: number }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
        <textarea 
            className="bg-[#151515] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
            rows={rows}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const ImageControl = ({ label, value, onChange, onUpload }: { label: string, value: string | undefined, onChange: (val: string) => void, onUpload: () => void }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
            
            {/* Image Preview */}
            {value && value.length > 10 && (
                <div className="relative w-full aspect-video bg-[#151515] rounded border border-[#333] overflow-hidden group">
                    <img src={value} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={onUpload} className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:scale-105 transition-transform shadow-lg">Change Image</button>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <input 
                    type="text" 
                    className="w-full bg-[#151515] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                />
                <button 
                    onClick={onUpload}
                    className="px-3 bg-[#222] border border-[#333] rounded hover:bg-[#333] text-white shrink-0"
                    title="Upload Image"
                >
                    <i className="fa-solid fa-upload text-xs"></i>
                </button>
            </div>
        </div>
    );
};

const RangeInput = ({ label, value, min = 0, max = 100, step = 1, onChange, unit = '' }: { label: string, value: number, min?: number, max?: number, step?: number, onChange: (val: number) => void, unit?: string }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center ml-1">
             <label className="text-[10px] font-bold text-white/40 capitalize">{label}</label>
             <span className="text-[10px] text-white/60 font-mono">{value}{unit}</span>
        </div>
        <input 
            type="range" min={min} max={max} step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
    </div>
);

const SelectInput = ({ label, value, options, onChange }: { label: string, value: string | undefined, options: {label: string, value: string}[], onChange: (val: string) => void }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
        <div className="relative">
            <select 
                className="w-full bg-[#151515] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 pointer-events-none"></i>
        </div>
    </div>
);

const ButtonGroup = ({ options, value, onChange }: { options: {icon: string, value: string, label: string}[], value: string | undefined, onChange: (val: string) => void }) => (
    <div className="flex bg-[#151515] p-1 rounded border border-[#333]">
        {options.map(opt => (
            <button 
                key={opt.value}
                className={`flex-1 py-1.5 rounded text-xs transition-all ${value === opt.value ? 'bg-[#333] text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                onClick={() => onChange(opt.value)}
                title={opt.label}
            >
                <i className={`fa-solid ${opt.icon}`}></i>
            </button>
        ))}
    </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [siteData, setSiteData] = useState<WebsiteData>(INITIAL_TEMPLATE);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null); 
  
  const [editTab, setEditTab] = useState<'content' | 'design' | 'advanced'>('content'); 
  const [globalTab, setGlobalTab] = useState<'themes' | 'colors' | 'typography'>('themes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop'); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{sectionId: string, elementId?: string, field: string} | null>(null);

  const selectedSection = useMemo(() => 
    siteData.sections.find(s => s.id === selectedSectionId), 
    [siteData.sections, selectedSectionId]
  );

  const selectedElement = useMemo(() => {
    if (!selectedSection || !selectedElementId) return null;
    return selectedSection.elements?.find(e => e.id === selectedElementId);
  }, [selectedSection, selectedElementId]);

  useEffect(() => {
    if (selectedSectionId && !isPreviewMode) {
      setIsSidebarOpen(true);
      if (selectedSection && !selectedSection.elements?.find(e => e.id === selectedElementId)) {
          setSelectedElementId(null);
      }
    } else {
      setIsSidebarOpen(false);
    }
  }, [selectedSectionId, isPreviewMode]);
  
  // Switch to Content tab when selecting a new element
  useEffect(() => {
      if(selectedElementId) {
          if(editTab === 'advanced') setEditTab('content');
      }
  }, [selectedElementId]);

  // Inject Dynamic Styles
  useEffect(() => {
    const { typography, colors } = siteData.globalStyles;
    const styleString = `:root { --bg-color: ${colors.backgroundColor}; --text-color: ${colors.textColor}; --title-color: ${colors.titleColor}; --accent-color: ${colors.accentColor}; --btn-bg: ${colors.buttonBackgroundColor}; --btn-text: ${colors.buttonTextColor}; } #canvas-root { background-color: var(--bg-color); color: var(--text-color); min-height: 100vh; }`;
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-theme-styles';
    styleEl.innerHTML = styleString;
    const existing = document.getElementById('dynamic-theme-styles');
    if (existing) existing.remove();
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); }
  }, [siteData.globalStyles]);


  const updateSection = (id: string, updates: Partial<Section>) => {
    setSiteData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...updates } as Section : s)
    }));
  };
  
  const updateElement = (sectionId: string, elementId: string, updates: Partial<WebsiteElement>) => {
      setSiteData(prev => ({
          ...prev,
          sections: prev.sections.map(s => {
              if (s.id !== sectionId) return s;
              return {
                  ...s,
                  elements: s.elements?.map(e => e.id === elementId ? { ...e, ...updates, content: {...e.content, ...updates.content}, style: {...e.style, ...updates.style}, settings: {...e.settings, ...updates.settings} } : e)
              };
          })
      }));
  };

  const updateSectionStyle = (id: string, key: string, value: any) => {
    const section = siteData.sections.find(s => s.id === id);
    if (section) updateSection(id, { styles: { ...section.styles, [key]: value } });
  };
  
  const updateGlobalColor = (key: keyof typeof siteData.globalStyles.colors, value: string) => {
      setSiteData(prev => ({
          ...prev,
          globalStyles: { ...prev.globalStyles, colors: { ...prev.globalStyles.colors, [key]: value } }
      }));
  };

  const applyTheme = (theme: typeof PRESET_THEMES[0]) => {
      const colors = theme.elements;
      
      // 1. Update Global Settings
      const newGlobalStyles = {
          ...siteData.globalStyles,
          colors: {
              backgroundColor: colors.surface,
              textColor: colors.description,
              titleColor: colors.heading,
              subtitleColor: colors.description,
              accentColor: colors.accent,
              buttonBackgroundColor: colors.primaryButton.bg,
              buttonTextColor: colors.primaryButton.text,
              linkColor: colors.ring,
              borderColor: colors.ring,
              overlayColor: colors.overlay.color
          }
      };

      // 2. Deep update all sections to enforce the new theme
      const newSections = siteData.sections.map(section => ({
          ...section,
          styles: {
              ...section.styles,
              backgroundColor: colors.surface,
              textColor: colors.description,
              titleColor: colors.heading,
              subtitleColor: colors.description,
              accentColor: colors.accent,
              buttonBackgroundColor: colors.primaryButton.bg,
              buttonTextColor: colors.primaryButton.text,
              borderColor: colors.ring,
              overlayColor: colors.overlay.color,
              // Force opacity to 1 because presets provide RGBA colors with alpha baked in
              overlayOpacityValue: '1', 
              overlayBlendMode: colors.overlay.blend || 'normal'
          }
      }));

      setSiteData(prev => ({
          ...prev,
          globalStyles: newGlobalStyles,
          sections: newSections
      }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (uploadTarget.elementId) {
             const section = siteData.sections.find(s => s.id === uploadTarget.sectionId);
             const element = section?.elements?.find(el => el.id === uploadTarget.elementId);
             if (section && element) {
                 const newContent = { ...element.content, [uploadTarget.field]: base64String };
                 updateElement(uploadTarget.sectionId, uploadTarget.elementId, { content: newContent });
             }
        } else {
             // Section background image or other fields
             if (uploadTarget.field === 'backgroundImage') {
                 updateSectionStyle(uploadTarget.sectionId, uploadTarget.field, base64String);
             } else {
                 // Section content image (logo, hero image)
                 const section = siteData.sections.find(s => s.id === uploadTarget.sectionId);
                 if(section) {
                    updateSection(uploadTarget.sectionId, { content: {...section.content, [uploadTarget.field]: base64String} });
                 }
             }
        }
        setUploadTarget(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (sectionId: string, field: string, elementId?: string) => {
    setUploadTarget({ sectionId, field, elementId });
    fileInputRef.current?.click();
  };

  const deleteSection = (id: string) => {
    setSiteData(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    setSiteData(prev => {
      const idx = prev.sections.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.sections.length) return prev;
      const newSections = [...prev.sections];
      const [moved] = newSections.splice(idx, 1);
      newSections.splice(newIdx, 0, moved);
      return { ...prev, sections: newSections };
    });
  };

  const addNewSection = (type: SectionType) => {
    const template = SECTION_TEMPLATES[type] || SECTION_TEMPLATES.hero;
    const newSection: Section = { ...template as Section, id: `section-${Date.now()}` };
    setSiteData(prev => {
        const sections = [...prev.sections];
        const heroIdx = sections.findIndex(s => s.type === 'hero');
        if (heroIdx > -1 && type !== 'navbar') sections.splice(heroIdx + 1, 0, newSection);
        else sections.push(newSection);
        return { ...prev, sections };
    });
    setSelectedSectionId(newSection.id);
    setIsAddMenuOpen(false);
  };

  // --- Comprehensive Style Editor ---

  const renderStyleEditor = (
      styles: any, 
      onUpdate: (key: string, val: any) => void, 
      context: 'section' | 'element'
    ) => {
      
      // Helper to prepare spacing values
      const getSpacingValues = (type: 'margin' | 'padding') => {
        if (context === 'element') {
            const val = styles[type];
            if (typeof val === 'string') {
                return { top: val, right: val, bottom: val, left: val };
            }
            return val || {};
        } else {
            // Section
            if (type === 'padding') {
                return {
                    top: styles.paddingTop,
                    bottom: styles.paddingBottom,
                    left: styles.paddingLeft,
                    right: styles.paddingRight
                };
            } else {
                return {
                    top: styles.marginTop,
                    bottom: styles.marginBottom,
                    left: styles.marginLeft,
                    right: styles.marginRight
                };
            }
        }
      };

      const handleSpacingUpdate = (type: 'margin' | 'padding', newValues: any) => {
          if (context === 'element') {
              // For elements, we store as an object
              onUpdate(type, newValues);
          } else {
              // For sections, we map to flat keys
              if (type === 'padding') {
                  if (newValues.top !== undefined) onUpdate('paddingTop', newValues.top);
                  if (newValues.bottom !== undefined) onUpdate('paddingBottom', newValues.bottom);
                  if (newValues.left !== undefined) onUpdate('paddingLeft', newValues.left);
                  if (newValues.right !== undefined) onUpdate('paddingRight', newValues.right);
              } else {
                  if (newValues.top !== undefined) onUpdate('marginTop', newValues.top);
                  if (newValues.bottom !== undefined) onUpdate('marginBottom', newValues.bottom);
                  if (newValues.left !== undefined) onUpdate('marginLeft', newValues.left);
                  if (newValues.right !== undefined) onUpdate('marginRight', newValues.right);
              }
          }
      };
      
      return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              
              {/* 1. LAYOUT & SPACING */}
              <AccordionGroup title="Layout & Spacing" defaultOpen={true}>
                  <div className="mb-4">
                      {context === 'section' && (
                          <TextInput label="Max Width" value={styles.maxWidth} onChange={(v) => onUpdate('maxWidth', v)} placeholder="max-w-6xl" />
                      )}
                  </div>
                  
                  <div className="space-y-4">
                      <SpacingInputGroup 
                        label="Padding" 
                        values={getSpacingValues('padding')} 
                        onChange={(v) => handleSpacingUpdate('padding', v)} 
                      />
                      
                      <div className="h-px bg-white/5"></div>

                      <SpacingInputGroup 
                        label="Margin" 
                        values={getSpacingValues('margin')} 
                        onChange={(v) => handleSpacingUpdate('margin', v)} 
                      />
                  </div>
              </AccordionGroup>

              {/* 2. TYPOGRAPHY (GENERAL) */}
              <AccordionGroup title="Typography" defaultOpen={true}>
                   <ColorInput label="Text Color" value={styles.textColor || styles.color} onChange={(v) => context === 'section' ? onUpdate('textColor', v) : onUpdate('color', v)} />
                   <div className="grid grid-cols-2 gap-4">
                        <TextInput label="Font Size" value={context === 'section' ? styles.titleSize : styles.fontSize} onChange={(v) => context === 'section' ? onUpdate('titleSize', v) : onUpdate('fontSize', v)} placeholder="1rem" />
                        <SelectInput 
                            label="Font Weight"
                            value={styles.fontWeight || 'normal'}
                            options={[{label: 'Normal', value: '400'}, {label: 'Bold', value: '700'}, {label: 'Black', value: '900'}, {label: 'Light', value: '300'}]}
                            onChange={(v) => onUpdate('fontWeight', v)}
                        />
                   </div>
                   <div className="mt-2">
                        <label className="text-[10px] font-bold text-white/40 capitalize ml-1 mb-1 block">Alignment</label>
                        <ButtonGroup 
                            value={styles.textAlign || 'left'}
                            onChange={(v) => onUpdate('textAlign', v)}
                            options={[
                                { icon: 'fa-align-left', value: 'left', label: 'Left' },
                                { icon: 'fa-align-center', value: 'center', label: 'Center' },
                                { icon: 'fa-align-right', value: 'right', label: 'Right' },
                                { icon: 'fa-align-justify', value: 'justify', label: 'Justify' }
                            ]}
                        />
                   </div>
              </AccordionGroup>
              
              {/* SECTION-SPECIFIC TYPOGRAPHY */}
              {context === 'section' && (
                  <>
                      <AccordionGroup title="Heading Styles">
                          <ColorInput label="Heading Color" value={styles.titleColor || styles.textColor} onChange={(v) => onUpdate('titleColor', v)} />
                          <div className="grid grid-cols-2 gap-4">
                              <TextInput label="Size" value={styles.titleSize} onChange={(v) => onUpdate('titleSize', v)} placeholder="text-5xl" />
                          </div>
                      </AccordionGroup>
                      
                      <AccordionGroup title="Subtitle Styles">
                           <ColorInput label="Subtitle Color" value={styles.subtitleColor || styles.textColor} onChange={(v) => onUpdate('subtitleColor', v)} />
                           <TextInput label="Size" value={styles.subtitleSize} onChange={(v) => onUpdate('subtitleSize', v)} placeholder="text-xl" />
                      </AccordionGroup>

                      <AccordionGroup title="Action Button">
                           <ColorInput label="Button Bg" value={styles.buttonBackgroundColor} onChange={(v) => onUpdate('buttonBackgroundColor', v)} />
                           <ColorInput label="Button Text" value={styles.buttonTextColor} onChange={(v) => onUpdate('buttonTextColor', v)} />
                           <SelectInput 
                              label="Shape"
                              value={styles.buttonStyle || 'rounded'}
                              options={[{label: 'Rounded', value: 'rounded'}, {label: 'Pill', value: 'pill'}, {label: 'Square', value: 'square'}]}
                              onChange={(v) => onUpdate('buttonStyle', v)}
                           />
                      </AccordionGroup>
                  </>
              )}

              {/* 3. BACKGROUND & OVERLAY */}
              <AccordionGroup title="Background">
                   <ColorInput label="Background Color" value={styles.backgroundColor} onChange={(v) => onUpdate('backgroundColor', v)} />
                   
                   <div className="mt-4">
                       <ImageControl 
                            label="Background Image" 
                            value={styles.backgroundImage} 
                            onChange={(v) => onUpdate('backgroundImage', v)} 
                            onUpload={() => triggerUpload(selectedSectionId!, 'backgroundImage')}
                       />
                   </div>

                   {context === 'section' && (
                       <div className="mt-4 p-3 bg-white/5 rounded border border-white/5">
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">Overlay</h4>
                           <ColorInput label="Overlay Color" value={styles.overlayColor} onChange={(v) => onUpdate('overlayColor', v)} />
                           <div className="mt-2">
                                <RangeInput 
                                    label="Opacity" 
                                    value={parseFloat(styles.overlayOpacityValue || '0')} 
                                    max={1} 
                                    step={0.1} 
                                    onChange={(v) => onUpdate('overlayOpacityValue', v.toString())} 
                                />
                           </div>
                           <div className="mt-2">
                                <SelectInput 
                                    label="Blend Mode"
                                    value={styles.overlayBlendMode || 'normal'}
                                    options={[
                                        {label: 'Normal', value: 'normal'},
                                        {label: 'Multiply', value: 'multiply'},
                                        {label: 'Screen', value: 'screen'},
                                        {label: 'Overlay', value: 'overlay'},
                                        {label: 'Darken', value: 'darken'},
                                        {label: 'Lighten', value: 'lighten'}
                                    ]}
                                    onChange={(v) => onUpdate('overlayBlendMode', v)}
                                />
                           </div>
                       </div>
                   )}
              </AccordionGroup>

              {/* 4. BORDERS & EFFECTS */}
              <AccordionGroup title="Borders & Effects">
                   <div className="grid grid-cols-2 gap-4">
                        <TextInput label="Border Radius" value={styles.borderRadius} onChange={(v) => onUpdate('borderRadius', v)} placeholder="0px" />
                        <ColorInput label="Border Color" value={styles.borderColor} onChange={(v) => onUpdate('borderColor', v)} />
                   </div>
                   <div className="mt-4">
                       <RangeInput label="Opacity" value={parseFloat(styles.opacity || '1')} max={1} step={0.1} onChange={(v) => onUpdate('opacity', v)} />
                   </div>
                   <div className="mt-2">
                       <TextInput label="Box Shadow" value={styles.boxShadow} onChange={(v) => onUpdate('boxShadow', v)} placeholder="0 4px 6px rgba(0,0,0,0.1)" />
                   </div>
              </AccordionGroup>

          </div>
      );
  };


  // --- Main Render ---

  return (
    <div className={`h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden flex flex-col`} style={{ fontFamily: siteData.globalStyles.primaryFont }}>
        <header className="h-14 border-b border-white/10 bg-[#050505] flex items-center justify-between px-4 shrink-0 z-50">
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg tracking-tighter">Genie<span className="text-blue-500">Build</span></span>
                <div className="h-4 w-px bg-white/10 mx-2"></div>
                <button 
                  onClick={() => { setSelectedSectionId(null); setSelectedElementId(null); setIsSidebarOpen(true); }} 
                  className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${!selectedSectionId ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} 
                  title="Global Design System"
                >
                    <i className="fa-solid fa-palette"></i>Theme
                </button>
            </div>
             <div className="flex items-center gap-2">
                 <div className="flex bg-[#151515] rounded p-1 border border-[#333] mr-2">
                     <button onClick={() => setViewMode('desktop')} className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'desktop' ? 'bg-[#333] text-white' : 'text-slate-500 hover:text-white'}`}><i className="fa-solid fa-desktop"></i></button>
                     <button onClick={() => setViewMode('mobile')} className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'mobile' ? 'bg-[#333] text-white' : 'text-slate-500 hover:text-white'}`}><i className="fa-solid fa-mobile-screen"></i></button>
                 </div>
                 <button 
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${isPreviewMode ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/20 hover:bg-white/10'}`}
                >
                    {isPreviewMode ? <><i className="fa-solid fa-eye-slash mr-2"></i>Edit</> : <><i className="fa-solid fa-eye mr-2"></i>Preview</>}
                </button>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
            {/* SIDEBAR */}
            <aside className={`w-80 bg-[#080808] border-r border-white/10 flex flex-col shrink-0 transition-all duration-300 absolute z-40 h-full md:relative ${isSidebarOpen && !isPreviewMode ? 'translate-x-0' : '-translate-x-full md:hidden'} ${!isPreviewMode ? 'md:translate-x-0' : 'md:-translate-x-full md:w-0 md:border-none'}`}>
                
                {/* 1. NO SELECTION: GLOBAL DESIGN SYSTEM */}
                {!selectedSectionId ? (
                     <div className="flex flex-col h-full">
                         <div className="p-4 border-b border-white/10">
                            <h2 className="font-bold text-xs uppercase tracking-widest text-white/50 mb-3">Global Theme</h2>
                            <div className="flex bg-[#151515] p-1 rounded">
                                <button onClick={() => setGlobalTab('themes')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${globalTab === 'themes' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>Presets</button>
                                <button onClick={() => setGlobalTab('colors')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${globalTab === 'colors' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>Colors</button>
                                <button onClick={() => setGlobalTab('typography')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${globalTab === 'typography' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>Type</button>
                            </div>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                             {globalTab === 'themes' && (
                                 <div className="space-y-4">
                                     <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-2">Select a Preset</p>
                                     <div className="grid grid-cols-1 gap-4">
                                         {PRESET_THEMES.map((theme, idx) => (
                                             <button 
                                                key={idx}
                                                onClick={() => applyTheme(theme)}
                                                className="group flex flex-col gap-2 p-3 rounded-xl border border-white/10 hover:border-white/30 bg-[#111] hover:bg-[#1a1a1a] transition-all"
                                             >
                                                 <div className="flex items-center justify-between w-full">
                                                     <span className="font-bold text-xs uppercase tracking-wider text-white/80">{theme.name}</span>
                                                     <div className="flex gap-1">
                                                          <div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: theme.elements.surface}} title="Background"></div>
                                                          <div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: theme.elements.heading}} title="Text"></div>
                                                          <div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: theme.elements.primaryButton.bg}} title="Primary"></div>
                                                          <div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: theme.elements.accent}} title="Accent"></div>
                                                     </div>
                                                 </div>
                                                 <div className="w-full h-12 rounded-lg overflow-hidden relative shadow-inner mt-1">
                                                      {/* Preview Composition */}
                                                      <div className="absolute inset-0" style={{backgroundColor: theme.elements.surface}}></div>
                                                      <div className="absolute top-3 left-3 right-3 h-2 rounded-full opacity-40" style={{backgroundColor: theme.elements.heading, width: '60%'}}></div>
                                                      <div className="absolute top-7 left-3 h-2 rounded-full opacity-20" style={{backgroundColor: theme.elements.description, width: '40%'}}></div>
                                                      <div className="absolute bottom-3 right-3 w-8 h-4 rounded" style={{backgroundColor: theme.elements.primaryButton.bg}}></div>
                                                 </div>
                                             </button>
                                         ))}
                                     </div>
                                 </div>
                             )}
                             {globalTab === 'colors' && (
                                <div className="space-y-4">
                                    <ColorInput label="Background" value={siteData.globalStyles.colors.backgroundColor} onChange={(v) => updateGlobalColor('backgroundColor', v)} />
                                    <ColorInput label="Text" value={siteData.globalStyles.colors.textColor} onChange={(v) => updateGlobalColor('textColor', v)} />
                                    <ColorInput label="Title" value={siteData.globalStyles.colors.titleColor} onChange={(v) => updateGlobalColor('titleColor', v)} />
                                    <ColorInput label="Primary / Accent" value={siteData.globalStyles.colors.accentColor} onChange={(v) => updateGlobalColor('accentColor', v)} />
                                    <ColorInput label="Button Bg" value={siteData.globalStyles.colors.buttonBackgroundColor} onChange={(v) => updateGlobalColor('buttonBackgroundColor', v)} />
                                    <ColorInput label="Button Text" value={siteData.globalStyles.colors.buttonTextColor} onChange={(v) => updateGlobalColor('buttonTextColor', v)} />
                                </div>
                             )}
                              {globalTab === 'typography' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded border border-white/10 text-xs text-white/50 text-center">
                                        Typography controls coming soon.
                                    </div>
                                </div>
                             )}
                         </div>
                     </div>
                ) : (
                    // 2. SELECTION ACTIVE (SECTION OR ELEMENT)
                    <div className="flex flex-col h-full">
                        {/* Header with Breadcrumb */}
                        <div className="p-4 border-b border-white/10">
                             <div className="flex items-center gap-2 mb-3">
                                <button onClick={() => { if(selectedElementId) setSelectedElementId(null); else setSelectedSectionId(null); }} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-slate-400"><i className="fa-solid fa-arrow-left text-[10px]"></i></button>
                                <div className="flex items-center text-xs font-bold capitalize truncate">
                                    <span className={selectedElementId ? 'text-slate-500' : 'text-white'}>{selectedSection?.type.replace('-',' ')}</span>
                                    {selectedElementId && (
                                        <>
                                            <i className="fa-solid fa-chevron-right text-[8px] mx-1.5 text-slate-600"></i>
                                            <span className="text-white">{selectedElement?.type.replace('-',' ')}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Tabs */}
                            <div className="flex gap-1 bg-[#151515] rounded p-1">
                                <button onClick={() => setEditTab('content')} className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${editTab === 'content' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>CONTENT</button>
                                <button onClick={() => setEditTab('design')} className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${editTab === 'design' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>DESIGN</button>
                                {selectedElementId && (
                                    <button onClick={() => setEditTab('advanced')} className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${editTab === 'advanced' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>ADVANCED</button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-20">
                             {/* 3. ELEMENT EDITOR */}
                             {selectedElementId && selectedElement && selectedSection ? (
                                 editTab === 'design' ? (
                                     renderStyleEditor(selectedElement.style, (k,v) => updateElement(selectedSection.id, selectedElement.id, { style: { ...selectedElement.style, [k]: v } }), 'element')
                                 ) : editTab === 'content' ? (
                                     <div className="space-y-4">
                                         {/* Basic Content inputs like Text, Subtext */}
                                         {['heading','text','button','badge','blockquote','icon-box','image-box','star-rating','alert-box','counter','call-to-action','toggle','pricing-table','countdown-timer'].includes(selectedElement.type) && (
                                            <TextAreaInput 
                                                label="Text Content" 
                                                value={selectedElement.content.text} 
                                                onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, text: v} })} 
                                            />
                                         )}
                                          {['icon-box','image-box','alert-box','toggle', 'call-to-action', 'hero', 'image-banner'].includes(selectedElement.type) && (
                                             <TextAreaInput 
                                                label="Subtext" 
                                                value={selectedElement.content.subText} 
                                                onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, subText: v} })} 
                                            />
                                         )}
                                         {['image','video','image-box'].includes(selectedElement.type) && (
                                             <ImageControl 
                                                label="Source URL" 
                                                value={selectedElement.content.src} 
                                                onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, src: v} })}
                                                onUpload={() => triggerUpload(selectedSection.id, 'src', selectedElement.id)}
                                             />
                                         )}
                                     </div>
                                 ) : (
                                     <div className="space-y-4">
                                         <SelectInput 
                                            label="Animation"
                                            value={selectedElement.settings?.animation || 'none'}
                                            options={[{label: 'None', value: 'none'}, {label: 'Fade In', value: 'fade'}, {label: 'Slide Up', value: 'slide'}, {label: 'Zoom In', value: 'zoom'}]}
                                            onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { settings: { ...selectedElement.settings, animation: v as any } })}
                                         />
                                         <TextInput label="Custom Class" value={selectedElement.settings?.className} onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { settings: { ...selectedElement.settings, className: v } })} />
                                     </div>
                                 )
                             ) : (
                                 // 4. SECTION EDITOR
                                 selectedSection && (
                                     editTab === 'design' ? (
                                         renderStyleEditor(selectedSection.styles, (k,v) => updateSectionStyle(selectedSection.id, k, v), 'section')
                                     ) : (
                                         <div className="space-y-6">
                                              
                                              {/* EDITABLE FIELDS FOR CONTENT-BASED SECTIONS (Hero, CTA, etc) */}
                                              {(selectedSection.content.title !== undefined || selectedSection.content.subtitle !== undefined || selectedSection.content.description !== undefined) && (
                                                  <div className="space-y-4 border-b border-white/10 pb-6 mb-2">
                                                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Section Content</h3>
                                                      
                                                      {/* Title */}
                                                      {(selectedSection.content.title !== undefined) && (
                                                          <TextAreaInput 
                                                            label="Heading"
                                                            value={selectedSection.content.title}
                                                            onChange={(v) => updateSection(selectedSection.id, { content: {...selectedSection.content, title: v} })}
                                                            rows={2}
                                                          />
                                                      )}
                                                      
                                                      {/* Subtitle */}
                                                      {(selectedSection.content.subtitle !== undefined) && (
                                                          <TextAreaInput 
                                                            label="Subtitle"
                                                            value={selectedSection.content.subtitle}
                                                            onChange={(v) => updateSection(selectedSection.id, { content: {...selectedSection.content, subtitle: v} })}
                                                          />
                                                      )}

                                                      {/* Description */}
                                                      {(selectedSection.content.description !== undefined) && (
                                                          <TextAreaInput 
                                                            label="Description"
                                                            value={selectedSection.content.description}
                                                            onChange={(v) => updateSection(selectedSection.id, { content: {...selectedSection.content, description: v} })}
                                                            rows={4}
                                                          />
                                                      )}

                                                      {/* CTA Text */}
                                                      {(selectedSection.content.ctaText !== undefined) && (
                                                          <TextInput 
                                                              label="Button Text" 
                                                              value={selectedSection.content.ctaText} 
                                                              onChange={(v) => updateSection(selectedSection.id, { content: {...selectedSection.content, ctaText: v} })} 
                                                          />
                                                      )}

                                                       {/* Image URL with Preview */}
                                                      {(selectedSection.content.imageUrl !== undefined) && (
                                                           <div className="pt-2">
                                                               <ImageControl 
                                                                    label="Main Image" 
                                                                    value={selectedSection.content.imageUrl} 
                                                                    onChange={(v) => updateSection(selectedSection.id, { content: {...selectedSection.content, imageUrl: v} })}
                                                                    onUpload={() => triggerUpload(selectedSection.id, 'imageUrl')}
                                                               />
                                                           </div>
                                                      )}

                                                      {/* Logo URL with Preview */}
                                                      {(selectedSection.content.logoImageUrl !== undefined) && (
                                                           <div className="pt-2">
                                                               <ImageControl 
                                                                    label="Logo Image" 
                                                                    value={selectedSection.content.logoImageUrl} 
                                                                    onChange={(v) => updateSection(selectedSection.id, { content: {...selectedSection.content, logoImageUrl: v} })}
                                                                    onUpload={() => triggerUpload(selectedSection.id, 'logoImageUrl')}
                                                               />
                                                           </div>
                                                      )}
                                                  </div>
                                              )}

                                             {selectedSection.elements && (
                                                 <div className="space-y-2">
                                                     <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Child Elements</label>
                                                     {selectedSection.elements.map(el => (
                                                          <button 
                                                            key={el.id}
                                                            onClick={() => setSelectedElementId(el.id)}
                                                            className="w-full text-left p-2.5 rounded bg-[#1a1a1a] border border-[#333] hover:border-white/30 text-xs flex justify-between items-center group transition-colors"
                                                         >
                                                             <span className="capitalize font-bold text-slate-300">{el.type.replace('-',' ')}</span>
                                                             <i className="fa-solid fa-chevron-right text-[10px] opacity-0 group-hover:opacity-50"></i>
                                                         </button>
                                                     ))}
                                                 </div>
                                             )}
                                         </div>
                                     )
                                 )
                             )}
                        </div>
                    </div>
                )}
            </aside>

            {/* CANVAS */}
            <main className="flex-1 bg-[#111] overflow-hidden relative flex flex-col items-center justify-center p-4 md:p-8" onClick={() => { setSelectedSectionId(null); setSelectedElementId(null); }}>
                <PreviewFrame 
                    className={`
                        transition-all duration-500 ease-in-out shadow-2xl ring-1 ring-white/10
                        ${viewMode === 'desktop' && !isPreviewMode ? 'w-full h-full rounded-xl' : ''}
                        ${viewMode === 'desktop' && isPreviewMode ? 'w-full h-full rounded-none' : ''}
                        ${viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-2xl border-[8px] border-[#222]' : ''}
                    `}
                    style={{ backgroundColor: 'var(--bg-color)' }}
                >
                    <div id="canvas-root" className="min-h-full">
                         {siteData.sections.map((section) => (
                            <SectionRenderer 
                                key={section.id} 
                                section={section} 
                                onUpdate={updateSection}
                                isSelected={selectedSectionId === section.id}
                                readOnly={isPreviewMode}
                                onClick={() => { setSelectedSectionId(section.id); setSelectedElementId(null); }}
                                onDelete={deleteSection}
                                onMoveUp={(id) => moveSection(id, 'up')}
                                onMoveDown={(id) => moveSection(id, 'down')}
                                onUpload={triggerUpload}
                                // Pass selection down
                                selectedElementId={selectedElementId}
                                onElementSelect={(elId) => { setSelectedSectionId(section.id); setSelectedElementId(elId); }}
                            />
                        ))}
                    </div>
                </PreviewFrame>
            </main>

            {/* ADD SECTION MODAL */}
            {isAddMenuOpen && !isPreviewMode && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setIsAddMenuOpen(false)}>
                    <div className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Add Section</h2>
                            <button onClick={() => setIsAddMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(SECTION_TEMPLATES).map(([key, template]) => (
                                <button 
                                    key={key}
                                    onClick={() => addNewSection(key as SectionType)}
                                    className="aspect-square bg-[#0a0a0a] border border-white/10 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-4 group"
                                >
                                    <span className="font-bold capitalize">{key.replace('-', ' ')}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        </div>
    </div>
  );
};

export default App;
