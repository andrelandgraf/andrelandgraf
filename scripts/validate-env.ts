#!/usr/bin/env bun
import { loadEnvConfig } from '@next/env';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

function parseEnvironmentArg(): 'development' | 'production' | 'test' {
  const arg = process.argv.find((value) => value.startsWith('--environment='));
  const parsed = arg?.split('=')[1];
  if (parsed === 'production' || parsed === 'test' || parsed === 'development') {
    return parsed;
  }
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production' || nodeEnv === 'test') {
    return nodeEnv;
  }
  return 'development';
}

async function validate() {
  const environment = parseEnvironmentArg();
  (process.env as Record<string, string | undefined>).NODE_ENV = environment;

  console.log(bold('\nEnvironment Configuration Validator\n'));
  console.log(dim(`  Environment: ${environment}`));

  const isDev = environment === 'development';
  const { loadedEnvFiles } = loadEnvConfig(process.cwd(), isDev);

  if (loadedEnvFiles.length > 0) {
    console.log(dim('\n  Loaded env files:'));
    for (const file of loadedEnvFiles) {
      console.log(dim(`    - ${path.relative(process.cwd(), file.path)}`));
    }
  } else {
    console.log(dim('\n  No .env files loaded'));
  }

  const configModules = [
    './app/modules/config/main.ts',
    './app/modules/config/events.ts',
    './app/modules/config/observability.ts',
    './app/modules/env.server.ts',
  ];

  console.log(dim('\n  Validating config modules:\n'));
  let hasError = false;
  for (const modulePath of configModules) {
    const absolutePath = path.resolve(process.cwd(), modulePath);
    try {
      await import(pathToFileURL(absolutePath).href);
      console.log(green(`  ✓ ${modulePath}`));
    } catch (error: unknown) {
      hasError = true;
      const message = error instanceof Error ? error.message : String(error);
      console.log(red(`  ✗ ${modulePath}`));
      console.log(red(`    ${message.split('\n')[0]}`));
    }
  }

  if (hasError) {
    console.log(red('\nEnvironment validation failed.\n'));
    process.exit(1);
  }

  console.log(green('\nEnvironment validation passed.\n'));
}

validate().catch((error: unknown) => {
  console.error(red('Unexpected validation error'));
  console.error(error);
  process.exit(1);
});
