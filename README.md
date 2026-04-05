# Nexum

Single-source Jekyll website for `leowajda.github.io`.

## Architecture

- `packages/theme/src`: shared Jekyll theme source copied from `no-style-please` and evolved here.
- `packages/ui/src`: shared browser modules written in TypeScript with Effect.
- `site-src/`: content and site-specific overrides.
- `tools/src`: Effect CLI for generating the buildable Jekyll source under `site/`.
- `sources/`: git submodules for project content.

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
