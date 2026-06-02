// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
var welcome = defineDocs({
  dir: "content/welcome"
});
var helpCenter = defineDocs({
  dir: "content/help-center"
});
var troubleshooting = defineDocs({
  dir: "content/troubleshooting"
});
var apiReference = defineDocs({
  dir: "content/api-reference"
});
var source_config_default = defineConfig();
export {
  apiReference,
  source_config_default as default,
  helpCenter,
  troubleshooting,
  welcome
};
