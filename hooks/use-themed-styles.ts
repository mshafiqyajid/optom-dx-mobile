import { useMemo } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getThemedColors } from '@/constants/styles';

/**
 * Hook to get themed colors with memoization
 * Combines useColorScheme and getThemedColors into a single hook
 *
 * @example
 * const { isDark, colors } = useThemedStyles();
 * <View style={{ backgroundColor: colors.background }} />
 */
export function useThemedStyles() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = useMemo(() => getThemedColors(isDark), [isDark]);

  return { isDark, colors, colorScheme };
}
