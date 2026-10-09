# Clean Architecture with Next.js App Router & TypeScript

This project follows **Clean Architecture** principles to separate business logic, data infrastructure, and presentation logic, making the codebase highly testable, scalable, and maintainable.

---

## 🏗️ Folder Structure Overview

```text
src/
├── app/                      # Framework & Routing Layer (Next.js App Router)
│   ├── layout.tsx            # Root Layout
│   ├── page.tsx              # Home Page
│   ├── providers.tsx         # Global Context/Query Providers
│   └── users/
│       └── page.tsx          # Users Route
│
├── domain/                   # 1. Domain Layer (Core Business Rules)
│   ├── entities/             # Enterprise business entities (pure TS interfaces)
│   │   ├── user.entity.ts
│   │   └── auth.entity.ts
│   ├── repositories/         # Repository Interfaces / Contracts
│   │   ├── user.repository.ts
│   │   └── auth.repository.ts
│   └── usecases/             # Application Use Cases / Interactors
│       ├── get-users.usecase.ts
│       └── login.usecase.ts
│
├── infrastructure/           # 2. Infrastructure Layer (Data & External Services)
│   ├── api/                  # Base HTTP Client (fetch wrapper)
│   │   └── http-client.ts
│   ├── dtos/                 # Data Transfer Objects (API response types)
│   │   ├── user.dto.ts
│   │   └── auth.dto.ts
│   ├── mappers/              # DTO <-> Entity Mappers
│   │   └── user.mapper.ts
│   ├── repositories/         # Concrete Repository Implementations
│   │   ├── user.repository.impl.ts
│   │   └── auth.repository.impl.ts
│   └── di/                   # Dependency Injection Container
│       └── container.ts
│
├── presentation/             # 3. Presentation Layer (UI & View Logic)
│   ├── components/
│   │   ├── common/           # Atomic UI elements (Button, Card, Modal, etc.)
│   │   ├── layouts/          # Layout components (Header, Sidebar, Footer)
│   │   └── modules/          # Feature UI modules (UserList, LoginForm, etc.)
│   ├── hooks/                # Presenter React Hooks (interact with domain use cases)
│   │   └── useUsers.ts
│   └── store/                # Global State (Zustand / Context)
│
└── shared/                   # 4. Shared Layer (Cross-Cutting Concerns)
    ├── config/               # App & Env configuration
    ├── constants/            # Global constants
    ├── errors/               # Application & API error classes
    ├── types/                # Generic utility types
    └── utils/                # Pure utility functions (formatting, validation)
```

---

## 📌 Architecture Rules

1. **Dependency Rule**: Dependencies ONLY point inward towards the `Domain` layer:
   - `Presentation` ➔ `Domain`
   - `Infrastructure` ➔ `Domain`
   - `Domain` depends on NOTHING external.
2. **Entities**: Must be pure TypeScript interfaces or classes with zero framework imports.
3. **Repository Interfaces**: Defined in `domain/repositories/` and implemented in `infrastructure/repositories/`.
4. **Use Cases**: Each use case represents a single user interaction or business operation.
5. **Path Aliases**:
   - `@domain/*` ➔ `src/domain/*`
   - `@infrastructure/*` ➔ `src/infrastructure/*`
   - `@presentation/*` ➔ `src/presentation/*`
   - `@shared/*` ➔ `src/shared/*`
   - `@/*` ➔ `src/*`

---

## 🚀 Getting Started

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

