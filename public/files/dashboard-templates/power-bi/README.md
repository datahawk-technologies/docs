# Power BI template assets

Power BI templates are hosted as assets on the public [`power-bi-templates` GitHub Release](https://github.com/datahawk-technologies/docs/releases/tag/power-bi-templates). Local `.pbix` files in this folder are ignored by Git and serve only as a staging area for release uploads.

Each asset has a stable download URL:

`https://github.com/datahawk-technologies/docs/releases/download/power-bi-templates/<filename>`

## Updating a template

1. Replace the local file at its existing path, keeping the same filename.
2. Upload it to the release with `gh release upload power-bi-templates public/files/dashboard-templates/power-bi/<filename> --clobber --repo datahawk-technologies/docs`.
3. Update the Version and Changes columns for that row in `content/help-center/connect-tools/powerbi-templates-library.mdx`.
4. Commit the documentation change and open a PR. The `.pbix` file remains ignored.

## Adding a new template

1. Add the local `.pbix` file here using the naming pattern `<template-slug>-dashboard.pbix` (lowercase, hyphenated).
2. Upload it with `gh release upload power-bi-templates public/files/dashboard-templates/power-bi/<filename> --repo datahawk-technologies/docs`.
3. Add a row to `powerbi-templates-library.mdx` using the stable release download URL and enter the release date in the Version column.

## Current assets

- seller-analytics-dashboard.pbix
- product-dashboard.pbix
- search-dashboard.pbix
- advertising-dashboard.pbix
- market-intelligence-dashboard.pbix
- vendor-analytics-dashboard.pbix
- seller-vendor-analytics-dashboard.pbix
- ads-dsp-dashboard.pbix
- seller-finances-supply-chain-dashboard.pbix
