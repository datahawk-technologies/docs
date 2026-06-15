/**
 * Central glossary definitions for the <Term> tooltip component.
 *
 * Installed at: lib/glossary.ts
 * Used by:      components/Term.tsx
 *
 * To add a new term: add an entry below. Keep `short` to 1–2 sentences.
 * Authors write <Term>ASIN</Term> in MDX; the component looks up the
 * uppercased key here, renders a dotted-underline span with a hover
 * tooltip showing { title, short, "Read more" link }.
 *
 * "Read more" links to /help-center/knowledge-hub/glossary#<key-lowercased>
 * so the full entry's heading must match. Glossary headings use the same
 * casing as displayed in the page (e.g., "### ASIN — Amazon Standard...").
 */

export type GlossaryEntry = {
  title: string;
  short: string;
};

export const glossary: Record<string, GlossaryEntry> = {
  // ─── Amazon platform ──────────────────────────────────────────────────
  ASIN: {
    title: 'Amazon Standard Identification Number',
    short: 'Unique 10-character product ID Amazon assigns to every product. Same ASIN works across all marketplaces.',
  },
  SKU: {
    title: 'Stock Keeping Unit',
    short: 'Your internal product identifier. Each ASIN can have multiple SKUs across sellers and fulfillment channels.',
  },
  FNSKU: {
    title: 'Fulfillment Network SKU',
    short: "Amazon's internal identifier for items inside FBA warehouses. Generated when you create an FBA shipment.",
  },
  MARKETPLACE: {
    title: 'Marketplace',
    short: 'A regional Amazon storefront (Amazon US, UK, DE, JP, etc.). Each has its own catalog, currency, and rules.',
  },

  // ─── Fulfillment ──────────────────────────────────────────────────────
  FBA: {
    title: 'Fulfillment by Amazon',
    short: 'Amazon stores, picks, packs, and ships your inventory. You ship to Amazon warehouses; Amazon handles the rest.',
  },
  FBM: {
    title: 'Fulfillment by Merchant',
    short: 'You store and ship your own inventory directly to customers. Used for oversized items or sellers with their own logistics.',
  },
  MFN: {
    title: 'Merchant Fulfilled Network',
    short: "Amazon's official API term for FBM. Used in report and table names.",
  },
  SNS: {
    title: 'Subscribe & Save',
    short: "Amazon's recurring subscription program. Sellers offer a small discount in exchange for predictable repeat sales.",
  },

  // ─── Advertising ──────────────────────────────────────────────────────
  ACOS: {
    title: 'Advertising Cost of Sales',
    short: 'Ad spend ÷ ad sales, as a percentage. Lower = more efficient ads. 15–25% is typical for healthy performance.',
  },
  TACOS: {
    title: 'Total Advertising Cost of Sales',
    short: 'Ad spend ÷ total sales (organic + ad). Measures advertising drag on overall revenue.',
  },
  ROAS: {
    title: 'Return on Ad Spend',
    short: 'Ad sales ÷ ad spend. Inverse of ACoS. Higher = better. ROAS of 5 means $1 of ad spend made $5 of ad sales.',
  },
  DSP: {
    title: 'Demand Side Platform',
    short: "Amazon's programmatic advertising platform for display, video, and audio ads. Different from Sponsored Ads.",
  },
  DPV: {
    title: 'Detail Page View',
    short: "A view of a product's detail page. A core conversion-funnel metric.",
  },
  NTB: {
    title: 'New-to-Brand',
    short: "Amazon's metric for first-time purchases of a brand within a rolling 12-month window. Measures brand-building effectiveness.",
  },
  SOV: {
    title: 'Share of Voice',
    short: "Your brand's percentage of visibility for a given search query or category. Can be organic, sponsored, or combined.",
  },
  SP: {
    title: 'Sponsored Products',
    short: "Amazon's PPC ad type targeting individual keywords or products. The most common ad type.",
  },
  SB: {
    title: 'Sponsored Brands',
    short: 'Brand-builder ad type with a headline, logo, and product carousel at the top of search results. Requires brand registry.',
  },
  SD: {
    title: 'Sponsored Display',
    short: 'Display ad type that appears on product detail pages and off-Amazon. Programmatic placements.',
  },

  // ─── Finance & Profit ─────────────────────────────────────────────────
  COGS: {
    title: 'Cost of Goods Sold',
    short: 'The amount you paid to manufacture or buy the products you sold. Uploaded into DataHawk for profit calculations.',
  },
  VAT: {
    title: 'Value Added Tax',
    short: 'A consumption tax used in the EU and UK. In some marketplaces VAT is included in prices; in others added at checkout.',
  },
  'BUY BOX': {
    title: 'Buy Box (Featured Offer)',
    short: 'The default offer shown on a product page. Winning the Buy Box typically captures 80–90% of that product\'s sales.',
  },

  // ─── Search & SEO ─────────────────────────────────────────────────────
  BSR: {
    title: 'Best Sellers Rank',
    short: "A product's ranking within its Amazon category, updated hourly. Lower number = better seller.",
  },
  SQP: {
    title: 'Search Query Performance',
    short: "Amazon's report showing how individual search queries contribute to product performance across the customer journey. Brand-registry required.",
  },

  // ─── DataHawk concepts ────────────────────────────────────────────────
  MCP: {
    title: 'Model Context Protocol',
    short: 'An open standard for connecting AI assistants (Claude, ChatGPT, n8n, etc.) to DataHawk data so you can ask questions in plain English.',
  },
  WORKSPACE: {
    title: 'Workspace',
    short: 'Your isolated environment in DataHawk. Each workspace has its own data, settings, connected accounts, and members.',
  },
  WSID: {
    title: 'Workspace ID',
    short: 'A numeric identifier for your DataHawk workspace (e.g., 84497). Always include in support tickets — helps us find your account fast.',
  },
  SHERLOCK: {
    title: 'DataHawk Sherlock',
    short: "DataHawk's AI diagnostic module. Surfaces root causes for performance changes ('why did sales on ASIN X drop?').",
  },
  CAPACITY: {
    title: 'Capacity',
    short: 'Your subscription limit for tracked products, keywords, categories, or accounts. Set by your DataHawk plan.',
  },

  // ─── Technical & Data ─────────────────────────────────────────────────
  SNOWFLAKE: {
    title: 'Snowflake',
    short: 'A cloud data warehouse. DataHawk delivers your data into a Snowflake share you can query directly or connect to BI tools.',
  },
  BIGQUERY: {
    title: 'BigQuery',
    short: "Google Cloud's data warehouse. DataHawk supports BigQuery delivery as an alternative to Snowflake.",
  },
  OAUTH: {
    title: 'OAuth',
    short: 'The authentication protocol used to connect your Amazon, Walmart, or BI accounts to DataHawk without sharing passwords.',
  },
  'SP-API': {
    title: 'Selling Partner API',
    short: "Amazon's modern API for Seller and Vendor data. Replaced the older MWS (Marketplace Web Service).",
  },

  // ─── Vendor-specific ──────────────────────────────────────────────────
  '1P': {
    title: '1P — First-Party (Vendor)',
    short: 'You sell wholesale to the marketplace (Amazon Vendor Central); they resell to consumers at prices they control.',
  },
  '3P': {
    title: '3P — Third-Party (Seller)',
    short: 'You sell directly to consumers using the marketplace as a platform (Amazon Seller Central, Walmart Marketplace).',
  },
};
