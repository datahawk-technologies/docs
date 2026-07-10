/**
 * Legacy Notion → Fumadocs URL redirects.
 *
 * These map old Notion-hosted docs.datahawk.co URLs to the new Fumadocs paths.
 * Activated when the ENABLE_NOTION_REDIRECTS env var is set to "true".
 * See next.config.mjs for the wiring.
 *
 * To add a new mapping: append an entry below. Keep `from` as the EXACT URL path
 * (everything after docs.datahawk.co/), case-sensitive. Keep `to` as the destination
 * URL on the new Fumadocs site.
 *
 * Do not add duplicate query-string variants from Notion copy links. Next.js
 * matches redirects by path, so query variants of a legacy URL are covered by
 * the same canonical entry.
 */

export const notionRedirects = [
  // ── Connect tools ────────────────────────────────────────────────────────
  { from: '/bigquery', to: '/help-center/connect-tools/bigquery' },
  { from: '/connect-to-excel', to: '/help-center/connect-tools/excel' },
  { from: '/connect-to-google-sheets', to: '/help-center/connect-tools/google-sheets' },
  { from: '/destinations-overview', to: '/help-center/connect-tools' },
  { from: '/download-power-bi-templates', to: '/help-center/connect-tools/powerbi-templates-library' },
  { from: '/Connect-to-Looker-Studio-3414aa5f57fa80d69a35fd905eb4aed8', to: '/help-center/connect-tools/looker-studio' },
  { from: '/Connect-to-Power-BI-3414aa5f57fa80219889fd5d0743535d', to: '/help-center/connect-tools/powerbi' },
  { from: '/snowflake', to: '/help-center/connect-tools/snowflake' },
  { from: '/writable-database-service', to: '/help-center/connect-tools/writable-database' },

  // ── Data setup ───────────────────────────────────────────────────────────
  { from: '/Amazon-Private-Data-Advertising-Account-3294aa5f57fa803a87eced06037be162', to: '/help-center/data-setup/ads-account' },
  { from: '/Public-Data-Categories-Amazon-only-32e4aa5f57fa80079bbdc418e0c528e5', to: '/help-center/data-setup/categories-tracking' },
  { from: '/upload-amazon-product-expenses', to: '/help-center/data-setup/cogs-amz-upload' },
  { from: '/Walmart-Private-Data-Connect-3304aa5f57fa809c81f6e9454ebce5f5', to: '/help-center/data-setup/connect-account' },
  { from: '/Public-Data-Keywords-32e4aa5f57fa8016aadbdefc3b82f25a', to: '/help-center/data-setup/keywords-tracking' },
  { from: '/Walmart-Private-Data-Marketplace-3304aa5f57fa80b58cdbc16629dcbbbe', to: '/help-center/data-setup/marketplace-account' },
  { from: '/on-demand-sources', to: '/help-center/data-setup/on-demand-sources' },
  { from: '/Public-Data-Products-32e4aa5f57fa8025bf50f822fd59236a', to: '/help-center/data-setup/products-tracking' },
  { from: '/Amazon-Private-Data-Seller-Account-3294aa5f57fa803f9153cf761bc95d4f', to: '/help-center/data-setup/seller-account' },
  { from: '/add-product-or-keyword-tags', to: '/help-center/data-setup/tags' },
  { from: '/Amazon-Private-Data-Vendor-Account-3294aa5f57fa80949bdef08e390e94ae', to: '/help-center/data-setup/vendor-account' },

  // ── DataHawk app ─────────────────────────────────────────────────────────
  { from: '/Manage-your-Account-33b4aa5f57fa801e9f98cf4822282f93', to: '/help-center/datahawk-app/account-management' },
  { from: '/DataHawk-WebApp-33b4aa5f57fa80b08999f30f618abb86', to: '/help-center/datahawk-app' },
  { from: '/Manage-members-33b4aa5f57fa801d835eeddad8abcc36', to: '/help-center/datahawk-app/members-management' },
  { from: '/Stripe-Subscription-Management-33c4aa5f57fa805db405c39e74e861f8', to: '/help-center/datahawk-app/subscription-management' },
  { from: '/Workspace-Management-33b4aa5f57fa805dae69d3dff08a18da', to: '/help-center/datahawk-app/workspace-management' },

  // ── Help center root ─────────────────────────────────────────────────────
  // Root `/` is intentionally not redirected — that's the new docs homepage.
  { from: '/get-in-touch', to: '/help-center/contact' },

  // ── Knowledge hub ────────────────────────────────────────────────────────
  { from: '/Amazon-Advertising-Models-2a04aa5f57fa80d49294cbf78495d839', to: '/help-center/data-reference/amazon-advertising-data' },
  { from: '/search-query-performance-data', to: '/help-center/data-reference/amz-brand-analytics-data' },
  { from: '/Amazon-Vendor-Account-Sourcing-vs-Manufacturing-View-32d4aa5f57fa807ba469c7a59af4a74e', to: '/help-center/data-metrics-guides/foundation/key-concepts#amazon-vendor-views-sourcing-vs-manufacturing' },
  { from: '/Amazon-DataHawk-Reports-2f04aa5f57fa80a5b9dfe034202ed249', to: '/help-center/data-reference/amz-datahawk-reports' },
  { from: '/inventory-documentation', to: '/help-center/data-reference/amz-inventory-data' },
  { from: '/product-pricing-intelligence', to: '/help-center/data-metrics-guides/content/amz-product-pricing-offers-intelligence' },
  { from: '/removal-data', to: '/help-center/data-reference/amz-removal-data' },
  { from: '/amazon-replenishment-subscribe-save-performance-forecast', to: '/help-center/data-metrics-guides/inventory/subscribe-save-performance-forecast' },
  { from: '/amazon-returns-data', to: '/help-center/data-reference/amz-returns-data' },
  { from: '/amazon-sales-estimates', to: '/help-center/data-metrics-guides/competition/amz-sales-estimates' },
  { from: '/seller-profit-data', to: '/help-center/data-reference/amz-seller-profit-data' },
  { from: '/Amazon-Seller-Profit-Reading-Your-Reports-33b4aa5f57fa8030ac92e201a546e618', to: '/help-center/data-metrics-guides/finance/profitability-analysis' },
  { from: '/automated-competitors-detection', to: '/help-center/data-metrics-guides/competition/auto-competitors-detection' },
  { from: '/recipes-convert-currencies', to: '/help-center/data-reference/convert-currencies' },
  { from: '/daily-exchange-rate-dataset', to: '/help-center/data-reference/daily-exchange-rate-dataset' },
  { from: '/datasets-models', to: '/help-center/data-reference/find-tables-and-columns' },
  { from: '/How-DataHawk-Sources-Your-Data-33e4aa5f57fa81b1a8beffff7a716b69', to: '/help-center/data-metrics-guides/foundation/how-datahawk-sources-data' },
  { from: '/Key-Concepts-33e4aa5f57fa8197841bd9c7c1548921', to: '/help-center/data-metrics-guides/foundation/key-concepts' },
  { from: '/keyword-research', to: '/help-center/data-metrics-guides/search/keyword-research' },
  { from: '/keyword-search-volume', to: '/help-center/data-metrics-guides/search/keyword-research' },
  { from: '/listing-quality-analysis', to: '/help-center/data-metrics-guides/content/listing-quality-analysis' },

  // ── Looker Studio ────────────────────────────────────────────────────────
  { from: '/looker-studio-template', to: '/help-center/dashboard-templates/looker-studio' },
  { from: '/client-level-looker-studio-dashboards', to: '/help-center/dashboard-templates/looker-studio/white-label' },

  // ── Modules: AI Copywriter ───────────────────────────────────────────────
  { from: '/Best-practices-for-AI-Copywriter-3524aa5f57fa81698d8fdca7b9f646bc', to: '/help-center/modules/ai-copywriter/best-practices' },
  { from: '/Amazon-compliance-guidelines-3524aa5f57fa8169953fe6878a5912ba', to: '/help-center/modules/ai-copywriter/compliance-guidelines' },
  { from: '/AI-Copywriter-FAQ-roadmap-3524aa5f57fa815b863ee1c072d05edb', to: '/help-center/modules/ai-copywriter/faq-troubleshooting' },
  { from: '/AI-Copywriter-overview-3524aa5f57fa81a3865ac74dd2408470', to: '/help-center/modules/ai-copywriter' },
  { from: '/Limits-quotas-3524aa5f57fa811e8120d9f8777de9e5', to: '/help-center/modules/ai-copywriter/limits' },
  { from: '/Optimise-your-first-listing-3524aa5f57fa81249213ed68d11ca4e5', to: '/help-center/modules/ai-copywriter/optimize' },

  // ── Modules: Alerts ──────────────────────────────────────────────────────
  { from: '/Create-your-first-alert-3524aa5f57fa818a818ce8d59114e946', to: '/help-center/modules/alerts/create' },
  { from: '/Custom-triggers-3524aa5f57fa8167a955d9f98430e34c', to: '/help-center/modules/alerts/custom-triggers' },
  { from: '/Alerts-FAQ-troubleshooting-3524aa5f57fa8163869afb9ecd576407', to: '/help-center/modules/alerts/faq-troubleshooting' },
  { from: '/Alerts-overview-3524aa5f57fa817da199e4e746d0c965', to: '/help-center/modules/alerts' },
  { from: '/Manage-alerts-3524aa5f57fa81c2aa26ca6151dd04cd', to: '/help-center/modules/alerts/manage-alerts' },
  { from: '/Recipient-groups-email-setup-3524aa5f57fa8114a5c4dbced3856ba3', to: '/help-center/modules/alerts/recipient-groups' },
  { from: '/Triggers-properties-reference-3524aa5f57fa813aa64fcf81d28c2aa6', to: '/help-center/modules/alerts/triggers' },

  // ── Modules: DataHawk MCP ────────────────────────────────────────────────
  { from: '/MCP-Frequently-Asked-Questions-FAQ-3524aa5f57fa80089bb1d8bdccfb7fca', to: '/help-center/modules/datahawkmcp/faq-troubleshooting' },
  { from: '/Going-further-with-the-MCP-3524aa5f57fa80d894b4f766586b0ef1', to: '/help-center/modules/datahawkmcp/going-further' },
  { from: '/What-is-DataHawk-MCP-3524aa5f57fa802b9c49da6c7cdb6a02', to: '/help-center/modules/datahawkmcp' },
  { from: '/Ready-to-use-prompts-3524aa5f57fa807d9ee7e81fbcc164fd', to: '/help-center/modules/datahawkmcp/ready-prompts' },
  { from: '/Set-up-DataHawk-MCP-3524aa5f57fa80558224f376bd4a7000', to: '/help-center/modules/datahawkmcp/setup' },
  { from: '/How-to-write-effective-MCP-prompts-35d4aa5f57fa802f91f3dcee668a5f2a', to: '/help-center/modules/datahawkmcp/write-prompts' },

  // ── Modules: overview ────────────────────────────────────────────────────
  { from: '/DataHawk-Modules-Which-One-Should-I-Use-3524aa5f57fa800b803dca0c8acf1416', to: '/help-center/modules' },

  // ── Retired module pages ─────────────────────────────────────────────────
  { from: '/Anomalies-explained-3524aa5f57fa81819931e348336eaefc', to: '/changelog/2026-06-30-insights-module-retired' },
  { from: '/Get-started-with-Insights-in-5-minutes-3524aa5f57fa8188aabaf48ee43ab5da', to: '/changelog/2026-06-30-insights-module-retired' },
  { from: '/insights-faq-troubleshooting', to: '/changelog/2026-06-30-insights-module-retired' },
  { from: '/Findings-explained-3524aa5f57fa814da4f1f8a42b608d6b', to: '/changelog/2026-06-30-insights-module-retired' },
  { from: '/Good-Practices-explained-3524aa5f57fa8172b9d1fe8b86bc5eb3', to: '/changelog/2026-06-30-insights-module-retired' },
  { from: '/Insights-overview-3524aa5f57fa815cb80debfaa5cb8a09', to: '/changelog/2026-06-30-insights-module-retired' },
  { from: '/Triaging-collaboration-3524aa5f57fa8176afade23564f3ffdf', to: '/changelog/2026-06-30-insights-module-retired' },

  // ── Modules: Sherlock ────────────────────────────────────────────────────
  { from: '/Navigate-through-Ad-Spend-Drop-35f4aa5f57fa815b86b1d80c5c0f6f73', to: '/help-center/modules/sherlock/ad-spend-drop' },
  { from: '/Navigate-through-Buy-Box-Loss-35f4aa5f57fa81c1b46de78dc1c0711a', to: '/help-center/modules/sherlock/buybox-loss' },
  { from: '/Navigate-through-FBA-Stockout-35f4aa5f57fa81e482a8e03b8ab28a66', to: '/help-center/modules/sherlock/fba-stockout' },
  { from: '/What-is-Sherlock-35f4aa5f57fa8176a01fe8d116e9a92c', to: '/help-center/modules/sherlock' },
  { from: '/Meet-Sherlock-the-AI-Powered-Diagnostic-Engine-for-your-Amazon-Business-3124aa5f57fa8073ba30e3cd72eae08e', to: '/help-center/modules/sherlock' },
  { from: '/Navigate-through-Price-CVR-Drop-35f4aa5f57fa81848c87f2308afa2bda', to: '/help-center/modules/sherlock/price-cvr-drop' },
  { from: '/Navigate-through-Return-Anomalies-35f4aa5f57fa8163b9ccd4a646f71743', to: '/help-center/modules/sherlock/return-anomalies' },
  { from: '/Navigate-through-Signals-35f4aa5f57fa81afb5f0fe0713de72c4', to: '/help-center/modules/sherlock/signals' },
  { from: '/Navigate-through-Zombie-Ad-Spend-35f4aa5f57fa81e38f89c50c4924a5fc', to: '/help-center/modules/sherlock/zombie-ad-spend' },

  // ── Power BI dashboards ──────────────────────────────────────────────────
  { from: '/ads-dsp-dashboard-documentation', to: '/help-center/dashboard-templates/power-bi/ads-dsp-dashboard' },
  { from: '/advertising-dashboard-user-guide', to: '/help-center/dashboard-templates/power-bi/advertising-dashboard' },
  { from: '/market-intelligence-dashboard-user-guide', to: '/help-center/dashboard-templates/power-bi/market-intelligence-dashboard' },
  { from: '/product-dashboard-user-guide', to: '/help-center/dashboard-templates/power-bi/product-dashboard' },
  { from: '/seller-analytics-dashboard-user-guide', to: '/help-center/dashboard-templates/power-bi/seller-analytics-dashboard' },
  { from: '/Seller-Vendor-Analytics-Dashboard-3864aa5f57fa8075b32febcb689194cb', to: '/help-center/dashboard-templates/power-bi/seller-vendor-analytics-dashboard' },
  { from: '/master-vendor-dashboard-user-guide', to: '/help-center/dashboard-templates/power-bi/vendor-analytics-dashboard' },

  // ── Tips & advanced use ──────────────────────────────────────────────────
  // CSV had these two URL→file mappings swapped; corrected by inspecting the
  // MDX frontmatter titles.
  { from: '/build-something-new', to: '/help-center/tips-advanced-use/build-something-new' },
  { from: '/user-guide-creating-power-bi-alerts-in-power-automate', to: '/help-center/tips-advanced-use/alerts-automation' },

  // ── Troubleshooting ──────────────────────────────────────────────────────
  // Troubleshooting was reorganized from a flat help-center/troubleshooting/*
  // tree into top-level /troubleshooting/<category>/*. Mapped to the current
  // file locations (see next.config.mjs for additional internal redirects).
  { from: '/accessing-our-snowflake-database-from-behind-a-firewall', to: '/troubleshooting/connection-failures/accessing-our-snowflake-database-from-behind-a-firewall' },
  { from: '/Ads-data-appearing-under-the-wrong-Account-Type-Seller-vs-Vendor-3294aa5f57fa8008b23afa81e49a4435', to: '/troubleshooting/data-discrepancies/ads-data-appearing-under-the-wrong-account-type' },
  { from: '/I-cannot-see-data-in-manufacturing-views-but-I-see-it-in-sourcing-32d4aa5f57fa808db8f8fe8d38b8462f', to: '/troubleshooting/data-discrepancies/manufacturing-vs-sourcing-views' },
  { from: '/I-don-t-see-Data-after-connecting-my-DSP-Account-32e4aa5f57fa80caa8a5c9880a09c7d4', to: '/troubleshooting/connection-failures/no-data-after-dsp-connect' },
  { from: '/I-want-to-restrict-DataHawk-Access-to-Specific-DSP-Profiles-32e4aa5f57fa801295f0c1e382d8e4fb', to: '/troubleshooting/access-permissions/i-want-to-restrict-datahawk-access-to-specific-dsp-profiles' },
  { from: '/My-advertising-data-is-not-populating-33c4aa5f57fa8029a603f1d07e4fdb30', to: '/troubleshooting/data-not-refreshing/my-advertising-data-is-not-populating' },

  // ── Welcome ──────────────────────────────────────────────────────────────
  // The Explore-DataHawk Notion page was split into seven sub-pages in the
  // new docs; redirect the single legacy URL to the section's index.
  { from: '/Explore-DataHawk-3644aa5f57fa80c1ad06c51f19922c2e', to: '/welcome/explore-datahawk' },
  { from: '/Before-You-Start-33b4aa5f57fa80b88726e6c26d1cc057', to: '/welcome/getting-started/before-starting' },
  { from: '/Quick-Start-Guide-33b4aa5f57fa803b803ae52cc74daed1', to: '/welcome/getting-started/quick-start' },
  { from: '/welcome-datahawk', to: '/welcome' },
];
