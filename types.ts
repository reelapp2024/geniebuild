
export type SectionType = 'navbar' | 'hero' | 'features' | 'cta' | 'footer' | 'testimonials' | 'pricing' | 'image-banner' | 'elements';

export type ElementType = 
  // Basic
  | 'heading' 
  | 'text' 
  | 'button' 
  | 'image' 
  | 'video' 
  | 'icon' 
  | 'icon-box' 
  | 'image-box' 
  | 'list' 
  | 'star-rating' 
  | 'badge' 
  | 'highlight-text' 
  | 'blockquote'
  // Advanced
  | 'accordion'
  | 'toggle'
  | 'tabs'
  | 'progress-bar'
  | 'counter'
  | 'testimonial'
  | 'review-carousel'
  | 'alert-box'
  | 'pricing-table'
  | 'flip-box'
  | 'call-to-action'
  | 'countdown-timer';

// Comprehensive Style Interface based on "Common Properties" request
export interface ElementStyle {
    // 1. Typography (Basic)
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    textDecoration?: 'none' | 'underline' | 'line-through';
    fontStyle?: 'normal' | 'italic';

    // 2. Backgrounds
    backgroundColor?: string;
    backgroundType?: 'none' | 'color' | 'gradient' | 'image' | 'video';
    backgroundImage?: string;
    backgroundPosition?: string; // e.g. 'center center'
    backgroundSize?: 'cover' | 'contain' | 'auto' | string;
    backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    backgroundAttachment?: 'scroll' | 'fixed' | 'local';
    
    backgroundGradient?: {
        type: 'linear' | 'radial';
        angle?: number; // for linear
        colors: { color: string; stop: number }[]; // Gradient stops
    };
    
    backgroundOverlay?: {
        enabled: boolean;
        color?: string; // Solid or Gradient string
        opacity?: number;
        blendMode?: string; // mix-blend-mode
    };

    // 3. Dimensions
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    aspectRatio?: string;

    // 4. Spacing (Margin & Padding)
    // Supports string "10px" or object for individual sides
    padding?: string | { top?: string; right?: string; bottom?: string; left?: string };
    margin?: string | { top?: string; right?: string; bottom?: string; left?: string };
    
    // 5. Border & Outline
    border?: string; // Shorthand
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    borderWidth?: string | { top?: string; right?: string; bottom?: string; left?: string };
    borderColor?: string;
    borderRadius?: string | { tl?: string; tr?: string; bl?: string; br?: string }; // top-left, top-right, etc.
    
    outline?: string;
    outlineOffset?: string;
    outlineColor?: string;
    outlineStyle?: string;
    outlineWidth?: string;

    // 6. Box Model & Shadows
    boxShadow?: string; // Includes inset support via string value
    textShadow?: string;
    boxSizing?: 'content-box' | 'border-box';

    // 7. Layout & Positioning
    display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: number;
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
    overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
    overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';

    // 8. Flexbox Controls
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
    gap?: string; // Row and Column gap
    rowGap?: string;
    columnGap?: string;
    
    // Flex Item props
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: string;
    order?: number;
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

    // 9. Grid Controls
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gridTemplateAreas?: string;
    gridAutoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
    gridAutoColumns?: string;
    gridAutoRows?: string;
    justifyItems?: 'start' | 'end' | 'center' | 'stretch';
    justifySelf?: 'start' | 'end' | 'center' | 'stretch';
    placeItems?: string;
    placeContent?: string;

    // 10. Effects & Filters
    opacity?: number; // 0 to 1
    visibility?: 'visible' | 'hidden' | 'collapse';
    filter?: string; // blur(), brightness(), contrast(), grayscale(), hue-rotate(), invert(), opacity(), saturate(), sepia(), drop-shadow()
    backdropFilter?: string; // Same as filter but for backdrop
    mixBlendMode?: string;
    
    // 11. Transforms
    transform?: string; // rotate(), scale(), skew(), translate(), matrix()
    transformOrigin?: string;
    perspective?: string;
    backfaceVisibility?: 'visible' | 'hidden';

    // 12. Transitions & Animations
    transition?: string; // property duration timing-function delay
    animation?: string; // name duration timing-function delay iteration-count direction fill-mode play-state

    // 13. Advanced / Misc
    cursor?: string; // pointer, default, text, move, etc.
    pointerEvents?: 'auto' | 'none';
    userSelect?: 'auto' | 'none' | 'text' | 'all';
    
    // Responsive Visibility (Helper for UI logic)
    hiddenOnDesktop?: boolean;
    hiddenOnTablet?: boolean;
    hiddenOnMobile?: boolean;
    
    // Accent Color support for form elements/custom elements
    accentColor?: string;

    // Allow generic string keys for extensibility
    [key: string]: any; 
}

export interface WebsiteElement {
  id: string;
  type: ElementType;
  
  // Custom ID and Classes for Advanced Control
  customId?: string;
  customClasses?: string;
  
  content: {
    text?: string; // Main Title / Heading / Button Text
    subText?: string; // Description / Subtitle
    htmlTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span';
    link?: string;
    src?: string; 
    alt?: string;
    icon?: string; 
    
    // Lists (Accordion, Tabs, Reviews, Pricing Features)
    items?: { 
        title?: string; 
        content?: string; 
        icon?: string; 
        link?: string;
        author?: string; // Testimonial
        role?: string;   // Testimonial
        avatar?: string; // Testimonial
        rating?: number; // Review
        price?: string; // Pricing Table
    }[]; 
    
    rating?: number; 
    scale?: number; 
    badgeText?: string;
    highlightWord?: string;
    author?: string; 
    authorRole?: string; 
    
    // Advanced Fields
    percentage?: number; // Progress bar
    showPercentage?: boolean; // Progress bar
    
    startNumber?: number; // Counter
    targetNumber?: number; // Counter
    duration?: number; // Counter/Animation
    prefix?: string; // Counter
    suffix?: string; // Counter
    
    targetDate?: string; // Countdown
    
    price?: string; // Pricing Table
    currency?: string; // Pricing Table
    period?: string; // Pricing Table
    isPopular?: boolean; // Pricing Table
    
    alertType?: 'success' | 'warning' | 'error' | 'info'; // Alert Box
    dismissible?: boolean; // Alert Box
    
    frontTitle?: string; // Flipbox
    frontDesc?: string; // Flipbox
    backTitle?: string; // Flipbox
    backDesc?: string; // Flipbox
    flipDirection?: 'left' | 'right' | 'top' | 'bottom'; // Flipbox
    trigger?: 'hover' | 'click'; // Flipbox
    
    layout?: 'inline' | 'stacked' | 'left' | 'top' | 'vertical' | 'horizontal'; // Tabs, Testimonial, CTA
    
    [key: string]: any; 
  };
  
  // Use the new comprehensive ElementStyle interface
  style: ElementStyle;
  
  settings?: {
    animation?: 'fade' | 'slide' | 'zoom' | 'none';
    delay?: string;
    className?: string; // Legacy support, prefer customClasses at root
    hidden?: boolean; 
    autoplay?: boolean; // Carousels
    loop?: boolean; // Carousels
    speed?: number; // Carousels
    
    // Advanced Interaction Settings
    scrollTrigger?: boolean;
    sticky?: boolean;
    stickyTop?: string;
    parallax?: boolean;
    
    [key: string]: any; 
  };
}

export interface TypographyStyle {
  fontFamily: string;
  fontSize?: string; // Base size
  fontWeight: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  color?: string; // Optional override
}

export interface Section {
  id: string;
  type: SectionType;
  // Specific content for preset sections (hero, features, etc.)
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    links?: { label: string; href: string }[];
    items?: { 
      id: string;
      title: string; 
      description: string; 
      icon?: string; 
      price?: string; 
      features?: string[];
      author?: string;
      role?: string;
      avatar?: string;
    }[];
    logo?: string;
    logoImageUrl?: string; 
    imageUrl?: string;
    videoUrl?: string;
    badgeText?: string;
    blockquote?: string;
    blockquoteAuthor?: string;
    highlightText?: string;
    listItems?: string[]; 
    projectId?: string; // For API-based navbar/footer
    brand?: string; // For footer brand name
  };
  // The new flexible structure for custom/elements sections
  elements?: WebsiteElement[]; 
  
  styles: {
    // Container
    backgroundColor: string;
    
    // Spacing
    paddingTop: string;
    paddingBottom: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingX?: string; // Deprecated but kept for backward compatibility if needed
    
    marginTop?: string; 
    marginBottom?: string; 
    marginLeft?: string;
    marginRight?: string;

    textAlign: 'left' | 'center' | 'right';
    maxWidth?: 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
    backgroundImage?: string;
    
    overlayOpacity?: string; 
    overlayColor?: string; 
    overlayOpacityValue?: string; 
    overlayBlendMode?: string; 
    
    variant?: string; 

    // Typography & Colors
    textColor: string; 
    
    titleColor?: string;
    titleSize?: string;
    titleAlign?: 'left' | 'center' | 'right' | 'justify';
    titleFontWeight?: string;
    titleHeadingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Heading level for section titles
    
    subtitleColor?: string;
    subtitleSize?: string;
    subtitleAlign?: 'left' | 'center' | 'right' | 'justify';
    subtitleFontWeight?: string;
    
    descriptionColor?: string;
    descriptionSize?: string;
    
    fontSize?: string;
    fontWeight?: string;
    
    accentColor: string; 

    // Buttons
    buttonBackgroundColor: string;
    buttonTextColor: string;
    buttonStyle?: 'rounded' | 'pill' | 'square';
    
    borderRadius?: string; 

    secondaryButtonBackgroundColor?: string;
    secondaryButtonTextColor?: string;

    linkColor?: string; 

    fontFamily?: string;
  };
}

export interface WebsiteData {
  name: string;
  sections: Section[];
  globalStyles: {
    primaryFont: string; 
    themeMode: 'light' | 'dark';
    borderRadius: string;
    colors: {
        backgroundColor: string;
        textColor: string;
        titleColor: string;
        subtitleColor: string;
        accentColor: string;
        buttonBackgroundColor: string;
        buttonTextColor: string;
        linkColor: string;
        borderColor: string;
        overlayColor?: string; 
    };
    typography: {
        h1: TypographyStyle;
        h2: TypographyStyle;
        h3: TypographyStyle;
        p: TypographyStyle;
        button: TypographyStyle;
        link: TypographyStyle;
    };
  };
}
