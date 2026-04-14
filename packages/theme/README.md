# Theme Source

This directory is the shared Jekyll theme source.

It started from the local `no-style-please` fork and now contains the generic layout, navigation, typography, shared Jekyll Sass assets, and reusable includes used by the site.

The live Jekyll source is `site-src/`. Theme work should be done here first, then synced into `site-src` with `pnpm theme:refresh`. The generation pipeline now writes only generated data, pages, collections, and browser assets into `site-src` instead of assembling a separate throwaway site directory for every build.
