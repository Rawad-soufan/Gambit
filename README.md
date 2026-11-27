# Gambit

A seven-screen powerlifting journal for the mobile application assignment. Built with React Native, Expo SDK 58, Expo Router, Zod, and AsyncStorage. Source files use ordinary JavaScript/JSX, following the supplied class project, MyTasks.

## Start

Use Node.js 22 LTS or a compatible newer LTS release. Open a terminal in this folder:

```powershell
npm ci
npx expo start
```

Scan the QR code with an Expo SDK 58-compatible Expo Go app. Phone and computer should share a network. Other commands:

```powershell
npm run web
npm run android
```

Android requires a running emulator or connected device. `npm run ios` requires a Mac with an iOS simulator. iOS can also be checked on a physical iPhone with compatible Expo Go.

Demo login:

```text
Email: athlete@gambit.app
Password: Gambit123!
```

The login is mock authentication. The session ends after restarting; the lift collection remains stored locally.

## Screens and features

Welcome → Login → Dashboard ↔ Lift Log → Lift Details → Add/Edit Lift. Dashboard also opens Challenges. Dashboard and Lift Log both offer Add lift. Logout returns to Login. A protected stack prevents logged-out users from reopening the main screens.

Users can add, view, edit, and delete records with confirmation; search exercise names/notes; and filter by exercise. All screens use the same collection. The app handles invalid forms, missing entries, empty collections, no matches, loading, storage failures, and successful actions.

## Files

```text
src/
  app/                 Seven Expo Router route files and _layout.jsx
  screens/             The seven screen implementations
  components/          AppButton, AppScreen, AppTextInput, LiftCard,
                       LiftForm, ExerciseFilter, ConfirmationDialog,
                       MainLinks, and shared UI helpers
  context/             AppProvider.jsx: shared state and data actions
  constants/           Colors, exercise labels, mock credentials
  data/                Nine initial mock lift entries
  lib/                 Calculations, Zod validation, storage repository
tests/core.test.ts     Development checks; application source stays JS/JSX
```

The class's `AppButton`, `AppScreen`, and `AppTextInput` implementations are adapted directly. `LiftCard` and `ExerciseFilter` follow the same props/callback pattern as `TaskItem` and `TaskFilters`. See the [class example license](https://github.com/Rawad-soufan/Gambit/blob/2f60c6707636a64810b3ae5649d7ea47c51f9496/CLASS-LICENSE.txt).

## State and storage explanation

`AppProvider` is a shared parent above the routes. It uses `useState` for the lift collection, authentication, loading, saving, and feedback. Context lets screens read that parent's state. Temporary form values and filters stay in their own components. Props pass values and callbacks to reusable components.

Adding uses array spread, editing uses `map`, and deleting uses `filter`, extending the patterns in MyTasks. Details find a current record by its ID rather than receiving a copied title or status that could become stale after editing.

`useEffect` loads data when the provider opens. The storage repository reads/writes JSON with AsyncStorage under `gambit:liftEntries:v1`:

- Only a missing value (`null`) triggers initial mock data.
- A saved `[]` remains empty after restart.
- Stored data is validated before use; a failed read offers Retry and does not overwrite it.
- Saves/deletions wait for the write before updating React state or reporting success.
- A failed write leaves the visible collection unchanged and allows retry.
- Refs hold the latest collection and prevent overlapping saves or writes before initial loading finishes. Unlike state, changing a ref does not cause a render.

These additions support the assignment's persistence requirements. AsyncStorage is local and unencrypted; uninstalling the app or clearing browser/device storage removes its data.

## Validation and calculations

Zod validates both login and lift forms with `safeParse`, like the class login example. Login compares both fields with predefined credentials after validation. Email comparison ignores casing/outer spaces; passwords are exact.

A lift requires one of the three exercises, a positive weight up to 500 kg, integer sets and reps from 1–10, a real date no later than today, and optional notes up to 300 characters. Decimal weights are supported. Invalid submissions show field messages and do not save.

```text
Training volume = weight × sets × reps
Estimated 1RM = weight × (1 + reps / 30)
```

Single-rep entries use the lifted weight as their estimate. Estimates display to at most one decimal place. Estimated 1RM is an approximation for tracking, not a verified competition maximum. Dashboard totals and entry calculations are derived from saved records.

## Development checks

```powershell
npm run typecheck
npm test
npx expo install --check
npx expo export --platform web
```

The JavaScript source follows the class's configuration with `checkJs` disabled; the TypeScript command checks the test imports and project configuration rather than claiming strict type coverage of the application. The six automated tests cover calculations, search/filter behavior, validation, CRUD persistence, empty persistence, corrupted reads, and write failures.

After exporting, `node scripts/preview.cjs` serves the browser preview at `http://127.0.0.1:8081`. The exported web app was opened to the Welcome screen on Windows. Runtime testing in Expo Go or a development build has not been verified here.

No backend, cloud authentication, account creation, social features, advanced charts, or game system is included.

## AI use

I used AI to create the screen-flow diagram and organize the screenshots.

## Submission version

The Project 1 source version is [Gambit commit 2f60c67](https://github.com/Rawad-soufan/Gambit/commit/2f60c6707636a64810b3ae5649d7ea47c51f9496).
