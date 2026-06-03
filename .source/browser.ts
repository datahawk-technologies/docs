// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  apiReference: create.doc("apiReference", {"index.mdx": () => import("../content/api-reference/index.mdx?collection=apiReference"), }),
  helpCenter: create.doc("helpCenter", {"index.mdx": () => import("../content/help-center/index.mdx?collection=helpCenter"), }),
  troubleshooting: create.doc("troubleshooting", {"index.mdx": () => import("../content/troubleshooting/index.mdx?collection=troubleshooting"), }),
  welcome: create.doc("welcome", {"index.mdx": () => import("../content/welcome/index.mdx?collection=welcome"), "pricing.mdx": () => import("../content/welcome/pricing.mdx?collection=welcome"), "getting-started/before-starting.mdx": () => import("../content/welcome/getting-started/before-starting.mdx?collection=welcome"), "getting-started/index.mdx": () => import("../content/welcome/getting-started/index.mdx?collection=welcome"), "getting-started/quick-start.mdx": () => import("../content/welcome/getting-started/quick-start.mdx?collection=welcome"), "explore-datahawk/advertizing.mdx": () => import("../content/welcome/explore-datahawk/advertizing.mdx?collection=welcome"), "explore-datahawk/amazon-seller.mdx": () => import("../content/welcome/explore-datahawk/amazon-seller.mdx?collection=welcome"), "explore-datahawk/amazon-vendor.mdx": () => import("../content/welcome/explore-datahawk/amazon-vendor.mdx?collection=welcome"), "explore-datahawk/finance-operations.mdx": () => import("../content/welcome/explore-datahawk/finance-operations.mdx?collection=welcome"), "explore-datahawk/index.mdx": () => import("../content/welcome/explore-datahawk/index.mdx?collection=welcome"), "explore-datahawk/market-intelligence.mdx": () => import("../content/welcome/explore-datahawk/market-intelligence.mdx?collection=welcome"), }),
};
export default browserCollections;