# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

An Expo SDK 54 / React Native 0.81 app using expo-router for file-based routing, TypeScript (strict), and React 19. Created from the default `create-expo-app` template, intended to run in Expo Go during development.

## Commands

- `npm start` — start the Metro dev server (`expo start`); press `a` for Android emulator, `w` for web, or scan the QR code with Expo Go on a phone
- `npm run android` / `npm run ios` / `npm run web` — start directly on a specific platform
- `npm run lint` — run ESLint (`expo lint`, flat config in eslint.config.js)
- `npm run reset-project` — moves the starter template code to `app-example/` and creates a blank `app/` directory (one-time, when ready to start fresh)

There is no test runner configured.

## Architecture

- **Routing is file-based via expo-router.** Files under `app/` are screens; `app/_layout.tsx` is the root Stack layout, and `app/(tabs)/` is a tab group with its own `_layout.tsx` defining the bottom tab bar (Home = `index.tsx`, Explore = `explore.tsx`). `app/modal.tsx` is presented modally. Typed routes are enabled (`experiments.typedRoutes`).
- **Path alias:** import project files as `@/...` (maps to the repo root, see tsconfig.json).
- **Theming:** colors and fonts live in `constants/theme.ts`. Components use `hooks/use-theme-color.ts` plus the `ThemedText`/`ThemedView` components in `components/` to support light/dark mode (`userInterfaceStyle: "automatic"`). `use-color-scheme.ts` has a `.web.ts` variant for web hydration.
- **Platform-specific files:** components may have `.ios.tsx` / `.web.ts` variants (e.g. `components/ui/icon-symbol.ios.tsx` uses SF Symbols on iOS with a Material Icons fallback in `icon-symbol.tsx`).
- **React Compiler and the New Architecture are enabled** in app.json (`reactCompiler`, `newArchEnabled`).
