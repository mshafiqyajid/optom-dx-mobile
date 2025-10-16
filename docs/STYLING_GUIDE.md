# StyleSheet Best Practices Guide

This guide outlines best practices for styling components in this React Native project using `StyleSheet.create()`.

## Table of Contents
- [Why StyleSheet?](#why-stylesheet)
- [Project Structure](#project-structure)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Examples](#examples)

---

## Why StyleSheet?

We use React Native's native `StyleSheet.create()` because:

✅ **Performance**: Styles are compiled once and referenced by ID
✅ **Type Safety**: Full TypeScript support out of the box
✅ **Zero Dependencies**: No extra packages needed
✅ **Universal**: Works seamlessly on iOS, Android, and Web
✅ **Team Familiarity**: Standard React Native approach

---

## Project Structure

```
constants/
├── design-system.ts    # Design tokens (colors, spacing, typography)
├── styles.ts           # Reusable style utilities and helpers
└── theme.ts            # Legacy theme (being phased out)
```

### Design System (`design-system.ts`)
Central source of truth for design tokens:
- `DesignColors` - Color palette (light/dark modes)
- `Spacing` - 8pt grid system
- `BorderRadius` - Border radius values
- `Typography` - Font sizes, weights, line heights
- `Shadows` - Elevation styles
- `IconSizes` - Standard icon dimensions
- `ComponentSizes` - Common component dimensions

### Style Utilities (`styles.ts`)
Reusable style patterns and helpers:
- `Layout` - Common layout patterns
- `Cards` - Card component styles
- `TextStyles` - Typography patterns
- `Buttons` - Button styles
- `getThemedColors()` - Helper for theme-based colors
- `spacing` - Spacing utility functions

---

## Best Practices

### 1. Use Design Tokens, Not Magic Numbers

❌ **Bad:**
```typescript
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
});
```

✅ **Good:**
```typescript
import { Spacing, BorderRadius, DesignColors } from '@/constants/design-system';

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: DesignColors.light.surface,
  },
});
```

### 2. Use Reusable Utility Styles

❌ **Bad:**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
});
```

✅ **Good:**
```typescript
import { Layout } from '@/constants/styles';

// Use directly in JSX
<View style={Layout.container}>
  <View style={Layout.flexRowCenter}>
    <View style={Layout.section}>
```

### 3. Create Theme-Aware Styles

❌ **Bad:**
```typescript
<View style={{
  backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
  borderColor: isDark ? '#2A2A2A' : '#E0E0E0'
}} />
```

✅ **Good:**
```typescript
import { getThemedColors, Cards } from '@/constants/styles';

const colors = getThemedColors(isDark);

// Option 1: Use helper function
<View style={Cards.base(isDark)} />

// Option 2: Use themed colors
<Text style={{ color: colors.textSecondary }} />
```

### 4. Keep Component-Specific Styles in StyleSheet.create()

✅ **Good:**
```typescript
// Component-specific styles
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
});

// Combine with utilities
<View style={[Layout.container, styles.header]} />
```

### 5. Avoid Inline Styles (Except for Dynamic Values)

❌ **Bad:**
```typescript
<View style={{
  flex: 1,
  padding: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
}} />
```

✅ **Good:**
```typescript
// Static styles in StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: DesignColors.light.background,
    borderRadius: BorderRadius.md,
  },
});

// Inline only for dynamic values
<View style={[styles.container, { opacity: isVisible ? 1 : 0 }]} />
```

### 6. Use Composition Over Duplication

❌ **Bad:**
```typescript
const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: '#B8A072',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
});
```

✅ **Good:**
```typescript
import { Buttons } from '@/constants/styles';

// Use pre-built patterns
<TouchableOpacity style={Buttons.primary(isDark)} />
<TouchableOpacity style={Buttons.secondary(isDark)} />
```

### 7. Name Styles Descriptively

❌ **Bad:**
```typescript
const styles = StyleSheet.create({
  box1: { ... },
  box2: { ... },
  text1: { ... },
});
```

✅ **Good:**
```typescript
const styles = StyleSheet.create({
  eventCard: { ... },
  eventCardHeader: { ... },
  eventTitle: { ... },
  eventDate: { ... },
});
```

---

## Common Patterns

### Card Components
```typescript
import { Cards } from '@/constants/styles';

const MyCard = () => {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={Cards.base(isDark)}>
      {/* content */}
    </View>
  );
};
```

### Themed Text
```typescript
import { getThemedColors } from '@/constants/styles';

const MyText = () => {
  const isDark = useColorScheme() === 'dark';
  const colors = getThemedColors(isDark);

  return (
    <>
      <Text style={{ color: colors.text }}>Primary text</Text>
      <Text style={{ color: colors.textSecondary }}>Secondary text</Text>
    </>
  );
};
```

### Layout Composition
```typescript
import { Layout } from '@/constants/styles';

const MyScreen = () => (
  <View style={Layout.container}>
    <ScrollView style={Layout.scrollView}>
      <View style={Layout.section}>
        <View style={Layout.flexRowBetween}>
          <Text>Title</Text>
          <IconButton />
        </View>
      </View>
    </ScrollView>
  </View>
);
```

### Spacing Utilities
```typescript
import { spacing } from '@/constants/styles';

const styles = StyleSheet.create({
  container: {
    ...spacing.mt('lg'),    // marginTop: 24
    ...spacing.px('md'),    // paddingHorizontal: 16
    ...spacing.mb('sm'),    // marginBottom: 8
  },
});
```

---

## Examples

### Before (Without Design Tokens)
```typescript
export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Hello</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
});
```

### After (With Design Tokens)
```typescript
import { Spacing, Typography, DesignColors } from '@/constants/design-system';
import { Layout, Cards, getThemedColors } from '@/constants/styles';

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = getThemedColors(isDark);

  return (
    <View style={[Layout.container, styles.container]}>
      <View style={Cards.base(isDark)}>
        <Text style={[styles.title, { color: colors.text }]}>Hello</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
});
```

---

## Tips for Maintainability

1. **Always import from design system first** before writing custom values
2. **Check `styles.ts`** for existing utilities before creating new styles
3. **Add new tokens to `design-system.ts`** if you need a value that doesn't exist
4. **Create reusable patterns in `styles.ts`** if a pattern is used 3+ times
5. **Keep component files clean** - move complex style logic to utility files
6. **Use TypeScript** to ensure type safety with design tokens

---

## When to Deviate

It's okay to use inline styles or custom values for:
- **Animations** and dynamic values (opacity, transforms, etc.)
- **Layout calculations** based on screen dimensions
- **One-off components** that won't be reused
- **Rapid prototyping** (but refactor later!)

---

## Resources

- [React Native StyleSheet Docs](https://reactnative.dev/docs/stylesheet)
- Project Design System: `constants/design-system.ts`
- Style Utilities: `constants/styles.ts`
