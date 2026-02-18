import { buildMetadata } from './next/lib/metadata.ts';
import { HomePage } from './next/pages/home-page.tsx';

export const metadata = buildMetadata({
  title: 'Homepage',
  description:
    'Hey there, this is my personal website and blog. I use this site to try out new things, share my knowledge, and document my journey. I hope you find something useful here!',
});

export default function Page() {
  return <HomePage />;
}
