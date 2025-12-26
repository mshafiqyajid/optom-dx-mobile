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
| Checkpoint | `checkpoint/[id].tsx` | `useGetCheckpoints` | ✅ Integrated |
| History Taking | `history-taking/[id].tsx` | `useGetHistoryTaking`, `useCreateOrUpdateHistoryTaking` | ✅ Integrated |
| Preliminary Test | `preliminary-test/[id].tsx` | `useGetPreliminaryTest`, `useCreateOrUpdatePreliminaryTest` | ✅ Integrated |
| Visual Acuity | `visual-acuity/[id].tsx` | `useGetVisualAcuityAssessment`, `useCreateOrUpdateVisualAcuityAssessment` | ✅ Integrated |
| External Eye | `external-eye/[id].tsx` | `useGetExternalEyeExamination`, `useCreateOrUpdateExternalEyeExamination`, `useUploadExternalEyeAttachment` | ✅ Integrated |
| Refraction | `refraction/[id].tsx` | `useGetRefractionAssessment`, `useCreateOrUpdateRefractionAssessment` | ✅ Integrated |
| Case Submission | `case-submission/[id].tsx` | `useGetCaseSubmission`, `useCreateOrUpdateCaseSubmission` | ✅ Integrated |

## Backend API Structure (Mobile Follows Backend)

The following documents the **verified backend API structure** from Postman collection examples. **Mobile screens have been refactored to match the backend structure exactly.**

**Refactoring Status (December 2024)**: All 6 assessment screens now send data matching backend expectations:

- ✅ History Taking - Uses `question_1` through `question_14` with `{answer, notes}` format
- ✅ Preliminary Test - Uses `{a, b, c, d}` for eye data, `{mm}` for PD, `{answer}` for cover test; **uses `lefy_eye` typo to match backend**
- ✅ Visual Acuity - Uses `distance_vision` with `with_spectacle`, `un_aided`, `pin_hole`
- ✅ External Eye - Uses `alignment_eyes`, `operator_observation`, `operator_notes` in `anterior`; uses `conjunctiva` (proper spelling - backend accepts flexible JSON)
- ✅ Refraction - Uses `objective_refraction`, `subjective_refraction` with `{a, b, c, d}` format
- ✅ Case Submission - Uses `referral.referral_list`, `overall_result.referral_list` with `notes`

**Backend Typos Note**: The backend has some typos in field names. Mobile handles them as follows:

- `lefy_eye` (backend typo) - **Mobile uses this typo** to match backend exactly
- `conjuctiva` (backend typo) - Mobile uses `conjunctiva` (proper spelling) since backend accepts flexible JSON
- `fundis_left` (backend typo) - Mobile uses `fundus_left` (proper spelling) for attachment type

### Checkpoint Screen

- **Status**: ✅ Verified - Correctly aligned
- **Checkpoint types**: `profile_verification`, `history_taking`, `preliminary_test`, `visual_acuity_assessment`, `external_eye_examination`, `refraction_assessment`, `case_submission`
- **API field**: Backend returns `checkpoint` field (not `checkpoint.type`) - already correctly mapped

### History Taking Screen

- **Status**: ✅ Mobile matches backend

**Backend structure (mobile sends this exact format):**

```json
{
  "registration_id": 7,
  "section_a": {
    "question_1": { "answer": "yes", "notes": "notes" },
    "question_2": { "answer": "yes", "notes": "notes" },
    "question_3": { "answer": "localise" },  // localise | radiate
    "question_4": { "answer": "gradial" },   // gradial | sudden
    "question_5": { "answer": "frequent" },  // frequent | occasional
    "question_6": { "answer": "daytime" },   // daytime | nighttime
    "question_7": { "answer": "9" },         // severity 1-10
    "question_8": { "answer": "notes" },     // relief factor
    "question_9": { "answer": "notes" },
    "question_10": { "answer": "yes" },
    "question_11": { "answer": "yes" },
    "question_12": { "answer": "notes" },
    "question_13": { "answer": "notes" },
    "question_14": { "answer": "notes" }
  },
  "section_b": {
    "operator_observation": { "answer": "notes" },
    "initial_assessment": { "answer": "pass" }  // pass | refer
  }
}
```

### Preliminary Test Screen

- **Status**: ✅ Mobile matches backend

**Backend structure (mobile sends this exact format):**

```json
{
  "registration_id": 7,
  "section_a": {
    "right_eye": { "a": "-1.00", "b": "-0.50", "c": "90", "d": "6/6" },
    "lefy_eye": { "a": "-1.00", "b": "-0.50", "c": "90", "d": "6/6" }
  },
  "section_b": {
    "right_eye": { "mm": 0 },
    "left_eye": { "mm": 0 },
    "pd_distance": { "mm": 0 }
  },
  "section_c": {
    "deviation_size": { "answer": "small" },      // small | big
    "type_of_deviation": { "answer": "exophoria" } // exophoria | esophoria
  }
}
```

**Note**: Backend has typo `lefy_eye` instead of `left_eye` in section_a. Mobile uses `lefy_eye` to match backend.

### Visual Acuity Screen

- **Status**: ✅ Mobile matches backend

**Backend structure (mobile sends this exact format):**

```json
{
  "registration_id": 7,
  "description": {
    "distance_visual_acuity_chart": "HOTV",
    "vision_screening_distance": "1.5",
    "distance_vision": {
      "with_spectacle": { "right_eye": "6", "left_eye": "6" },
      "un_aided": { "right_eye": "6", "left_eye": "6" },
      "pin_hole": { "right_eye": "6", "left_eye": "6" },
      "operator_notes": {
        "operator_observation": "notes",
        "distance_vision_test_result": "pass"
      }
    },
    "near_visual_acuity_chart": "LEA Symbols",
    "new_vision": {
      "aided": { "right_eye": "6", "left_eye": "6" },
      "un_aided": { "right_eye": "6", "left_eye": "6" },
      "operator_notes": {
        "operator_observation": "notes",
        "distance_vision_test_result": "pass"
      }
    }
  }
}
```

**Key field names**: `un_aided` (with underscore), `pin_hole` (with underscore), `right_eye`/`left_eye`

### External Eye Examination Screen

- **Status**: ✅ Mobile matches backend

**Backend structure (mobile sends this exact format):**

```json
{
  "registration_id": 7,
  "anterior": {
    "right_eye": {
      "eyelids_lashes": "Water / Sticky",
      "conjuctiva": "Inflamed",
      "cornea": "Ulcer",
      "iris_pupil": "Irregular eye",
      "lens": "cataract",
      "alignment_eyes": "not_aligned",
      "operator_observation": "notes"
    },
    "left_eye": { /* same structure */ },
    "operator_notes": {
      "operator_observation": "notes",
      "test_result": "pass"
    }
  }
}
```

**Attachment upload**: `POST /assessment/external-eye-examination/{id}/attachments`

- FormData with `type` (`anterior_left` | `anterior_right` | `fundis_left` | `fundus_right`) and `file`
- Response: `{ filename, path, type }`

**Note**: Backend has typo `conjuctiva` instead of `conjunctiva`, `fundis_left` instead of `fundus_left`. Mobile uses proper spellings since backend accepts flexible JSON.

### Refraction Assessment Screen

- **Status**: ✅ Mobile matches backend

**Backend structure (mobile sends this exact format):**

```json
{
  "registration_id": 7,
  "description": {
    "objective_refraction": {
      "right_eye": { "a": "-1.00", "b": "-0.50", "c": "90", "d": "6/6" },
      "left_eye": { "a": "-1.00", "b": "-0.50", "c": "90", "d": "6/6" }
    },
    "subjective_refraction": {
      "right_eye": { "a": "+0.75", "b": "+0.75", "c": "90", "d": "6/6" },
      "left_eye": { "a": "+0.75", "b": "+0.75", "c": "90", "d": "6/6" },
      "reading_spectacles_prescribe": { "a": "+0.75", "b": "14", "c": "40" }
    },
    "operator_notes": {
      "operator_observation": "notes",
      "test_result": "pass"
    }
  }
}
```

**Key difference**: Backend uses `a`, `b`, `c`, `d` for eye data, NOT `sph`, `cyl`, `axis`, `va`

### Case Submission Screen

- **Status**: ✅ Mobile matches backend

**Backend structure (mobile sends this exact format):**

```json
{
  "registration_id": 7,
  "description": {
    "referral": {
      "referral_list": "yes",
      "follow_up": "no need"
    },
    "overall_result": {
      "referral_list": "pass",
      "notes": "notes"
    }
  }
}
```

**Field values**:

- `referral.referral_list`: "yes" | "no"
- `referral.follow_up`: "no need" (with space)
- `overall_result.referral_list`: "pass" | "refer" | "urgent_refer"

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
