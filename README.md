# green-property

Fullstack property listing web app. Next.js (App Router, TypeScript) + Prisma (PostgreSQL / Supabase) + Supabase (Auth & Storage) + Sanity (CMS for content / studio).

## Stack

- **Frontend & Backend**: Next.js 16 (App Router, TypeScript, Tailwind CSS, ESLint)
- **Database (ORM)**: Prisma 6 → Supabase PostgreSQL (connection pooler via `DATABASE_URL`, direct via `DIRECT_URL`)
- **Auth & File Storage**: Supabase (email/password admin auth, property-photos bucket)
- **CMS**: Sanity Studio embedded at `/studio` (company profile, testimonials, partner logos)

## Getting started

### 0. Prerequisites

- Node.js 20.9+ (this repo was created with v22)
- A Supabase project (dashboard.supabase.com)
- A Sanity project (sanity.io/manage)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the template and fill it in:

```bash
cp .env.example .env
```

Then fill in the values (see `# Environment variables used` below). **Never commit `.env`** (it is git-ignored; `.env.example` is committed as the template).

### 3. Run database migrations (Prisma)

Once `DATABASE_URL` / `DIRECT_URL` point to your Supabase database, create/apply the schema:

```bash
npm run prisma:generate
npm run prisma:migrate
```

The `prisma/migrations` folder already contains an initial migration. `prisma migrate dev` will apply it and also regenerate the client.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root page verifies the connections:

```
Supabase (Prisma/PostgreSQL) connected: OK — Property rows: N
Sanity connected: OK — companyProfile documents: N
```

If it shows `FAIL`, check that `.env` is filled in correctly (and trust the error message for details).

### 5. Run Sanity Studio

Two options:

- **Embedded** (recommended): run `npm run dev` and open [http://localhost:3000/studio](http://localhost:3000/studio)
- **Standalone**: `npm run sanity:dev` (serves the Studio on its own port)

## Scripts

| Script              | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Next.js dev server                                 |
| `npm run build`     | Production build                                   |
| `npm run start`     | Serve the production build                         |
| `npm run lint`      | ESLint                                             |
| `npm run prisma:generate` | Generate Prisma Client                       |
| `npm run prisma:migrate`  | Create/apply a Prisma migration (`migrate dev`) |
| `npm run sanity:dev`     | Run Sanity Studio standalone                  |

## Environment variables used

| Variable | Source | Required for |
| --- | --- | --- |
| `DATABASE_URL` | Supabase → Settings → Database → Connection string → **Transaction / pooler** (port 6543, with `pgbouncer=true`) | Prisma runtime queries |
| `DIRECT_URL` | Supabase → Settings → Database → Connection string → **Direct** (port 5432) | Prisma migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key | Supabase client (browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role (secret key) | Server-only admin operations |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity manage → Project → Settings → Project ID | Sanity client + Studio |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity manage → Project → Datasets (e.g. `production`) | Sanity client + Studio |
| `SANITY_API_TOKEN` | Sanity manage → Project → API → Tokens → Add API token | Server-only write access |

> For Supabase Auth, enable **Email/Password** under Authentication → Providers. Create the **`property-photos`** storage bucket under Storage (set to Public if images must be publicly viewable).

## Project structure

```
app/
  page.tsx                    # connection-verification page (placeholder, no design)
  studio/[[...tool]]/page.tsx # embedded Sanity Studio at /studio
  layout.tsx, globals.css
components/                   # (empty; UI components come in the design phase)
lib/
  prisma.ts                   # Prisma Client singleton
  supabase/
    client.ts                 # browser client
    server.ts                 # server/client + service-role client
    middleware.ts             # session-refresh helper for proxy.ts
    storage.ts                # property-photos bucket helpers
    auth.ts                   # email/password admin auth helpers
  sanity/
    client.ts                 # Sanity fetch client (groq) + server token client
prisma/
  schema.prisma               # data model
  migrations/                 # initial migration
sanity/
  sanity.config.ts            # Studio config (basePath /studio)
  sanity.cli.ts               # CLI config for `sanity:dev`
  schema.ts                   # schema registry
  schemas/                    # companyProfile, testimonial, partnerLogo
types/                        # (empty; shared TS types come later)
public/
proxy.ts                      # Next 16 proxy (session refresh) — replaces middleware.ts
```

## Next steps

1. Fill in `.env` from the Supabase & Sanity dashboards.
2. Run `npm run prisma:migrate` to create the tables.
3. Run `npm run dev` and open `/` to confirm `Supabase connected: OK` and `Sanity connected: OK`.
4. Open `/studio` to add content (company profile, testimonials, partner logos).
5. Proceed to the UI design phase.
