import { useColorScheme } from 'react-native';
import { LIGHT, DARK, ACCENT, RADIUS, FONT_SIZE, Theme } from '../constants/theme';

export function useTheme(): {
  C: Theme;
  accent: typeof ACCENT;
  radius: typeof RADIUS;
  font: typeof FONT_SIZE;
  dark: boolean;
} {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return {
    C: dark ? DARK : LIGHT,
    accent: ACCENT,
    radius: RADIUS,
    font: FONT_SIZE,
    dark,
  };
}
