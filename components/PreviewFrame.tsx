
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PreviewFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ children, className, style }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    // We need to wait for the frame to load to access contentDocument
    const handleLoad = () => {
        const doc = frame.contentDocument;
        if (!doc) return;

        // Prevent flash of unstyled content or white background
        doc.open();
        doc.write('<!DOCTYPE html><html><head></head><body><div id="frame-root"></div></body></html>');
        doc.close();
        
        // Inject Tailwind
        const script = doc.createElement('script');
        script.src = "https://cdn.tailwindcss.com";
        doc.head.appendChild(script);

        // Inject Fonts & Icons from main document
        const links = document.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"], style');
        links.forEach(link => {
            // Clone and append
            doc.head.appendChild(link.cloneNode(true));
        });
        
        // Base Styles
        const styleEl = doc.createElement('style');
        styleEl.textContent = `
            body { 
                background-color: transparent; 
                margin: 0; 
                overflow-x: hidden;
                /* Ensure full height for layout */
                min-height: 100vh;
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

  return (
    <>
        <iframe 
            ref={frameRef} 
            className={className} 
            style={{...style, border: 'none'}}
            title="Site Preview"
        />
        {mountNode && createPortal(children, mountNode)}
    </>
  );
};
