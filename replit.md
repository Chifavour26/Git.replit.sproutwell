# Workspace

## Overview

pnpm workspace monorepo using TypeScript. KidWell — a children's health mobile app focused on NCD prevention.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (use `zod` not `zod/v4` in API server — esbuild can't resolve the subpath)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **Mobile**: Expo React Native (Expo Router v6, NativeTabs, react-native-reanimated)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   ├── mobile/             # KidWell Expo mobile app
│   └── mockup-sandbox/     # Vite component preview server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## KidWell Mobile App (`artifacts/mobile`)

Expo React Native app for children's health tracking.

### Features
- Daily health tracking: fruits/veggies, activity, sleep, screen time, water
- Virtual pet (PetAvatar) that reacts to healthy habits with animated mood states
- Gamification: achievements, badges, daily score (0-100%)
- Educational content: lesson cards with categories (Nutrition, Activity, Sleep, Health)
- Quizzes: 5-question interactive quizzes
- Family dashboard: multiple child profiles, parent tips
- Weekly progress charts (bar chart)
- Onboarding flow: 4-step profile creation

### Architecture
- AsyncStorage for persistence (AppContext)
- react-native-reanimated for all animations
- NativeTabs with liquid glass for iOS / BlurView fallback
- expo-linear-gradient, expo-haptics
- MaterialCommunityIcons + Ionicons (no emojis)
- Inter font family

### Key Files
- `app/_layout.tsx` — root layout, font loading, AppContext provider
- `app/(tabs)/_layout.tsx` — tab bar layout (NativeTabs + fallback)
- `app/(tabs)/index.tsx` — Home tab (daily goals, pet, score, quick log)
- `app/(tabs)/track.tsx` — Track tab (weekly charts, ring breakdowns)
- `app/(tabs)/learn.tsx` — Learn tab (educational cards, quiz banner)
- `app/(tabs)/family.tsx` — Family tab (profile switcher, achievements)
- `app/onboarding.tsx` — 4-step profile creation
- `app/learn/[id].tsx` — lesson detail screen
- `app/quiz/[id].tsx` — 5-question quiz with results
- `context/AppContext.tsx` — full app state (profiles, logs, goals, achievements)
- `constants/colors.ts` — color theme (green #2ECC71, teal, coral, purple, golden accent)
- `constants/quiz.ts` — quiz data
- `components/PetAvatar.tsx` — animated virtual pet
- `components/GoalCard.tsx` — SVG animated goal ring card
- `components/GoalRing.tsx` — SVG ring progress component
- `components/LogInputSheet.tsx` — stepper modal for logging
- `components/AchievementBadge.tsx` — badge component

### Web Platform Notes
- `paddingTop: insets.top + 67` on web (67px for Replit preview toolbar)
- `paddingBottom: 120` for tab bar clearance
- `useAnimatedStyle` hooks always extracted into separate components (never in `.map()`)
- BlurView has a web conditional wrapper to avoid crashes

## Database Schema (`lib/db`)

- `profiles` — child profiles (id, name, age, avatarColor, petName, petLevel, petMood, streakDays, totalPoints)
- `activity_logs` — daily health logs (id, profileId, type, value, notes, date)
- `achievements` — earned achievements (id, profileId, type, title, description, icon, points)

Run `pnpm --filter @workspace/db run push` to apply schema changes.

## API Server (`artifacts/api-server`)

Express 5 API at `/api/`. Routes:
- `GET/POST /api/profiles` — list / create profiles
- `GET /api/profiles/:id` — get profile
- `GET /api/profiles/:id/dashboard` — today's aggregated stats + score
- `GET/POST /api/logs` — activity logs
- `GET/POST /api/achievements/:profileId` — achievements

**Important**: Do not use `zod/v4` subpath in API server routes — esbuild cannot resolve it. Use `import { z } from "zod"` instead.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` (composite: true). Run `pnpm run typecheck` from root.

## Root Scripts

- `pnpm run build` — typecheck then recursive build
- `pnpm run typecheck` — `tsc --build --emitDeclarationOnly`
