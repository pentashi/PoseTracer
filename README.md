# PoseTracer
AI-powered web application for personalized workout planning, tracking, and coaching.

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-not%20specified-lightgrey)
![Coverage](https://img.shields.io/badge/coverage-not%20configured-lightgrey)

## Overview
PoseTracer delivers a production-oriented fitness web app that combines onboarding, workout planning, progress tracking, and AI coaching in one interface.

It exists to replace static workout plans with adaptive, user-specific training workflows backed by Firebase and a companion AI backend.

It is for engineering teams building or evaluating AI-enabled fitness products that require:
- Account-based user sessions
- Persistent training data
- Interactive coaching UX

## Key Features
- Generate personalized training flows from user onboarding context
- Track workouts and progression over time
- Manage goals and profile settings in authenticated sessions
- Use AI chat workflows with persisted conversation history
- Run a modular React + TypeScript frontend with Firebase integration

## Architecture Overview
```text
[React + Vite Frontend]
  ├─ Auth/session state (Firebase Auth)
  ├─ User/workout data (Firestore)
  ├─ Media storage (Firebase Storage)
  └─ AI chat UI
       └─ HTTP API (localhost:4000)
            ├─ POST /chat
            ├─ GET /chat-history
            └─ POST /clear-chat
```

## Prerequisites
- Node.js 18+ (Node.js 20 LTS recommended)
- npm 9+
- Firebase project with Auth, Firestore, and Storage enabled
- AI backend service reachable from the frontend (default: `http://localhost:4000`)

## Installation & Quick Start
```bash
git clone https://github.com/pentashi/PoseTracer.git
cd PoseTracer
npm install
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

## Configuration
Current runtime configuration lives in source (`/src/firebaseConfig.js` and `/src/components/AIChat.tsx`).

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `FIREBASE_API_KEY` | string | Hardcoded in `src/firebaseConfig.js` | Firebase API key used by the web app. |
| `FIREBASE_AUTH_DOMAIN` | string | `achapi-ai-fitness-coach.firebaseapp.com` | Firebase auth domain. |
| `FIREBASE_PROJECT_ID` | string | `achapi-ai-fitness-coach` | Firebase project identifier. |
| `FIREBASE_STORAGE_BUCKET` | string | `achapi-ai-fitness-coach.firebasestorage.app` | Firebase Storage bucket. |
| `FIREBASE_MESSAGING_SENDER_ID` | string | `117338601600` | Firebase sender ID. |
| `FIREBASE_APP_ID` | string | `1:117338601600:web:44f152b88bb5258d3d0e65` | Firebase app identifier. |
| `FIREBASE_MEASUREMENT_ID` | string | `G-V8B0V56DW5` | Firebase analytics measurement ID. |
| `AI_BACKEND_BASE_URL` | string | `http://localhost:4000` | Base URL for AI chat endpoints (`/chat`, `/chat-history`, `/clear-chat`). |

## Usage Examples
### Start local development
```bash
npm run dev
```

### Build for production
```bash
npm run build
npm run preview
```

### Read and update user settings from the app service layer
```ts
import { getUserSettings, updateUserSettings } from "@/services/userService";

const settings = await getUserSettings();
await updateUserSettings({ notifications: false, trainingGoal: "strength" });
```

## API Reference
PoseTracer frontend currently integrates with these AI backend endpoints:

| Method | Path | Purpose | Request Body |
| --- | --- | --- | --- |
| `GET` | `/chat-history?userId=<uid>` | Retrieve chat history for a user | None |
| `POST` | `/chat` | Send user message and receive AI reply | `{ "message": "string", "userId": "string" }` |
| `POST` | `/clear-chat?userId=<uid>` | Clear user chat history | None |

## Testing
This repository does not define automated unit/integration tests yet.

Current local verification commands:
```bash
npm run lint
npm run build
```

## Deployment
- Build static assets with `npm run build`
- Serve `dist/` through your CDN or static hosting platform
- Provision Firebase resources per environment (dev/staging/prod)
- Configure AI backend URL per environment instead of hardcoding localhost
- Enforce HTTPS, auth rules, and Firestore security rules before production rollout

## Contributing
1. Create a branch from `main` using `feature/<short-description>` or `fix/<short-description>`.
2. Keep changes scoped and production-safe.
3. Run `npm run lint` and `npm run build` before opening a PR.
4. Open a PR with:
   - Problem statement
   - Scope of changes
   - Validation evidence (command output/screenshots when relevant)
5. Address review feedback and keep history clean.

## Security
Report vulnerabilities privately via email: `achapipentashi@gmail.com`.

Include:
- Affected component or file
- Reproduction steps
- Impact assessment
- Suggested remediation (if available)


