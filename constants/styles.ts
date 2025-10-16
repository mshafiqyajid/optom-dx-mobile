/**
 * Reusable Style Utilities
 * Common style patterns and helper functions for consistent styling
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Spacing, BorderRadius, Typography, DesignColors } from './design-system';

/**
 * Layout Utilities
 * Common layout patterns used throughout the app
 */
export const Layout = StyleSheet.create({
  // Flex patterns
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Common containers
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },

  // Spacing
  paddingH: {
    paddingHorizontal: Spacing.lg,
  },
  paddingV: {
    paddingVertical: Spacing.lg,
  },
  padding: {
    padding: Spacing.lg,
  },
  marginBottom: {
    marginBottom: Spacing.md,
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
});

/**
 * Card Styles
 * Reusable card patterns
 */
export const Cards = {
  base: (isDark: boolean): ViewStyle => ({
    backgroundColor: isDark ? DesignColors.dark.surface : DesignColors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: isDark ? DesignColors.dark.border : DesignColors.light.border,
  }),

  elevated: (isDark: boolean): ViewStyle => ({
    ...Cards.base(isDark),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  }),

  outlined: (isDark: boolean): ViewStyle => ({
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: isDark ? DesignColors.dark.border : DesignColors.light.border,
  }),
};

/**
 * Text Styles
 * Common text patterns
 */
export const TextStyles = StyleSheet.create({
  // Headings
  h1: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize.xxxl * Typography.lineHeight.tight,
  },
  h2: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize.xxl * Typography.lineHeight.tight,
  },
  h3: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.normal,
  },

  // Body
  body: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  bodyBold: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },

  // Labels
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.wide,
  },
  labelBold: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },

  // Caption
  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.xs * Typography.lineHeight.normal,
  },
});

/**
 * Button Styles
 * Common button patterns
 */
export const Buttons = {
  primary: (isDark: boolean): ViewStyle => ({
    backgroundColor: DesignColors.accent,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  }),

  secondary: (isDark: boolean): ViewStyle => ({
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: isDark ? DesignColors.dark.border : DesignColors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  }),

  icon: (size: number = 48): ViewStyle => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
  }),
};

/**
 * Helper function to get themed colors
 */
export const getThemedColors = (isDark: boolean) => ({
  text: isDark ? DesignColors.dark.text : DesignColors.light.text,
  textSecondary: isDark ? DesignColors.dark.textSecondary : DesignColors.light.textSecondary,
  background: isDark ? DesignColors.dark.background : DesignColors.light.background,
  surface: isDark ? DesignColors.dark.surface : DesignColors.light.surface,
  border: isDark ? DesignColors.dark.border : DesignColors.light.border,
  icon: isDark ? DesignColors.dark.icon : DesignColors.light.icon,
});

/**
 * Helper to create conditional styles based on theme
 */
export const createThemedStyle = <T extends ViewStyle | TextStyle>(
  lightStyle: T,
  darkStyle: T,
  isDark: boolean
): T => {
  return isDark ? darkStyle : lightStyle;
};

/**
 * Spacing helpers
 */
export const spacing = {
  mt: (value: keyof typeof Spacing): ViewStyle => ({ marginTop: Spacing[value] }),
  mb: (value: keyof typeof Spacing): ViewStyle => ({ marginBottom: Spacing[value] }),
  ml: (value: keyof typeof Spacing): ViewStyle => ({ marginLeft: Spacing[value] }),
  mr: (value: keyof typeof Spacing): ViewStyle => ({ marginRight: Spacing[value] }),
  mx: (value: keyof typeof Spacing): ViewStyle => ({
    marginLeft: Spacing[value],
    marginRight: Spacing[value]
  }),
  my: (value: keyof typeof Spacing): ViewStyle => ({
    marginTop: Spacing[value],
    marginBottom: Spacing[value]
  }),
  pt: (value: keyof typeof Spacing): ViewStyle => ({ paddingTop: Spacing[value] }),
  pb: (value: keyof typeof Spacing): ViewStyle => ({ paddingBottom: Spacing[value] }),
  pl: (value: keyof typeof Spacing): ViewStyle => ({ paddingLeft: Spacing[value] }),
  pr: (value: keyof typeof Spacing): ViewStyle => ({ paddingRight: Spacing[value] }),
  px: (value: keyof typeof Spacing): ViewStyle => ({
    paddingLeft: Spacing[value],
    paddingRight: Spacing[value]
  }),
  py: (value: keyof typeof Spacing): ViewStyle => ({
    paddingTop: Spacing[value],
    paddingBottom: Spacing[value]
  }),
};
