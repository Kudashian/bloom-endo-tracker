/**
 * TEACHING NOTE: Root Layout
 * 
 * In Next.js, layout.tsx wraps all your pages.
 * Think of it like a picture frame - the frame stays the same,
 * but the picture inside (the page) changes.
 * 
 * We use this to:
 * - Load fonts globally
 * - Set HTML metadata (title, description)
 * - Provide consistent styling across all pages
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bloom - Endometriosis Tracker',
  description: 'Track symptoms, predict flares, take control of your health',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
