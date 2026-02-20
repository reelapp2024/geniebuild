
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { WebsiteData, Section, SectionType, WebsiteElement, ElementType } from './types';
import { INITIAL_TEMPLATE, SECTION_TEMPLATES, PRESET_THEMES, PRESET_FONTS } from './constants';
import { geminiService } from './services/geminiService';
import SectionRenderer from './components/SectionRenderer';
import { PreviewFrame } from './components/PreviewFrame';
import toast, { Toaster } from 'react-hot-toast';

// Get URL parameters
const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  // If token is in URL, save it to localStorage for future use
  if (token) {
    localStorage.setItem('token', token);
    // Remove token from URL for security (clean URL)
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('token');
    window.history.replaceState({}, '', newUrl.toString());
  }
  
  return {
    projectId: params.get('projectId'),
    pageId: params.get('pageId'),
    token: token || localStorage.getItem('token'),
  };
};

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

const FontSizeInput = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => {
  // Parse value to extract number and unit
  const parseValue = (val: string) => {
    const match = val.match(/^([\d.]+)(px|rem|em)$/);
    if (match) {
      return { num: parseFloat(match[1]), unit: match[2] };
    }
    return { num: 0, unit: 'rem' };
  };

  const currentValue = value || placeholder || '1rem';
  const parsed = parseValue(currentValue);
  const [selectedUnit, setSelectedUnit] = useState<'px' | 'rem' | 'em'>(parsed.unit as 'px' | 'rem' | 'em' || 'rem');
  const [displayNum, setDisplayNum] = useState<string>(parsed.num.toString());
  
  // Update display when value prop changes
  React.useEffect(() => {
    const parsed = parseValue(value || placeholder || '1rem');
    setDisplayNum(parsed.num.toString());
    setSelectedUnit(parsed.unit as 'px' | 'rem' | 'em' || 'rem');
  }, [value, placeholder]);

  const handleIncrement = () => {
    const step = selectedUnit === 'px' ? 1 : 0.125;
    const currentNum = parseFloat(displayNum) || 0;
    const newNum = currentNum + step;
    const newValue = `${newNum}${selectedUnit}`;
    setDisplayNum(newNum.toString());
    onChange(newValue);
  };

  const handleDecrement = () => {
    const step = selectedUnit === 'px' ? 1 : 0.125;
    const currentNum = parseFloat(displayNum) || 0;
    const newNum = Math.max(0.125, currentNum - step);
    const newValue = `${newNum}${selectedUnit}`;
    setDisplayNum(newNum.toString());
    onChange(newValue);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setDisplayNum(inputVal);
    
    // If it's just a number, add the unit
    if (/^\d+\.?\d*$/.test(inputVal)) {
      onChange(`${inputVal}${selectedUnit}`);
    } else if (/^\d+\.?\d*(px|rem|em)$/.test(inputVal)) {
      onChange(inputVal);
      // Update unit if changed
      const match = inputVal.match(/(px|rem|em)$/);
      if (match) setSelectedUnit(match[1] as 'px' | 'rem' | 'em');
    } else {
      onChange(inputVal);
    }
  };
  
  const handleUnitChange = (newUnit: 'px' | 'rem' | 'em') => {
    setSelectedUnit(newUnit);
    const currentNum = parseFloat(displayNum) || 0;
    onChange(`${currentNum}${newUnit}`);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
      <div className="flex gap-2 items-center">
        <button
          onClick={handleDecrement}
          className="w-8 h-8 flex items-center justify-center bg-[#222] border border-[#333] rounded hover:bg-[#333] transition-colors text-white text-xs font-bold"
        >
          −
        </button>
        <div className="flex-1 flex gap-1 items-center bg-[#151515] border border-[#333] rounded p-1">
          <input
            type="text"
            className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none text-center font-mono"
            value={displayNum}
            onChange={handleValueChange}
            placeholder={parsed.num.toString()}
          />
          <select
            value={selectedUnit}
            onChange={(e) => handleUnitChange(e.target.value as 'px' | 'rem' | 'em')}
            className="bg-[#222] border border-[#333] rounded px-2 py-1 text-white text-[10px] focus:outline-none cursor-pointer"
          >
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
          </select>
        </div>
        <button
          onClick={handleIncrement}
          className="w-8 h-8 flex items-center justify-center bg-[#222] border border-[#333] rounded hover:bg-[#333] transition-colors text-white text-xs font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
};

const SelectInput = ({ label, value, options, onChange }: { label: string, value: string | undefined, options: {label: string, value: string}[], onChange: (val: string) => void }) => {
    const currentValue = value || options[0]?.value || '';
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
            <div className="relative">
                <select 
                    className="w-full bg-[#151515] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    value={currentValue}
                    onChange={(e) => {
                        e.preventDefault();
                        onChange(e.target.value);
                    }}
                >
                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 pointer-events-none"></i>
            </div>
        </div>
    );
};

const ButtonGroup = ({ options, value, onChange }: { options: {icon: string, value: string, label: string}[], value: string | undefined, onChange: (val: string) => void }) => {
    const currentValue = value || 'left'; // Default to 'left' if undefined
    return (
        <div className="flex bg-[#151515] p-1 rounded border border-[#333]">
            {options.map(opt => (
                <button 
                    key={opt.value}
                    className={`flex-1 py-1.5 rounded text-xs transition-all ${currentValue === opt.value ? 'bg-[#333] text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                    onClick={() => onChange(opt.value)}
                    title={opt.label}
                >
                    <i className={`fa-solid ${opt.icon}`}></i>
                </button>
            ))}
        </div>
    );
};

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
  const [loadingPageData, setLoadingPageData] = useState(false);
  const [savingPageData, setSavingPageData] = useState(false);
  
  // Theme settings state
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [defaultSizes, setDefaultSizes] = useState({
    h1: '3rem',      // 48px
    h2: '2.5rem',    // 40px
    h3: '2rem',      // 32px
    h4: '1.5rem',    // 24px
    h5: '1.25rem',   // 20px
    h6: '1rem',      // 16px
    text: '1rem',    // 16px
    textSmall: '0.875rem',  // 14px
    textLarge: '1.125rem',  // 18px
    textXl: '1.25rem'       // 20px
  });
  const [defaultTypography, setDefaultTypography] = useState({
    fontFamily: 'Inter, sans-serif'
  });
  const [savingTheme, setSavingTheme] = useState(false);

  // Load page data from API if projectId and pageId are in URL
  useEffect(() => {
    const { projectId, pageId } = getUrlParams();
    if (projectId && pageId) {
      loadPageData(projectId, pageId);
    }
    if (projectId) {
      loadThemeSettings(projectId);
    }
  }, []);

  const loadPageData = async (projectId: string, pageId: string) => {
    try {
      setLoadingPageData(true);
      const { token } = getUrlParams();
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:1111/admin/v1';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/getWebsiteDesignData/${projectId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch website data');
      }

      const data = await response.json();
      if (data?.data?.pages) {
        // Find the specific page
        const pageData = data.data.pages.find((p: any) => {
          const currentPageId = p.pageId?._id || p.pageId;
          return String(currentPageId) === String(pageId);
        });

        if (pageData && pageData.style?.renderer === 'geniebuild' && pageData.componentIds && Array.isArray(pageData.componentIds)) {
          // Extract sectionData from componentIds (single source of truth)
          const genieBuildSections: Section[] = pageData.componentIds
            .map((compData: any) => compData.sectionData)
            .filter((section: any) => section != null) as Section[];
          
          // Extract global colors from design data
          const globalColors = {
            backgroundColor: data.data.colorSecondary || '#0E1214',
            textColor: data.data.colorAccent || '#D1D5DB',
            titleColor: data.data.colorAccent || '#F8FAFC',
            subtitleColor: data.data.colorAccent || '#D1D5DB',
            accentColor: data.data.colorAccent || '#F8FAFC',
            buttonBackgroundColor: data.data.colorPrimary || '#E11D48',
            buttonTextColor: '#FFFFFF',
            linkColor: data.data.colorAccent || '#F8FAFC',
            borderColor: data.data.colorAccent || '#D1D5DB'
          };

          setSiteData({
            ...INITIAL_TEMPLATE,
            sections: genieBuildSections,
            globalStyles: {
              ...INITIAL_TEMPLATE.globalStyles,
              colors: globalColors,
            },
          });
        } else {
          console.warn('Page does not have GenieBuild sections');
        }
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setLoadingPageData(false);
    }
  };

  const savePageData = async () => {
    const { projectId, pageId, token } = getUrlParams();
    if (!projectId || !pageId) {
      toast.error('Missing projectId or pageId in URL');
      return;
    }

    if (!token) {
      toast.error('Authentication token not found. Please open GenieBuild from the admin panel.');
      return;
    }

    try {
      setSavingPageData(true);
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:1111/admin/v1';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      
      // Transform siteData back to the format expected by the API
      // We need to fetch the current page data first to get componentIds structure
      const getResponse = await fetch(`${apiUrl}/getWebsiteDesignData/${projectId}`, {
        method: 'GET',
        headers,
      });

      if (!getResponse.ok) {
        throw new Error('Failed to fetch current website data');
      }

      const getData = await getResponse.json();
      if (!getData?.data?.pages) {
        throw new Error('No pages data found');
      }

      // Find the specific page
      const currentPageData = getData.data.pages.find((p: any) => {
        const currentPageId = p.pageId?._id || p.pageId;
        return String(currentPageId) === String(pageId);
      });

      if (!currentPageData || !currentPageData.componentIds) {
        throw new Error('Page data not found or invalid');
      }

      // Update componentIds with new sectionData from siteData
      // Match sections by type and update sectionData, preserving componentId structure
      const updatedComponentIds = currentPageData.componentIds.map((compData: any) => {
        // Find matching section by type
        const matchingSection = siteData.sections.find((s: Section) => s.type === compData.sectionData?.type);
        if (matchingSection) {
          return {
            ...compData,
            sectionData: matchingSection
          };
        }
        // Keep existing component if no match found (section might have been removed from editor)
        return compData;
      });

      // Prepare the save payload
      const savePayload = {
        projectId,
        colorPrimary: siteData.globalStyles.colors.buttonBackgroundColor || '#E11D48',
        colorSecondary: siteData.globalStyles.colors.backgroundColor || '#0E1214',
        colorAccent: siteData.globalStyles.colors.titleColor || '#F8FAFC',
        pages: [{
          pageId,
          style: {
            renderer: 'geniebuild'
          },
          componentIds: updatedComponentIds
        }]
      };

      const saveResponse = await fetch(`${apiUrl}/saveWebsiteDesignData`, {
        method: 'POST',
        headers,
        body: JSON.stringify(savePayload),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || 'Failed to save website data');
      }

      // Also save theme settings if they exist
      try {
        const themePayload: any = {
          projectId,
          theme: selectedPresetId ? 
            PRESET_THEMES[parseInt(selectedPresetId)]?.name.toLowerCase().replace(/\s+/g, '-') || 'custom' :
            'custom',
          presetId: null, // Backend will look up presetId from theme name
          defaultSizes,
          defaultTypography
        };
        
        // Only include customColors if it's a custom theme
        if (themePayload.theme === 'custom') {
          themePayload.customColors = {
            heading: siteData.globalStyles.colors.titleColor,
            description: siteData.globalStyles.colors.textColor,
            surface: siteData.globalStyles.colors.backgroundColor,
            primaryButton: {
              bg: siteData.globalStyles.colors.buttonBackgroundColor,
              text: siteData.globalStyles.colors.buttonTextColor
            },
            accent: siteData.globalStyles.colors.accentColor
          };
        }
        
        const themeResponse = await fetch(`${apiUrl}/updateProjectTheme`, {
          method: 'POST',
          headers,
          body: JSON.stringify(themePayload)
        });
        
        if (!themeResponse.ok) {
          console.warn('Failed to save theme settings, but page data was saved');
        }
      } catch (themeError) {
        console.warn('Error saving theme settings:', themeError);
        // Don't fail the whole save if theme save fails
      }

      toast.success('Website changes saved successfully!');
    } catch (error: any) {
      console.error('Error saving page data:', error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSavingPageData(false);
    }
  };

  const selectedSection = useMemo(() => {
    const section = siteData.sections.find(s => s.id === selectedSectionId);
    return section;
  }, [siteData.sections, selectedSectionId]);

  const selectedElement = useMemo(() => {
    if (!selectedSection || !selectedElementId) return null;
    
    // Check if it's a regular element in elements array
    const regularElement = selectedSection.elements?.find(e => e.id === selectedElementId);
    if (regularElement) return regularElement;
    
    // Handle Hero section virtual elements
    if (selectedSection.type === 'hero' && selectedElementId.startsWith(`${selectedSection.id}-hero-`)) {
      const elementType = selectedElementId.replace(`${selectedSection.id}-hero-`, '');
      const { content, styles } = selectedSection;
      const styleAny = styles as any;
      
      // Create virtual element based on type
      let virtualElement: WebsiteElement | null = null;
      
      if (elementType === 'title') {
        virtualElement = {
          id: selectedElementId,
          type: 'heading',
          content: { 
            text: content.title || '',
            htmlTag: styleAny.titleHeadingTag || 'h1' // Include heading tag in virtual element
          },
          style: {
            color: styles.titleColor || '',
            fontSize: styles.titleSize || 'text-4xl md:text-6xl',
            fontWeight: styleAny.titleFontWeight || styleAny.fontWeight || 'bold',
            textAlign: (styleAny.titleAlign || styles.textAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
          }
        };
      } else if (elementType === 'subtitle') {
        // Determine textSize based on subtitleSize if it matches a default
        let textSize: 'base' | 'small' | 'large' | 'xl' | undefined = undefined;
        if (styleAny.subtitleSize) {
          if (styleAny.subtitleSize === defaultSizes.textSmall) textSize = 'small';
          else if (styleAny.subtitleSize === defaultSizes.textLarge) textSize = 'large';
          else if (styleAny.subtitleSize === defaultSizes.textXl) textSize = 'xl';
          else if (styleAny.subtitleSize === defaultSizes.text) textSize = 'base';
        }
        
        virtualElement = {
          id: selectedElementId,
          type: 'text',
          content: { 
            text: content.subtitle || '',
            textSize: textSize || 'base'
          },
          style: {
            color: styles.subtitleColor || styles.textColor || '',
            fontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight || '400',
            textAlign: (styleAny.subtitleAlign || styles.textAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
          }
        };
      } else if (elementType === 'button') {
        virtualElement = {
          id: selectedElementId,
          type: 'button',
          content: { text: content.ctaText || '' },
          style: {
            backgroundColor: styles.buttonBackgroundColor || '',
            color: styles.buttonTextColor || '',
            fontSize: 'text-lg',
            padding: 'px-8 py-3',
          }
        };
      } else if (elementType === 'image') {
        virtualElement = {
          id: selectedElementId,
          type: 'image',
          content: { imageUrl: content.imageUrl || '', imageAlt: 'Hero' },
          style: {
            width: '100%',
            objectFit: 'cover',
          }
        };
      }
      
      return virtualElement;
    }
    
    return null;
  }, [selectedSection, selectedElementId, siteData.sections]);

  useEffect(() => {
    if (selectedSectionId && !isPreviewMode) {
      setIsSidebarOpen(true);
      // If an element is selected but doesn't exist in the current section, clear it
      if (selectedElementId && selectedSection && !selectedSection.elements?.find(e => e.id === selectedElementId)) {
        // Check if it's a virtual element (Hero section elements)
        const isVirtualElement = selectedElementId.startsWith(`${selectedSection.id}-hero-`);
        if (!isVirtualElement) {
          setSelectedElementId(null);
        }
      }
    } else {
      setIsSidebarOpen(false);
    }
  }, [selectedSectionId, selectedElementId, isPreviewMode, selectedSection]);
  
  useEffect(() => {
      if(selectedElementId) {
          if(editTab === 'advanced') setEditTab('content');
      }
  }, [selectedElementId]);

  // Apply font family to siteData.globalStyles in real-time
  useEffect(() => {
    setSiteData(prev => ({
      ...prev,
      globalStyles: {
        ...prev.globalStyles,
        primaryFont: defaultTypography.fontFamily
      }
    }));
  }, [defaultTypography.fontFamily]);

  // Update sections with default sizes in real-time when defaultSizes change
  // Always clear titleSize/subtitleSize to let CSS defaults apply (unless custom override exists)
  useEffect(() => {
    setSiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        const updatedSection = { ...section };
        const stylesAny = updatedSection.styles as any;
        
        // Always clear titleSize - CSS will apply the default based on titleHeadingTag
        // Only keep titleSize if it's a custom override (doesn't match any default)
        if (stylesAny.titleHeadingTag && stylesAny.titleSize) {
          const headingTag = stylesAny.titleHeadingTag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          const currentDefaultSize = defaultSizes[headingTag];
          
          // If titleSize matches the default for this heading tag, clear it
          if (stylesAny.titleSize === currentDefaultSize) {
            const { titleSize, ...restStyles } = stylesAny;
            updatedSection.styles = restStyles as typeof section.styles;
          }
        }
        
        // Always clear subtitleSize if it matches text defaults
        if (stylesAny.subtitleSize && (
            stylesAny.subtitleSize === defaultSizes.text ||
            stylesAny.subtitleSize === defaultSizes.textSmall ||
            stylesAny.subtitleSize === defaultSizes.textLarge ||
            stylesAny.subtitleSize === defaultSizes.textXl
          )) {
          const { subtitleSize, ...restStyles } = stylesAny;
          updatedSection.styles = restStyles as typeof section.styles;
        }
        
        // Update elements that use heading tags
        if (updatedSection.elements && Array.isArray(updatedSection.elements)) {
          updatedSection.elements = updatedSection.elements.map(element => {
            const htmlTag = element.content?.htmlTag;
            if (htmlTag && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(htmlTag)) {
              const headingTag = htmlTag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
              const currentDefaultSize = defaultSizes[headingTag];
              
              // Clear fontSize if it matches the default for this heading tag
              if (element.style?.fontSize === currentDefaultSize) {
                const { fontSize, ...restStyle } = element.style;
                return {
                  ...element,
                  style: restStyle
                };
              }
            }
            // Update text elements (p tags) - clear fontSize if it matches any text default
            if (htmlTag === 'p' && element.style?.fontSize && (
                element.style.fontSize === defaultSizes.text || 
                element.style.fontSize === defaultSizes.textSmall ||
                element.style.fontSize === defaultSizes.textLarge ||
                element.style.fontSize === defaultSizes.textXl
              )) {
              const { fontSize, ...restStyle } = element.style;
              return {
                ...element,
                style: restStyle
              };
            }
            return element;
          });
        }
        
        return updatedSection;
      })
    }));
  }, [defaultSizes]);

  useEffect(() => {
    const { colors } = siteData.globalStyles;
    
    // Generate CSS for default font sizes and typography
    const fontSizesCSS = `
      .h1-default { font-size: ${defaultSizes.h1}; }
      .h2-default { font-size: ${defaultSizes.h2}; }
      .h3-default { font-size: ${defaultSizes.h3}; }
      .h4-default { font-size: ${defaultSizes.h4}; }
      .h5-default { font-size: ${defaultSizes.h5}; }
      .h6-default { font-size: ${defaultSizes.h6}; }
      .text-default { font-size: ${defaultSizes.text}; }
      .text-small { font-size: ${defaultSizes.textSmall}; }
      .text-large { font-size: ${defaultSizes.textLarge}; }
      .text-xl { font-size: ${defaultSizes.textXl}; }
      
      /* Apply default font family globally */
      body, #canvas-root {
        font-family: ${defaultTypography.fontFamily};
      }
      
      /* Default heading sizes - apply to all headings, inline styles will override */
      #canvas-root h1 { font-size: ${defaultSizes.h1}; }
      #canvas-root h2 { font-size: ${defaultSizes.h2}; }
      #canvas-root h3 { font-size: ${defaultSizes.h3}; }
      #canvas-root h4 { font-size: ${defaultSizes.h4}; }
      #canvas-root h5 { font-size: ${defaultSizes.h5}; }
      #canvas-root h6 { font-size: ${defaultSizes.h6}; }
      #canvas-root p { font-size: ${defaultSizes.text}; }
      
      /* Text size variants - override default p size */
      #canvas-root p.text-sm { font-size: ${defaultSizes.textSmall}; }
      #canvas-root p.text-lg { font-size: ${defaultSizes.textLarge}; }
      #canvas-root p.text-xl { font-size: ${defaultSizes.textXl}; }
    `;
    
    const styleString = `
      :root { 
        --bg-color: ${colors.backgroundColor}; 
        --text-color: ${colors.textColor}; 
        --title-color: ${colors.titleColor}; 
        --accent-color: ${colors.accentColor}; 
        --btn-bg: ${colors.buttonBackgroundColor}; 
        --btn-text: ${colors.buttonTextColor}; 
      } 
      #canvas-root { 
        background-color: var(--bg-color); 
        color: var(--text-color); 
        min-height: 100vh; 
      }
      ${fontSizesCSS}
    `;
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-theme-styles';
    styleEl.innerHTML = styleString;
    const existing = document.getElementById('dynamic-theme-styles');
    if (existing) existing.remove();
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); }
  }, [siteData.globalStyles.colors, defaultSizes, defaultTypography]);


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
              
              // Handle Hero section virtual elements
              if (s.type === 'hero' && elementId.startsWith(`${sectionId}-hero-`)) {
                  const elementType = elementId.replace(`${sectionId}-hero-`, '');
                  const sectionUpdates: Partial<Section> = {};
                  
                  // Update content based on element type
                  if (updates.content) {
                      if (elementType === 'title') {
                          // Handle title heading tag update
                          if (updates.content.htmlTag !== undefined) {
                              sectionUpdates.styles = { ...s.styles, titleHeadingTag: updates.content.htmlTag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' };
                          }
                          if (updates.content.text !== undefined) {
                              sectionUpdates.content = { ...s.content, title: updates.content.text };
                          }
                      } else if (elementType === 'subtitle' && updates.content.text !== undefined) {
                          sectionUpdates.content = { ...s.content, subtitle: updates.content.text };
                      } else if (elementType === 'button' && updates.content.text !== undefined) {
                          sectionUpdates.content = { ...s.content, ctaText: updates.content.text };
                      } else if (elementType === 'image' && updates.content.imageUrl !== undefined) {
                          sectionUpdates.content = { ...s.content, imageUrl: updates.content.imageUrl };
                      }
                      
                      // Handle textSize for subtitle (Hero subtitle virtual elements)
                      if (elementType === 'subtitle' && updates.content.textSize !== undefined) {
                          const textSize = updates.content.textSize;
                          const styleUpdates: any = {};
                          // Map textSize to subtitleSize based on defaultSizes
                          if (textSize === 'small') styleUpdates.subtitleSize = defaultSizes.textSmall;
                          else if (textSize === 'large') styleUpdates.subtitleSize = defaultSizes.textLarge;
                          else if (textSize === 'xl') styleUpdates.subtitleSize = defaultSizes.textXl;
                          else if (textSize === 'base') styleUpdates.subtitleSize = defaultSizes.text;
                          if (Object.keys(styleUpdates).length > 0) {
                              sectionUpdates.styles = { ...s.styles, ...styleUpdates };
                          }
                      }
                  }
                  
                  // Update styles based on element type
                  if (updates.style) {
                      const styleUpdates: any = {};
                      
                      if (elementType === 'title') {
                          if (updates.style.color !== undefined) styleUpdates.titleColor = updates.style.color;
                          if (updates.style.fontSize !== undefined) styleUpdates.titleSize = updates.style.fontSize;
                          if (updates.style.fontWeight !== undefined) styleUpdates.titleFontWeight = updates.style.fontWeight;
                          if (updates.style.textAlign !== undefined) styleUpdates.titleAlign = updates.style.textAlign;
                      } else if (elementType === 'subtitle') {
                          if (updates.style.color !== undefined) styleUpdates.subtitleColor = updates.style.color;
                          if (updates.style.fontSize !== undefined) styleUpdates.subtitleSize = updates.style.fontSize;
                          if (updates.style.fontWeight !== undefined) styleUpdates.subtitleFontWeight = updates.style.fontWeight;
                          if (updates.style.textAlign !== undefined) styleUpdates.subtitleAlign = updates.style.textAlign;
                      } else if (elementType === 'button') {
                          if (updates.style.backgroundColor !== undefined) styleUpdates.buttonBackgroundColor = updates.style.backgroundColor;
                          if (updates.style.color !== undefined) styleUpdates.buttonTextColor = updates.style.color;
                          if (updates.style.fontSize !== undefined) styleUpdates.buttonFontSize = updates.style.fontSize;
                          if (updates.style.fontWeight !== undefined) styleUpdates.buttonFontWeight = updates.style.fontWeight;
                      }
                      
                      if (Object.keys(styleUpdates).length > 0) {
                          sectionUpdates.styles = { ...s.styles, ...styleUpdates };
                      }
                  }
                  
                  return { ...s, ...sectionUpdates };
              }
              
              // Regular element update - properly merge nested objects
              return {
                  ...s,
                  elements: s.elements?.map(e => {
                      if (e.id === elementId) {
                          return {
                              ...e,
                              content: updates.content ? { ...e.content, ...updates.content } : e.content,
                              style: updates.style ? { ...e.style, ...updates.style } : e.style,
                              settings: updates.settings ? { ...e.settings, ...updates.settings } : e.settings
                          };
                      }
                      return e;
                  })
              };
          })
      }));
  };

  const resetElementToDefault = async () => {
    if (!selectedSection || !selectedElementId) return;

    try {
      const { projectId, pageId, token } = getUrlParams();
      if (!projectId || !pageId || !token) {
        toast.error('Missing projectId, pageId, or authentication token');
        return;
      }

      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:1111/admin/v1';
      const sectionId = selectedSection.type; // Use section type as sectionId

      // Fetch original content from SectionContent
      const response = await fetch(`${apiUrl}/getSectionContent/${projectId}/${pageId}/${sectionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch original content');
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error('No original content found');
      }

      const originalData = result.data;

      // Handle Hero section virtual elements
      if (selectedSection.type === 'hero' && selectedElementId.startsWith(`${selectedSection.id}-hero-`)) {
        const elementType = selectedElementId.replace(`${selectedSection.id}-hero-`, '');
        
        if (elementType === 'title' && originalData.title) {
          updateElement(selectedSection.id, selectedElementId, { content: { text: originalData.title } });
        } else if (elementType === 'subtitle' && originalData.subtitle) {
          updateElement(selectedSection.id, selectedElementId, { content: { text: originalData.subtitle } });
        } else if (elementType === 'button' && originalData.ctaText) {
          updateElement(selectedSection.id, selectedElementId, { content: { text: originalData.ctaText } });
        } else if (elementType === 'image' && originalData.imageUrl) {
          updateElement(selectedSection.id, selectedElementId, { content: { imageUrl: originalData.imageUrl } });
        }
      } else {
        // Handle regular elements - find the element in the original data
        // For now, we'll reset the entire section content if it's a regular element
        // This is a simplified approach - you may need to adjust based on your element structure
        if (selectedElement && originalData) {
          // Try to find matching element content in originalData
          // This depends on your element structure
          const elementContent = originalData[selectedElement.type] || originalData;
          if (elementContent) {
            updateElement(selectedSection.id, selectedElementId, { content: elementContent });
          }
        }
      }

      toast.success('Content reset to default successfully!');
    } catch (error: any) {
      console.error('Error resetting element:', error);
      toast.error(`Failed to reset: ${error.message}`);
    }
  };

  const updateSectionStyle = (id: string, key: string, value: any) => {
    setSiteData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === id) {
          return {
            ...s,
            styles: {
              ...s.styles,
              [key]: value
            }
          } as Section;
        }
        return s;
      })
    }));
  };
  
  const updateGlobalColor = (key: keyof typeof siteData.globalStyles.colors, value: string) => {
      setSiteData(prev => ({
          ...prev,
          globalStyles: { ...prev.globalStyles, colors: { ...prev.globalStyles.colors, [key]: value } }
      }));
  };

  const loadThemeSettings = async (projectId: string) => {
    try {
      const { token } = getUrlParams();
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:1111/admin/v1';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/getThemeSettings?projectId=${projectId}`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        console.error('Failed to load theme settings, using defaults');
        // Use default values if API fails
        return;
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        const { presetId, defaultSizes: savedSizes, defaultTypography: savedTypography, theme, customColors } = result.data;
        
        // Load default sizes - use saved values or fallback to defaults
        setDefaultSizes({
          h1: savedSizes?.h1 || '3rem',
          h2: savedSizes?.h2 || '2.5rem',
          h3: savedSizes?.h3 || '2rem',
          h4: savedSizes?.h4 || '1.5rem',
          h5: savedSizes?.h5 || '1.25rem',
          h6: savedSizes?.h6 || '1rem',
          text: savedSizes?.text || '1rem',
          textSmall: savedSizes?.textSmall || '0.875rem',
          textLarge: savedSizes?.textLarge || '1.125rem',
          textXl: savedSizes?.textXl || '1.25rem'
        });
        
        // Load default typography - use saved value or fallback to default
        setDefaultTypography({
          fontFamily: savedTypography?.fontFamily || 'Inter, sans-serif'
        });
        
        // Apply custom colors if present (for custom theme)
        if (customColors && theme === 'custom') {
          const newGlobalStyles = {
            ...siteData.globalStyles,
            colors: {
              backgroundColor: customColors.surface || siteData.globalStyles.colors.backgroundColor,
              textColor: customColors.description || siteData.globalStyles.colors.textColor,
              titleColor: customColors.heading || siteData.globalStyles.colors.titleColor,
              subtitleColor: customColors.description || siteData.globalStyles.colors.subtitleColor,
              accentColor: customColors.accent || siteData.globalStyles.colors.accentColor,
              buttonBackgroundColor: customColors.primaryButton?.bg || siteData.globalStyles.colors.buttonBackgroundColor,
              buttonTextColor: customColors.primaryButton?.text || siteData.globalStyles.colors.buttonTextColor,
              linkColor: customColors.ring || siteData.globalStyles.colors.linkColor,
              borderColor: customColors.ring || siteData.globalStyles.colors.borderColor,
              overlayColor: customColors.overlay?.color || siteData.globalStyles.colors.overlayColor
            }
          };
          setSiteData(prev => ({
            ...prev,
            globalStyles: newGlobalStyles,
            sections: prev.sections.map(section => ({
              ...section,
              styles: {
                ...section.styles,
                backgroundColor: customColors.surface || section.styles.backgroundColor,
                textColor: customColors.description || section.styles.textColor,
                titleColor: customColors.heading || section.styles.titleColor,
                subtitleColor: customColors.description || section.styles.subtitleColor,
                accentColor: customColors.accent || section.styles.accentColor,
                buttonBackgroundColor: customColors.primaryButton?.bg || section.styles.buttonBackgroundColor,
                buttonTextColor: customColors.primaryButton?.text || section.styles.buttonTextColor
              }
            }))
          }));
        }
        
        // Apply theme if preset is selected - match by theme name and set index as selectedPresetId
        if (theme && theme !== 'custom') {
          const themeIndex = PRESET_THEMES.findIndex(t => t.name.toLowerCase().replace(/\s+/g, '-') === theme);
          if (themeIndex >= 0) {
            const presetTheme = PRESET_THEMES[themeIndex];
            setSelectedPresetId(themeIndex.toString());
            applyTheme(presetTheme, themeIndex.toString());
          }
        } else {
          // Custom theme - clear preset selection
          setSelectedPresetId(null);
        }
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
      // Use default values if error occurs
    }
  };

  const saveThemeSettings = async () => {
    try {
      setSavingTheme(true);
      const { projectId, token } = getUrlParams();
      if (!projectId) {
        toast.error('Project ID not found');
        return;
      }
      
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:1111/admin/v1';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Determine theme name from selected preset or use 'custom'
      // If selectedPresetId is set, find the theme name from PRESET_THEMES
      // Otherwise, check if custom colors are being used
      let themeName = 'custom';
      if (selectedPresetId !== null && selectedPresetId !== undefined) {
        const selectedTheme = PRESET_THEMES[parseInt(selectedPresetId)];
        if (selectedTheme) {
          themeName = selectedTheme.name.toLowerCase().replace(/\s+/g, '-');
        }
      }
      
      const payload: any = {
        projectId,
        theme: themeName,
        presetId: null, // Backend will look up presetId from theme name
        defaultSizes,
        defaultTypography
      };
      
      // Only include customColors if it's a custom theme
      if (themeName === 'custom') {
        payload.customColors = {
          heading: siteData.globalStyles.colors.titleColor,
          description: siteData.globalStyles.colors.textColor,
          surface: siteData.globalStyles.colors.backgroundColor,
          primaryButton: {
            bg: siteData.globalStyles.colors.buttonBackgroundColor,
            text: siteData.globalStyles.colors.buttonTextColor
          },
          accent: siteData.globalStyles.colors.accentColor
        };
      }
      
      const response = await fetch(`${apiUrl}/updateProjectTheme`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save theme settings: ${errorData.message || 'Unknown error'}`);
        return;
      }
      
      const result = await response.json();
      toast.success('Theme settings saved successfully!');
    } catch (error) {
      console.error('Error saving theme settings:', error);
      toast.error('Failed to save theme settings');
    } finally {
      setSavingTheme(false);
    }
  };

  const applyTheme = (theme: typeof PRESET_THEMES[0], presetId?: string | null) => {
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
      // Update selected preset ID
      if (presetId !== undefined) {
        setSelectedPresetId(presetId);
      }
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
                   <SelectInput label="Font Weight" value={styles.fontWeight || '400'} options={[{label: 'Normal', value: '400'}, {label: 'Bold', value: '700'}, {label: 'Black', value: '900'}, {label: 'Light', value: '300'}]} onChange={(v) => onUpdate('fontWeight', v)} />
                   <div className="mt-2 text-[10px] text-white/40 italic">
                     Font sizes are controlled by Theme Settings
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

  if (loadingPageData) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden flex flex-col`} style={{ fontFamily: siteData.globalStyles.primaryFont }}>
        <header className="h-14 border-b border-white/10 bg-[#050505] flex items-center justify-between px-4 shrink-0 z-50">
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg tracking-tighter">Genie<span className="text-blue-500">Build</span></span>
                <div className="h-4 w-px bg-white/10 mx-2"></div>
                <button onClick={() => { setSelectedSectionId(null); setSelectedElementId(null); setGlobalTab('themes'); setIsSidebarOpen(true); }} className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${!selectedSectionId && isSidebarOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} title="Global Design System"><i className="fa-solid fa-palette"></i>Theme</button>
            </div>
             <div className="flex items-center gap-2">
                 <div className="flex bg-[#151515] rounded p-1 border border-[#333] mr-2">
                     <button onClick={() => setViewMode('desktop')} className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'desktop' ? 'bg-[#333] text-white' : 'text-slate-500 hover:text-white'}`}><i className="fa-solid fa-desktop"></i></button>
                     <button onClick={() => setViewMode('mobile')} className={`px-2 py-1 rounded text-xs transition-colors ${viewMode === 'mobile' ? 'bg-[#333] text-white' : 'text-slate-500 hover:text-white'}`}><i className="fa-solid fa-mobile-screen"></i></button>
                 </div>
                 <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${isPreviewMode ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/20 hover:bg-white/10'}`}>{isPreviewMode ? <><i className="fa-solid fa-eye-slash mr-2"></i>Edit</> : <><i className="fa-solid fa-eye mr-2"></i>Preview</>}</button>
                 <button 
                   onClick={savePageData} 
                   disabled={savingPageData}
                   className={`px-3 py-1.5 rounded text-xs font-bold border transition-all flex items-center gap-2 ${
                     savingPageData 
                       ? 'bg-gray-600 border-gray-600 text-white cursor-not-allowed' 
                       : 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                   }`}
                 >
                   {savingPageData ? (
                     <>
                       <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                       Saving...
                     </>
                   ) : (
                     <>
                       <i className="fa-solid fa-save"></i>
                       Save
                     </>
                   )}
                 </button>
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
                                <button onClick={() => setGlobalTab('typography')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${globalTab === 'typography' ? 'bg-[#222] text-white shadow' : 'text-slate-400 hover:text-white'}`}>Typography</button>
                            </div>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-20">
                             {globalTab === 'themes' && (
                                 <div className="space-y-4">
                                     {PRESET_THEMES.map((theme, idx) => (
                                         <button key={idx} onClick={() => applyTheme(theme, idx.toString())} className={`group flex flex-col gap-2 p-3 rounded-xl border transition-all ${selectedPresetId === idx.toString() ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30 bg-[#111] hover:bg-[#1a1a1a]'}`}>
                                             <div className="flex items-center justify-between w-full">
                                                 <span className="font-bold text-xs uppercase tracking-wider text-white/80">{theme.name}</span>
                                                 <div className="flex gap-1">
                                                     <div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: theme.elements.surface}}></div>
                                                     <div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: theme.elements.primaryButton.bg}}></div>
                                                 </div>
                                             </div>
                                         </button>
                                     ))}
                                 </div>
                             )}
                             {globalTab === 'colors' && (
                                <div className="space-y-4">
                                    <ColorInput label="Background" value={siteData.globalStyles.colors.backgroundColor} onChange={(v) => updateGlobalColor('backgroundColor', v)} />
                                    <ColorInput label="Text" value={siteData.globalStyles.colors.textColor} onChange={(v) => updateGlobalColor('textColor', v)} />
                                    <ColorInput label="Title" value={siteData.globalStyles.colors.titleColor} onChange={(v) => updateGlobalColor('titleColor', v)} />
                                    <ColorInput label="Accent" value={siteData.globalStyles.colors.accentColor} onChange={(v) => updateGlobalColor('accentColor', v)} />
                                    <ColorInput label="Button Bg" value={siteData.globalStyles.colors.buttonBackgroundColor} onChange={(v) => updateGlobalColor('buttonBackgroundColor', v)} />
                                    <ColorInput label="Button Text" value={siteData.globalStyles.colors.buttonTextColor} onChange={(v) => updateGlobalColor('buttonTextColor', v)} />
                                </div>
                             )}
                             {globalTab === 'typography' && (
                                <div className="space-y-6">
                                    <AccordionGroup title="Default Font" defaultOpen={true}>
                                        <SelectInput 
                                            label="Font Family" 
                                            value={defaultTypography.fontFamily} 
                                            options={PRESET_FONTS.map(f => ({ label: f.name, value: f.value }))} 
                                            onChange={(v) => setDefaultTypography(prev => ({ ...prev, fontFamily: v }))} 
                                        />
                                    </AccordionGroup>
                                    <AccordionGroup title="Heading Sizes" defaultOpen={true}>
                                        <div className="space-y-3">
                                            <FontSizeInput label="H1 (Default: 3rem / 48px)" value={defaultSizes.h1} onChange={(v) => setDefaultSizes(prev => ({ ...prev, h1: v }))} placeholder="3rem" />
                                            <FontSizeInput label="H2 (Default: 2.5rem / 40px)" value={defaultSizes.h2} onChange={(v) => setDefaultSizes(prev => ({ ...prev, h2: v }))} placeholder="2.5rem" />
                                            <FontSizeInput label="H3 (Default: 2rem / 32px)" value={defaultSizes.h3} onChange={(v) => setDefaultSizes(prev => ({ ...prev, h3: v }))} placeholder="2rem" />
                                            <FontSizeInput label="H4 (Default: 1.5rem / 24px)" value={defaultSizes.h4} onChange={(v) => setDefaultSizes(prev => ({ ...prev, h4: v }))} placeholder="1.5rem" />
                                            <FontSizeInput label="H5 (Default: 1.25rem / 20px)" value={defaultSizes.h5} onChange={(v) => setDefaultSizes(prev => ({ ...prev, h5: v }))} placeholder="1.25rem" />
                                            <FontSizeInput label="H6 (Default: 1rem / 16px)" value={defaultSizes.h6} onChange={(v) => setDefaultSizes(prev => ({ ...prev, h6: v }))} placeholder="1rem" />
                                        </div>
                                    </AccordionGroup>
                                    <AccordionGroup title="Text Sizes" defaultOpen={true}>
                                        <div className="space-y-3">
                                            <FontSizeInput label="Base Text (Default: 1rem / 16px)" value={defaultSizes.text} onChange={(v) => setDefaultSizes(prev => ({ ...prev, text: v }))} placeholder="1rem" />
                                            <FontSizeInput label="Small Text (Default: 0.875rem / 14px)" value={defaultSizes.textSmall} onChange={(v) => setDefaultSizes(prev => ({ ...prev, textSmall: v }))} placeholder="0.875rem" />
                                            <FontSizeInput label="Large Text (Default: 1.125rem / 18px)" value={defaultSizes.textLarge} onChange={(v) => setDefaultSizes(prev => ({ ...prev, textLarge: v }))} placeholder="1.125rem" />
                                            <FontSizeInput label="XL Text (Default: 1.25rem / 20px)" value={defaultSizes.textXl} onChange={(v) => setDefaultSizes(prev => ({ ...prev, textXl: v }))} placeholder="1.25rem" />
                                        </div>
                                    </AccordionGroup>
                                </div>
                             )}
                         </div>
                         <div className="p-4 border-t border-white/10 bg-[#080808]">
                             <button 
                                 onClick={saveThemeSettings}
                                 disabled={savingTheme}
                                 className={`w-full px-4 py-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                                     savingTheme 
                                       ? 'bg-gray-600 border-gray-600 text-white cursor-not-allowed' 
                                       : 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                                 }`}
                             >
                                 {savingTheme ? (
                                     <>
                                         <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                         Saving...
                                     </>
                                 ) : (
                                     <>
                                         <i className="fa-solid fa-save"></i>
                                         Save Theme Settings
                                     </>
                                 )}
                             </button>
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
                                 editTab === 'design' ? (renderStyleEditor(selectedElement.style, (k,v) => updateElement(selectedSection.id, selectedElement.id, { style: { ...selectedElement.style, [k]: v } }), 'element')) : (
                                     <div className="space-y-4">
                                         {selectedElement.type === 'image' ? (
                                             <ImageControl 
                                                 label="Image URL" 
                                                 value={selectedElement.content.imageUrl || ''} 
                                                 onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, imageUrl: v} })} 
                                                 onUpload={() => triggerUpload(selectedSection.id, selectedElement.id)}
                                             />
                                         ) : (
                                             <>
                                                 <TextAreaInput 
                                                     label={selectedElement.type === 'heading' ? 'Heading' : selectedElement.type === 'button' ? 'Button Text' : 'Text'} 
                                                     value={selectedElement.content.text || ''} 
                                                     onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, text: v} })} 
                                                 />
                                                 {selectedElement.type === 'heading' && (
                                                     <SelectInput 
                                                         key={`heading-tag-${selectedElement.id}-${selectedElement.content.htmlTag || 'h2'}`}
                                                         label="Heading Level" 
                                                         value={
                                                             // For Hero title virtual elements, read from styles.titleHeadingTag
                                                             selectedElement.id.startsWith(`${selectedSection.id}-hero-title`) 
                                                                 ? (selectedSection.styles.titleHeadingTag || 'h1')
                                                                 : (selectedElement.content.htmlTag || 'h2')
                                                         } 
                                                         options={[
                                                             {label: 'H1 (Largest)', value: 'h1'},
                                                             {label: 'H2', value: 'h2'},
                                                             {label: 'H3', value: 'h3'},
                                                             {label: 'H4', value: 'h4'},
                                                             {label: 'H5', value: 'h5'},
                                                             {label: 'H6 (Smallest)', value: 'h6'}
                                                         ]} 
                                                         onChange={(v) => {
                                                             // For Hero title virtual elements, update titleHeadingTag in styles
                                                             if (selectedElement.id.startsWith(`${selectedSection.id}-hero-title`)) {
                                                                 updateSectionStyle(selectedSection.id, 'titleHeadingTag', v);
                                                             } else {
                                                                 // For regular heading elements
                                                                 updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, htmlTag: v as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} });
                                                             }
                                                         }} 
                                                     />
                                                 )}
                                                 {selectedElement.type === 'text' && (
                                                     <SelectInput 
                                                         key={`text-size-${selectedElement.id}-${selectedElement.content.textSize || 'base'}`}
                                                         label="Text Size" 
                                                         value={selectedElement.content.textSize || 'base'}
                                                         options={[
                                                             {label: 'Base', value: 'base'},
                                                             {label: 'Small', value: 'small'},
                                                             {label: 'Large', value: 'large'},
                                                             {label: 'XL', value: 'xl'}
                                                         ]} 
                                                         onChange={(v) => {
                                                             updateElement(selectedSection.id, selectedElement.id, { 
                                                                 content: {...selectedElement.content, textSize: v as 'base' | 'small' | 'large' | 'xl'} 
                                                             });
                                                         }} 
                                                     />
                                                 )}
                                             </>
                                         )}
                                         <button
                                           onClick={resetElementToDefault}
                                           className="w-full mt-4 px-3 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/40 text-orange-400 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                           title="Reset to original AI-generated content"
                                         >
                                           <i className="fa-solid fa-rotate-left"></i>
                                           Reset to Default
                                         </button>
                                     </div>
                                 )
                             ) : (
                                 selectedSection && (
                                     editTab === 'design' ? (renderStyleEditor(selectedSection.styles, (k,v) => updateSectionStyle(selectedSection.id, k, v), 'section')) : (
                                         <div className="space-y-6">
                                             <TextAreaInput label="Heading" value={selectedSection.content.title} onChange={(v) => updateSection(selectedSection.id, { content: {...selectedSection.content, title: v} })} />
                                             <SelectInput 
                                                 key={`section-heading-tag-${selectedSection.id}-${selectedSection.styles.titleHeadingTag || 'h2'}`}
                                                 label="Heading Level" 
                                                 value={selectedSection.styles.titleHeadingTag || 'h2'} 
                                                 options={[
                                                     {label: 'H1 (Largest)', value: 'h1'},
                                                     {label: 'H2', value: 'h2'},
                                                     {label: 'H3', value: 'h3'},
                                                     {label: 'H4', value: 'h4'},
                                                     {label: 'H5', value: 'h5'},
                                                     {label: 'H6 (Smallest)', value: 'h6'}
                                                 ]} 
                                                 onChange={(v) => {
                                                     updateSectionStyle(selectedSection.id, 'titleHeadingTag', v as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
                                                 }} 
                                             />
                                         </div>
                                     )
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
                            <SectionRenderer 
                              key={`${section.id}-${section.styles.titleHeadingTag || 'h2'}-${JSON.stringify(defaultSizes)}`} 
                              section={section} 
                              onUpdate={updateSection} 
                              isSelected={selectedSectionId === section.id} 
                              readOnly={isPreviewMode} 
                              onClick={() => { 
                                // When clicking section background, select section and clear element selection
                                setSelectedSectionId(section.id); 
                                setSelectedElementId(null); 
                              }} 
                              onDelete={deleteSection} 
                              onMoveUp={(id) => moveSection(id, 'up')} 
                              onMoveDown={(id) => moveSection(id, 'down')} 
                              onUpload={triggerUpload} 
                              selectedElementId={selectedElementId} 
                              onElementSelect={(elId) => { 
                                // When clicking element, select both section and element
                                setSelectedSectionId(section.id); 
                                setSelectedElementId(elId); 
                              }} 
                            />
                        ))}
                    </div>
                </PreviewFrame>
            </main>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
              style: {
                background: '#1a1a1a',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
              style: {
                background: '#1a1a1a',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              },
            },
          }}
        />
    </div>
  );
};

export default App;
