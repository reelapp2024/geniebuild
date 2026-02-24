
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
    // Construct full image URL for preview
    const getImageUrl = (url: string | undefined): string => {
        if (!url || url.trim().length < 5) return '';
        // If it's already a full URL, use it; otherwise prepend localhost:1111
        if (url.startsWith('http')) return url;
        return `http://localhost:1111${url.startsWith('/') ? '' : '/'}${url}`;
    };
    
    const previewUrl = getImageUrl(value);
    
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
            
            {/* Image Preview */}
            {previewUrl ? (
                <div className="relative w-full aspect-video bg-[#151515] rounded border border-[#333] overflow-hidden group">
                    <img 
                        src={previewUrl} 
                        className="w-full h-full object-cover" 
                        alt="Preview"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                             onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 onUpload();
                             }} 
                             className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:scale-105 transition-transform shadow-lg"
                         >
                             Change Image
                         </button>
                    </div>
                </div>
            ) : (
                <div className="w-full aspect-video bg-[#151515] rounded border border-[#333] flex items-center justify-center">
                    <div className="text-center text-white/40 text-xs">
                        <i className="fa-solid fa-image text-2xl mb-2 block"></i>
                        <span>No image preview</span>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <input 
                    type="text" 
                    className="w-full bg-[#151515] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste image URL or click upload"
                />
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onUpload();
                    }}
                    className="px-3 bg-[#222] border border-[#333] rounded hover:bg-[#333] text-white shrink-0 transition-colors"
                    title="Upload Image"
                >
                    <i className="fa-solid fa-upload text-xs"></i>
                </button>
            </div>
        </div>
    );
};

const VideoControl = ({ label, value, onChange, onUpload }: { label: string, value: string | undefined, onChange: (val: string) => void, onUpload: () => void }) => {
    // Helper to check if URL is YouTube
    const isYouTubeUrl = (url: string): boolean => {
        return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.test(url);
    };
    
    // Helper to convert YouTube URL to embed format
    const convertToEmbedUrl = (url: string): string => {
        if (url.includes('youtube.com/embed/') || url.includes('youtu.be/')) {
            return url;
        }
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    };
    
    // Construct full video URL for preview
    const getVideoUrl = (url: string | undefined): string => {
        if (!url || url.trim().length < 5) return '';
        // If it's already a full URL, use it; otherwise prepend localhost:1111
        if (url.startsWith('http')) {
            // If it's YouTube, convert to embed format
            if (isYouTubeUrl(url)) {
                return convertToEmbedUrl(url);
            }
            return url;
        }
        return `http://localhost:1111${url.startsWith('/') ? '' : '/'}${url}`;
    };
    
    const previewUrl = getVideoUrl(value);
    const isYouTube = value ? isYouTubeUrl(value) : false;
    
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
            
            {/* Video Preview */}
            {previewUrl ? (
                <div className="relative w-full aspect-video bg-[#151515] rounded border border-[#333] overflow-hidden group">
                    {isYouTube || previewUrl.includes('youtube.com/embed/') ? (
                        <iframe 
                            src={previewUrl} 
                            className="w-full h-full border-0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        />
                    ) : (
                        <video 
                            src={previewUrl} 
                            className="w-full h-full object-contain"
                            controls
                        />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                             onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 onUpload();
                             }} 
                             className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:scale-105 transition-transform shadow-lg"
                         >
                             Change Video
                         </button>
                    </div>
                </div>
            ) : (
                <div className="w-full aspect-video bg-[#151515] rounded border border-[#333] flex items-center justify-center">
                    <span className="text-white/30 text-xs">No Video Selected</span>
                </div>
            )}

            <div className="flex gap-2">
                <input 
                    type="text" 
                    className="w-full bg-[#151515] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste YouTube URL, video URL, or click upload"
                />
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpload(); }}
                    className="px-3 bg-[#222] border border-[#333] rounded hover:bg-[#333] text-white shrink-0"
                    title="Upload Video"
                >
                    <i className="fa-solid fa-upload text-xs"></i>
                </button>
            </div>
        </div>
    );
};

// Popular FontAwesome icons list
const POPULAR_ICONS = [
    // Common
    'fa-star', 'fa-heart', 'fa-thumbs-up', 'fa-check', 'fa-times', 'fa-plus', 'fa-minus', 'fa-edit', 'fa-trash', 'fa-save',
    // Arrows & Navigation
    'fa-arrow-right', 'fa-arrow-left', 'fa-arrow-up', 'fa-arrow-down', 'fa-chevron-right', 'fa-chevron-left', 'fa-chevron-up', 'fa-chevron-down',
    // Social & Communication
    'fa-envelope', 'fa-phone', 'fa-comment', 'fa-share', 'fa-link', 'fa-user', 'fa-users', 'fa-bell', 'fa-message',
    // Business & Finance
    'fa-dollar-sign', 'fa-credit-card', 'fa-shopping-cart', 'fa-bag-shopping', 'fa-chart-line', 'fa-briefcase', 'fa-building',
    // Technology
    'fa-laptop', 'fa-mobile-screen', 'fa-tablet', 'fa-wifi', 'fa-cloud', 'fa-database', 'fa-code', 'fa-server',
    // Media & Entertainment
    'fa-play', 'fa-pause', 'fa-stop', 'fa-music', 'fa-video', 'fa-image', 'fa-camera', 'fa-microphone',
    // Location & Travel
    'fa-map-marker-alt', 'fa-globe', 'fa-plane', 'fa-car', 'fa-home', 'fa-building',
    // Food & Drink
    'fa-utensils', 'fa-coffee', 'fa-pizza-slice', 'fa-burger', 'fa-wine-glass',
    // Health & Fitness
    'fa-heartbeat', 'fa-dumbbell', 'fa-running', 'fa-bicycle', 'fa-swimming-pool',
    // Education & Learning
    'fa-graduation-cap', 'fa-book', 'fa-pencil', 'fa-chalkboard', 'fa-lightbulb',
    // Tools & Settings
    'fa-wrench', 'fa-cog', 'fa-tools', 'fa-screwdriver', 'fa-hammer', 'fa-key', 'fa-lock', 'fa-unlock',
    // Weather & Nature
    'fa-sun', 'fa-moon', 'fa-cloud-sun', 'fa-cloud-rain', 'fa-snowflake', 'fa-leaf', 'fa-tree', 'fa-mountain',
    // Shapes & Symbols
    'fa-circle', 'fa-square', 'fa-triangle', 'fa-diamond', 'fa-hexagon', 'fa-pentagon',
    // Time & Calendar
    'fa-clock', 'fa-calendar', 'fa-calendar-alt', 'fa-hourglass', 'fa-stopwatch',
    // Security & Safety
    'fa-shield', 'fa-shield-alt', 'fa-fire', 'fa-exclamation-triangle', 'fa-info-circle', 'fa-question-circle',
    // Transport
    'fa-truck', 'fa-ship', 'fa-train', 'fa-bus', 'fa-motorcycle',
    // Sports & Games
    'fa-football', 'fa-basketball', 'fa-baseball', 'fa-volleyball', 'fa-chess', 'fa-dice',
    // Miscellaneous
    'fa-gift', 'fa-trophy', 'fa-medal', 'fa-flag', 'fa-palette', 'fa-paint-brush', 'fa-magic', 'fa-rocket', 'fa-gem'
];

const IconPicker = ({ label, value, onChange }: { label: string, value: string | undefined, onChange: (val: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    
    // Normalize icon value to 'fa-icon-name' format
    const normalizeIcon = (iconValue: string | undefined): string => {
        if (!iconValue) return 'fa-star';
        // Remove 'fa-solid fa-' or 'fa-solid ' prefix if present
        if (iconValue.startsWith('fa-solid fa-')) {
            return iconValue.replace('fa-solid fa-', 'fa-');
        }
        if (iconValue.startsWith('fa-solid ')) {
            return iconValue.replace('fa-solid ', 'fa-');
        }
        // If it already starts with 'fa-', return as is
        if (iconValue.startsWith('fa-')) {
            return iconValue;
        }
        // Otherwise, add 'fa-' prefix
        return `fa-${iconValue}`;
    };
    
    const normalizedValue = normalizeIcon(value);
    
    // Get current icon name for display (remove 'fa-' prefix)
    const currentIcon = normalizedValue.replace('fa-', '');
    
    // Filter icons based on search
    const filteredIcons = POPULAR_ICONS.filter(icon => 
        icon.replace('fa-', '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Get icon class for display
    const getIconClass = (iconName: string) => {
        const normalized = normalizeIcon(iconName);
        return `fa-solid ${normalized}`;
    };
    
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
            
            {/* Current Icon Display */}
            <div 
                className="w-full bg-[#151515] border border-[#333] rounded p-3 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => setShowPicker(!showPicker)}
            >
                <div className="flex items-center gap-3">
                    <i className={`${getIconClass(normalizedValue)} text-xl`} style={{ color: '#F59E0B' }}></i>
                    <span className="text-white text-xs font-medium">
                        {currentIcon.charAt(0).toUpperCase() + currentIcon.slice(1).replace(/-/g, ' ')}
                    </span>
                </div>
                <i className={`fa-solid fa-chevron-${showPicker ? 'up' : 'down'} text-xs text-white/40`}></i>
            </div>
            
            {/* Icon Picker Dropdown */}
            {showPicker && (
                <div className="bg-[#151515] border border-[#333] rounded p-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {/* Search Input */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none"
                            placeholder="Search icons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    
                    {/* Icons Grid */}
                    <div className="grid grid-cols-6 gap-2">
                        {filteredIcons.map((icon) => {
                            const iconName = icon.replace('fa-', '');
                            const isSelected = normalizedValue === icon;
                            return (
                                <button
                                    key={icon}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(icon);
                                        setShowPicker(false);
                                        setSearchTerm('');
                                    }}
                                    className={`p-2 rounded border transition-all hover:border-blue-500 hover:bg-[#1a1a1a] ${
                                        isSelected 
                                            ? 'border-blue-500 bg-blue-500/10' 
                                            : 'border-[#333] bg-[#0a0a0a]'
                                    }`}
                                    title={iconName.replace(/-/g, ' ')}
                                >
                                    <i className={`fa-solid ${icon} text-lg`} style={{ color: isSelected ? '#60A5FA' : '#D1D5DB' }}></i>
                                </button>
                            );
                        })}
                    </div>
                    
                    {filteredIcons.length === 0 && (
                        <div className="text-center text-white/40 text-xs py-4">
                            No icons found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
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
    // Ensure value is exactly one of the option values, or use first option as default
    const currentValue = (value && options.some(opt => opt.value === value)) ? value : (options[0]?.value || '');
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

const FontSelectInput = ({ label, value, options, onChange, defaultFont }: { label: string, value: string | undefined, options: {label: string, value: string}[], onChange: (val: string) => void, defaultFont?: string }) => {
    // Only show default option if defaultFont is provided
    const showDefaultOption = !!defaultFont;
    
    // If value is empty/null/undefined or matches defaultFont, show default option
    const isUsingDefault = showDefaultOption && (!value || value === '' || value === defaultFont);
    const currentValue = isUsingDefault ? '__default__' : (value || options[0]?.value || '');
    
    // Find the default font option from PRESET_FONTS to get its display name
    const defaultFontOption = defaultFont ? PRESET_FONTS.find(f => f.value === defaultFont) : null;
    const defaultFontName = defaultFontOption?.name || 'Default Theme Font';
    
    // Get current option for display
    const currentOption = isUsingDefault 
        ? { value: '__default__', label: `${defaultFontName} (Default Theme Font)` }
        : options.find(opt => opt.value === currentValue);
    
    // Build options list with default as first option (only if defaultFont is provided)
    const allOptions = showDefaultOption
        ? [
            { value: '__default__', label: `${defaultFontName} (Default Theme Font)` },
            ...options
          ]
        : options;
    
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 capitalize ml-1">{label}</label>
            <div className="relative">
                <select 
                    className="w-full bg-[#151515] border border-[#333] rounded p-2 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    value={currentValue}
                    onChange={(e) => {
                        e.preventDefault();
                        // If default is selected, pass empty string to clear fontFamily
                        if (e.target.value === '__default__') {
                            onChange('');
                        } else {
                            onChange(e.target.value);
                        }
                    }}
                    style={{ fontFamily: isUsingDefault ? (defaultFont || 'inherit') : (currentOption?.value || 'inherit') }}
                >
                    {allOptions.map(opt => (
                        <option 
                            key={opt.value} 
                            value={opt.value}
                            style={{ fontFamily: opt.value === '__default__' ? (defaultFont || 'inherit') : opt.value }}
                        >
                            {opt.label}
                        </option>
                    ))}
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
            fontFamily: styleAny.titleFontFamily || styleAny.fontFamily || undefined, // Include fontFamily for Hero title
          }
        };
      } else if (elementType === 'subtitle') {
        // Read textSize directly from content.subtitleTextSize (stored directly, no inference needed)
        // Fallback to inferring from subtitleSize only if subtitleTextSize is not set (for backward compatibility)
        let textSize: 'base' | 'small' | 'large' | 'xl' = 'base';
        
        if (content.subtitleTextSize) {
          // Direct storage - most reliable
          textSize = content.subtitleTextSize;
        } else if (styleAny.subtitleSize) {
          // Fallback: infer from subtitleSize (for backward compatibility with old data)
          const normalizeSize = (size: string): string => {
            if (!size) return '';
            return size.trim().toLowerCase().replace(/\s+/g, '');
          };
          const convertToPixels = (size: string): number | null => {
            if (!size) return null;
            const trimmed = size.trim();
            const match = trimmed.match(/^([\d.]+)(px|rem|em)$/i);
            if (!match) return null;
            const value = parseFloat(match[1]);
            const unit = match[2].toLowerCase();
            if (unit === 'rem' || unit === 'em') return value * 16;
            return value;
          };
          
          const subtitleSize = styleAny.subtitleSize;
          const normalizedSubtitleSize = normalizeSize(subtitleSize);
          const subtitlePixels = convertToPixels(subtitleSize);
          
          const normalizedTextSmall = normalizeSize(defaultSizes.textSmall);
          const normalizedTextLarge = normalizeSize(defaultSizes.textLarge);
          const normalizedTextXl = normalizeSize(defaultSizes.textXl);
          const normalizedText = normalizeSize(defaultSizes.text);
          
          if (normalizedSubtitleSize === normalizedTextSmall) {
            textSize = 'small';
          } else if (normalizedSubtitleSize === normalizedTextLarge) {
            textSize = 'large';
          } else if (normalizedSubtitleSize === normalizedTextXl) {
            textSize = 'xl';
          } else if (normalizedSubtitleSize === normalizedText) {
            textSize = 'base';
          } else if (subtitlePixels !== null) {
            const textSmallPixels = convertToPixels(defaultSizes.textSmall);
            const textLargePixels = convertToPixels(defaultSizes.textLarge);
            const textXlPixels = convertToPixels(defaultSizes.textXl);
            const textPixels = convertToPixels(defaultSizes.text);
            
            if (textSmallPixels !== null && Math.abs(subtitlePixels - textSmallPixels) < 0.1) {
              textSize = 'small';
            } else if (textLargePixels !== null && Math.abs(subtitlePixels - textLargePixels) < 0.1) {
              textSize = 'large';
            } else if (textXlPixels !== null && Math.abs(subtitlePixels - textXlPixels) < 0.1) {
              textSize = 'xl';
            } else if (textPixels !== null && Math.abs(subtitlePixels - textPixels) < 0.1) {
              textSize = 'base';
            }
          }
        }
        
        virtualElement = {
          id: selectedElementId,
          type: 'text',
          content: { 
            text: content.subtitle || '',
            textSize: textSize
          },
          style: {
            color: styles.subtitleColor || styles.textColor || '',
            fontWeight: styleAny.subtitleFontWeight || styleAny.fontWeight || '400',
            textAlign: (styleAny.subtitleAlign || styles.textAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
            fontFamily: styleAny.subtitleFontFamily || styleAny.fontFamily || undefined, // Include fontFamily for Hero subtitle
          }
        };
      } else if (elementType === 'button') {
        virtualElement = {
          id: selectedElementId,
          type: 'button',
          content: { 
            text: content.ctaText || '',
            link: content.ctaHref || '' // Include link in virtual element
          },
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
  }, [selectedSection, selectedElementId, siteData.sections, defaultSizes]);

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

  // Auto-save theme settings when font family changes
  const isInitialMount = useRef(true);
  useEffect(() => {
    const { projectId, token } = getUrlParams();
    if (!projectId || !token) return;
    
    // Skip initial mount - only save when font actually changes
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Debounce auto-save to avoid too many API calls
    const timeoutId = setTimeout(async () => {
      try {
        const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:1111/admin/v1';
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };
        
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
          presetId: null,
          defaultSizes,
          defaultTypography
        };
        
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
        
        if (response.ok) {
          toast.success('Font updated and saved!', { duration: 2000 });
        }
      } catch (error) {
        console.error('Error auto-saving font:', error);
        // Don't show error toast for auto-save to avoid annoyance
      }
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timeoutId);
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
        
        // Don't clear subtitleSize - we need it to map to textSize for Hero subtitle virtual elements
        // The subtitleSize is used to determine which textSize variant (base/small/large/xl) to show in the dropdown
        // Clearing it would break the textSize selection functionality
        
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
      
      /* Apply default font family only to canvas content, not GenieBuild UI */
      /* Inline styles (with fontFamily) will automatically override this CSS rule */
      #canvas-root {
        font-family: ${defaultTypography.fontFamily};
      }
      
      /* Apply font family to all text elements within canvas */
      /* Inline fontFamily styles will automatically override this (higher specificity) */
      #canvas-root h1,
      #canvas-root h2,
      #canvas-root h3,
      #canvas-root h4,
      #canvas-root h5,
      #canvas-root h6,
      #canvas-root p,
      #canvas-root span,
      #canvas-root div {
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
                      } else if (elementType === 'button') {
                          if (updates.content.text !== undefined) {
                              sectionUpdates.content = { ...s.content, ctaText: updates.content.text };
                          }
                          if (updates.content.link !== undefined) {
                              sectionUpdates.content = { ...s.content, ctaHref: updates.content.link };
                          }
                      } else if (elementType === 'image' && updates.content.imageUrl !== undefined) {
                          sectionUpdates.content = { ...s.content, imageUrl: updates.content.imageUrl };
                      }
                      
                      // Handle textSize for subtitle (Hero subtitle virtual elements)
                      if (elementType === 'subtitle' && updates.content.textSize !== undefined) {
                          const textSize = updates.content.textSize;
                          
                          // Store textSize directly in content.subtitleTextSize (primary storage)
                          sectionUpdates.content = { 
                              ...s.content, 
                              subtitleTextSize: textSize as 'base' | 'small' | 'large' | 'xl'
                          };
                          
                          // Also update subtitleSize in styles for rendering (keep both for compatibility)
                          const styleUpdates: any = {};
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
                          if (updates.style.fontFamily !== undefined) styleUpdates.titleFontFamily = updates.style.fontFamily;
                      } else if (elementType === 'subtitle') {
                          if (updates.style.color !== undefined) styleUpdates.subtitleColor = updates.style.color;
                          if (updates.style.fontSize !== undefined) styleUpdates.subtitleSize = updates.style.fontSize;
                          if (updates.style.fontWeight !== undefined) styleUpdates.subtitleFontWeight = updates.style.fontWeight;
                          if (updates.style.fontFamily !== undefined) styleUpdates.subtitleFontFamily = updates.style.fontFamily;
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      try {
        // Use uploadFile API instead of base64
        const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:1111/admin/v1';
        const { projectId, token } = getUrlParams();
        
        const formData = new FormData();
        formData.append('file', file);
        
        const headers: HeadersInit = {
          'Authorization': token ? `Bearer ${token}` : '',
        };
        
        const response = await fetch(`${apiUrl}/uploadFile`, {
          method: 'POST',
          headers,
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const data = await response.json();
        const uploadedUrl = data.data?.url || data.url || '';
        
        // Construct full URL with localhost:1111 base
        const fullImageUrl = uploadedUrl.startsWith('http') 
          ? uploadedUrl 
          : `http://localhost:1111${uploadedUrl.startsWith('/') ? '' : '/'}${uploadedUrl}`;
        
        if (uploadTarget.elementId) {
          const section = siteData.sections.find(s => s.id === uploadTarget.sectionId);
          const element = section?.elements?.find(el => el.id === uploadTarget.elementId);
          if (section && element) {
            const fieldName = uploadTarget.field === 'imageUrl' || uploadTarget.field === 'videoUrl' ? uploadTarget.field : uploadTarget.field;
            // For video elements, use 'src' field; for images, use 'imageUrl'
            const updateField = uploadTarget.field === 'videoUrl' ? 'src' : (fieldName === 'imageUrl' ? 'imageUrl' : fieldName);
            const newContent = { ...element.content, [updateField]: fullImageUrl };
            // Also update src for video elements
            if (uploadTarget.field === 'videoUrl' && element.type === 'video') {
                newContent.src = fullImageUrl;
            }
            updateElement(uploadTarget.sectionId, uploadTarget.elementId, { content: newContent });
          }
        } else {
          if (uploadTarget.field === 'backgroundImage') {
            updateSectionStyle(uploadTarget.sectionId, uploadTarget.field, fullImageUrl);
          } else {
            const section = siteData.sections.find(s => s.id === uploadTarget.sectionId);
            if (section) {
              updateSection(uploadTarget.sectionId, { content: {...section.content, [uploadTarget.field]: fullImageUrl} });
            }
          }
        }
        
        const fileType = file.type.startsWith('video/') ? 'Video' : 'Image';
        toast.success(`${fileType} uploaded successfully`);
      } catch (error: any) {
        console.error('Upload error:', error);
        const fileType = file.type?.startsWith('video/') ? 'video' : 'image';
        toast.error(error?.message || `Failed to upload ${fileType}`);
      } finally {
        setUploadTarget(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
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

  const renderStyleEditor = (styles: any, onUpdate: (key: string, val: any) => void, context: 'section' | 'element', elementType?: string) => {
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
                   {context === 'element' && (elementType === 'heading' || elementType === 'text') && (
                       <FontSelectInput 
                           label="Font Family" 
                           value={styles.fontFamily || ''} 
                           options={PRESET_FONTS.map(f => ({ label: f.name, value: f.value }))} 
                           onChange={(v) => {
                               // If empty string, remove fontFamily to use theme default
                               if (v === '') {
                                   onUpdate('fontFamily', undefined);
                               } else {
                                   onUpdate('fontFamily', v);
                               }
                           }} 
                           defaultFont={defaultTypography.fontFamily}
                       />
                   )}
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
              {context === 'element' && elementType === 'image' && (
                  <>
                      <AccordionGroup title="Image Effects" defaultOpen={true}>
                          <RangeInput 
                              label="Opacity" 
                              value={styles.opacity !== undefined ? Math.round(parseFloat(styles.opacity) * 100) : 100} 
                              min={0} 
                              max={100} 
                              step={1} 
                              unit="%" 
                              onChange={(v) => onUpdate('opacity', (v / 100).toString())} 
                          />
                          <ColorInput 
                              label="Overlay Color" 
                              value={styles.overlayColor || ''} 
                              onChange={(v) => onUpdate('overlayColor', v)} 
                          />
                          <RangeInput 
                              label="Overlay Opacity" 
                              value={styles.overlayOpacity !== undefined ? Math.round(parseFloat(styles.overlayOpacity) * 100) : 0} 
                              min={0} 
                              max={100} 
                              step={1} 
                              unit="%" 
                              onChange={(v) => onUpdate('overlayOpacity', (v / 100).toString())} 
                          />
                          <SelectInput 
                              label="Object Fit" 
                              value={styles.objectFit || 'cover'} 
                              options={[
                                  {label: 'Cover', value: 'cover'},
                                  {label: 'Contain', value: 'contain'},
                                  {label: 'Fill', value: 'fill'},
                                  {label: 'None', value: 'none'},
                                  {label: 'Scale Down', value: 'scale-down'}
                              ]} 
                              onChange={(v) => onUpdate('objectFit', v)} 
                          />
                          <SelectInput 
                              label="Object Position" 
                              value={styles.objectPosition || 'center'} 
                              options={[
                                  {label: 'Center', value: 'center'},
                                  {label: 'Top', value: 'top'},
                                  {label: 'Bottom', value: 'bottom'},
                                  {label: 'Left', value: 'left'},
                                  {label: 'Right', value: 'right'},
                                  {label: 'Top Left', value: 'top left'},
                                  {label: 'Top Right', value: 'top right'},
                                  {label: 'Bottom Left', value: 'bottom left'},
                                  {label: 'Bottom Right', value: 'bottom right'}
                              ]} 
                              onChange={(v) => onUpdate('objectPosition', v)} 
                          />
                      </AccordionGroup>
                      <AccordionGroup title="Filters">
                          <RangeInput 
                              label="Brightness" 
                              value={styles.filter?.includes('brightness') ? Math.round(parseFloat(styles.filter.match(/brightness\(([^)]+)\)/)?.[1] || '1') * 100) : 100} 
                              min={0} 
                              max={200} 
                              step={1} 
                              unit="%" 
                              onChange={(v) => {
                                  const currentFilter = styles.filter || '';
                                  const brightness = `brightness(${v / 100})`;
                                  const newFilter = currentFilter.replace(/brightness\([^)]+\)/g, '').trim() + ' ' + brightness;
                                  onUpdate('filter', newFilter.trim());
                              }} 
                          />
                          <RangeInput 
                              label="Contrast" 
                              value={styles.filter?.includes('contrast') ? Math.round(parseFloat(styles.filter.match(/contrast\(([^)]+)\)/)?.[1] || '1') * 100) : 100} 
                              min={0} 
                              max={200} 
                              step={1} 
                              unit="%" 
                              onChange={(v) => {
                                  const currentFilter = styles.filter || '';
                                  const contrast = `contrast(${v / 100})`;
                                  const newFilter = currentFilter.replace(/contrast\([^)]+\)/g, '').trim() + ' ' + contrast;
                                  onUpdate('filter', newFilter.trim());
                              }} 
                          />
                          <RangeInput 
                              label="Saturation" 
                              value={styles.filter?.includes('saturate') ? Math.round(parseFloat(styles.filter.match(/saturate\(([^)]+)\)/)?.[1] || '1') * 100) : 100} 
                              min={0} 
                              max={200} 
                              step={1} 
                              unit="%" 
                              onChange={(v) => {
                                  const currentFilter = styles.filter || '';
                                  const saturate = `saturate(${v / 100})`;
                                  const newFilter = currentFilter.replace(/saturate\([^)]+\)/g, '').trim() + ' ' + saturate;
                                  onUpdate('filter', newFilter.trim());
                              }} 
                          />
                          <RangeInput 
                              label="Blur" 
                              value={styles.filter?.includes('blur') ? Math.round(parseFloat(styles.filter.match(/blur\(([^)]+)\)/)?.[1] || '0') * 10) : 0} 
                              min={0} 
                              max={100} 
                              step={1} 
                              unit="px" 
                              onChange={(v) => {
                                  const currentFilter = styles.filter || '';
                                  const blur = `blur(${v / 10}px)`;
                                  const newFilter = currentFilter.replace(/blur\([^)]+\)/g, '').trim() + ' ' + blur;
                                  onUpdate('filter', newFilter.trim());
                              }} 
                          />
                          <RangeInput 
                              label="Hue Rotate" 
                              value={styles.filter?.includes('hue-rotate') ? Math.round(parseFloat(styles.filter.match(/hue-rotate\(([^)]+)\)/)?.[1] || '0')) : 0} 
                              min={0} 
                              max={360} 
                              step={1} 
                              unit="deg" 
                              onChange={(v) => {
                                  const currentFilter = styles.filter || '';
                                  const hueRotate = `hue-rotate(${v}deg)`;
                                  const newFilter = currentFilter.replace(/hue-rotate\([^)]+\)/g, '').trim() + ' ' + hueRotate;
                                  onUpdate('filter', newFilter.trim());
                              }} 
                          />
                      </AccordionGroup>
                      <AccordionGroup title="Border & Shadow">
                          <TextInput label="Border Radius" value={styles.borderRadius || ''} onChange={(v) => onUpdate('borderRadius', v)} placeholder="e.g., 8px, 50%, 1rem" />
                          <TextInput label="Border Width" value={styles.borderWidth || ''} onChange={(v) => onUpdate('borderWidth', v)} placeholder="e.g., 2px, 1rem" />
                          <ColorInput label="Border Color" value={styles.borderColor || ''} onChange={(v) => onUpdate('borderColor', v)} />
                          <TextInput label="Box Shadow" value={styles.boxShadow || ''} onChange={(v) => onUpdate('boxShadow', v)} placeholder="e.g., 0 4px 6px rgba(0,0,0,0.1)" />
                      </AccordionGroup>
                  </>
              )}
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
    <div className={`h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden flex flex-col`}>
        <header className="h-14 border-b border-white/10 bg-[#050505] flex items-center justify-between px-4 shrink-0 z-50">
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg tracking-tighter">Genie<span className="text-blue-500">Build</span></span>
                <div className="h-4 w-px bg-white/10 mx-2"></div>
                <button onClick={() => { setSelectedSectionId(null); setSelectedElementId(null); setGlobalTab('themes'); setIsSidebarOpen(true); }} className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${!selectedSectionId && isSidebarOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} title="Global Design System"><i className="fa-solid fa-palette"></i>Theme</button>
                <button onClick={() => addNewSection('allelementsTest')} className="px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5" title="Add All Elements Test Section"><i className="fa-solid fa-vial"></i>Test All Elements</button>
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
                                        <FontSelectInput 
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
                                 editTab === 'design' ? (renderStyleEditor(selectedElement.style, (k,v) => updateElement(selectedSection.id, selectedElement.id, { style: { ...selectedElement.style, [k]: v } }), 'element', selectedElement.type)) : (
                                     <div className="space-y-4">
                                         {selectedElement.type === 'image' ? (
                                             <div className="space-y-4">
                                                 <ImageControl 
                                                     label="Image URL" 
                                                     value={selectedElement.content.imageUrl || ''} 
                                                     onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, imageUrl: v} })} 
                                                     onUpload={() => triggerUpload(selectedSection.id, 'imageUrl', selectedElement.id)}
                                                 />
                                                 <TextInput 
                                                     label="Alt Text" 
                                                     value={selectedElement.content.imageAlt || selectedElement.content.alt || ''} 
                                                     onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, imageAlt: v, alt: v} })} 
                                                     placeholder="Enter image alt text"
                                                 />
                                             </div>
                                         ) : selectedElement.type === 'image-box' ? (
                                             <div className="space-y-4">
                                                 <ImageControl 
                                                     label="Image URL" 
                                                     value={selectedElement.content.imageUrl || selectedElement.content.src || ''} 
                                                     onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, imageUrl: v, src: v} })} 
                                                     onUpload={() => triggerUpload(selectedSection.id, 'imageUrl', selectedElement.id)}
                                                 />
                                                 <TextInput 
                                                     label="Alt Text" 
                                                     value={selectedElement.content.imageAlt || selectedElement.content.alt || ''} 
                                                     onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, imageAlt: v, alt: v} })} 
                                                     placeholder="Enter image alt text"
                                                 />
                                                 <TextInput 
                                                     label="Title" 
                                                     value={selectedElement.content.title || selectedElement.content.text || ''} 
                                                     onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, title: v, text: v} })} 
                                                     placeholder="Enter image box title"
                                                 />
                                                 <TextAreaInput 
                                                     label="Subtitle / Description" 
                                                     value={selectedElement.content.description || selectedElement.content.subText || ''} 
                                                     onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, description: v, subText: v} })} 
                                                 />
                                             </div>
                                         ) : selectedElement.type === 'video' ? (
                                             <div className="space-y-4">
                                                 <VideoControl 
                                                     label="Video URL" 
                                                     value={selectedElement.content.src || ''} 
                                                     onChange={(v) => {
                                                         // If it's a YouTube URL, convert to embed format
                                                         const isYouTube = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.test(v);
                                                         let finalUrl = v;
                                                         if (isYouTube && !v.includes('youtube.com/embed/')) {
                                                             const match = v.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                                             if (match && match[1]) {
                                                                 finalUrl = `https://www.youtube.com/embed/${match[1]}`;
                                                             }
                                                         }
                                                         updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, src: finalUrl} });
                                                     }} 
                                                     onUpload={() => triggerUpload(selectedSection.id, 'videoUrl', selectedElement.id)}
                                                 />
                                             </div>
                                         ) : selectedElement.type === 'icon' ? (
                                             <div className="space-y-4">
                                                 <IconPicker 
                                                     label="Icon" 
                                                     value={selectedElement.content.icon || 'fa-star'} 
                                                     onChange={(v) => {
                                                         // Ensure icon is in correct format (fa-icon-name)
                                                         const iconValue = v.startsWith('fa-') ? v : `fa-${v}`;
                                                         updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, icon: iconValue} });
                                                     }} 
                                                 />
                                                 <TextInput 
                                                     label="Icon Size" 
                                                     value={selectedElement.content.iconSize || '2rem'} 
                                                     onChange={(v) => updateElement(selectedSection.id, selectedElement.id, { content: {...selectedElement.content, iconSize: v} })} 
                                                     placeholder="e.g., 2rem, 24px, 1.5em"
                                                 />
                                             </div>
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
                                                 {selectedElement.type === 'text' && (() => {
                                                     // For Hero subtitle virtual elements, we need to compute textSize from subtitleSize
                                                     // For regular text elements, read from content.textSize
                                                     let currentTextSize: 'base' | 'small' | 'large' | 'xl' = 'base';
                                                     
                                                     if (selectedElement.id.includes('-hero-subtitle')) {
                                                         // Hero subtitle virtual element - read textSize directly from content.subtitleTextSize
                                                         const currentSection = siteData.sections.find(s => s.id === selectedSection.id);
                                                         if (currentSection && currentSection.content.subtitleTextSize) {
                                                             // Direct storage - most reliable
                                                             currentTextSize = currentSection.content.subtitleTextSize;
                                                         } else {
                                                             // Fallback to selectedElement (from useMemo)
                                                             currentTextSize = selectedElement.content?.textSize || 'base';
                                                         }
                                                     } else {
                                                         // Regular text element - read from content.textSize
                                                         const currentSection = siteData.sections.find(s => s.id === selectedSection.id);
                                                         const currentElement = currentSection?.elements?.find(e => e.id === selectedElement.id);
                                                         currentTextSize = (currentElement?.content?.textSize || selectedElement.content?.textSize || 'base') as 'base' | 'small' | 'large' | 'xl';
                                                     }
                                                     
                                                     return (
                                                         <SelectInput 
                                                             key={`text-size-${selectedElement.id}-${currentTextSize}`}
                                                             label="Text Size" 
                                                             value={currentTextSize}
                                                             options={[
                                                                 {label: 'Base', value: 'base'},
                                                                 {label: 'Small', value: 'small'},
                                                                 {label: 'Large', value: 'large'},
                                                                 {label: 'XL', value: 'xl'}
                                                             ]} 
                                                             onChange={(v) => {
                                                                 const newTextSize = v as 'base' | 'small' | 'large' | 'xl';
                                                                 updateElement(selectedSection.id, selectedElement.id, { 
                                                                     content: {...selectedElement.content, textSize: newTextSize} 
                                                                 });
                                                             }} 
                                                         />
                                                     );
                                                 })()}
                                                 {selectedElement.type === 'button' && (
                                                     <TextInput 
                                                         label="Button Link (URL)" 
                                                         value={
                                                             // For Hero button virtual elements, read from section content
                                                             selectedElement.id.includes('-hero-button')
                                                                 ? (selectedSection.content.ctaHref || '')
                                                                 : (selectedElement.content.link || '')
                                                         }
                                                         onChange={(v) => {
                                                             // For Hero button virtual elements, update ctaHref in section content
                                                             if (selectedElement.id.includes('-hero-button')) {
                                                                 updateElement(selectedSection.id, selectedElement.id, {
                                                                     content: {
                                                                         ...selectedElement.content,
                                                                         link: v
                                                                     }
                                                                 });
                                                             } else {
                                                                 // For regular button elements
                                                                 updateElement(selectedSection.id, selectedElement.id, { 
                                                                     content: {...selectedElement.content, link: v} 
                                                                 });
                                                             }
                                                         }}
                                                         placeholder="https://example.com or /page"
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
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
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
