import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from '../config/theme';

export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
} 