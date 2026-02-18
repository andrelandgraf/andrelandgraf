#!/usr/bin/env bun
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';

type Environment = 'development' | 'preview' | 'production';

type Args = {
  file: string;
  environment: Environment;
  scope?: string;
};

const IGNORED_KEYS = new Set(['VERCEL', 'VERCEL_ENV']);
const IGNORED_PREFIXES = ['VERCEL_', 'NX_', 'TURBO_'];

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const result: Partial<Args> = {};

  for (const arg of args) {
    if (arg.startsWith('--file=')) {
      result.file = arg.split('=')[1];
    } else if (arg.startsWith('--environment=')) {
      const environment = arg.split('=')[1];
      if (environment === 'development' || environment === 'preview' || environment === 'production') {
        result.environment = environment;
      } else {
        throw new Error(`Invalid environment: ${environment}`);
      }
    } else if (arg.startsWith('--scope=')) {
      result.scope = arg.split('=')[1];
    }
  }

  if (!result.file) {
    throw new Error('Missing --file argument');
  }

  if (!result.environment) {
    throw new Error('Missing --environment argument');
  }

  return result as Args;
}

function parseDotEnv(content: string): Array<{ key: string; value: string }> {
  const envVars: Array<{ key: string; value: string }> = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    let value = match[2] ?? '';

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    envVars.push({ key, value });
  }

  return envVars;
}

function shouldSkipKey(key: string): boolean {
  if (IGNORED_KEYS.has(key)) {
    return true;
  }

  return IGNORED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

async function runVercelEnvAdd(args: Args, key: string, value: string): Promise<void> {
  const cmdArgs = ['env', 'add', key, args.environment, '--force', '--yes'];
  if (args.scope) {
    cmdArgs.push('--scope', args.scope);
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn('vercel', cmdArgs, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stderr = '';
    let stdout = '';

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`vercel env add failed for ${key} (exit ${code}). ${stdout}\n${stderr}`));
    });

    child.stdin.write(value);
    child.stdin.end();
  });
}

async function main() {
  const args = parseArgs();
  const envFilePath = path.resolve(process.cwd(), args.file);
  const fileContents = await readFile(envFilePath, 'utf-8');
  const allVars = parseDotEnv(fileContents);

  const variables = allVars.filter(({ key }) => !shouldSkipKey(key));
  const skipped = allVars.filter(({ key }) => shouldSkipKey(key)).map(({ key }) => key);

  if (variables.length === 0) {
    console.log(`No variables to push from ${args.file} (${args.environment})`);
    return;
  }

  console.log(`Pushing ${variables.length} variables from ${args.file} to ${args.environment}...`);
  for (const { key, value } of variables) {
    await runVercelEnvAdd(args, key, value);
    console.log(`  updated ${key}`);
  }

  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} system-managed keys.`);
  }

  console.log('Environment push complete.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
