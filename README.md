# datahawk-docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

## Fresh Checkout Setup

Install these system dependencies before you start:

- Git, for cloning the repository.
- Node.js 20.9.0 or newer. Next.js 16 requires this minimum Node version.
- Corepack, which ships with recent Node.js releases and manages `pnpm`.

This project uses `pnpm` and the committed `pnpm-lock.yaml` file. From a fresh
checkout:

```bash
git clone <repo-url>
cd docs
corepack enable
corepack prepare pnpm@10.18.3 --activate
pnpm install --frozen-lockfile
```

`pnpm install` runs the `postinstall` script, which generates the Fumadocs MDX
source files under `.source`. No `.env` file, database, or external service is
required for local development.

The package dependencies installed by `pnpm` are:

- Next.js, React, and React DOM for the application runtime.
- Fumadocs Core, Fumadocs MDX, and Fumadocs UI for the documentation system.
- Tailwind CSS, `@tailwindcss/postcss`, PostCSS, and `tailwind-merge` for
  styling.
- TypeScript and the React/Node/MDX type packages for type checking.
- ESLint and `eslint-config-next` for linting.
- `lucide-react` for icons.

Run the development server:

```bash
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

Before opening a pull request, run the local checks:

```bash
pnpm lint
pnpm types:check
pnpm build
```

Useful scripts:

- `pnpm dev`: start the Next.js development server.
- `pnpm build`: build the production site.
- `pnpm start`: serve a production build locally.
- `pnpm lint`: run ESLint.
- `pnpm types:check`: regenerate Fumadocs/Next types and run TypeScript.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
