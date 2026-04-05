# Nexum

## Architecture

Nexum builds the website in two stages.

1. The Effect CLI reads source repositories, copies the shared theme and site content, generates project-specific data and pages, builds the browser bundles, and writes the final Jekyll input into `site/`.
2. Jekyll renders `site/` into `_site/`, which is what GitHub Pages deploys.

Main directories:

- `packages/theme/src`: shared Jekyll layouts, includes, and styles.
- `packages/ui/src`: shared browser code written in TypeScript with Effect.
- `site-src/`: root pages, posts, and site-specific Jekyll source files.
- `tools/src`: Effect CLI and generation logic.
- `projects/`: project manifests that describe what Nexum should ingest.
- `sources/`: git submodules for project source repositories.
- `site/`: generated Jekyll source, rebuilt on every generation step.
- `_site/`: final rendered static site output.

## Local development

```bash
pnpm install
bundle config set --local path vendor/bundle
bundle install
git submodule update --init --recursive
pnpm run serve
```

## Build flow

1. `pnpm generate` composes theme files, site content, generated project data, browser bundles, and vendored assets into `site/`.
2. Jekyll builds `site/` into `_site/`.
