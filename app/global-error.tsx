'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6">
        <main className="w-full max-w-xl rounded-lg border border-white/20 bg-white/5 p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-white/80 mb-6">
            An unexpected error occurred. The issue has been reported and you can retry the page now.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-white/10 px-4 py-2 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
