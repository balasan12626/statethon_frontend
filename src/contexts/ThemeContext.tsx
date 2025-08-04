import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type ColorScheme = 'default' | 'high-contrast' | 'warm' | 'cool';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  fontSize: number;
  reducedMotion: boolean;
  highContrast: boolean;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setFontSize: (size: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (high: boolean) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetSettings: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('auto');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
  const [fontSize, setFontSize] = useState(16);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Detect system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    const savedFontSize = localStorage.getItem('fontSize');
    const savedReducedMotion = localStorage.getItem('reducedMotion');
    const savedHighContrast = localStorage.getItem('highContrast');

    if (savedTheme) setTheme(savedTheme);
    if (savedColorScheme) setColorScheme(savedColorScheme);
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true');
    if (savedHighContrast) setHighContrast(savedHighContrast === 'true');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme and settings to document
  const applyTheme = () => {
    const root = document.documentElement;
    const actualTheme = theme === 'auto' ? getSystemTheme() : theme;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'high-contrast', 'reduced-motion', 'color-warm', 'color-cool');
    
    // Apply theme
    root.classList.add(actualTheme);
    
    // Apply color scheme
    if (colorScheme !== 'default') {
      root.classList.add(`color-${colorScheme}`);
    }
    
    // Apply accessibility settings
    if (highContrast) root.classList.add('high-contrast');
    if (reducedMotion) root.classList.add('reduced-motion');
    
    // Apply font size
    root.style.fontSize = `${fontSize}px`;
  };

  useEffect(() => {
    applyTheme();
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('reducedMotion', reducedMotion.toString());
    localStorage.setItem('highContrast', highContrast.toString());
  }, [theme, colorScheme, fontSize, reducedMotion, highContrast]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(24, prev + 2));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(12, prev - 2));
  };

  const resetSettings = () => {
    setTheme('auto');
    setColorScheme('default');
    setFontSize(16);
    setReducedMotion(false);
    setHighContrast(false);
  };

  const value: ThemeContextType = {
    theme,
    colorScheme,
    fontSize,
    reducedMotion,
    highContrast,
    setTheme,
    setColorScheme,
    setFontSize,
    setReducedMotion,
    setHighContrast,
    increaseFontSize,
    decreaseFontSize,
    resetSettings,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 