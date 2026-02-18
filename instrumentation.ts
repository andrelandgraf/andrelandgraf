import './app/modules/config/events.ts';
import './app/modules/config/main.ts';
import './app/modules/config/observability.ts';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config.ts');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config.ts');
  }
}
