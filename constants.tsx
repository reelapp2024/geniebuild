
import { WebsiteData, Section, WebsiteElement } from './types';

// Global Element Defaults - Universal baseline styles for all elements
// NOTE: No color properties here - elements inherit from theme via ElementsSection
export const ELEMENT_DEFAULTS: Record<string, any> = {
  card: { padding: '32px', borderRadius: '24px', borderWidth: '1px', borderStyle: 'solid', backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  button: { padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' },
  badge: { padding: '6px' },
  heading: { fontWeight: 'bold', textAlign: 'center'},
  text: { opacity: 1, textAlign: 'center'},
  icon: { fontSize: '24px' },
  image: { 
    objectFit: 'cover', 
    width: '100%',
    aspectRatio: 'auto',
    borderRadius: '0%',
    borderWidth: '0px',
    borderStyle: 'none',
    borderColor: 'transparent',
    boxShadow: 'none',
    filter: 'none'
  },
  'star-rating': {},
  'feature-box': {
    padding: '24px',
    borderRadius: '16px',
    iconSize: '24px',
    iconContainerSize: '48px',
    titleFontSize: '20px',
    titleFontWeight: '700',
    descriptionFontSize: '14px'
  }
};

export const PRESET_FONTS = [
  // Sans-serif fonts
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Poppins', value: '"Poppins", sans-serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: '"Lato", sans-serif' },
  { name: 'Nunito', value: '"Nunito", sans-serif' },
  { name: 'Raleway', value: '"Raleway", sans-serif' },
  { name: 'Ubuntu', value: '"Ubuntu", sans-serif' },
  { name: 'Work Sans', value: '"Work Sans", sans-serif' },
  { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
  { name: 'DM Sans', value: '"DM Sans", sans-serif' },
  
  // Serif fonts
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Merriweather', value: '"Merriweather", serif' },
  { name: 'Lora', value: '"Lora", serif' },
  { name: 'Crimson Text', value: '"Crimson Text", serif' },
  { name: 'Libre Caslon Text', value: '"Libre Caslon Text", serif' },
 
  // Script/Display fonts
  { name: 'Dancing Script', value: '"Dancing Script", cursive' },
  { name: 'Pacifico', value: '"Pacifico", cursive' },
  { name: 'Great Vibes', value: '"Great Vibes", cursive' },
  { name: 'Satisfy', value: '"Satisfy", cursive' },
];

export const PRESET_THEMES = [
  {
    "name": "Crimson Jet",
    "elements": {
      "heading": "#F8FAFC", "description": "#C7CDD6", "surface": "#0E1214",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#2D0A0F", "opacity": 0.75, "blend": "normal" }, 
      "primaryButton": { "bg": "#E11D48", "text": "#FFFFFF", "hover": "#BE123C" },
      "secondaryButton": { "bg": "transparent", "text": "#F8FAFC", "border": "#E11D48", "hover": "rgba(244,63,94,0.10)" },
      "icon": "#E11D48",
      "iconBg": "rgba(225,29,72,0.1)",
      "subheading": "#D1D5DB",
      "secondaryHeading": "#E11D48",
      "accent": "#F59E0B", "gradient": { "from": "#0E1214", "to": "#1F2937" },
      "ring": "#F43F5E", "shadow": "rgba(0,0,0,0.35)",
      "badge": { "text": "#F8FAFC", "background": "rgba(225,29,72,0.15)" },
      "trust": { "text": "#C7CDD6", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#F59E0B" },
      "accordion": { "questionColor": "#F8FAFC", "answerColor": "#C7CDD6" },
      "light": {
        "surface": "#FFFFFF", "heading": "#000000", "description": "#333333", "accent": "#E11D48",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#4B5563",
        "iconBg": "rgba(225,29,72,0.08)",
        "secondaryHeading": "#E11D48",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#000000", "answerColor": "#333333" }
      }
    }
  },
  {
    "name": "Indigo Sand",
    "elements": {
      "heading": "#F8FAFC", "description": "#BCC6DD", "surface": "#0F1222",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#0F0F2D", "opacity": 0.75, "blend": "normal" }, 
      "primaryButton": { "bg": "#4F46E5", "text": "#FFFFFF", "hover": "#4338CA" },
      "secondaryButton": { "bg": "transparent", "text": "#E5E7EB", "border": "#4F46E5", "hover": "rgba(129,140,248,0.12)" },
      "icon": "#4F46E5",
      "iconBg": "rgba(79,70,229,0.1)",
      "subheading": "#BCC6DD",
      "secondaryHeading": "#4F46E5",
      "accent": "#EAB308", "gradient": { "from": "#0F1222", "to": "#111827" },
      "ring": "#818CF8", "shadow": "rgba(0,0,0,0.34)",
      "badge": { "text": "#F8FAFC", "background": "rgba(79,70,229,0.15)" },
      "trust": { "text": "#BCC6DD", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#EAB308" },
      "accordion": { "questionColor": "#F8FAFC", "answerColor": "#BCC6DD" },
      "light": {
        "surface": "#FFFFFF", "heading": "#111827", "description": "#4B5563",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#6B7280",
        "iconBg": "rgba(79,70,229,0.08)",
        "secondaryHeading": "#4F46E5",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#111827", "answerColor": "#4B5563" }
      }
    }
  },
  {
    "name": "Saffron Charcoal",
    "elements": {
      "heading": "#FFFFFF", "description": "#E5E7EB", "surface": "#121212",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#2D190A", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#FDB022", "text": "#1A1306", "hover": "#DC8D05" },
      "secondaryButton": { "bg": "transparent", "text": "#FFFFFF", "border": "#FDB022", "hover": "rgba(250,204,21,0.14)" },
      "icon": "#FDB022",
      "iconBg": "rgba(253,176,34,0.1)",
      "subheading": "#E5E7EB",
      "secondaryHeading": "#FDB022",
      "accent": "#38BDF8", "gradient": { "from": "#0B0B0B", "to": "#1A1A1A" },
      "ring": "#FACC15", "shadow": "rgba(0,0,0,0.45)",
      "badge": { "text": "#FFFFFF", "background": "rgba(253,176,34,0.15)" },
      "trust": { "text": "#E5E7EB", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#38BDF8" },
      "accordion": { "questionColor": "#FFFFFF", "answerColor": "#E5E7EB" },
      "light": {
        "surface": "#FFFFFF", "heading": "#111827", "description": "#4B5563",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#6B7280",
        "iconBg": "rgba(253,176,34,0.08)",
        "secondaryHeading": "#FDB022",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#111827", "answerColor": "#4B5563" }
      }
    }
  },
  {
    "name": "Mint Slate",
    "elements": {
      "heading": "#FFFFFF", "description": "#D3DEDA", "surface": "#0B1412",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#0A2819", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#22C55E", "text": "#022C22", "hover": "#16A34A" }, 
      "secondaryButton": { "bg": "transparent", "text": "#FFFFFF", "border": "#22C55E", "hover": "rgba(52,211,153,0.16)" },
      "icon": "#22C55E",
      "iconBg": "rgba(34,197,94,0.1)",
      "subheading": "#D3DEDA",
      "secondaryHeading": "#22C55E",
      "accent": "#60A5FA", "gradient": { "from": "#0B1412", "to": "#0F1A18" },
      "ring": "#34D399", "shadow": "rgba(0,0,0,0.40)",
      "badge": { "text": "#FFFFFF", "background": "rgba(34,197,94,0.15)" },
      "trust": { "text": "#D3DEDA", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#60A5FA" },
      "accordion": { "questionColor": "#FFFFFF", "answerColor": "#D3DEDA" },
      "light": {
        "surface": "#FFFFFF", "heading": "#111827", "description": "#4B5563",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#6B7280",
        "iconBg": "rgba(34,197,94,0.08)",
        "secondaryHeading": "#22C55E",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#111827", "answerColor": "#4B5563" }
      }
    }
  },
  {
    "name": "Marine Teal",
    "elements": {
      "heading": "#FFFFFF", "description": "#BDD0DB", "surface": "#0B1720",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#0A2828", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#0EA5A4", "text": "#FFFFFF", "hover": "#0C7E7D" },
      "secondaryButton": { "bg": "transparent", "text": "#FFFFFF", "border": "#0EA5A4", "hover": "rgba(34,211,238,0.16)" },
      "icon": "#0EA5A4",
      "iconBg": "rgba(14,165,164,0.1)",
      "subheading": "#BDD0DB",
      "secondaryHeading": "#0EA5A4",
      "accent": "#A7F3D0", "gradient": { "from": "#0B1720", "to": "#0F2430" },
      "ring": "#22D3EE", "shadow": "rgba(0,0,0,0.38)",
      "badge": { "text": "#FFFFFF", "background": "rgba(14,165,164,0.15)" },
      "trust": { "text": "#BDD0DB", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#A7F3D0" },
      "accordion": { "questionColor": "#FFFFFF", "answerColor": "#BDD0DB" },
      "light": {
        "surface": "#FFFFFF", "heading": "#111827", "description": "#4B5563",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#6B7280",
        "iconBg": "rgba(14,165,164,0.08)",
        "secondaryHeading": "#0EA5A4",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#111827", "answerColor": "#4B5563" }
      }
    }
  },
  {
    "name": "Royal Plum Noir",
    "elements": {
      "heading": "#FFFFFF", "description": "#D8CCE6", "surface": "#120C18",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#230A32", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#A855F7", "text": "#FFFFFF", "hover": "#7E22CE" },
      "secondaryButton": { "bg": "transparent", "text": "#FFFFFF", "border": "#A855F7", "hover": "rgba(192,132,252,0.14)" },
      "icon": "#A855F7",
      "iconBg": "rgba(168,85,247,0.1)",
      "subheading": "#D8CCE6",
      "secondaryHeading": "#A855F7",
      "accent": "#F59E0B", "gradient": { "from": "#0F0A16", "to": "#1A1230" },
      "ring": "#C084FC", "shadow": "rgba(0,0,0,0.42)",
      "badge": { "text": "#FFFFFF", "background": "rgba(168,85,247,0.15)" },
      "trust": { "text": "#D8CCE6", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#F59E0B" },
      "accordion": { "questionColor": "#FFFFFF", "answerColor": "#D8CCE6" },
      "light": {
        "surface": "#FFFFFF", "heading": "#000000", "description": "#333333", "accent": "#A855F7",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#4B5563",
        "iconBg": "rgba(168,85,247,0.08)",
        "secondaryHeading": "#A855F7",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#000000", "answerColor": "#333333" }
      }
    }
  },
  {
    "name": "Electric Cobalt",
    "elements": {
      "heading": "#F8FAFC", "description": "#B8C7D9", "surface": "#0A1220",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#0A1437", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#2563EB", "text": "#FFFFFF", "hover": "#1E40AF" },
      "secondaryButton": { "bg": "transparent", "text": "#F8FAFC", "border": "#2563EB", "hover": "rgba(56,189,248,0.14)" },
      "icon": "#2563EB",
      "iconBg": "rgba(37,99,235,0.1)",
      "subheading": "#B8C7D9",
      "secondaryHeading": "#2563EB",
      "accent": "#22D3EE", "gradient": { "from": "#0A1220", "to": "#0F172A" },
      "ring": "#38BDF8", "shadow": "rgba(0,0,0,0.40)",
      "badge": { "text": "#F8FAFC", "background": "rgba(37,99,235,0.15)" },
      "trust": { "text": "#B8C7D9", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#22D3EE" },
      "accordion": { "questionColor": "#F8FAFC", "answerColor": "#B8C7D9" },
      "light": {
        "surface": "#FFFFFF", "heading": "#000000", "description": "#333333", "accent": "#2563EB",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#4B5563",
        "iconBg": "rgba(37,99,235,0.08)",
        "secondaryHeading": "#2563EB",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#000000", "answerColor": "#333333" }
      }
    }
  },
  {
    "name": "Copper Forest",
    "elements": {
      "heading": "#FFFFFF", "description": "#C9D6CF", "surface": "#0D1512",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#28140A", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#D97706", "text": "#0E0A04", "hover": "#B45309" },
      "secondaryButton": { "bg": "transparent", "text": "#FFFFFF", "border": "#D97706", "hover": "rgba(245,158,11,0.14)" },
      "icon": "#D97706",
      "iconBg": "rgba(217,119,6,0.1)",
      "subheading": "#C9D6CF",
      "secondaryHeading": "#D97706",
      "accent": "#34D399", "gradient": { "from": "#0D1512", "to": "#12201B" },
      "ring": "#F59E0B", "shadow": "rgba(0,0,0,0.44)",
      "badge": { "text": "#FFFFFF", "background": "rgba(217,119,6,0.15)" },
      "trust": { "text": "#C9D6CF", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#34D399" },
      "accordion": { "questionColor": "#FFFFFF", "answerColor": "#C9D6CF" },
      "light": {
        "surface": "#FFFFFF", "heading": "#1B2C23", "description": "#43534B", "accent": "#D97706",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#6B7280",
        "iconBg": "rgba(217,119,6,0.08)",
        "secondaryHeading": "#D97706",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#1B2C23", "answerColor": "#43534B" }
      }
    }
  },
  {
    "name": "Ruby Night",
    "elements": {
      "heading": "#FFFFFF", "description": "#E2C9CF", "surface": "#140A0D",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#2D0A14", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#DC2626", "text": "#FFFFFF", "hover": "#991B1B" },
      "secondaryButton": { "bg": "transparent", "text": "#FFFFFF", "border": "#DC2626", "hover": "rgba(248,113,113,0.14)" },
      "icon": "#DC2626",
      "iconBg": "rgba(220,38,38,0.1)",
      "subheading": "#E2C9CF",
      "secondaryHeading": "#DC2626",
      "accent": "#FB923C", "gradient": { "from": "#140A0D", "to": "#1F0E13" },
      "ring": "#F87171", "shadow": "rgba(0,0,0,0.46)",
      "badge": { "text": "#FFFFFF", "background": "rgba(220,38,38,0.15)" },
      "trust": { "text": "#E2C9CF", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#FB923C" },
      "accordion": { "questionColor": "#FFFFFF", "answerColor": "#E2C9CF" },
      "light": {
        "surface": "#FFFFFF", "heading": "#000000", "description": "#333333", "accent": "#DC2626",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#4B5563",
        "iconBg": "rgba(220,38,38,0.08)",
        "secondaryHeading": "#DC2626",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#000000", "answerColor": "#333333" }
      }
    }
  },
  {
    "name": "Citrus Navy",
    "elements": {
      "heading": "#FFFFFF", "description": "#C9D3E6", "surface": "#0A1224",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#0A0F2D", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#F59E0B", "text": "#1A1306", "hover": "#D97706" },
      "secondaryButton": { "bg": "transparent", "text": "#FFFFFF", "border": "#F59E0B", "hover": "rgba(251,191,36,0.16)" },
      "icon": "#F59E0B",
      "iconBg": "rgba(245,158,11,0.1)",
      "subheading": "#C9D3E6",
      "secondaryHeading": "#F59E0B",
      "accent": "#10B981", "gradient": { "from": "#0A1224", "to": "#0C1A33" },
      "ring": "#FBBF24", "shadow": "rgba(0,0,0,0.43)",
      "badge": { "text": "#FFFFFF", "background": "rgba(245,158,11,0.15)" },
      "trust": { "text": "#C9D3E6", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#10B981" },
      "accordion": { "questionColor": "#FFFFFF", "answerColor": "#C9D3E6" },
      "light": {
        "surface": "#FFFFFF", "heading": "#0A1224", "description": "#475569", "accent": "#F59E0B",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#6B7280",
        "iconBg": "rgba(245,158,11,0.08)",
        "secondaryHeading": "#F59E0B",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#0A1224", "answerColor": "#475569" }
      }
    }
  },
  {
    "name": "Midnight Amber",
    "elements": {
      "heading": "#F8FAFC", "description": "#C7CDD6", "surface": "#000000",
      "borderColor": "rgba(255,255,255,0.1)",
      "overlay": { "color": "#1A0F00", "opacity": 0.75, "blend": "normal" },
      "primaryButton": { "bg": "#F97316", "text": "#FFFFFF", "hover": "#EA580C" },
      "secondaryButton": { "bg": "transparent", "text": "#F8FAFC", "border": "#F97316", "hover": "rgba(251,146,60,0.10)" },
      "icon": "#F97316",
      "iconBg": "rgba(249,115,22,0.1)",
      "subheading": "#C7CDD6",
      "secondaryHeading": "#F97316",
      "accent": "#FDBA74", "gradient": { "from": "#000000", "to": "#171717" },
      "ring": "#FB923C", "shadow": "rgba(0,0,0,0.50)",
      "badge": { "text": "#F8FAFC", "background": "rgba(249,115,22,0.15)" },
      "trust": { "text": "#C7CDD6", "dot1": "#22C55E", "dot2": "#3B82F6", "dot3": "#F97316" },
      "accordion": { "questionColor": "#F8FAFC", "answerColor": "#C7CDD6" },
      "light": {
        "surface": "#FFFFFF", "heading": "#000000", "description": "#333333", "accent": "#F97316",
        "borderColor": "rgba(0,0,0,0.1)",
        "subheading": "#4B5563",
        "iconBg": "rgba(249,115,22,0.08)",
        "secondaryHeading": "#F97316",
        "overlay": { "color": "#FFFFFF", "opacity": 0.90, "blend": "normal" },
        "accordion": { "questionColor": "#000000", "answerColor": "#333333" }
      }
    }
  }
];

// --- BASIC CONTENT ELEMENTS LIST ---
const BASIC_ELEMENTS_LIST: WebsiteElement[] = [
    {
        id: 'basic-head',
        type: 'heading',
        content: { text: 'Basic Building Blocks', htmlTag: 'h1' },
        style: { fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0' }
    },
    {
        id: 'basic-txt',
        type: 'text',
        content: { text: 'This section demonstrates standard HTML elements styled for your website.' },
        style: { fontSize: '1rem', lineHeight: '1.6', margin: '0 0 2rem 0' }
    },
    {
        id: 'basic-btn',
        type: 'button',
        content: { text: 'Click Me' },
        style: { margin: '0 0 2rem 0' }
    },
    {
        id: 'basic-icon-box',
        type: 'icon-box',
        content: { icon: 'fa-rocket', text: 'Fast Performance', subText: 'Optimized for speed and efficiency.' },
        style: { margin: '0 0 1rem 0' }
    },
    {
        id: 'basic-image-box',
        type: 'image-box',
        content: { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400', text: 'Visual Card', subText: 'Images enhance user engagement.' },
        style: { margin: '0 0 2rem 0' }
    },
    {
        id: 'basic-list',
        type: 'list',
        content: { items: [{title: 'Responsive Design'}, {title: 'SEO Friendly'}, {title: 'Cross-browser'}] },
        style: { margin: '0 0 2rem 0' }
    },
    {
        id: 'basic-badge',
        type: 'badge',
        content: { text: 'New Feature' },
        style: {} // Use theme badge colors - empty style allows theme fallback
    },
    {
        id: 'basic-quote',
        type: 'blockquote',
        content: { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
        style: { margin: '0 0 2rem 0' }
    }
];

// --- ADVANCED CONTENT ELEMENTS LIST ---
const ADVANCED_ELEMENTS_LIST: WebsiteElement[] = [
     {
        id: 'adv-head',
        type: 'heading',
        content: { text: 'Advanced Components', htmlTag: 'h2' },
        style: { fontSize: '2rem', fontWeight: 'bold', margin: '0 0 2rem 0' }
    },
    {
        id: 'adv-1',
        type: 'accordion',
        content: { 
            items: [
                { title: 'How does it work?', content: 'Just click and edit. It is that simple.' },
                { title: 'Is it responsive?', content: 'Yes, all elements are mobile-friendly by default.' }
            ] 
        },
        style: { margin: '0 0 2rem 0' }
    },
    {
        id: 'adv-3',
        type: 'progress-bar',
        content: { text: 'Project Completion', percentage: 75 },
        style: { margin: '0 0 2rem 0' }
    },
    {
        id: 'adv-4',
        type: 'counter',
        content: { targetNumber: 5000, text: 'Happy Users' },
        style: { margin: '0 0 2rem 0' }
    },
    {
        id: 'adv-6',
        type: 'alert-box',
        content: { text: 'Important Notice', subText: 'Please review your settings before publishing.', icon: 'fa-circle-exclamation' },
        style: { margin: '0 0 2rem 0' }
    },
    {
        id: 'adv-7',
        type: 'flip-box',
        content: { 
            frontTitle: 'Hover Me', 
            frontDesc: 'Discover what is behind', 
            backTitle: 'Surprise!', 
            backDesc: 'Flip boxes are great for revealing details.',
            icon: 'fa-gift'
        },
        style: { margin: '0 0 2rem 0' }
    },
    {
        id: 'adv-9',
        type: 'countdown-timer',
        content: { text: 'Launch In', targetDate: new Date(Date.now() + 100000000).toISOString() },
        style: { margin: '0 0 2rem 0', textAlign: 'left' }
    }
];

export const DEFAULT_TYPOGRAPHY = {
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: '700', fontSize: '3.75rem', lineHeight: '1.1' },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: '600', fontSize: '2.25rem', lineHeight: '1.2' },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: '600', fontSize: '1.5rem', lineHeight: '1.3' },
    p: { fontFamily: '"Inter", sans-serif', fontWeight: '400', fontSize: '1rem', lineHeight: '1.6' },
    button: { fontFamily: '"Inter", sans-serif', fontWeight: '600', fontSize: '0.875rem', textTransform: 'none' as const },
    link: { fontFamily: '"Inter", sans-serif', fontWeight: '500', fontSize: '1rem', textTransform: 'none' as const }
};

export const INITIAL_TEMPLATE: WebsiteData = {
  name: "GenieBuild Template",
  globalStyles: {
    primaryFont: '"Poppins", sans-serif',
    themeMode: 'dark',
    borderRadius: 'rounded-xl',
    colors: {
        backgroundColor: '#0E1214',
        textColor: '#C7CDD6',
        titleColor: '#F8FAFC',
        subtitleColor: '#C7CDD6',
        accentColor: '#F59E0B',
        buttonBackgroundColor: '#E11D48',
        buttonTextColor: '#FFFFFF',
        linkColor: '#F43F5E',
        borderColor: '#F43F5E',
        subheadingColor: '#D1D5DB',
        iconColor: '#E11D48',
        iconBgColor: 'rgba(225,29,72,0.1)',
        secondaryHeadingColor: '#E11D48'
    },
    typography: DEFAULT_TYPOGRAPHY
  },
  sections: [
    // 0. HERO (default opening at localhost:3000 shows Hero first)
    {
        id: 'hero-1',
        type: 'hero',
        content: {
            title: 'Expert Plumbing Solutions for Your Home & Business',
            subtitle: 'Reliable, professional, and affordable plumbing services available 24/7. We handle everything from minor leaks to major installations.',
            ctaText: 'Get a Free Quote',
            secondaryCtaText: 'Our Services',
            imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=2000'
        },
        styles: {
            backgroundColor: '#0E1214',
            backgroundImage: '',
            overlayColor: '#000000',
            overlayOpacityValue: '0.6',
            textColor: '#C7CDD6',
            titleColor: '#F8FAFC',
            accentColor: '#F43F5E',
            buttonBackgroundColor: '#E11D48',
            buttonTextColor: '#FFFFFF',
            paddingTop: 'pt-32',
            paddingBottom: 'pb-32',
            paddingX: 'px-6',
            textAlign: 'left',
            titleSize: 'text-6xl',
            variant: 'HeroPlumbing1',
            backgroundPattern: 'none',
            maxWidth: 'max-w-full'
        }
    },
    // 0.5 ABOUT
    {
        id: 'about-1',
        type: 'about',
        content: {
            title: 'About Our Mission',
            subtitle: 'Our Story',
            description: 'We are committed to delivering excellence through innovation and dedication. Our team works tirelessly to ensure that every project we undertake meets the highest standards of quality.',
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
            ctaText: 'Learn More'
        },
        styles: {
            backgroundColor: '#FFFFFF',
            themeMode: 'light',
            textColor: '#4B5563',
            titleColor: '#111827',
            accentColor: '#F59E0B',
            subheadingColor: '#6B7280',
            secondaryHeadingColor: '#E11D48',
            paddingTop: 'pt-32',
            paddingBottom: 'pb-32',
            paddingX: 'px-6',
            textAlign: 'left',
            variant: 'About1',
            maxWidth: 'max-w-full'
        }
    },
    // 0.7 SERVICES
    {
        id: 'services-1',
        type: 'services',
        content: {
            title: 'Our Premium <span style="color: #E11D48">Services</span>',
            subtitle: 'What We Offer',
            description: 'We provide a wide range of professional services tailored to meet your specific needs and exceed your expectations.',
            items: [
                { id: 's1', title: 'Web Development', description: 'Custom websites built with the latest technologies for maximum performance.', icon: 'Globe' },
                { id: 's2', title: 'Mobile Apps', description: 'Native and cross-platform mobile applications for iOS and Android.', icon: 'Smartphone' },
                { id: 's3', title: 'UI/UX Design', description: 'User-centric design that focuses on creating intuitive and engaging experiences.', icon: 'Palette' },
                { id: 's4', title: 'Cloud Solutions', description: 'Scalable and secure cloud infrastructure to power your business growth.', icon: 'Cloud' },
                { id: 's5', title: 'Digital Marketing', description: 'Strategic marketing campaigns to increase your online presence and reach.', icon: 'BarChart' },
                { id: 's6', title: 'Consultancy', description: 'Expert advice and guidance to help you navigate the digital landscape.', icon: 'MessageSquare' }
            ]
        },
        styles: {
            backgroundColor: '#FFFFFF',
            themeMode: 'light',
            textColor: '#4B5563',
            titleColor: '#111827',
            accentColor: '#E11D48',
            subheadingColor: '#E11D48',
            secondaryHeadingColor: '#E11D48',
            paddingTop: 'pt-32',
            paddingBottom: 'pb-32',
            paddingX: 'px-6',
            textAlign: 'center',
            variant: 'ServicesGrid',
            maxWidth: 'max-w-full'
        }
    },
    // 1. CTA
    {
        id: 'cta-1',
        type: 'cta',
        content: {
            title: 'Ready to dive in?',
            subtitle: 'Join thousands of users building the future today.',
            ctaText: 'Get Started Now'
        },
        styles: {
            backgroundColor: '#0E1214',
            textColor: '#C7CDD6',
            titleColor: '#F8FAFC',
            accentColor: '#F59E0B',
            buttonBackgroundColor: '#E11D48',
            buttonTextColor: '#FFFFFF',
            paddingTop: 'pt-16 md:pt-32',
            paddingBottom: 'pb-16 md:pb-32',
            paddingX: 'px-6',
            textAlign: 'center',
            titleSize: 'text-4xl md:text-6xl',
            variant: 'center',
            maxWidth: 'max-w-full'
        }
    },
    // 1.5 PROCESS
    {
        id: 'process-1',
        type: 'process',
        content: {
            badge: 'Workflow',
            title: 'Our Working Process',
            subtitle: 'A simple, transparent process designed to deliver exceptional results.',
            items: [
                { id: 'p1', title: 'Strategy', description: 'We start by defining the project goals and target audience.', icon: 'Target' },
                { id: 'p2', title: 'Design', description: 'Our designers create a visual representation of the project.', icon: 'Palette' },
                { id: 'p3', title: 'Development', description: 'We build the project using the latest technologies.', icon: 'Code' },
                { id: 'p4', title: 'Launch', description: 'The project is launched and monitored for performance.', icon: 'Rocket' }
            ]
        },
        styles: {
            backgroundColor: '#FFFFFF',
            themeMode: 'light',
            textColor: '#333333',
            titleColor: '#000000',
            accentColor: '#E11D48',
            paddingTop: 'pt-20',
            paddingBottom: 'pb-20',
            paddingX: 'px-6',
            textAlign: 'center',
            variant: 'ProcessSteps',
            maxWidth: 'max-w-full'
        }
    },
    // 1.7 WHY CHOOSE US
    {
        id: 'why-choose-us-1',
        type: 'why-choose-us',
        content: {
            title: 'Why Choose Us',
            subtitle: 'Our Advantages',
            description: 'We offer unmatched quality and dedication to our clients.',
            items: [
                { id: 'w1', title: 'Expert Team', description: 'Our professionals are highly skilled and experienced.', icon: 'Users' },
                { id: 'w2', title: '24/7 Support', description: 'We are always here to help you with any issues.', icon: 'Headphones' },
                { id: 'w3', title: 'Quality Guaranteed', description: 'We stand behind the quality of our work.', icon: 'Award' }
            ]
        },
        styles: {
            backgroundColor: '#FFFFFF',
            themeMode: 'light',
            textColor: '#4B5563',
            titleColor: '#111827',
            accentColor: '#E11D48',
            paddingTop: 'pt-32',
            paddingBottom: 'pb-32',
            paddingX: 'px-6',
            textAlign: 'center',
            titleSize: 'text-4xl md:text-6xl',
            variant: 'WhyChooseUsGrid',
            maxWidth: 'max-w-full'
        }
    },
    // 1.8 GUARANTEE
    {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
            title: 'Our Quality <span style="color: #E11D48">Guarantee</span>',
            badgeText: '100% SATISFACTION GUARANTEE',
            description: 'We stand behind our work. If you are not completely satisfied with our service, we will make it right at no extra cost to you.',
            icon: 'ShieldCheck',
            ctaText: 'Learn More About Our Guarantee'
        },
        styles: {
            backgroundColor: '#FFFFFF',
            themeMode: 'light',
            textColor: '#4B5563',
            titleColor: '#111827',
            accentColor: '#E11D48',
            paddingTop: 'pt-24',
            paddingBottom: 'pb-24',
            paddingX: 'px-6',
            textAlign: 'center',
            variant: 'GuaranteeSimple',
            maxWidth: 'max-w-full'
        }
    },
    // 2. FAQ
    {
        id: 'faq-1',
        type: 'faq',
        content: {
            title: 'Frequently Asked Questions',
            subtitle: 'Everything you need to know about our product and billing.',
            items: [
                { title: 'How does the billing work?', content: 'We offer flexible pricing plans depending on your needs. You can choose to be billed monthly or annually.' },
                { title: 'Can I cancel my subscription anytime?', content: 'Yes, you can cancel your subscription at any time without any hidden fees or penalties.' },
                { title: 'Do you offer technical support?', content: 'Yes, we provide email and chat support for all plans. Enterprise plans include dedicated support.' }
            ] as any
        },
        styles: {
            backgroundColor: '#0E1214',
            textColor: '#C7CDD6',
            titleColor: '#F8FAFC',
            accentColor: '#F59E0B',
            buttonBackgroundColor: '#E11D48',
            buttonTextColor: '#FFFFFF',
            paddingTop: 'pt-24',
            paddingBottom: 'pb-24',
            paddingX: 'px-6',
            textAlign: 'center',
            variant: 'FAQCentered',
            maxWidth: 'max-w-full'
        },
        elements: []
    },
    // 3. TESTIMONIALS
    {
        id: 'testimonials-1',
        type: 'testimonials',
        content: {
            title: 'What Our Clients Say',
            subtitle: 'Real feedback from people who use our product.',
            items: [
                { id: '1', title: '', author: 'John Doe', role: 'CEO', description: 'Great product!', avatar: 'https://i.pravatar.cc/150?img=11' },
                { id: '2', title: '', author: 'Jane Smith', role: 'Designer', description: 'Amazing service!', avatar: 'https://i.pravatar.cc/150?img=5' },
                { id: '3', title: '', author: 'Bob Johnson', role: 'Developer', description: 'Highly recommended!', avatar: 'https://i.pravatar.cc/150?img=8' }
            ]
        },
        styles: {
            backgroundColor: '#0E1214',
            textColor: '#C7CDD6',
            titleColor: '#F8FAFC',
            accentColor: '#F59E0B',
            buttonBackgroundColor: '#E11D48',
            buttonTextColor: '#FFFFFF',
            paddingTop: 'pt-20',
            paddingBottom: 'pb-20',
            paddingX: 'px-6',
            textAlign: 'center',
            variant: 'TestimonialsGrid',
            maxWidth: 'max-w-full'
        },
        elements: []
    },
    // 4. BASIC ELEMENTS SECTION
    {
      id: 'section-basic',
      type: 'elements',
      content: { title: 'Basic Elements' },
      elements: BASIC_ELEMENTS_LIST,
      styles: { 
          backgroundColor: '#0E1214', 
          textColor: '#C7CDD6', 
          accentColor: '#F59E0B', 
          buttonBackgroundColor: '#E11D48', 
          buttonTextColor: '#FFFFFF', 
          paddingTop: 'pt-16', 
          paddingBottom: 'pb-16', 
          paddingX: 'px-6', 
          textAlign: 'left', 
          titleSize: 'text-4xl', 
          variant: 'default',
          maxWidth: 'max-w-full'
      }
    },
    // 5. ADVANCED ELEMENTS SECTION
    {
      id: 'section-advanced',
      type: 'elements',
      content: { title: 'Advanced Elements' },
      elements: ADVANCED_ELEMENTS_LIST,
      styles: { 
          backgroundColor: '#161b22', 
          textColor: '#e5e7eb', 
          accentColor: '#3b82f6', 
          buttonBackgroundColor: '#2563eb', 
          buttonTextColor: '#FFFFFF', 
          paddingTop: 'pt-16', 
          paddingBottom: 'pb-16', 
          paddingX: 'px-6', 
          textAlign: 'left', 
          titleSize: 'text-4xl', 
          variant: 'default',
          maxWidth: 'max-w-full'
      }
    }
  ]
};

export const SECTION_TEMPLATES: Record<string, Partial<Section>> = {
  allelementsTest: {
    type: 'allelementsTest',
    content: {
      title: 'All Elements Test Section',
      subtitle: 'This section contains all 25 elements for testing and debugging purposes.'
    },
    elements: [
      // Basic Elements (13)
      { id: 'test-heading', type: 'heading', content: { text: 'Sample Heading', htmlTag: 'h2' }, style: {} },
      { id: 'test-text', type: 'text', content: { text: 'This is a sample text element for testing.', textSize: 'base' }, style: {} },
      { id: 'test-button', type: 'button', content: { text: 'Click Me', link: '' }, style: {} },
      { id: 'test-image', type: 'image', content: { imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400', imageAlt: 'Sample Image' }, style: { width: '200px', height: '150px' } },
      { id: 'test-video', type: 'video', content: { videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoTitle: 'Sample Video' }, style: { width: '100%', maxWidth: '560px' } },
      { id: 'test-icon', type: 'icon', content: { icon: 'fa-star', iconSize: '24px' }, style: {} },
      { id: 'test-icon-box', type: 'icon-box', content: { icon: 'fa-check-circle', title: 'Icon Box', description: 'Sample icon box element' }, style: {} },
      { id: 'test-image-box', type: 'image-box', content: { imageUrl: 'http://localhost:1111/files/placeholder.jpg', title: 'Image Box', description: 'Sample image box element' }, style: {} },
      { id: 'test-list', type: 'list', content: { items: [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }], listType: 'ul' }, style: {} },
      { id: 'test-star-rating', type: 'star-rating', content: { rating: 4.5, maxRating: 5 }, style: {} },
      { id: 'test-badge', type: 'badge', content: { text: 'New', variant: 'primary' }, style: {} }, // Use theme badge colors
      { id: 'test-highlight-text', type: 'highlight-text', content: { text: 'This is highlighted text', highlightColor: '#F59E0B' }, style: {} },
      { id: 'test-blockquote', type: 'blockquote', content: { text: 'This is a sample blockquote for testing purposes.', author: 'Test Author' }, style: {} },
      // Advanced Elements (12)
      { id: 'test-accordion', type: 'accordion', content: { items: [{ title: 'Item 1', content: 'Content 1' }, { title: 'Item 2', content: 'Content 2' }] }, style: {} },
      { id: 'test-toggle', type: 'toggle', content: { label: 'Toggle Switch', checked: false }, style: {} },
      { id: 'test-tabs', type: 'tabs', content: { tabs: [{ label: 'Tab 1', content: 'Content 1' }, { label: 'Tab 2', content: 'Content 2' }] }, style: {} },
      { id: 'test-progress-bar', type: 'progress-bar', content: { value: 75, max: 100, label: 'Progress' }, style: {} },
      { id: 'test-counter', type: 'counter', content: { value: 100, label: 'Count', prefix: '', suffix: '+' }, style: {} },
      { id: 'test-testimonial', type: 'testimonial', content: { quote: 'Great service!', author: 'John Doe', role: 'CEO', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' }, style: {} },
      { id: 'test-review-carousel', type: 'review-carousel', content: { reviews: [{ rating: 5, text: 'Excellent!', author: 'Jane' }] }, style: {} },
      { id: 'test-alert-box', type: 'alert-box', content: { message: 'This is an alert message', type: 'info' }, style: {} },
      { id: 'test-pricing-table', type: 'pricing-table', content: { plans: [{ name: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2'] }] }, style: {} },
      { id: 'test-flip-box', type: 'flip-box', content: { frontTitle: 'Front', backTitle: 'Back', frontContent: 'Front content', backContent: 'Back content' }, style: {} },
      { id: 'test-call-to-action', type: 'call-to-action', content: { text: 'Get Started', subText: 'Start your free trial today' }, style: {} },
      { id: 'test-countdown-timer', type: 'countdown-timer', content: { targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), text: 'Offer Ends In' }, style: {} },
    ],
    styles: {
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      paddingX: 'px-6',
      textAlign: 'center',
      titleSize: 'text-4xl',
      variant: 'AllElementsTest'
    }
  },
  elements: {
      type: 'elements',
      content: { title: 'New Elements Section' },
      elements: [...BASIC_ELEMENTS_LIST.slice(0,3)], 
      styles: {
          paddingTop: 'pt-16',
          paddingBottom: 'pb-16',
          paddingX: 'px-6',
          textAlign: 'left',
          titleSize: 'text-4xl',
          variant: 'default'
      }
  },
  hero: {
    type: 'hero',
    content: {
        title: 'Hero Title',
        subtitle: 'This is a subtitle for your hero section.',
        ctaText: 'Action',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
    },
    styles: {
        paddingTop: 'pt-16 md:pt-32',
        paddingBottom: 'pb-16 md:pb-32',
        paddingX: 'px-6',
        textAlign: 'center',
        titleSize: 'text-5xl md:text-7xl',
        variant: 'center'
    },
    variantOverrides: {
      'center': { textAlign: 'center' },
      'HeroLight': {
          textAlign: 'center',
          themeMode: 'light', // This triggers our Dual-Palette Engine automatically!
          background: { 
              type: 'color', 
              overlay: { enabled: false } // No glass effect needed for a clean white background
          }
      },
      'HeroCrimsonJet': { 
          textAlign: 'center', 
          background: { 
              type: 'image', 
              image: {
                  url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 
                  position: 'center',
                  size: 'cover',
                  repeat: 'no-repeat',
                  overlay: { enabled: true }
              }
          }
      },
      'HeroPlumbing1': { 
          textAlign: 'left', 
          backgroundPattern: 'dots-grid',
          titleColor: '#F8FAFC',
          textColor: '#C7CDD6',
          subtitleColor: '#C7CDD6',
          buttonBackgroundColor: '#E11D48',
          buttonTextColor: '#FFFFFF',
          background: { 
              type: 'color', 
              color: '#0E1214',
              overlay: { enabled: false }
          }
      },
      'HeroExplore': {
          textAlign: 'left',
          titleColor: '#F8FAFC',
          subtitleColor: '#D1D5DB',
          textColor: '#D1D5DB',
          background: {
              type: 'gradient',
              gradient: {
                  type: 'linear',
                  direction: 135,
                  stops: [
                      { color: '#0A1220', position: 0 },
                      { color: '#0F2430', position: 100 }
                  ]
              },
              overlay: { enabled: false }
          },
          imageOverlayOpacity: 0.14
      },
      'HeroMarquee': {
          textAlign: 'center',
          titleColor: '#F8FAFC',
          subtitleColor: '#E5E7EB',
          textColor: '#E5E7EB',
          titleSize: 'clamp(3rem, 8vw, 7rem)',
          background: {
              type: 'image',
              image: {
                  url: 'https://step.themerex.net/splash/src/img/hero/1.jpg',
                  mode: 'multiple',
                  images: [
                      { id: 'hero-marquee-1', url: 'https://step.themerex.net/splash/src/img/hero/1.jpg' },
                      { id: 'hero-marquee-3', url: 'https://step.themerex.net/splash/src/img/hero/3.jpg' },
                      { id: 'hero-marquee-2', url: 'https://step.themerex.net/splash/src/img/hero/2.jpg' }
                  ],
                  carouselSettings: {
                      enabled: true,
                      autoplay: true,
                      duration: 5500,
                      transitionType: 'fade',
                      transitionSpeed: 900,
                      loop: true,
                      pauseOnHover: false,
                      buttonVariant: 'hidden'
                  },
                  position: 'center',
                  size: 'cover',
                  repeat: 'no-repeat',
                  overlay: { enabled: true, color: '#000000', opacity: 0.38, blendMode: 'normal' }
              }
          }
      },
      'HeroOverlay': {
          textAlign: 'center',
          background: {
              type: 'image',
              image: {
                  url: 'https://images.unsplash.com/photo-1470071131384-001b85755536?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                  mode: 'multiple',
                  images: [
                      { id: 'img2', url: 'https://images.unsplash.com/photo-1470071131384-001b85755536?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
                      { id: 'img3', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
                      { id: 'img4', url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
                      { id: 'img5', url: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' }
                  ],
                  carouselSettings: {
                      enabled: true,
                      autoplay: true,
                      duration: 5000,
                      transitionType: 'fade',
                      transitionSpeed: 1000,
                      loop: true,
                      pauseOnHover: false,
                      buttonVariant: 'outline'
                  },
                  position: 'center',
                  size: 'cover',
                  repeat: 'no-repeat',
                  overlay: { enabled: true, color: '#000000', opacity: 0.5, blendMode: 'normal' }
              }
          }
      }
    }
  },
  features: {
      type: 'features',
      content: {
          title: 'Our Features',
          items: [
              { id: 'new-f1', title: 'Feature One', description: 'Description for feature one.', icon: '★' },
              { id: 'new-f2', title: 'Feature Two', description: 'Description for feature two.', icon: '★' },
              { id: 'new-f3', title: 'Feature Three', description: 'Description for feature three.', icon: '★' }
          ]
      },
      styles: {
          paddingTop: 'pt-12 md:pt-24',
          paddingBottom: 'pb-12 md:pb-24',
          paddingX: 'px-6',
          textAlign: 'center',
          titleSize: 'text-3xl md:text-5xl',
          variant: 'FeaturesGrid'
      }
  },
  pricing: {
    type: 'pricing',
    content: {
        title: 'Simple Pricing',
        subtitle: 'Choose the plan that fits your needs.',
        items: [
            { id: 'p1', title: 'Starter', price: '$0', description: 'Perfect for side projects.', features: ['1 Project', 'Community Support'] },
            { id: 'p2', title: 'Pro', price: '$29', description: 'For growing businesses.', features: ['Unlimited Projects', 'Priority Support', 'Analytics'] }
        ]
    },
    styles: {
        paddingTop: 'pt-12 md:pt-24',
        paddingBottom: 'pb-12 md:pb-24',
        paddingX: 'px-6',
        textAlign: 'center',
        titleSize: 'text-3xl md:text-5xl',
        variant: 'cards'
    }
  },
  testimonials: {
    type: 'testimonials',
    content: {
        title: 'What Our Clients Say',
        subtitle: 'Real feedback from people who use our product.',
        items: [
            { id: '1', title: '', author: 'John Doe', role: 'CEO', description: 'Great product!', avatar: 'https://i.pravatar.cc/150?img=1' },
            { id: '2', title: '', author: 'Jane Smith', role: 'Designer', description: 'Amazing service!', avatar: 'https://i.pravatar.cc/150?img=2' },
            { id: '3', title: '', author: 'Bob Johnson', role: 'Developer', description: 'Highly recommended!', avatar: 'https://i.pravatar.cc/150?img=3' }
        ]
    },
    styles: {
        paddingTop: 'py-20',
        paddingBottom: 'py-20',
        textAlign: 'center',
        variant: 'TestimonialsGrid'
    },
    elements: [],
    variantOverrides: {
      'TestimonialsGrid': { textAlign: 'center' },
      'TestimonialsCentered': { textAlign: 'center', maxWidth: 'max-w-4xl' },
      'TestimonialsColumns': { textAlign: 'left' },
      'TestimonialsLight': {
          textAlign: 'center',
          themeMode: 'light',
          background: { type: 'color', overlay: { enabled: false } }
      }
    }
  },
  faq: {
    type: 'faq',
    content: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our product and billing.',
    },
    styles: {
      variant: 'FAQCentered',
      paddingTop: 'pt-24',
      paddingBottom: 'pb-24',
      textAlign: 'center'
    },
    elements: [],
    variantOverrides: {
      'FAQCentered': { textAlign: 'center', maxWidth: 'max-w-4xl' },
      'FAQSplit': { textAlign: 'left' },
      'FAQLight': {
          textAlign: 'center',
          themeMode: 'light',
          background: { type: 'color', overlay: { enabled: false } }
      }
    }
  },
  cta: {
      type: 'cta',
      content: {
          title: 'Ready to dive in?',
          subtitle: 'Join thousands of users building the future today.',
          ctaText: 'Get Started Now'
      },
      styles: {
          paddingTop: 'pt-16 md:pt-32',
          paddingBottom: 'pb-16 md:pb-32',
          paddingX: 'px-6',
          textAlign: 'center',
          titleSize: 'text-4xl md:text-6xl',
          variant: 'center'
      },
      variantOverrides: {
        'center': { textAlign: 'center' },
        'split': { textAlign: 'left' },
        'CTALight': {
            textAlign: 'center',
            themeMode: 'light',
            background: { type: 'color', overlay: { enabled: false } }
        }
      }
  },
  services: {
      type: 'services',
      content: {
          title: 'Our Services',
          subtitle: 'What We Do',
          description: 'Comprehensive solutions for your business needs.',
          items: [
              { id: 's1', title: 'Service One', description: 'Description for service one.', icon: 'Settings' },
              { id: 's2', title: 'Service Two', description: 'Description for service two.', icon: 'Zap' },
              { id: 's3', title: 'Service Three', description: 'Description for service three.', icon: 'Shield' }
          ]
      },
      styles: {
          backgroundColor: '#FFFFFF',
          themeMode: 'light',
          textColor: '#4B5563',
          titleColor: '#111827',
          accentColor: '#F59E0B',
          paddingTop: 'pt-32',
          paddingBottom: 'pb-32',
          paddingX: 'px-6',
          textAlign: 'center',
          titleSize: 'text-4xl md:text-6xl',
          variant: 'ServicesGrid'
      }
  },
  'why-choose-us': {
      type: 'why-choose-us',
      content: {
          title: 'Why Choose Us',
          subtitle: 'Our Advantages',
          description: 'We offer unmatched quality and dedication to our clients.',
          items: [
              { id: 'w1', title: 'Expert Team', description: 'Our professionals are highly skilled and experienced.', icon: 'Users' },
              { id: 'w2', title: '24/7 Support', description: 'We are always here to help you with any issues.', icon: 'Headphones' },
              { id: 'w3', title: 'Quality Guaranteed', description: 'We stand behind the quality of our work.', icon: 'Award' }
          ]
      },
      styles: {
          backgroundColor: '#FFFFFF',
          themeMode: 'light',
          textColor: '#4B5563',
          titleColor: '#111827',
          accentColor: '#E11D48',
          paddingTop: 'pt-32',
          paddingBottom: 'pb-32',
          paddingX: 'px-6',
          textAlign: 'center',
          titleSize: 'text-4xl md:text-6xl',
          variant: 'WhyChooseUsGrid'
      }
  },
  guarantee: {
      type: 'guarantee',
      content: {
          title: 'Our Quality <span style="color: #E11D48">Guarantee</span>',
          badgeText: '100% SATISFACTION GUARANTEE',
          description: 'We stand behind our work. If you are not completely satisfied with our service, we will make it right at no extra cost to you.',
          icon: 'ShieldCheck',
          ctaText: 'Learn More About Our Guarantee'
      },
      styles: {
          backgroundColor: '#FFFFFF',
          themeMode: 'light',
          textColor: '#4B5563',
          titleColor: '#111827',
          accentColor: '#E11D48',
          paddingTop: 'pt-24',
          paddingBottom: 'pb-24',
          paddingX: 'px-6',
          textAlign: 'center',
          variant: 'GuaranteeSimple'
      }
  },
  process: {
      type: 'process',
      content: {
          title: 'Our Working Process',
          subtitle: 'How It Works',
          items: [
              { id: 'p1', title: 'Strategy', description: 'We start by defining the project goals and target audience.' },
              { id: 'p2', title: 'Design', description: 'Our designers create a visual representation of the project.' },
              { id: 'p3', title: 'Development', description: 'We build the project using the latest technologies.' },
              { id: 'p4', title: 'Launch', description: 'The project is launched and monitored for performance.' }
          ]
      },
      styles: {
          backgroundColor: '#FFFFFF',
          themeMode: 'light',
          textColor: '#4B5563',
          titleColor: '#111827',
          accentColor: '#3b82f6',
          paddingTop: 'pt-20',
          paddingBottom: 'pb-20',
          paddingX: 'px-6',
          textAlign: 'center',
          variant: 'ProcessSteps',
          maxWidth: 'max-w-full'
      }
  },
  navbar: {
    type: 'navbar',
    content: {
        logo: 'Brand',
        links: [{label: 'Home', href:'#'}, {label: 'About', href:'#'}],
        ctaText: 'Login'
    },
    styles: {
        paddingTop: 'py-4 md:py-6',
        paddingBottom: 'py-4 md:py-6',
        paddingX: 'px-6',
        textAlign: 'left',
        titleSize: '24px',
        variant: 'NavbarSimple'
    }
  },
  footer: {
    type: 'footer',
    content: {
        title: 'Brand',
        description: 'Building the future one pixel at a time.',
        links: [{label: 'Privacy', href:'#'}, {label: 'Terms', href:'#'}]
    },
    styles: {
        paddingTop: 'pt-8 md:pt-16',
        paddingBottom: 'pb-8 md:pb-16',
        paddingX: 'px-6',
        textAlign: 'left',
        titleSize: '24px',
        variant: 'columns'
    }
  },
  'image-banner': {
      type: 'image-banner',
      content: {
          title: 'Visual Impact',
          subtitle: 'Use high quality images to tell your story.',
          ctaText: 'Learn More'
      },
      styles: {
          background: { 
            type: 'image', 
            image: { 
              url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600', 
              position: 'center', 
              size: 'cover', 
              repeat: 'no-repeat', 
              attachment: 'scroll', 
              overlay: { 
                enabled: true, 
                color: '#000000', 
                opacity: 0.6, 
                blendMode: 'normal' 
              }
            } 
          },
          paddingTop: 'pt-24 md:pt-40',
          paddingBottom: 'pb-24 md:pb-40',
          paddingX: 'px-6',
          textAlign: 'center',
          titleSize: 'text-5xl md:text-7xl',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600',
          overlayOpacity: 'bg-black/60',
          variant: 'center'
      }
  },
  
  // Inside export const SECTION_TEMPLATES: Record<SectionType, Partial<Section>> = {
};
