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
 * "Read more" links to /help-center/glossary#<key-lowercased>
 * so the full entry's heading must match. Glossary headings use the same
 * casing as displayed in the page (e.g., "### ASIN — Amazon Standard...").
 */

export type GlossaryEntry = {
  title: string;
  short: string;
  /**
   * Optional override for the tooltip's "Read more" link.
   * When set, the link points to this URL instead of the default
   * `/help-center/glossary#<key>` anchor.
   * Use this to route foundational concepts (ASIN, SKU, BSR, etc.)
   * to their richer Key Concepts page entry.
   */
  readMore?: string;
};

export const glossary: Record<string, GlossaryEntry> = {
  // ─── Amazon platform ──────────────────────────────────────────────────
  ASIN: {
    title: 'Amazon Standard Identification Number',
    short: "Unique 10-character product ID Amazon assigns to every product. ASINs are marketplace-specific — the same physical product sold on Amazon.com (US) and Amazon.co.uk (UK) has a different ASIN in each country.",
    readMore: '/help-center/data-metrics-guides/key-concepts#asin--what-it-is-and-why-it-matters',
  },
  'PARENT ASIN': {
    title: 'Parent ASIN',
    short: 'A virtual container ASIN that groups related product variations (sizes, colors, packs). Not directly purchasable — only its child ASINs are.',
    readMore: '/help-center/data-metrics-guides/key-concepts#parent-asins-and-child-asins--understanding-product-variants',
  },
  'CHILD ASIN': {
    title: 'Child ASIN',
    short: 'A specific, purchasable variation under a parent ASIN — for example, the blue size-M t-shirt within a parent that groups all sizes and colors.',
    readMore: '/help-center/data-metrics-guides/key-concepts#parent-asins-and-child-asins--understanding-product-variants',
  },
  SKU: {
    title: 'Stock Keeping Unit',
    short: 'Your internal product identifier — assigned by you, not by Amazon. Each ASIN can have multiple SKUs across sellers and fulfillment channels; each SKU maps to exactly one ASIN.',
    readMore: '/help-center/data-metrics-guides/key-concepts#sku--your-internal-product-reference',
  },
  FNSKU: {
    title: 'Fulfillment Network SKU',
    short: "Amazon's internal identifier for items inside FBA warehouses. Generated when you create an FBA shipment.",
  },
  MARKETPLACE: {
    title: 'Marketplace',
    short: 'A regional Amazon storefront (Amazon US, UK, DE, JP, etc.). Each has its own catalog, currency, advertising rules, and tax treatment.',
    readMore: '/help-center/data-metrics-guides/key-concepts#marketplace-vs-channel',
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
    short: 'A metric that measures advertising efficiency by comparing ad spend to ad-attributed revenue. Used to evaluate the success of ad campaigns. See the dashboard page for the formula used in that view.',
  },
  TACOS: {
    title: 'Total Advertising Cost of Sales',
    short: "A metric that measures advertising spend against total revenue (both organic and ad-attributed). Used to gauge advertising's overall impact on the business. See the dashboard page for the formula used in that view.",
  },
  ROAS: {
    title: 'Return on Ad Spend',
    short: 'A metric that measures ad-attributed revenue per dollar of ad spend. The inverse of ACoS — used to evaluate ad campaign profitability. See the dashboard page for the formula used in that view.',
  },
  DSP: {
    title: 'Demand Side Platform',
    short: "Amazon's programmatic advertising platform for display, video, and audio ads. Different from Sponsored Ads.",
  },
  DPV: {
    title: 'Detail Page View',
    short: "A view of a product's detail page on Amazon. A core conversion-funnel metric. See the dashboard page for context-specific attribution rules (e.g. DSP uses a 14-day post-click window).",
  },
  DPVR: {
    title: 'Detail Page View Rate',
    short: "The number of detail page views relative to the number of impressions.",
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
    short: "A product's ranking within its Amazon category, based on recent sales velocity. Updated hourly by Amazon, captured daily by DataHawk. Lower number = better seller.",
    readMore: '/help-center/data-metrics-guides/key-concepts#bsr--best-seller-rank',
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
  'SALES ESTIMATES': {
    title: 'Sales Estimates',
    short: "DataHawk's modeled estimates of units and revenue for Amazon products, based on rank and price signals. These are estimates, not Amazon-reported sales — they won't exactly match Seller Central.",
    readMore: '/help-center/data-metrics-guides/amz-sales-estimates',
  },
  LQS: {
    title: 'Listing Quality Score',
    short: "A 0–100 score reflecting how well an Amazon listing follows best practices for titles, images, bullets, and content. Computed daily by DataHawk from 25+ criteria.",
    readMore: '/help-center/data-metrics-guides/listing-quality-analysis',
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
  SOURCING: {
    title: 'Sourcing View (Vendor)',
    short: "The Vendor account view where Amazon sources your products but you're not their manufacturer. DataHawk sees partial data because Amazon limits what it shares for sourced ASINs.",
    readMore: '/help-center/data-metrics-guides/amz-vendor-account-sourcing-manufacturing',
  },
  MANUFACTURING: {
    title: 'Manufacturing View (Vendor)',
    short: "The Vendor account view where you're the manufacturer of the products. DataHawk sees full sales, traffic, and inventory data for these ASINs.",
    readMore: '/help-center/data-metrics-guides/amz-vendor-account-sourcing-manufacturing',
  },
  '1P': {
    title: '1P — First-Party (Vendor)',
    short: 'You sell wholesale to the marketplace (Amazon Vendor Central); they resell to consumers at prices they control.',
  },
  '3P': {
    title: '3P — Third-Party (Seller)',
    short: 'You sell directly to consumers using the marketplace as a platform (Amazon Seller Central, Walmart Marketplace).',
  },

  // ─── Time-comparison & change metrics ─────────────────────────────────
  BPS: {
    title: 'Basis Points (bps)',
    short: 'Absolute change in percentage points. 100 bps = 1 percentage point.',
  },
  POP: {
    title: 'Period over Period',
    short: 'Relative difference of a measure between two consecutive periods. Monthly view means Month over Month (MoM); weekly view means Week over Week (WoW). Can be expressed as absolute value (PoP Abs) or percentage (PoP %).',
  },
  YOY: {
    title: 'Year over Year',
    short: "Relative difference of a measure in the selected period vs the same period last year (e.g., January 2024 vs January 2023).",
  },

  // ─── Core ad metrics ──────────────────────────────────────────────────
  'AD SPEND': {
    title: 'Ad Spend',
    short: 'Total amount spent on advertising campaigns in a given time frame.',
  },
  'AD SALES': {
    title: 'Ad Sales',
    short: 'Total revenue generated from sales attributed to advertising campaigns.',
  },
  'AD SALES SAME SKU': {
    title: 'Ad Sales Same SKU',
    short: 'Revenue generated from advertising-attributed sales of the same product that was promoted in the ad.',
  },
  'AD SALES OTHER SKU': {
    title: 'Ad Sales Other SKU',
    short: 'Revenue generated from advertising-attributed sales of products other than the one promoted in the ad (halo effect).',
  },
  IMPRESSIONS: {
    title: 'Impressions',
    short: 'Number of times an ad is displayed to users on a webpage, app, or platform.',
  },
  CLICKS: {
    title: 'Clicks',
    short: 'Number of times users click on an ad.',
  },
  CTR: {
    title: 'Click-Through Rate',
    short: 'A metric that measures how often viewers click an ad after seeing it. Used to evaluate ad creative quality and targeting relevance. See the dashboard page for the formula used in that view.',
  },
  CPC: {
    title: 'Cost Per Click',
    short: 'A metric that measures the cost paid each time a user clicks on an ad. Used to compare ad cost efficiency across campaigns. See the dashboard page for the formula used in that view.',
  },
  CVR: {
    title: 'Conversion Rate',
    short: 'A metric that measures how often ad clicks result in a purchase. Used to evaluate landing-page quality and product-market fit. See the dashboard page for the formula used in that view.',
  },
  'NEW TO BRAND SALES': {
    title: 'New-to-Brand Sales',
    short: 'Revenue generated from purchases by first-time brand shoppers attributed to advertising. Available for Sponsored Brands, Sponsored Display, and DSP campaigns.',
  },

  // ─── Traffic & sales metrics ──────────────────────────────────────────
  'GLANCE VIEWS': {
    title: 'Glance Views',
    short: 'Number of views to a Vendor product detail page. Calculated at ASIN level, and only when Retail is the featured seller.',
  },
  'PAGE VIEWS': {
    title: 'Page Views',
    short: 'Total number of times product detail pages are viewed during the selected period. Multiple views by the same user are counted.',
  },
  SESSIONS: {
    title: 'Sessions',
    short: 'Number of unique visits to your Amazon listings within a 24-hour period. Multiple pages viewed by the same shopper count as a single session.',
  },
  ASP: {
    title: 'Average Selling Price',
    short: 'A metric that measures the average price per unit sold over a period. Used to track pricing strategy and product-mix shifts. The basis (Seller vs Vendor) changes the formula — see the dashboard page for the version used in that view.',
  },
  'ORDERED REVENUE': {
    title: 'Ordered Revenue',
    short: "A metric that measures the total retail value of consumer demand on Amazon, regardless of whether the products have shipped. On the Vendor side this reflects Amazon's retail price per unit. See the dashboard page for the formula used in that view.",
  },
  'RETURN RATE': {
    title: 'Return Rate',
    short: 'A metric that measures the proportion of sold products returned by customers. Used to evaluate product quality and listing accuracy. See the dashboard page for the formula used in that view.',
  },

  // ─── Market analysis ──────────────────────────────────────────────────
  'PRICE BAND': {
    title: 'Price Band',
    short: 'A price range bracket (e.g. $50–100, $100–150) used to segment the market for analysis. The step size for each band is configured in the dashboard Parameters settings alongside your warehouse connection.',
  },
};
