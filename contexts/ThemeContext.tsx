import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextData {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme) {
        setTheme(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const toggleTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('@theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const isDark = theme === 'system' 
    ? deviceTheme === 'dark'
    : theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}; 