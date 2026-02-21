import './src/lib/events/config.ts';
import './src/lib/main/config.ts';
import './src/lib/observability/config.ts';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config.ts');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config.ts');
  }
}
