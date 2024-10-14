// deno-lint-ignore-file no-explicit-any
import { useEffect } from 'react';

function useTwitterEmbeds() {
  useEffect(() => {
    if ((window as any).twttr) {
      (window as any).twttr.widgets.load();
    }
  }, []);
}

export { useTwitterEmbeds };
