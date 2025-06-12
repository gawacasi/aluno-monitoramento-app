/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#CCCCCC',
    tabIconSelected: tintColorLight,
    card: '#F5F5F5',
    border: '#E0E0E0',
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    shiftCard: '#F0F0F0',
    shiftCardText: '#000000',
    shiftCardSubtext: '#666666',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
    card: '#1C1C1E',
    border: '#38383A',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    shiftCard: '#2C2C2E',
    shiftCardText: '#FFFFFF',
    shiftCardSubtext: '#8E8E93',
  },
};

export const lightTheme = {
  primary: '#007AFF',
  background: '#FFFFFF',
  card: '#F2F2F7',
  text: '#000000',
  border: '#C6C6C8',
  notification: '#FF3B30',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
};

export const darkTheme = {
  primary: '#0A84FF',
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  border: '#38383A',
  notification: '#FF453A',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FF9F0A',
};
