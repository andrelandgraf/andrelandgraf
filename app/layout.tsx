import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '~/styles/tailwind.css';
import '~/styles/index.css';

const metadataBase = process.env.ORIGIN?.trim() ? new URL(process.env.ORIGIN.trim()) : new URL('http://localhost:3000');

export const metadata: Metadata = {
  metadataBase,
  title: 'Andre Landgraf',
  description: 'A tech enthusiast and student who loves to develop fullstack software solutions.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
