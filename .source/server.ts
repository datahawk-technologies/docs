// @ts-nocheck
import { default as __fd_glob_19 } from "../content/welcome/explore-datahawk/meta.json?collection=welcome"
import { default as __fd_glob_18 } from "../content/welcome/getting-started/meta.json?collection=welcome"
import { default as __fd_glob_17 } from "../content/welcome/meta.json?collection=welcome"
import * as __fd_glob_16 from "../content/welcome/explore-datahawk/market-intelligence.mdx?collection=welcome"
import * as __fd_glob_15 from "../content/welcome/explore-datahawk/index.mdx?collection=welcome"
import * as __fd_glob_14 from "../content/welcome/explore-datahawk/finance-operations.mdx?collection=welcome"
import * as __fd_glob_13 from "../content/welcome/explore-datahawk/amazon-vendor.mdx?collection=welcome"
import * as __fd_glob_12 from "../content/welcome/explore-datahawk/amazon-seller.mdx?collection=welcome"
import * as __fd_glob_11 from "../content/welcome/explore-datahawk/advertizing.mdx?collection=welcome"
import * as __fd_glob_10 from "../content/welcome/getting-started/quick-start.mdx?collection=welcome"
import * as __fd_glob_9 from "../content/welcome/getting-started/index.mdx?collection=welcome"
import * as __fd_glob_8 from "../content/welcome/getting-started/before-starting.mdx?collection=welcome"
import * as __fd_glob_7 from "../content/welcome/pricing.mdx?collection=welcome"
import * as __fd_glob_6 from "../content/welcome/index.mdx?collection=welcome"
import * as __fd_glob_5 from "../content/troubleshooting/index.mdx?collection=troubleshooting"
import { default as __fd_glob_4 } from "../content/troubleshooting/meta.json?collection=troubleshooting"
import * as __fd_glob_3 from "../content/help-center/index.mdx?collection=helpCenter"
import { default as __fd_glob_2 } from "../content/help-center/meta.json?collection=helpCenter"
import { default as __fd_glob_1 } from "../content/api-reference/meta.json?collection=apiReference"
import * as __fd_glob_0 from "../content/api-reference/index.mdx?collection=apiReference"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const apiReference = await create.docs("apiReference", "content/api-reference", {"meta.json": __fd_glob_1, }, {"index.mdx": __fd_glob_0, });

export const helpCenter = await create.docs("helpCenter", "content/help-center", {"meta.json": __fd_glob_2, }, {"index.mdx": __fd_glob_3, });

export const troubleshooting = await create.docs("troubleshooting", "content/troubleshooting", {"meta.json": __fd_glob_4, }, {"index.mdx": __fd_glob_5, });

export const welcome = await create.docs("welcome", "content/welcome", {"meta.json": __fd_glob_17, "getting-started/meta.json": __fd_glob_18, "explore-datahawk/meta.json": __fd_glob_19, }, {"index.mdx": __fd_glob_6, "pricing.mdx": __fd_glob_7, "getting-started/before-starting.mdx": __fd_glob_8, "getting-started/index.mdx": __fd_glob_9, "getting-started/quick-start.mdx": __fd_glob_10, "explore-datahawk/advertizing.mdx": __fd_glob_11, "explore-datahawk/amazon-seller.mdx": __fd_glob_12, "explore-datahawk/amazon-vendor.mdx": __fd_glob_13, "explore-datahawk/finance-operations.mdx": __fd_glob_14, "explore-datahawk/index.mdx": __fd_glob_15, "explore-datahawk/market-intelligence.mdx": __fd_glob_16, });