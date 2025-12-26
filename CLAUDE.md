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

The app uses Expo Router's file-based routing system with route groups:

- **app/_layout.tsx** - Root layout with theme provider and navigation stack
- **app/(auth)/_layout.tsx** - Authentication flow layout
- **app/(auth)/login.tsx** - Login screen (initial route)
- **app/(tabs)/_layout.tsx** - Tab navigation layout
- **app/(tabs)/index.tsx** - Home screen
- **app/(tabs)/explore.tsx** - Explore screen

The `unstable_settings.anchor` in [app/_layout.tsx](app/_layout.tsx) is set to `'(auth)/login'`, making the login screen the default initial route.

#### Authentication Flow

The app implements a simple auth flow:
- Login screen (`/(auth)/login`) is the entry point
- After successful login, users navigate to `/(tabs)` using `router.replace()`
- Logout navigates back to `/(auth)/login`

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

- **components/** - Reusable components (themed-text, themed-view)
- **components/ui/** - UI primitives (icon-symbol, optom-logo)
- **components/haptic-tab.tsx** - Custom tab component with haptic feedback
- **hooks/** - Custom React hooks
- **constants/** - Theme constants and configuration

### Key Dependencies

- **react-native-svg** - For SVG support (Optom logo)

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

## IMPORTANT: Adding New Screens

When creating a new screen in the `app/` directory, you **MUST** register it in `app/_layout.tsx` with `headerShown: false` to prevent double headers (Expo Router's default header + your custom header).

```tsx
// In app/_layout.tsx - Add your new screen to the Stack
<Stack.Screen name="your-screen/[id]" options={{ headerShown: false }} />
```

**Current registered screens:**
- `(auth)` - Authentication flow
- `(tabs)` - Tab navigation
- `event/[id]` - Event details
- `profile/[id]` - Profile screen
- `profile/guardian/[id]` - Guardian profile
- `checkpoint/[id]` - Checkpoint timeline
- `history-taking/[id]` - History Taking assessment
- `preliminary-test/[id]` - Preliminary Test assessment
- `visual-acuity/[id]` - Visual Acuity assessment
- `external-eye/[id]` - External Eye Examination
- `refraction/[id]` - Refraction Assessment
- `case-submission/[id]` - Case Submission

**Failure to register screens will result in double headers appearing on the screen.**

## API Services

The mobile app has TanStack Query services ready for backend integration in `services/`:

### Available Services

| Service | File | Hooks |
|---------|------|-------|
| **Auth** | `auth/` | `useLogin`, `useLogout`, `useRegister` |
| **Events** | `events/` | `useGetEvents`, `useGetEventById`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent`, `useCheckInEvent` |
| **Patients** | `patients/` | `useGetPatients`, `useGetPatientById`, `useCreatePatient`, `useUpdatePatient` |
| **Registrations** | `registrations/` | `useGetRegistrations`, `useCreateRegistration`, `useGetCheckpoints`, `useGetCheckpoint` |
| **Assessments** | `assessments/` | See below |

### Assessment Hooks

| Assessment | Get Hook | Mutation Hook |
|------------|----------|---------------|
| History Taking | `useGetHistoryTaking(registrationId)` | `useCreateOrUpdateHistoryTaking()` |
| Preliminary Test | `useGetPreliminaryTest(registrationId)` | `useCreateOrUpdatePreliminaryTest()` |
| Visual Acuity | `useGetVisualAcuityAssessment(registrationId)` | `useCreateOrUpdateVisualAcuityAssessment()` |
| External Eye | `useGetExternalEyeExamination(registrationId)` | `useCreateOrUpdateExternalEyeExamination()`, `useUploadExternalEyeAttachment(registrationId)` |
| Refraction | `useGetRefractionAssessment(registrationId)` | `useCreateOrUpdateRefractionAssessment()` |
| Case Submission | `useGetCaseSubmission(registrationId)` | `useCreateOrUpdateCaseSubmission()` |

### API Endpoints

```
# Auth
POST /login
POST /logout
POST /register

# Events
GET    /events
GET    /events/{id}
POST   /events
PUT    /events/{id}
DELETE /events/{id}
GET    /events/{id}/check-in

# Registrations (PUBLIC - no auth)
GET  /registrations
POST /registrations
GET  /registrations/{id}/checkpoints
GET  /registrations/{id}/checkpoints/{checkpoint}

# Assessments
GET  /assessment/history-taking/{registrationId}
POST /assessment/history-taking
GET  /assessment/preliminary-test/{registrationId}
POST /assessment/preliminary-test
GET  /assessment/visual-acuity-assessment/{registrationId}
POST /assessment/visual-acuity-assessment
GET  /assessment/external-eye-examination/{registrationId}
POST /assessment/external-eye-examination
POST /assessment/external-eye-examination/{registrationId}/attachments
GET  /assessment/refraction-assessment/{registrationId}
POST /assessment/refraction-assessment
GET  /assessment/case-submission/{registrationId}
POST /assessment/case-submission
```

## Mobile Screens Integration Status

| Screen | File | API Integration | Status |
|--------|------|-----------------|--------|
| Login | `(auth)/login.tsx` | `useLogin` | Pending |
| Home | `(tabs)/index.tsx` | `useGetEvents` | Pending |
| Event Details | `event/[id].tsx` | `useGetEventById` | Pending |
| Checkpoint | `checkpoint/[id].tsx` | `useGetCheckpoints` | Pending |
| History Taking | `history-taking/[id].tsx` | `useGetHistoryTaking`, `useCreateOrUpdateHistoryTaking` | Pending |
| Preliminary Test | `preliminary-test/[id].tsx` | `useGetPreliminaryTest`, `useCreateOrUpdatePreliminaryTest` | Pending |
| Visual Acuity | `visual-acuity/[id].tsx` | `useGetVisualAcuityAssessment`, `useCreateOrUpdateVisualAcuityAssessment` | Pending |
| External Eye | `external-eye/[id].tsx` | `useGetExternalEyeExamination`, `useCreateOrUpdateExternalEyeExamination`, `useUploadExternalEyeAttachment` | Pending |
| Refraction | `refraction/[id].tsx` | `useGetRefractionAssessment`, `useCreateOrUpdateRefractionAssessment` | Pending |
| Case Submission | `case-submission/[id].tsx` | `useGetCaseSubmission`, `useCreateOrUpdateCaseSubmission` | Pending |

## Integration Pattern

When integrating API with a screen:

```tsx
import { useGetHistoryTaking, useCreateOrUpdateHistoryTaking } from '@/services';

export default function HistoryTakingScreen() {
  const { id } = useLocalSearchParams();
  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;

  // Fetch existing data
  const { data, isLoading, error } = useGetHistoryTaking(registrationId);

  // Mutation for save
  const { mutate: saveHistoryTaking, isPending } = useCreateOrUpdateHistoryTaking();

  const handleSave = () => {
    saveHistoryTaking({
      registration_id: registrationId,
      section_a: { /* form data */ },
      section_b: { /* form data */ },
    }, {
      onSuccess: () => router.back(),
      onError: (error) => Alert.alert('Error', error.message),
    });
  };

  // Pre-fill form from existing data
  useEffect(() => {
    if (data?.data) {
      // Set form state from data.data
    }
  }, [data]);

  // ... rest of component
}
```
