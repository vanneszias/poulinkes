# poulinkes

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Hono, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Hono** - Lightweight, performant server framework
- **tRPC** - End-to-end type-safe APIs
- **workers** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **Cloudflare D1** - Database engine
- **Authentication** - Better-Auth
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Poulinkes

Legkippen op abonnement met vossengarantie. Concept en businessnotities: [`docs/IDEE.md`](docs/IDEE.md).

| Route | Wat |
|---|---|
| `/` | Landingspagina: hero met naamgenerator, stappen, prijzen, vossengarantie, FAQ |
| `/namen` | Kippennaamgenerator (marketing, deelbaar, `?stijl=deftig`) |
| `/login?plan=familiekot` | Account aanmaken, daarna meteen naar Polar checkout |
| `/kot` | Klantaccount: abonnement, kippen een naam geven, vossenmeldingen |
| `/vos-melden` | Vossenclaim indienen |
| `/welkom` | Na een geslaagde checkout |

Plannen staan in `packages/api/src/plans.ts`. Regels voor claims (venster van 7 dagen, aantal per jaar) worden
server-side afgedwongen in `packages/api/src/routers/claims.ts`.

### Polar instellen

1. Maak in [Polar](https://sandbox.polar.sh) drie maandelijkse producten aan: Stadskot (€9), Familiekot (€15), Boerderijbende (€25).
2. Maak een organization access token aan.
3. Vul `apps/server/.env` in:

   ```bash
   POLAR_ACCESS_TOKEN=polar_oat_...
   POLAR_SERVER=sandbox            # production voor live
   POLAR_PRODUCT_STADSKOT=...
   POLAR_PRODUCT_FAMILIEKOT=...
   POLAR_PRODUCT_BOERDERIJBENDE=...
   ```

De success URL na betaling wordt per checkout meegegeven vanuit `POLAR_SUCCESS_URL`
(`https://poulinkes.com/welkom?checkout_id={CHECKOUT_ID}` in productie), dus in Polar zelf hoef je er geen in te stellen.

Het actieve abonnement wordt live bij Polar opgevraagd (customer state op basis van de user-ID), dus webhooks zijn nog niet nodig.

### Deployen naar poulinkes.com

```bash
bun run deploy:prod
```

Dit deployt de `prod` stage met `APP_ENV=production`, zodat `apps/server/.env.production` over `.env` gelegd wordt (niet via `NODE_ENV`: de alchemy CLI zet die altijd op `production`).
Alleen deze stage koppelt de domeinen: de site op `poulinkes.com` (`www` redirect daarheen) en de API op
`api.poulinkes.com`. DNS-records en certificaten maakt Alchemy aan in de bestaande Cloudflare-zone.
`bun run deploy` zonder `:prod` geeft een persoonlijke test-stage op `workers.dev`.

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses Cloudflare D1 (SQLite) with Drizzle ORM.

Runtime database access uses the Cloudflare `DB` binding from `packages/infra/alchemy.run.ts`. If a local `DATABASE_URL` is present, it is only for database tooling.

Alchemy provisions the D1 database and applies migrations during `deploy`.

1. Generate migration files:

```bash
bun run db:generate
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@poulinkes/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Environment Configuration

Each app owns its environment schema in `.env.schema`. Varlock generates `src/env.ts` during installation; run `bun run env:generate` after changing a schema. Commit schemas, and keep secrets in ignored env files or your deployment platform.

Import the generated `ENV` accessor in application code. Shared database and auth packages receive configuration or initialized clients from the application. See [Varlock's monorepo guide](https://varlock.dev/guides/monorepos/).

For Cloudflare, Alchemy loads and validates deployment inputs with `varlock/auto-load` in its Node/Bun deployment process. Worker code reads native bindings; web clients use the framework's public env API through `src/env.public.ts` where needed. Alchemy supplies resource URLs and managed database credentials. In-Worker Varlock protections are deferred until an official Alchemy integration is available; see [the non-Wrangler deployment guidance](https://varlock.dev/integrations/cloudflare/#non-wrangler-deploy-tools-alchemy-sst-pulumi).

Bun's automatic env loading is disabled in `bunfig.toml`; the framework integration or server bootstrap loads Varlock. Node deployments must include Varlock and its dependencies alongside the app schema.

Run standalone Node/Bun tools that use Varlock from the owning app directory so they load that app's schema and env files. `env:generate` only generates TypeScript files; it does not initialize environment values in a subsequent command.

## Deployment

### Alchemy

- Target: web on Cloudflare + server on Cloudflare
- Configure provider accounts: `cd packages/infra && bunx alchemy profile edit`
- Dev: bun run dev
- Deploy: bun run deploy
- Destroy: bun run destroy

`alchemy profile edit` stores the selected Axiom, Cloudflare, Neon, PlanetScale, and/or Prisma provider profiles under `~/.alchemy`; no provider-specific setup command is required by this scaffold.

Deploys are staged and default to a personal `dev_<username>` stage. For production, run the deploy with an explicit stage from `packages/infra`:

```bash
cd packages/infra && bunx alchemy deploy --stage production
```

### Production origins

- Required after the first deploy: set `CORS_ORIGIN` in `apps/server/.env` to the exact deployed web origin, such as `https://app.example.com`, then deploy the server again.

## Git Hooks and Formatting

- Run checks: `bun run check`

## Project Structure

```
poulinkes/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Hono, TRPC)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:generate`: Generate database client/types
- `bun run check`: Run Biome formatting and linting
