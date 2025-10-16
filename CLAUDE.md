# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native mobile application called "optom-dx-mobile" built with TypeScript. The app uses file-based routing with Expo Router and supports iOS, Android, and web platforms.

## Key Technologies

- **Expo SDK ~54.0** with React Native 0.81.4 and React 19.1.0
- **Expo Router ~6.0** for file-based navigation
- **TypeScript** with strict mode enabled
- **React Navigation** for tab-based navigation
- **React Native Reanimated** for animations
- **Expo New Architecture** enabled (`newArchEnabled: true`)
- **React Compiler** enabled (experimental)

## Development Commands

```bash
# Start development server (choose platform from menu)
npm start
# or
npx expo start

# Start on specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser

# Linting
npm run lint       # Runs expo lint (uses eslint-config-expo)
npx eslint <file>  # Lint specific file
```

## Project Architecture

### File-Based Routing

The app uses Expo Router's file-based routing system:

- **app/_layout.tsx** - Root layout with theme provider and navigation stack
- **app/(tabs)/_layout.tsx** - Tab navigation layout
- **app/(tabs)/index.tsx** - Home screen
- **app/(tabs)/explore.tsx** - Explore screen
- **app/modal.tsx** - Modal screen example

The `unstable_settings.anchor` in [app/_layout.tsx](app/_layout.tsx) is set to `'(tabs)'`, making tabs the default initial route.

### Path Aliases

The project uses `@/*` path aliases that resolve to the project root:

```typescript
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
```

Configured in [tsconfig.json](tsconfig.json):
```json
"paths": {
  "@/*": ["./*"]
}
```

### Theme System

The app implements a light/dark theme system:

- **constants/theme.ts** - Defines `Colors` (light/dark) and `Fonts` (platform-specific)
- **hooks/use-color-scheme.ts** - Platform-specific color scheme detection
- **hooks/use-theme-color.ts** - Hook to get theme-specific colors
- **components/themed-*.tsx** - Pre-styled components that adapt to theme

Theme is managed via `@react-navigation/native`'s `ThemeProvider` in the root layout.

### Platform-Specific Code

The codebase uses platform-specific file extensions:

- `.ios.tsx` - iOS-specific implementation (e.g., [components/ui/icon-symbol.ios.tsx](components/ui/icon-symbol.ios.tsx))
- `.web.ts` - Web-specific implementation (e.g., [hooks/use-color-scheme.web.ts](hooks/use-color-scheme.web.ts))
- Base files serve as fallback for other platforms

### Component Organization

- **components/** - Reusable components (themed-text, themed-view, external-link, etc.)
- **components/ui/** - UI primitives (icon-symbol, collapsible)
- **components/haptic-tab.tsx** - Custom tab component with haptic feedback
- **hooks/** - Custom React hooks
- **constants/** - Theme constants and configuration

## Configuration Files

- **app.json** - Expo configuration with plugins, experiments, and platform settings
- **tsconfig.json** - TypeScript config extending `expo/tsconfig.base` with strict mode
- **eslint.config.js** - ESLint config using `eslint-config-expo/flat` (flat config format)

## App Features

- **Deep linking** with custom scheme: `optomdxmobile://`
- **Typed routes** enabled (`typedRoutes: true`)
- **Edge-to-edge** on Android
- **Tab navigation** with haptic feedback
- **SF Symbols** support via `expo-symbols` (iOS native icons with fallback)
- **Automatic theme** switching based on system preferences
