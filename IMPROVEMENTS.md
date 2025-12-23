# Mobile App Improvement Recommendations

This document outlines potential improvements for the OPTOM DX Mobile application.

---

## 1. Reusable Components to Extract

### 1.1 RadioButton Component
**Currently duplicated in:**
- `app/visual-acuity/[id].tsx`
- `app/preliminary-test/[id].tsx`
- `app/history-taking/[id].tsx`

**Create:** `components/ui/radio-button.tsx`
```typescript
interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}
```

### 1.2 ScreenHeader Component
**Currently duplicated in:**
- `app/checkpoint/[id].tsx`
- `app/visual-acuity/[id].tsx`
- `app/event/[id].tsx`
- `app/profile/[id].tsx`

**Create:** `components/ui/screen-header.tsx`
```typescript
interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}
```

### 1.3 SectionCard Component
**Currently duplicated in:**
- `app/visual-acuity/[id].tsx`
- `app/preliminary-test/[id].tsx`
- `app/history-taking/[id].tsx`

**Create:** `components/ui/section-card.tsx`
```typescript
interface SectionCardProps {
  title: string;
  backgroundColor?: string;
  children: React.ReactNode;
}
```

### 1.4 FixedBottomButton Component
**Currently duplicated in:**
- All form screens with absolute positioned bottom buttons

**Create:** `components/ui/fixed-bottom-button.tsx`
```typescript
interface FixedBottomButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}
```

### 1.5 LoadingState & ErrorState Components
**Create:** `components/ui/loading-state.tsx`
```typescript
interface LoadingStateProps {
  message?: string;
}
```

**Create:** `components/ui/error-state.tsx`
```typescript
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}
```

### 1.6 Dropdown Component
**Currently in:** `app/visual-acuity/[id].tsx`

**Create:** `components/ui/dropdown.tsx`
```typescript
interface DropdownProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}
```

---

## 2. Configuration & Constants to Centralize

### 2.1 API URL (High Priority)
**File:** `services/api.ts`
**Issue:** Hardcoded `http://54.179.79.104:8080/api`

**Fix:**
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';
```

**Create:** `.env.example`
```
EXPO_PUBLIC_API_URL=http://54.179.79.104:8080/api
```

### 2.2 Routes Constants
**Create:** `constants/routes.ts`
```typescript
export const ROUTES = {
  // Auth
  LOGIN: '/(auth)/login',

  // Tabs
  HOME: '/(tabs)',
  PROFILE: '/(tabs)/profile',

  // Event
  EVENT: (id: number) => `/event/${id}` as const,

  // Patient
  PATIENT_PROFILE: (id: number) => `/profile/${id}` as const,
  CHECKPOINT: (id: number) => `/checkpoint/${id}` as const,

  // Diagnostics
  HISTORY_TAKING: (id: number) => `/history-taking/${id}` as const,
  PRELIMINARY_TEST: (id: number) => `/preliminary-test/${id}` as const,
  VISUAL_ACUITY: (id: number) => `/visual-acuity/${id}` as const,
} as const;
```

### 2.3 Form Options
**Create:** `constants/form-options.ts`
```typescript
export const VISION_CHART_OPTIONS = ['HOTV', 'LEA Symbols', 'Snellen', 'Tumbling E'];
export const SCREENING_DISTANCE_OPTIONS = ['3m', '4m', '5m', '6m'];
export const DENOMINATOR_OPTIONS = ['6', '9', '12', '18', '24', '36', '60'];
export const YES_NO_OPTIONS = ['Yes', 'No'];
```

### 2.4 Consolidate Mock Data
**Create:** `constants/mock-data.ts`
Move all mock data from:
- `app/checkpoint/[id].tsx` (getMockCheckpointSteps)
- `app/profile/[id].tsx` (PATIENT_DETAILS)
- `constants/patient.ts` (MOCK_PATIENTS)

---

## 3. Error Handling Improvements

### 3.1 Enhanced API Error Handling
**File:** `services/api.ts`

Add handling for:
- 400: Validation errors
- 404: Not found
- 500: Server errors
- Network timeouts

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        // Handle validation errors
        break;
      case 401:
        // Already handled - clear auth
        break;
      case 404:
        // Handle not found
        break;
      case 500:
        // Handle server error
        break;
    }

    if (!error.response) {
      // Network error
    }

    return Promise.reject(error);
  }
);
```

### 3.2 Error Types
**Create:** `services/types.errors.ts`
```typescript
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface NetworkError {
  message: string;
  isNetworkError: true;
}
```

---

## 4. Form Handling Improvements

### 4.1 Form State Hook
**Create:** `hooks/use-form-state.ts`
```typescript
export function useFormState<T extends Record<string, unknown>>(initialState: T) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = (key: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [key]: value }));
    // Clear error when value changes
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (rules: ValidationRules<T>) => {
    // Validation logic
  };

  return { values, errors, setValue, validate, reset };
}
```

### 4.2 Form Persistence
- Save form state to AsyncStorage on step change
- Load on screen mount
- Clear on completion

---

## 5. UI Store for Global State

**Create:** `store/ui-store.ts`
```typescript
import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  error: string | null;
  toast: { message: string; type: 'success' | 'error' } | null;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  error: null,
  toast: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
```

---

## 6. Accessibility Improvements

### 6.1 Add Accessibility Labels
```typescript
<TouchableOpacity
  accessibilityLabel="Go back"
  accessibilityRole="button"
  onPress={() => router.back()}
>
  <IconSymbol name="chevron.left" />
</TouchableOpacity>
```

### 6.2 Form Input Accessibility
```typescript
<TextInput
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email to login"
  textContentType="emailAddress"
  autoComplete="email"
/>
```

---

## 7. Performance Optimizations

### 7.1 Memoize Heavy Components
```typescript
import { memo } from 'react';

export const SeverityChart = memo(function SeverityChart({ value, maxValue, onValueChange }) {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
```

### 7.2 Use FlatList for Long Lists
Replace `map()` with `FlatList` in event lists for better performance with large datasets.

### 7.3 Query Client Optimization
```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'offlineFirst',
    },
  },
});
```

---

## 8. Hooks to Create

### 8.1 useThemedStyles
**Create:** `hooks/use-themed-styles.ts`
```typescript
export function useThemedStyles() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  return { isDark, colors };
}
```

### 8.2 useAsync
**Create:** `hooks/use-async.ts`
```typescript
export function useAsync<T>(asyncFn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({ data: null, loading: true, error: null });

  useEffect(() => {
    asyncFn()
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }));
  }, deps);

  return state;
}
```

---

## 9. Files to Create Summary

| File | Priority | Description |
|------|----------|-------------|
| `components/ui/radio-button.tsx` | High | Reusable radio button |
| `components/ui/screen-header.tsx` | High | Consistent screen headers |
| `components/ui/section-card.tsx` | High | Form section wrapper |
| `components/ui/fixed-bottom-button.tsx` | Medium | Bottom action button |
| `components/ui/loading-state.tsx` | Medium | Loading indicator |
| `components/ui/error-state.tsx` | Medium | Error display |
| `components/ui/dropdown.tsx` | Medium | Dropdown selector |
| `constants/routes.ts` | High | Type-safe navigation |
| `constants/form-options.ts` | Medium | Form select options |
| `constants/mock-data.ts` | Low | Consolidated mock data |
| `hooks/use-themed-styles.ts` | Medium | Theme helper hook |
| `hooks/use-form-state.ts` | Medium | Form state management |
| `store/ui-store.ts` | Medium | Global UI state |
| `services/types.errors.ts` | Low | Error type definitions |
| `.env.example` | High | Environment template |

---

## 10. Implementation Priority

### Phase 1: Quick Wins (Immediate)
1. ✅ Create `constants/routes.ts`
2. ✅ Create `.env.example` and use env variable for API URL
3. ✅ Extract `RadioButton` component
4. ✅ Extract `ScreenHeader` component

### Phase 2: Code Consolidation
5. ✅ Extract `SectionCard` component
6. ✅ Extract `FixedBottomButton` component
7. ✅ Create `LoadingState` and `ErrorState` components
8. ✅ Consolidate mock data

### Phase 3: Enhanced Functionality
9. Create `useThemedStyles` hook
10. Create `useFormState` hook
11. Create `ui-store.ts` for global state
12. Enhance API error handling

### Phase 4: Polish
13. Add accessibility labels
14. Memoize heavy components
15. Replace map with FlatList where needed
16. Add form validation

---

## Notes

- All new components should follow existing design system tokens from `constants/design-system.ts`
- Maintain consistency with existing patterns in `constants/styles.ts`
- Test on both iOS and Android after each change
- Run `npm run lint` after modifications
