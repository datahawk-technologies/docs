// source.config.ts
import { z } from "zod";
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
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
var changelog = defineDocs({
  dir: "content/changelog",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.coerce.string().optional(),
      tags: z.array(z.string()).optional()
    })
  }
});
var source_config_default = defineConfig();
export {
  apiReference,
  changelog,
  source_config_default as default,
  helpCenter,
  troubleshooting,
  welcome
};
