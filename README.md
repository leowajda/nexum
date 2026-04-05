# Nexum

## Architecture

```mermaid
architecture-beta
  group authoring(cloud)[Authoring Inputs]
  service content(disk)[Theme, site content, manifests] in authoring
  service sourceRepos(internet)[Source repos] in authoring
  service browserUi(server)[packages/ui/src] in authoring

  group build(server)[Effect CLI Pipeline]
  service cli(server)[tools/src/main.ts] in build
  service generate(server)[tools/src/programs/generate.ts] in build
  service assets(server)[tools/src/core/assets.ts] in build

  group publish(cloud)[Published Site]
  service siteDir(disk)[site/] in publish
  service jekyllBuild(server)[bundle exec jekyll build] in publish
  service pages(cloud)[_site / GitHub Pages] in publish

  content:R --> L:generate
  sourceRepos:R --> L:generate
  cli:B --> T:generate
  browserUi:R --> L:assets
  generate:B --> T:siteDir
  assets:B --> T:siteDir
  siteDir:B --> T:jekyllBuild
  jekyllBuild:B --> T:pages
```
