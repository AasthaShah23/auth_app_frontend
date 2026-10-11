# AuthApp — Frontend

A modern, production-grade Next.js (App Router) + TypeScript frontend implementing persistent authentication, Clean Architecture, and HttpOnly cookie session management integrated with a FastAPI backend.

---

## 🚀 Quick Start / How to Run Locally

### Prerequisites

- **Node.js**: v18.17+ or v20+ recommended
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Backend**: FastAPI backend running locally (by default at `http://localhost:8000`)

### 1. Clone & Install Dependencies

```bash
# Navigate to the frontend directory
cd auth_app_frontend

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (you can copy from `.env.example`):

```bash
cp .env.example .env.local
```

Ensure `.env.local` contains your FastAPI backend URL:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be accessible at: **[http://localhost:3000](http://localhost:3000)**

### 4. Build for Production

```bash
# Build the application
npm run build

# Start the production build
npm run start
```

---

## 🔑 Environment Variables

| Variable              | Description                            | Default / Example           | Required |
| :-------------------- | :------------------------------------- | :-------------------------- | :------- |
| `NEXT_PUBLIC_API_URL` | Base URL for FastAPI backend endpoints | `http://localhost:8000/api` | **Yes**  |

---

## 🏗️ Architecture & Project Structure

The project is structured according to **Clean Architecture (Domain-Driven Design)** principles to enforce separation of concerns, testability, and maintainability:

```text
src/
├── app/                  # Next.js App Router (pages, layouts, auth route guard)
│   ├── (auth)/           # Public auth routes: /login, /signup, /forgot-password, /reset-password
│   ├── (dashboard)/      # Protected routes: /dashboard, /profile
│   └── verify-email/     # Email verification route: /verify-email?token=...
│
├── presentation/         # UI & State Layer
│   ├── components/       # Reusable UI widgets and auth views
│   └── store/            # Zustand global state (auth.store.ts)
│
├── domain/               # Enterprise Business Rules & Contracts (Pure TypeScript)
│   ├── entities/         # Domain models (User, AuthSession, Credentials)
│   ├── repositories/     # Repository interfaces (Contracts: AuthRepository, ProfileRepository)
│   └── usecases/         # Single-responsibility use cases (Login, Signup, VerifyEmail, etc.)
│
├── infrastructure/       # External Systems Implementation
│   ├── api/              # HTTP Client (fetch wrapper with credentials & 401 token refresh)
│   ├── dtos/             # Data Transfer Objects matching FastAPI response schemas
│   ├── repositories/     # Repository implementations (AuthRepositoryImpl, ProfileRepositoryImpl)
│   └── di/               # Dependency Injection Container (container.ts)
│
└── shared/               # Cross-cutting Concerns
    ├── types/            # Shared TypeScript types
    └── validators/       # Zod schemas & client-side validation rules
```

---

## 💡 Key Architectural & Technical Decisions

### 1. HttpOnly Cookie Authentication (Zero Client-Side Token Storage)

- **Why**: Storing JWT access tokens or refresh tokens in `localStorage` or `sessionStorage` leaves them vulnerable to Cross-Site Scripting (XSS) attacks. Storing tokens in Zustand memory loses them on page refresh.
- **Solution**: The backend issues `HttpOnly`, `SameSite=lax` cookies. Every frontend network request in `httpClient` uses `credentials: "include"`, letting the browser automatically manage cookies securely.

### 2. Session Restoration Without Flashes or Premature Redirects

- **Why**: On page reload, the client memory starts empty. If route guards check `isAuthenticated` immediately, the user gets prematurely redirected to `/login` before the backend responds.
- **Solution**:
  - `checkAuth()` calls `GET /api/profile/me` on initial render.
  - An `isLoading` state is preserved while `checkAuth()` runs.
  - The [`AuthGuard`](file:///d:/TongGarden%20Assignment/fullstack_assignment_frontend/src/components/AuthGuard.tsx) displays a smooth loader until the session check resolves.

### 3. Silent 401 Token Refresh Interceptor

- **Why**: When the short-lived access cookie expires, in-flight requests should not break user workflows.
- **Solution**: The custom `HttpClient` automatically intercepts `401 Unauthorized` responses, calls `POST /api/auth/refresh` once to renew the cookie, and transparently retries the failed request.

### 4. Deduplication of In-Flight Requests & Strict Mode Guards

- **Why**: React 19 Strict Mode mounts components twice in development. Concurrent calls to `/api/profile/me` wasted network bandwidth, and multiple calls to `/api/auth/verify-email?token=...` burned single-use tokens, causing invalid token errors on the second hit.
- **Solution**:
  - Store-level in-flight promise caching (`activeCheckAuthPromise`, `activeFetchProfilePromise`) merges simultaneous requests into one.
  - Component-level `useRef` guards prevent single-use email verification tokens from firing more than once per page visit.

### 5. Dependency Inversion Principle (DIP) & Container

- **Why**: Having components directly call `fetch` or Axios tightly couples UI with transport logic.
- **Solution**: The UI only talks to Use Cases, Use Cases only depend on Domain Interfaces (`AuthRepository`), and `container.ts` wires the concrete implementations (`AuthRepositoryImpl`). Any network client or backend can be swapped with zero UI changes.

---

## 🧪 Available Scripts

| Script          | Command         | Purpose                                          |
| :-------------- | :-------------- | :----------------------------------------------- |
| **Development** | `npm run dev`   | Runs the Next.js development server on port 3000 |
| **Build**       | `npm run build` | Builds the production bundle                     |
| **Start**       | `npm run start` | Runs the production server                       |
| **Lint**        | `npm run lint`  | Checks code with ESLint                          |
