
import React, { useState, useEffect } from 'react';
import { Section, WebsiteElement } from '../../types';

interface ElementsSectionProps {
  section: Section;
  onTextEdit: (key: any, value: string) => void;
  onUpload?: (sectionId: string, field: string) => void;
  onElementUpdate: (elementId: string, updates: Partial<WebsiteElement>) => void;
  onElementSelect?: (elementId: string) => void;
  selectedElementId?: string | null;
  buttonClass: string;
}

// Helper for Countdown
const CountdownTimer = ({ targetDate, style }: { targetDate: string, style: any }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;
            
            if (distance < 0) {
                clearInterval(interval);
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const boxClass = "flex flex-col items-center p-3 rounded bg-white/5 border border-white/10 min-w-[60px] md:min-w-[80px]";
    const numClass = "text-xl md:text-2xl font-bold";
    const labelClass = "text-[10px] uppercase opacity-60";

    return (
        <div className="flex gap-2 md:gap-4" style={{ justifyContent: style.textAlign === 'center' ? 'center' : (style.textAlign === 'right' ? 'flex-end' : 'flex-start') }}>
            <div className={boxClass} style={{ borderColor: style.accentColor }}>
                <span className={numClass}>{timeLeft.days}</span>
                <span className={labelClass}>Days</span>
            </div>
            <div className={boxClass} style={{ borderColor: style.accentColor }}>
                <span className={numClass}>{timeLeft.hours}</span>
                <span className={labelClass}>Hrs</span>
            </div>
            <div className={boxClass} style={{ borderColor: style.accentColor }}>
                <span className={numClass}>{timeLeft.minutes}</span>
                <span className={labelClass}>Min</span>
            </div>
            <div className={boxClass} style={{ borderColor: style.accentColor }}>
                <span className={numClass}>{timeLeft.seconds}</span>
                <span className={labelClass}>Sec</span>
            </div>
        </div>
    );
};

const getSafeStyle = (style: any): React.CSSProperties => {
  const css: any = { ...style };
  
  // Explicitly handle 'margin' object from state
  if (typeof style.margin === 'object' && style.margin !== null) {
      if(style.margin.top) css.marginTop = style.margin.top;
      if(style.margin.right) css.marginRight = style.margin.right;
      if(style.margin.bottom) css.marginBottom = style.margin.bottom;
      if(style.margin.left) css.marginLeft = style.margin.left;
      delete css.margin;
  }
  
  // Explicitly handle 'padding' object from state
  if (typeof style.padding === 'object' && style.padding !== null) {
      if(style.padding.top) css.paddingTop = style.padding.top;
      if(style.padding.right) css.paddingRight = style.padding.right;
      if(style.padding.bottom) css.paddingBottom = style.padding.bottom;
      if(style.padding.left) css.paddingLeft = style.padding.left;
      delete css.padding;
  }
  
  // Clean up 'borderRadius'
  if (typeof style.borderRadius === 'object' && style.borderRadius !== null) {
      if(style.borderRadius.tl) css.borderTopLeftRadius = style.borderRadius.tl;
      if(style.borderRadius.tr) css.borderTopRightRadius = style.borderRadius.tr;
      if(style.borderRadius.bl) css.borderBottomLeftRadius = style.borderRadius.bl;
      if(style.borderRadius.br) css.borderBottomRightRadius = style.borderRadius.br;
      delete css.borderRadius;
  }

  if (typeof style.borderWidth === 'object' && style.borderWidth !== null) {
      if(style.borderWidth.top) css.borderTopWidth = style.borderWidth.top;
      if(style.borderWidth.right) css.borderRightWidth = style.borderWidth.right;
      if(style.borderWidth.bottom) css.borderBottomWidth = style.borderWidth.bottom;
      if(style.borderWidth.left) css.borderLeftWidth = style.borderWidth.left;
      delete css.borderWidth;
  }
  
  // Remove non-standard CSS properties
  delete css.backgroundGradient;
  delete css.backgroundOverlay;
  delete css.accentColor;
  delete css.hiddenOnDesktop;
  delete css.hiddenOnTablet;
  delete css.hiddenOnMobile;

  return css as React.CSSProperties;
};

export const ElementsSection: React.FC<ElementsSectionProps> = ({ section, onElementUpdate, onElementSelect, selectedElementId, buttonClass }) => {
  const elements = section.elements || [];
  const [activeTabs, setActiveTabs] = useState<Record<string, number>>({});

  const handleContentUpdate = (id: string, key: string, value: any) => {
    const el = elements.find(e => e.id === id);
    if(el) {
        onElementUpdate(id, { content: { ...el.content, [key]: value } });
    }
  };

  const handleClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (onElementSelect) {
          onElementSelect(id);
      }
  };

  const renderElement = (el: WebsiteElement) => {
    const { id, type, content, style } = el;
    const isSelected = selectedElementId === id;
    const selectedClass = isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-20' : 'hover:ring-1 hover:ring-white/20';

    const safeStyle = getSafeStyle(style);

    switch (type) {
        case 'heading':
            const headingTag = (content.htmlTag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            return React.createElement(
                headingTag,
                {
                    key: `${id}-${headingTag}`, // Force re-render when tag changes
                    className: `font-bold outline-none rounded px-1 relative transition-all cursor-pointer ${selectedClass}`,
                    style: safeStyle,
                    onClick: (e: React.MouseEvent) => handleClick(e, id),
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onBlur: (e: any) => handleContentUpdate(id, 'text', e.currentTarget.textContent)
                },
                content.text
            );

        case 'text':
            return (
                <p 
                    key={id}
                    className={`outline-none rounded px-1 relative transition-all cursor-pointer ${selectedClass}`}
                    style={safeStyle}
                    onClick={(e: React.MouseEvent) => handleClick(e, id)}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e: any) => handleContentUpdate(id, 'text', e.currentTarget.textContent)}
                >
                    {content.text}
                </p>
            );

        case 'button':
        case 'call-to-action':
            return (
                <div key={id} style={{ textAlign: safeStyle.textAlign }}>
                    <button 
                        className={`${buttonClass} outline-none relative transition-all cursor-pointer ${selectedClass}`}
                        style={{ ...safeStyle, textAlign: 'center' }}
                        onClick={(e) => handleClick(e, id)}
                        contentEditable suppressContentEditableWarning
                        onBlur={(e: any) => handleContentUpdate(id, 'text', e.currentTarget.textContent)}
                    >
                        {content.text}
                    </button>
                    {type === 'call-to-action' && content.subText && (
                        <p className="mt-2 text-sm opacity-70" contentEditable suppressContentEditableWarning onBlur={(e) => handleContentUpdate(id, 'subText', e.currentTarget.textContent)}>{content.subText}</p>
                    )}
                </div>
            );

        case 'image':
            return (
                <div key={id} className={`relative group cursor-pointer inline-block max-w-full ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    <img 
                        src={content.src || 'https://via.placeholder.com/600x400'} 
                        alt={content.alt} 
                        className="max-w-full h-auto object-cover shadow-lg"
                        style={{ borderRadius: safeStyle.borderRadius, width: '100%', height: '100%' }}
                    />
                </div>
            );

        case 'video':
             return (
                 <div key={id} className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                     {content.src ? (
                         <iframe 
                            src={content.src.replace('watch?v=', 'embed/')} 
                            className="w-full h-full border-0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                         />
                     ) : (
                         <div className="flex items-center justify-center h-full text-white/20 flex-col gap-4">
                             <i className="fa-solid fa-play text-4xl"></i>
                             <span className="text-sm font-bold uppercase tracking-widest">Add Video URL</span>
                         </div>
                     )}
                 </div>
             );

        case 'icon':
            return (
                <div key={id} className={`inline-block ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    <i className={`fa-solid ${content.icon || 'fa-star'}`} style={{ fontSize: safeStyle.fontSize || '2rem', color: safeStyle.color }}></i>
                </div>
            );
            
        case 'icon-box':
            return (
                <div key={id} className={`flex gap-4 p-4 rounded-lg bg-white/5 border border-white/5 ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    <div className="shrink-0">
                         <i className={`fa-solid ${content.icon || 'fa-layer-group'}`} style={{ fontSize: '2rem', color: style.accentColor }}></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1" contentEditable suppressContentEditableWarning onBlur={(e) => handleContentUpdate(id, 'text', e.currentTarget.textContent)}>{content.text || 'Icon Box Title'}</h3>
                        <p className="opacity-70 text-sm" contentEditable suppressContentEditableWarning onBlur={(e) => handleContentUpdate(id, 'subText', e.currentTarget.textContent)}>{content.subText || 'Description for this icon box goes here.'}</p>
                    </div>
                </div>
            );

        case 'image-box':
            return (
                <div key={id} className={`flex flex-col gap-4 p-0 rounded-lg overflow-hidden bg-white/5 border border-white/5 ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                     <img src={content.src || 'https://via.placeholder.com/400x250'} className="w-full h-48 object-cover" alt="Box" />
                     <div className="p-6 pt-2">
                        <h3 className="font-bold text-xl mb-2" contentEditable suppressContentEditableWarning onBlur={(e) => handleContentUpdate(id, 'text', e.currentTarget.textContent)}>{content.text || 'Image Box Title'}</h3>
                        <p className="opacity-70 text-sm" contentEditable suppressContentEditableWarning onBlur={(e) => handleContentUpdate(id, 'subText', e.currentTarget.textContent)}>{content.subText || 'Description text for the image box element.'}</p>
                     </div>
                </div>
            );

        case 'list':
            return (
                <ul key={id} className={`list-disc list-inside space-y-2 ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    {(content.items || [{title: 'List Item 1'}, {title: 'List Item 2'}, {title: 'List Item 3'}]).map((item, i) => (
                        <li key={i} className="opacity-90">
                            {item.title}
                        </li>
                    ))}
                </ul>
            );

        case 'star-rating':
            return (
                <div key={id} className={`flex gap-1 ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    {[1,2,3,4,5].map(star => (
                        <i key={star} className={`fa-solid fa-star ${star <= (content.rating || 5) ? 'text-yellow-500' : 'text-slate-600'}`}></i>
                    ))}
                </div>
            );
            
        case 'badge':
            return (
                <span 
                    key={id} 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedClass}`} 
                    style={{ backgroundColor: style.accentColor || '#3b82f6', color: '#fff', ...safeStyle }}
                    onClick={(e) => handleClick(e, id)}
                    contentEditable suppressContentEditableWarning 
                    onBlur={(e) => handleContentUpdate(id, 'text', e.currentTarget.textContent)}
                >
                    {content.text || 'Badge'}
                </span>
            );

        case 'highlight-text':
            return (
                <p key={id} className={`${selectedClass}`} style={safeStyle} onClick={(e) => handleClick(e, id)}>
                    Here is some <span className="px-1 rounded" style={{ backgroundColor: style.accentColor || '#facc15', color: '#000' }}>{content.text || 'Highlighted'}</span> text example.
                </p>
            );

        case 'blockquote':
            return (
                <blockquote key={id} className={`border-l-4 pl-4 py-2 italic opacity-80 ${selectedClass}`} style={{ borderColor: style.accentColor || '#fff', ...safeStyle }} onClick={(e) => handleClick(e, id)}>
                    <p className="mb-2" contentEditable suppressContentEditableWarning onBlur={(e) => handleContentUpdate(id, 'text', e.currentTarget.textContent)}>"{content.text || 'This is a quote.'}"</p>
                    <cite className="text-sm font-bold not-italic opacity-70">- {content.author || 'Author Name'}</cite>
                </blockquote>
            );

        case 'accordion':
            return (
                <div key={id} className={`space-y-2 ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    {content.items?.map((item, idx) => (
                        <details key={idx} className="group bg-white/5 border border-white/10 rounded-lg open:bg-white/10 transition-colors">
                            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold list-none">
                                <span>{item.title}</span>
                                <i className="fa-solid fa-chevron-down text-xs transition-transform group-open:rotate-180"></i>
                            </summary>
                            <div className="p-4 pt-0 text-sm opacity-80 leading-relaxed border-t border-white/5 mt-2">
                                {item.content}
                            </div>
                        </details>
                    ))}
                </div>
            );

        case 'toggle':
            return (
                <div key={id} className={`bg-white/5 border border-white/10 rounded-lg ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                     <details className="group">
                        <summary className="flex items-center gap-3 p-4 cursor-pointer font-bold list-none">
                             <div className="w-10 h-6 bg-white/10 rounded-full relative group-open:bg-green-500 transition-colors">
                                 <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all group-open:left-5"></div>
                             </div>
                             <span>{content.text || 'Toggle Title'}</span>
                        </summary>
                        <div className="p-4 pt-0 text-sm opacity-80">
                            {content.subText || 'Toggle Content goes here...'}
                        </div>
                     </details>
                </div>
            );

        case 'tabs':
            const currentTab = activeTabs[id] || 0;
            return (
                <div key={id} className={`${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    <div className="flex border-b border-white/10 mb-4 overflow-x-auto">
                        {content.items?.map((item, idx) => (
                            <button 
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setActiveTabs({...activeTabs, [id]: idx}); }}
                                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${currentTab === idx ? 'border-blue-500 text-white' : 'border-transparent text-white/50 hover:text-white'}`}
                                style={{ borderColor: currentTab === idx ? style.accentColor : 'transparent' }}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 min-h-[100px]">
                        {content.items?.[currentTab]?.content}
                    </div>
                </div>
            );

        case 'progress-bar':
            return (
                <div key={id} className={`${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    <div className="flex justify-between mb-1 text-xs font-bold uppercase tracking-wider">
                        <span>{content.text}</span>
                        <span>{content.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                            style={{ width: `${content.percentage}%`, backgroundColor: style.accentColor || '#3b82f6' }}
                        ></div>
                    </div>
                </div>
            );

        case 'counter':
            return (
                <div key={id} className={`text-center p-6 border border-white/10 bg-white/5 rounded-xl ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                    <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: style.accentColor || '#ffffff' }}>
                        {content.prefix}{content.targetNumber}{content.suffix}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-widest opacity-60">
                        {content.text}
                    </div>
                </div>
            );
        
        case 'alert-box':
            const alertColors = {
                success: 'rgba(34, 197, 94, 0.1)',
                warning: 'rgba(234, 179, 8, 0.1)',
                error: 'rgba(239, 68, 68, 0.1)',
                info: 'rgba(59, 130, 246, 0.1)'
            };
            const alertBorder = {
                success: '#22c55e',
                warning: '#eab308',
                error: '#ef4444',
                info: '#3b82f6'
            };
            const alertBoxType = content.alertType || 'info';
            
            return (
                <div key={id} className={`p-4 rounded-lg border-l-4 flex gap-4 ${selectedClass}`} onClick={(e) => handleClick(e, id)} 
                    style={{ 
                        backgroundColor: alertColors[alertBoxType],
                        borderColor: alertBorder[alertBoxType],
                        ...safeStyle
                    }}
                >
                     <div style={{ color: alertBorder[alertBoxType] }}><i className={`fa-solid ${content.icon || 'fa-circle-info'}`}></i></div>
                     <div>
                         <strong className="block font-bold mb-1" contentEditable suppressContentEditableWarning onBlur={(e) => handleContentUpdate(id, 'text', e.currentTarget.textContent)}>{content.text || 'Alert Title'}</strong>
                         <p className="text-sm opacity-80" contentEditable suppressContentEditableWarning onBlur={(e) => handleContentUpdate(id, 'subText', e.currentTarget.textContent)}>{content.subText || 'Alert description.'}</p>
                     </div>
                </div>
            );

        case 'testimonial':
            return (
                 <div key={id} className={`p-6 rounded-xl bg-white/5 border border-white/10 ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                     <div className="flex items-center gap-4 mb-4">
                         <img src={content.items?.[0]?.avatar || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-full object-cover" alt="Avatar" />
                         <div>
                             <div className="font-bold">{content.items?.[0]?.author || 'John Doe'}</div>
                             <div className="text-xs opacity-50">{content.items?.[0]?.role || 'Customer'}</div>
                         </div>
                         <div className="ml-auto text-yellow-500 text-sm">
                             <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                         </div>
                     </div>
                     <p className="italic opacity-80">"{content.items?.[0]?.content || 'Great service!'}"</p>
                 </div>
            );

        case 'pricing-table':
             return (
                 <div key={id} className={`p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={{ borderColor: style.accentColor, ...safeStyle }}>
                     <h3 className="text-xl font-bold mb-2">{content.text || 'Plan Name'}</h3>
                     <div className="text-4xl font-bold mb-1">{content.price || '$99'}</div>
                     <div className="text-sm opacity-50 mb-6">{content.period || 'per month'}</div>
                     <ul className="space-y-3 mb-8 w-full text-left">
                         {content.items?.map((feature, i) => (
                             <li key={i} className="flex gap-2 text-sm opacity-80">
                                 <i className="fa-solid fa-check text-green-500 mt-1"></i> {feature.title}
                             </li>
                         ))}
                     </ul>
                     <button className={`${buttonClass} w-full`}>{content.link || 'Choose Plan'}</button>
                 </div>
             );

        case 'flip-box':
            const directionClass = {
                left: 'group-hover:rotate-y-180',
                right: 'group-hover:-rotate-y-180',
                top: 'group-hover:rotate-x-180',
                bottom: 'group-hover:-rotate-x-180'
            };
            const dir = content.flipDirection || 'left';
            const rotateClass = directionClass[dir] || directionClass.left;
            
            const backRotate = (dir === 'top' || dir === 'bottom') ? 'rotate-x-180' : 'rotate-y-180';

            return (
                 <div key={id} className={`group h-64 perspective-1000 ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                     <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${rotateClass}`}>
                         <div className="absolute inset-0 backface-hidden bg-white/10 border border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                              <i className={`fa-solid ${content.icon || 'fa-star'} text-4xl mb-4`} style={{color: style.accentColor}}></i>
                              <h3 className="font-bold text-xl">{content.frontTitle || 'Front Title'}</h3>
                              <p className="text-sm opacity-70 mt-2">{content.frontDesc || 'Hover to flip'}</p>
                         </div>
                         <div className={`absolute inset-0 backface-hidden ${backRotate} bg-blue-600 rounded-xl flex flex-col items-center justify-center p-6 text-center`} style={{ backgroundColor: style.accentColor }}>
                              <h3 className="font-bold text-xl">{content.backTitle || 'Back Title'}</h3>
                              <p className="text-sm opacity-90 mt-2 mb-4">{content.backDesc || 'Hidden details revealed.'}</p>
                              <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full">Action</button>
                         </div>
                     </div>
                 </div>
            );

        case 'countdown-timer':
             return (
                 <div key={id} className={`${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                     <h4 className="font-bold mb-4 uppercase tracking-widest text-xs opacity-50" style={{textAlign: safeStyle.textAlign}}>{content.text || 'Offer Ends In'}</h4>
                     <CountdownTimer targetDate={content.targetDate || new Date(Date.now() + 86400000).toISOString()} style={style} />
                 </div>
             );

        case 'review-carousel':
            return (
                 <div key={id} className={`p-6 bg-white/5 border border-white/10 rounded-xl ${selectedClass}`} onClick={(e) => handleClick(e, id)} style={safeStyle}>
                     <div className="flex gap-4 overflow-hidden mask-linear-gradient">
                         {(content.items || [{title: 'Review 1'}, {title: 'Review 2'}]).map((item, i) => (
                             <div key={i} className="min-w-[250px] p-4 bg-black/20 rounded border border-white/5">
                                 <div className="text-yellow-500 text-xs mb-2"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                                 <p className="text-sm italic opacity-80 mb-2">"{item.content || 'Excellent product.'}"</p>
                                 <div className="font-bold text-xs">{item.author || 'User'}</div>
                             </div>
                         ))}
                     </div>
                 </div>
            );

        default:
             return (
                 <div key={id} className={`${selectedClass} opacity-50`} onClick={(e) => handleClick(e, id)}>
                     Element {type} not fully implemented in preview.
                 </div>
             );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 relative z-10 text-left">
      <div className="grid gap-8">
          {elements.map(renderElement)}
      </div>
    </div>
  );
};
