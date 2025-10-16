/**
 * Optom DX Design System
 * Central design tokens for the application
 */

// Brand Colors
export const DesignColors = {
  // Primary
  primary: '#1E3A5F', // Navy blue
  primaryLight: '#D6E8F5', // Light blue for active states

  // Accent
  accent: '#B8A072', // Gold
  accentDark: '#9A8562',

  // Semantic
  success: '#4CAF50',
  error: '#FF3B30',
  warning: '#FFA726',
  info: '#0a7ea4',

  // Neutrals (Light Mode)
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    border: '#E0E0E0',
    icon: '#687076',
  },

  // Neutrals (Dark Mode)
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    surface: '#1E1E1E',
    border: '#2A2A2A',
    icon: '#9BA1A6',
  },

  // Event Card
  eventCard: {
    background: '#34495E',
    backgroundDark: '#2C3E50',
  },
} as const;

// Spacing System (8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Typography
export const Typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 28,
    display: 36,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// Icon Sizes
export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 48,
} as const;

// Component Sizes
export const ComponentSizes = {
  button: {
    height: 56,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
  },
  input: {
    height: 56,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  avatar: {
    sm: 40,
    md: 60,
    lg: 80,
    xl: 100,
  },
  iconButton: {
    sm: 40,
    md: 48,
    lg: 56,
  },
} as const;
