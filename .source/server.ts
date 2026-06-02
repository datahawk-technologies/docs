// @ts-nocheck
import * as __fd_glob_5 from "../content/welcome/index.mdx?collection=welcome"
import * as __fd_glob_4 from "../content/welcome/getting-started.mdx?collection=welcome"
import * as __fd_glob_3 from "../content/welcome/explore-datahawk.mdx?collection=welcome"
import * as __fd_glob_2 from "../content/troubleshooting/index.mdx?collection=troubleshooting"
import * as __fd_glob_1 from "../content/help-center/index.mdx?collection=helpCenter"
import * as __fd_glob_0 from "../content/api-reference/index.mdx?collection=apiReference"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const apiReference = await create.docs("apiReference", "content/api-reference", {}, {"index.mdx": __fd_glob_0, });

export const helpCenter = await create.docs("helpCenter", "content/help-center", {}, {"index.mdx": __fd_glob_1, });

export const troubleshooting = await create.docs("troubleshooting", "content/troubleshooting", {}, {"index.mdx": __fd_glob_2, });

export const welcome = await create.docs("welcome", "content/welcome", {}, {"explore-datahawk.mdx": __fd_glob_3, "getting-started.mdx": __fd_glob_4, "index.mdx": __fd_glob_5, });