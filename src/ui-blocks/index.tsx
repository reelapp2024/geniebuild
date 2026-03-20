import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_TYPOGRAPHY, PRESET_THEMES } from '../../constants';

const ThemeContext = createContext<any>({
  theme: 'default',
  themeData: {
    ...PRESET_THEMES[0].elements,
    typography: DEFAULT_TYPOGRAPHY,
  },
});

export const ThemeProvider = ({
  children,
  projectId,
  isBuilder,
  typography,
}: {
  children: React.ReactNode;
  projectId: string | null;
  isBuilder: boolean;
  typography?: typeof DEFAULT_TYPOGRAPHY;
}) => {
  // Keep typography reactive to sidebar changes without lifting state.
  const [activeTypography, setActiveTypography] = useState(typography || DEFAULT_TYPOGRAPHY);

  useEffect(() => {
    setActiveTypography(typography || DEFAULT_TYPOGRAPHY);
  }, [typography]);

  useEffect(() => {
    const handler = (e: any) => {
      const next = e?.detail?.typography;
      if (next) setActiveTypography(next);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('geniebuild-typography-change', handler as any);
      return () => window.removeEventListener('geniebuild-typography-change', handler as any);
    }
    return;
  }, []);

  const themeData = useMemo(
    () => ({
      ...PRESET_THEMES[0].elements,
      typography: activeTypography,
    }),
    [activeTypography]
  );
  return (
    <ThemeContext.Provider value={{ theme: 'default', themeData }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
