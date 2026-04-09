
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PRESET_FONTS } from '../constants';

interface PreviewFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ children, className, style }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  // INJECT GOOGLE FONTS INTO IFRAME IN REAL-TIME
  useEffect(() => {
    const iframe = frameRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;
      // Check if already injected to prevent duplicates
      if (!iframeDoc.getElementById('geniebuild-fonts')) {
        const fontFamilies = PRESET_FONTS.map(f => f.name.replace(/\s+/g, '+') + ':wght@300;400;700;900');
        const url = `https://fonts.googleapis.com/css2?family=${fontFamilies.join('&family=')}&display=swap`;
        
        const link = iframeDoc.createElement('link');
        link.id = 'geniebuild-fonts';
        link.rel = 'stylesheet';
        link.href = url;
        iframeDoc.head.appendChild(link);
      }
    };
    
    // Run immediately if already loaded, otherwise wait for load
    if (iframe.contentDocument?.readyState === 'complete') {
      handleLoad();
      return;
    } else {
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [mountNode]); // Re-inject if the HTML completely resets

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    // We need to wait for the frame to load to access contentDocument
    const handleLoad = () => {
        const doc = frame.contentDocument;
        if (!doc) return;

        // Prevent flash of unstyled content or white background
        // Use device-width for proper responsive behavior (not fixed pixel width)
        doc.open();
        doc.write('<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></head><body><div id="frame-root"></div></body></html>');
        doc.close();

        // Suppress ResizeObserver errors in the iframe window too
        const win = doc.defaultView;
        if (win) {
            const suppressIframeResizeObserverErrors = (e: ErrorEvent | PromiseRejectionEvent) => {
                const message = (e instanceof ErrorEvent) ? e.message : (e.reason?.message || '');
                if (message?.includes('ResizeObserver')) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            };
            win.addEventListener('error', suppressIframeResizeObserverErrors);
            win.addEventListener('unhandledrejection', suppressIframeResizeObserverErrors);
        }
        
        // Inject Tailwind runtime (required for current GenieBuild class rendering)
        const script = doc.createElement('script');
        script.src = "https://cdn.tailwindcss.com";
        doc.head.appendChild(script);

        // Inject Fonts, Icons, and built CSS from main document
        const links = document.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"], style');
        links.forEach(link => {
            // Clone and append
            doc.head.appendChild(link.cloneNode(true));
        });
        
        // Base Styles
        const styleEl = doc.createElement('style');
        styleEl.textContent = `
            html, body { 
                background-color: transparent; 
                margin: 0; 
                padding: 0;
                overflow-x: hidden;
                /* Allow content to determine height */
                height: auto;
                min-height: 100%;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
            }
            * {
                box-sizing: border-box;
            }
            /* Ensure sections can use full width */
            #frame-root {
                width: 100%;
                max-width: 100%;
                min-height: auto;
                margin: 0;
                padding: 0;
            }
            /* Ensure all sections take full width */
            #frame-root > * {
                width: 100%;
                max-width: 100%;
            }
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: #111; }
            ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        `;
        doc.head.appendChild(styleEl);

        setMountNode(doc.getElementById('frame-root'));
    };

    // If already loaded (rare in React render cycle but possible) or simple mounting
    if (frame.contentDocument?.readyState === 'complete') {
        handleLoad();
    } else {
        frame.addEventListener('load', handleLoad);
    }
    
    return () => {
        frame.removeEventListener('load', handleLoad);
    };
  }, []);

  // Sync Dynamic Styles (The variable CSS properties)
  useEffect(() => {
    if (!mountNode || !frameRef.current) return;
    
    const frame = frameRef.current;
    
    // Auto-resize iframe height based on content
    let isUpdating = false;
    const updateHeight = () => {
        if (isUpdating) return;
        
        // Use requestAnimationFrame to ensure we update in sync with the browser's paint cycle
        // and avoid "ResizeObserver loop completed with undelivered notifications"
        isUpdating = true;
        window.requestAnimationFrame(() => {
            const doc = frame.contentDocument;
            if (doc && doc.body) {
                // Use scrollHeight to get the content height
                const height = doc.body.scrollHeight;
                
                // Get current height to compare
                const currentHeightStr = frame.style.height;
                const currentHeight = currentHeightStr ? parseInt(currentHeightStr, 10) : 0;

                // Only update if the height has actually changed significantly (> 2px)
                // to avoid redundant layout cycles and potential infinite loops
                if (height > 0 && Math.abs(currentHeight - height) > 2) {
                    frame.style.height = `${height}px`;
                }
            }
            isUpdating = false;
        });
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(mountNode);
    
    // Initial update
    setTimeout(updateHeight, 100);

    return () => resizeObserver.disconnect();
  }, [mountNode]);

  // Sync Dynamic Styles (The variable CSS properties)
  useEffect(() => {
      if (!frameRef.current?.contentDocument) return;
      const doc = frameRef.current.contentDocument;
      
      const syncStyles = () => {
          const mainStyles = document.getElementById('dynamic-theme-styles');
          let frameStyles = doc.getElementById('dynamic-theme-styles');
          
          if (mainStyles) {
              if (!frameStyles) {
                  frameStyles = doc.createElement('style');
                  frameStyles.id = 'dynamic-theme-styles';
                  doc.head.appendChild(frameStyles);
              }
              if (frameStyles.innerHTML !== mainStyles.innerHTML) {
                  frameStyles.innerHTML = mainStyles.innerHTML;
              }
          }
      };

      // Create an observer to watch for changes in the main document style
      const observer = new MutationObserver(syncStyles);
      const target = document.getElementById('dynamic-theme-styles');
      if (target) {
          observer.observe(target, { childList: true, characterData: true, subtree: true });
          syncStyles(); // Initial sync
      }
      
      return () => observer.disconnect();
  }, [mountNode]); // Re-setup if mountNode changes (iframe reloads)

  // Viewport is set to device-width for proper responsive behavior
  // The iframe width itself controls the viewport size, not the meta tag

  return (
    <>
        <iframe 
            ref={frameRef} 
            className={className} 
            style={{
                ...style, 
                border: 'none',
                display: 'block',
                width: style?.width || '100%',
                height: style?.height || '100%'
            }}
            title="Site Preview"
        />
        {mountNode && createPortal(children, mountNode)}
    </>
  );
};
