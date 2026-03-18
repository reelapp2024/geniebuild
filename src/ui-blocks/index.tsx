import React, { createContext, useContext } from 'react';
import { PRESET_THEMES } from '../../constants';

const ThemeContext = createContext({ theme: 'default', themeData: PRESET_THEMES[0].elements });

export const ThemeProvider = ({ children, projectId, isBuilder }: { children: React.ReactNode, projectId: string | null, isBuilder: boolean }) => {
  // For now, just use the first theme as default
  const themeData = PRESET_THEMES[0].elements;
  return (
    <ThemeContext.Provider value={{ theme: 'default', themeData }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
