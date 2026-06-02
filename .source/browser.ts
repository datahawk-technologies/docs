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
  welcome: create.doc("welcome", {"explore-datahawk.mdx": () => import("../content/welcome/explore-datahawk.mdx?collection=welcome"), "getting-started.mdx": () => import("../content/welcome/getting-started.mdx?collection=welcome"), "index.mdx": () => import("../content/welcome/index.mdx?collection=welcome"), }),
};
export default browserCollections;