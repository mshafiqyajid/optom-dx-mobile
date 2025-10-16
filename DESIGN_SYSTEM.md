# Optom DX Design System

## Overview

This document describes the design system for the Optom DX mobile application, including colors, typography, spacing, and reusable components.

## Design Tokens

All design tokens are defined in `constants/design-system.ts`.

### Colors

#### Brand Colors
- **Primary**: `#1E3A5F` (Navy blue) - Main brand color
- **Primary Light**: `#D6E8F5` (Light blue) - Active states, highlights
- **Accent**: `#B8A072` (Gold) - Icons, highlights
- **Accent Dark**: `#9A8562` - Hover states

#### Semantic Colors
- **Success**: `#4CAF50` - Status indicators, success messages
- **Error**: `#FF3B30` - Error messages, danger buttons
- **Warning**: `#FFA726` - Warning messages
- **Info**: `#0a7ea4` - Info messages

#### Neutral Colors (Light Mode)
- Text: `#11181C`
- Text Secondary: `#687076`
- Background: `#FFFFFF`
- Surface: `#F5F5F5`
- Border: `#E0E0E0`
- Icon: `#687076`

#### Neutral Colors (Dark Mode)
- Text: `#ECEDEE`
- Text Secondary: `#9BA1A6`
- Background: `#151718`
- Surface: `#1E1E1E`
- Border: `#2A2A2A`
- Icon: `#9BA1A6`

### Spacing

Based on an 8pt grid system:

```typescript
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
xxxl: 64px
```

### Typography

#### Font Sizes
- xs: 12px
- sm: 13px
- base: 14px
- md: 15px
- lg: 16px
- xl: 18px
- xxl: 24px
- xxxl: 28px
- display: 36px

#### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### Border Radius
- sm: 8px - Small elements
- md: 12px - Cards, inputs
- lg: 16px - Large cards
- xl: 24px - Special components
- full: 9999px - Pills, circles

### Shadows

Pre-defined shadow configurations for elevation:
- sm: Subtle shadow for slight elevation
- md: Medium shadow for cards
- lg: Large shadow for modals

## Reusable Components

### Button

**Import**: `import { Button } from '@/components/ui'`

**Props**:
```typescript
{
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}
```

**Usage**:
```tsx
<Button
  title="Login"
  onPress={handleLogin}
  variant="primary"
  size="large"
/>
```

**Variants**:
- `primary`: Navy blue background
- `secondary`: Gold background
- `danger`: Red background
- `outline`: Transparent with border

---

### EventCard

**Import**: `import { EventCard } from '@/components/ui'`

**Props**:
```typescript
{
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  variant?: 'upcoming' | 'list';
  onPress?: () => void;
  onMenuPress?: () => void;
}
```

**Usage**:
```tsx
// Upcoming event (large card)
<EventCard
  variant="upcoming"
  title="School Eye Screening"
  subtitle="SK Taman Putra"
  date="Monday, 04 August 2025"
  time="09:00am - 12:30pm"
  onPress={handleEventPress}
/>

// List item (compact)
<EventCard
  variant="list"
  title="COMMUNITY EYE SCREENING"
  date="05 AUG 2025, 10:00 AM – 4:00 PM"
  onPress={handleEventPress}
  onMenuPress={handleMenuPress}
/>
```

---

### UserProfileHeader

**Import**: `import { UserProfileHeader } from '@/components/ui'`

**Props**:
```typescript
{
  name: string;
  role: string;
  avatarUrl?: string;
  online?: boolean;
  size?: 'small' | 'medium' | 'large';
  onAvatarPress?: () => void;
}
```

**Usage**:
```tsx
<UserProfileHeader
  name="Ahmad Zaki"
  role="Operator"
  online={true}
  size="medium"
  onAvatarPress={handleAvatarPress}
/>
```

---

### StatusBadge

**Import**: `import { StatusBadge } from '@/components/ui'`

**Props**:
```typescript
{
  text: string;
  color?: string;
  online?: boolean;
}
```

**Usage**:
```tsx
<StatusBadge
  text="Operator"
  online={true}
/>
```

---

## Usage Examples

### Creating a New Screen

```tsx
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { UserProfileHeader, EventCard, Button } from '@/components/ui';
import { DesignColors, Spacing } from '@/constants/design-system';

export default function MyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <UserProfileHeader
            name="Ahmad Zaki"
            role="Operator"
            online={true}
          />
        </View>

        <View style={styles.content}>
          <EventCard
            variant="upcoming"
            title="School Eye Screening"
            date="Monday, 04 August 2025"
            time="09:00am - 12:30pm"
          />

          <Button
            title="View Details"
            onPress={handlePress}
            variant="primary"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});
```

## File Structure

```
constants/
├── design-system.ts     # All design tokens
└── theme.ts            # Legacy theme (deprecated)

components/
├── ui/
│   ├── button.tsx
│   ├── event-card.tsx
│   ├── status-badge.tsx
│   ├── user-profile-header.tsx
│   ├── optom-logo.tsx
│   ├── icon-symbol.tsx
│   └── index.ts        # Barrel export
├── themed-text.tsx
└── themed-view.tsx
```

## Best Practices

1. **Always use design tokens** instead of hard-coded values
2. **Import from barrel exports**: `import { Button, EventCard } from '@/components/ui'`
3. **Use ThemedText and ThemedView** for automatic dark mode support
4. **Follow the 8pt spacing grid** for consistent layouts
5. **Use semantic color names** for better maintainability

## Migration Guide

### Old Way (Hard-coded)
```tsx
<TouchableOpacity
  style={{
    backgroundColor: '#1E3A5F',
    padding: 16,
    borderRadius: 12
  }}
>
```

### New Way (Design System)
```tsx
import { Button } from '@/components/ui';
import { DesignColors, Spacing, BorderRadius } from '@/constants/design-system';

<Button
  title="Click Me"
  onPress={handlePress}
  variant="primary"
/>

// Or for custom components:
<TouchableOpacity
  style={{
    backgroundColor: DesignColors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md
  }}
>
```

## Future Enhancements

- [ ] Add Avatar component with image support
- [ ] Add Input component with validation
- [ ] Add Card component
- [ ] Add Badge/Chip component
- [ ] Add Modal component
- [ ] Add Toast/Snackbar component
- [ ] Add Loading states/Skeleton screens
