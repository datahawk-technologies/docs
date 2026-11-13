// Run after bundling and before publishing these exact assets.
const { spawnSync } = require('node:child_process');
const path = require('node:path');
if (!process.env.POSTHOG_CLI_API_KEY) {
  console.warn('PostHog source maps were not uploaded: configure POSTHOG_CLI_API_KEY in the build environment.');
  process.exit(0);
}
const directory = process.argv[2];
if (!directory) throw new Error('A build output directory is required');
const env = { ...process.env, POSTHOG_CLI_HOST: 'https://eu.posthog.com', POSTHOG_CLI_PROJECT_ID: '154758' };
const cli = path.join(process.cwd(), 'node_modules/@posthog/cli/run-posthog-cli.js');
const result = spawnSync(process.execPath, [cli, 'sourcemap', 'process', '--directory', directory, '--delete-after'], { stdio: 'inherit', env });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
