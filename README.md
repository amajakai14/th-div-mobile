# TH Dividend Calendar — Mobile

Expo iOS + Android app for the TH Dividend Calendar. Connects to the Express backend API with SQLite offline cache.

## Stack

- Expo SDK 54 / Expo Router v6
- NativeWind v5 + Tailwind CSS v4
- React Query v5
- expo-sqlite v13 (offline cache)
- expo-secure-store (JWT)
- expo-notifications (push alerts)

## Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo`
- iOS: Xcode + iOS Simulator
- Android: Android Studio + emulator, or physical device with Expo Go

## Setup

```bash
cd mobile
npm install
```

Create `.env.local`:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

For physical device, replace `localhost` with your machine's LAN IP.

## Run

```bash
# Start Metro bundler
npx expo start

# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android
```

Scan the QR code with Expo Go (Android) or Camera app (iOS) to run on a physical device.

## Project structure

```
mobile/
  app/
    _layout.tsx          # Root layout — auth guard, SplashScreen
    (auth)/
      login.tsx
      register.tsx
    (tabs)/
      _layout.tsx        # Tab navigator
      index.tsx          # Calendar screen
      portfolio.tsx      # Holdings + income estimate
      profile.tsx        # Account, notifications, watchlist
    modal/
      [ticker].tsx       # Ticker detail bottom sheet
  components/
    CalendarGrid.tsx
    DayCell.tsx
    TabBar.tsx
    OfflineBadge.tsx
    ErrorToast.tsx
    HoldingCard.tsx
    TickerCard.tsx
  hooks/
    useAuth.tsx          # JWT + SecureStore
    useTheme.ts          # Design tokens
    useNetworkStatus.ts
    usePushToken.ts      # Expo push registration
  queries/
    useDividends.ts      # React Query + SQLite fallback
    usePortfolio.ts
    useWatchlist.ts
  services/
    api.ts               # Typed fetch wrapper
    db.ts                # expo-sqlite schema + helpers
  constants/
    theme.ts             # Color/radius/font tokens
```

## Build (EAS)

Requires [EAS CLI](https://docs.expo.dev/build/setup/): `npm install -g eas-cli` and an Expo account.

```bash
# Dev client (physical device, hot reload)
eas build --profile development --platform ios
eas build --profile development --platform android

# Internal APK (Android, no store)
eas build --profile preview --platform android

# Store build
eas build --profile production
```

## Backend

The app expects the Express API from the parent repo running on port 3000. See the root `README.md` or `ROADMAP.md` for server setup.

Push notifications use the Expo Push API — set `EXPO_PUBLIC_API_URL` to your deployed server for production builds.
