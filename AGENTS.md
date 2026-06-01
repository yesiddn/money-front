# OpenCode Instructions: money-front

## Tech Stack & Tooling
- **Framework:** Angular 20 (Standalone Components)
- **Styling/UI:** Tailwind CSS v4, PrimeNG
- **Package Manager:** `pnpm` (Required. Do not use `npm` or `yarn`)

## Project Conventions (Crucial)
- **Component Naming:** This project **rejects** the standard Angular `.component` suffix convention.
  - **Files:** Use `name.ts`, `name.html`, `name.css` (e.g., `accounts.ts`, NOT `accounts.component.ts`).
  - **Classes:** Omit the `Component` suffix (e.g., `export class Accounts`, NOT `AccountsComponent`).
- **State:** Use Angular Signals (`signal`, `set`, `update`) as the primary reactivity model. RxJS is generally reserved for HTTP operations.
- **Path Aliases:** Always use TypeScript aliases for imports:
  - `@app/*` -> `src/app/*`
  - `@env/*` -> `src/environments/*`
  - `@transactions/*` -> `src/app/transactions/*`

## Architecture & Workflows
- **Authenticated HTTP Requests:** The project uses a custom HTTP interceptor for tokens. Any API call requiring authentication **must** explicitly pass the `checkToken()` context:
  ```typescript
  import { checkToken } from '@app/interceptors/token-interceptor';
  
  this.http.get(`${this.apiURL}/api/data/`, { context: checkToken() })
  ```
- **Manual API Caching:** See `ManageAccounts` (`src/app/accounts/manage-accounts.ts`) for the established pattern of caching HTTP responses manually combining Signals and RxJS `shareReplay(1)`.

## Commands
- **Install:** `pnpm install`
- **Dev Server:** `pnpm start` (or `ng serve`)
- **Build:** `pnpm build`
- **Test:** `pnpm test`