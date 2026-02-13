
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
      const currentVal = value || '0px';
      const num = parseInt(currentVal) || 0;
      const step = e.shiftKey ? 10 : 1;
      const nextNum = e.key === 'ArrowUp' ? num + step : num - step;
      onChange(`${nextNum}px`);
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
        // Automatically enforce px for numeric-only inputs
        const finalVal = (val !== '' && !isNaN(Number(val))) ? `${val}px` : val;
        onChange({ top: finalVal, right: finalVal, bottom: finalVal, left: finalVal });
    };

    const updateSide = (side: keyof typeof values, val: string) => {
        // Instantly append px if it's a number to ensure CSS validity while typing
        const finalVal = (val !== '' && !isNaN(Number(val))) ? `${val}px` : val;
        onChange({ ...values, [side]: finalVal });
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
  
  useEffect(() => {
      if(selectedElementId) {
          if(editTab === 'advanced') setEditTab('content');
      }
  }, [selectedElementId]);

  useEffect(() => {
    const { colors } = siteData.globalStyles;
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
             if (uploadTarget.field === 'backgroundImage') {
                 updateSectionStyle(uploadTarget.sectionId, uploadTarget.field, base64String);
             } else {
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

  const renderStyleEditor = (styles: any, onUpdate: (key: string, val: any) => void, context: 'section' | 'element') => {
      const getSpacingValues = (type: 'margin' | 'padding') => {
        if (context === 'element') {
            const val = styles[type];
            if (typeof val === 'string') return { top: val, right: val, bottom: val, left: val };
            return val || {};
        } else {
            if (type === 'padding') return { top: styles.paddingTop, bottom: styles.paddingBottom, left: styles.paddingLeft, right: styles.paddingRight };
            return { top: styles.marginTop, bottom: styles.marginBottom, left: styles.marginLeft, right: styles.marginRight };
        }
      };

      const handleSpacingUpdate = (type: 'margin' | 'padding', newValues: any) => {
          if (context === 'element') {
              onUpdate(type, newValues);
          } else {
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
              <AccordionGroup title="Layout & Spacing" defaultOpen={true}>
                  <div className="mb-4">
                      {context === 'section' && <TextInput label="Max Width" value={styles.maxWidth} onChange={(v) => onUpdate('maxWidth', v)} placeholder="max-w-6xl" />}
                  </div>
                  <div className="space-y-4">
                      <SpacingInputGroup label="Padding" values={getSpacingValues('padding')} onChange={(v) => handleSpacingUpdate('padding', v)} />
                      <div className="h-px bg-white/5"></div>
                      <SpacingInputGroup label="Margin" values={getSpacingValues('margin')} onChange={(v) => handleSpacingUpdate('margin', v)} />
                  </div>
              </AccordionGroup>
              <AccordionGroup title="Typography" defaultOpen={true}>
                   <ColorInput label="Text Color" value={styles.textColor || styles.color} onChange={(v) => context === 'section' ? onUpdate('textColor', v) : onUpdate('color', v)} />
                   <div className="grid grid-cols-2 gap-4">
                        <TextInput label="Font Size" value={context === 'section' ? styles.titleSize : styles.fontSize} onChange={(v) => context === 'section' ? onUpdate('titleSize', v) : onUpdate('fontSize', v)} placeholder="1rem" />
                        <SelectInput label="Font Weight" value={styles.fontWeight || '400'} options={[{label: 'Normal', value: '400'}, {label: 'Bold', value: '700'}, {label: 'Black', value: '900'}, {label: 'Light', value: '300'}]} onChange={(v) => onUpdate('fontWeight', v)} />
                   </div>
                   <div className="mt-2">
                        <label className="text-[10px] font-bold text-white/40 capitalize ml-1 mb-1 block">Alignment</label>
                        <ButtonGroup value={styles.textAlign || 'left'} onChange={(v) => onUpdate('textAlign', v)} options={[{ icon: 'fa-align-left', value: 'left', label: 'Left' }, { icon: 'fa-align-center', value: 'center', label: 'Center' }, { icon: 'fa-align-right', value: 'right', label: 'Right' }, { icon: 'fa-align-justify', value: 'justify', label: 'Justify' }]} />
                   </div>
              </AccordionGroup>
              {context === 'section' && (
                  <>
                      <AccordionGroup title="Heading Styles">
                          <ColorInput label="Heading Color" value={styles.titleColor || styles.textColor} onChange={(v) => onUpdate('titleColor', v)} />
                          <div className="grid grid-cols-2 gap-4"><TextInput label="Size" value={styles.titleSize} onChange={(v) => onUpdate('titleSize', v)} placeholder="text-5xl" /></div>
                      </AccordionGroup>
                      <AccordionGroup title="Action Button">
                           <ColorInput label="Button Bg" value={styles.buttonBackgroundColor} onChange={(v) => onUpdate('buttonBackgroundColor', v)} />
                           <ColorInput label="Button Text" value={styles.buttonTextColor} onChange={(v) => onUpdate('buttonTextColor', v)} />
                           <SelectInput label="Shape" value={styles.buttonStyle || 'rounded'} options={[{label: 'Rounded', value: 'rounded'}, {label: 'Pill', value: 'pill'}, {label: 'Square', value: 'square'}]} onChange={(v) => onUpdate('buttonStyle', v)} />
                      </AccordionGroup>
                  </>
              )}
              <AccordionGroup title="Background">
                   <ColorInput label="Background Color" value={styles.backgroundColor} onChange={(v) => onUpdate('backgroundColor', v)} />
                   <div className="mt-4"><ImageControl label="Background Image" value={styles.backgroundImage} onChange={(v) => onUpdate('backgroundImage', v)} onUpload={() => triggerUpload(selectedSectionId!, 'backgroundImage')} /></div>
              </AccordionGroup>
          </div>
      );
  };

  return (
    <div className={`h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden flex flex-col`} style={{ fontFamily: siteData.globalStyles.primaryFont }}>
        <header className="h-14 border-b border-white/10 bg-[#050505] flex items-center justify-between px-4 shrink-0 z-50">
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg tracking-tighter">Genie<span className="text-blue-500">Build</span></span>
                <div className="h-4 w-px bg-white/10 mx-2"></div>
                <button onClick={() => { setSelectedSectionId(null); setSelectedElementId(null); setIsSidebarOpen(true); }} className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${!selectedSectionId ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} title="Global Design System"><i className="fa-solid fa-palette"></i>Theme</button>
            </div>
             <div className="flex items-center gap-2">
                 <div className="flex bg-[#151515] rounded p-1 border border-[#333] mr-2">
                     <button onClick={() => setViewMode('desktop')} className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'desktop' ? 'bg-[#333] text-white' : 'text-slate-500 hover:text-white'}`}><i className="fa-solid fa-desktop"></i></button>
                     <button onClick={() => setViewMode('mobile')} className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'mobile' ? 'bg-[#333] text-white' : 'text-slate-500 hover:text-white'}`}><i className="fa-solid fa-mobile-screen"></i></button>
                 </div>
                 <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${isPreviewMode ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/20 hover:bg-white/10'}`}>{isPreviewMode ? <><i className="fa-solid fa-eye-slash mr-2"></i>Edit</> : <><i className="fa-solid fa-eye mr-2"></i>Preview</>}</button>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
            <aside className={`w-80 bg-[#080808] border-r border-white/10 flex flex-col shrink-0 transition-all duration-300 absolute z-40 h-full md:relative ${isSidebarOpen && !isPreviewMode ? 'translate-x-0' : '-translate-x-full md:hidden'} ${!isPreviewMode ? 'md:translate-x-0' : 'md:-translate-x-full md:w-0 md:border-none'}`}>
                {!selectedSectionId ? (
                     <div className="flex flex-col h-full">
                         <div className="p-4 border-b border-white/10">
                            <h2 className="font-bold text-xs uppercase tracking-widest text-white/50 mb-3">Global Theme</h2>
                            <div className="flex bg-[#151515] p-1 rounded">
                                <button onClick={() => setGlobalTab('themes')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${globalTab === 'themes' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>Presets</button>
                                <button onClick={() => setGlobalTab('colors')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${globalTab === 'colors' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>Colors</button>
                            </div>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                             {globalTab === 'themes' && (
                                 <div className="space-y-4">
                                     {PRESET_THEMES.map((theme, idx) => (
                                         <button key={idx} onClick={() => applyTheme(theme)} className="group flex flex-col gap-2 p-3 rounded-xl border border-white/10 hover:border-white/30 bg-[#111] hover:bg-[#1a1a1a] transition-all"><div className="flex items-center justify-between w-full"><span className="font-bold text-xs uppercase tracking-wider text-white/80">{theme.name}</span><div className="flex gap-1"><div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: theme.elements.surface}}></div><div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: theme.elements.primaryButton.bg}}></div></div></div></button>
                                     ))}
                                 </div>
                             )}
                             {globalTab === 'colors' && (
                                <div className="space-y-4">
                                    <ColorInput label="Background" value={siteData.globalStyles.colors.backgroundColor} onChange={(v) => updateGlobalColor('backgroundColor', v)} /><ColorInput label="Text" value={siteData.globalStyles.colors.textColor} onChange={(v) => updateGlobalColor('textColor', v)} /><ColorInput label="Title" value={siteData.globalStyles.colors.titleColor} onChange={(v) => updateGlobalColor('titleColor', v)} />
                                </div>
                             )}
                         </div>
                     </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-white/10">
                             <div className="flex items-center gap-2 mb-3"><button onClick={() => { if(selectedElementId) setSelectedElementId(null); else setSelectedSectionId(null); }} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-slate-400"><i className="fa-solid fa-arrow-left text-[10px]"></i></button><div className="flex items-center text-xs font-bold capitalize truncate"><span className={selectedElementId ? 'text-slate-500' : 'text-white'}>{selectedSection?.type}</span>{selectedElementId && <><i className="fa-solid fa-chevron-right text-[8px] mx-1.5 text-slate-600"></i><span className="text-white">{selectedElement?.type}</span></>}</div></div>
                            <div className="flex gap-1 bg-[#151515] rounded p-1">
                                <button onClick={() => setEditTab('content')} className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${editTab === 'content' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>CONTENT</button><button onClick={() => setEditTab('design')} className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${editTab === 'design' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>DESIGN</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-20">
                             {selectedElementId && selectedElement && selectedSection ? (
                                 editTab === 'design' ? (renderStyleEditor(selectedElement.style, (k,v) => updateElement(selectedSection.id, selectedElement.id, { style: { ...selectedElement.style, [k]: v } }), 'element')) : (<div className="space-y-4"><TextAreaInput label="Text" value={selectedElement.content.text} onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, text: v} })} /></div>)
                             ) : (
                                 selectedSection && (
                                     editTab === 'design' ? (renderStyleEditor(selectedSection.styles, (k,v) => updateSectionStyle(selectedSection.id, k, v), 'section')) : (<div className="space-y-6"><TextAreaInput label="Heading" value={selectedSection.content.title} onChange={(v) => updateSection(selectedSection.id, { content: {...selectedSection.content, title: v} })} /></div>)
                                 )
                             )}
                        </div>
                    </div>
                )}
            </aside>
            <main className="flex-1 bg-[#111] overflow-hidden relative flex flex-col items-center justify-center p-4 md:p-8" onClick={() => { setSelectedSectionId(null); setSelectedElementId(null); }}>
                <PreviewFrame className={`transition-all duration-500 ease-in-out shadow-2xl ring-1 ring-white/10 ${viewMode === 'desktop' ? 'w-full h-full rounded-xl' : 'w-[375px] h-[667px] rounded-2xl border-[8px] border-[#222]'}`} style={{ backgroundColor: 'var(--bg-color)' }}>
                    <div id="canvas-root" className="min-h-full">
                         {siteData.sections.map((section) => (
                            <SectionRenderer key={section.id} section={section} onUpdate={updateSection} isSelected={selectedSectionId === section.id} readOnly={isPreviewMode} onClick={() => { setSelectedSectionId(section.id); setSelectedElementId(null); }} onDelete={deleteSection} onMoveUp={(id) => moveSection(id, 'up')} onMoveDown={(id) => moveSection(id, 'down')} onUpload={triggerUpload} selectedElementId={selectedElementId} onElementSelect={(elId) => { setSelectedSectionId(section.id); setSelectedElementId(elId); }} />
                        ))}
                    </div>
                </PreviewFrame>
            </main>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
    </div>
  );
};

export default App;
