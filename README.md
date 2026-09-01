# green-property

Fullstack property listing web app. Next.js (App Router, TypeScript) + Sanity (CMS for content / studio), deployed on Vercel.

## Stack

- **Frontend & Backend**: Next.js 16 (App Router, TypeScript, Tailwind CSS, ESLint)
- **CMS**: Sanity Studio embedded at `/studio` (company profile, testimonials, partner logos, properties)
- **Deployment**: Vercel (with Sanity as the content backend)

## Getting started

### 0. Prerequisites

- Node.js 20.9+ (this repo was created with v22)
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

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Run Sanity Studio

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
| `npm run sanity:dev`     | Run Sanity Studio standalone                  |

## Environment variables used

| Variable | Source | Required for |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity manage → Project → Settings → Project ID | Sanity client + Studio |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity manage → Project → Datasets (e.g. `production`) | Sanity client + Studio |
| `SANITY_API_TOKEN` | Sanity manage → Project → API → Tokens → Add API token | Server-only write access |

## Project structure

```
app/
  (site)/                     # public-facing pages (properties, home, etc.)
  studio/[[...tool]]/page.tsx # embedded Sanity Studio at /studio
  layout.tsx, globals.css
components/                   # UI components (PropertyCard, SiteHeader, etc.)
lib/
  sanity/
    client.ts                 # Sanity fetch client (groq) + server token client
    data.ts                   # data-fetching helpers
sanity/
  sanity.config.ts            # Studio config (basePath /studio)
  sanity.cli.ts               # CLI config for `sanity:dev`
  schema.ts                   # schema registry
  schemas/                    # companyProfile, testimonial, partnerLogo, property, ...
types/                        # shared TS types
```

## Next steps

1. Fill in `.env` from the Sanity dashboard.
2. Run `npm run dev` and open `/`.
3. Open `/studio` to add content (company profile, testimonials, partner logos, properties).
4. Proceed to the UI design phase.
