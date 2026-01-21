import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chaos Stories',
  description: 'A mobile-first interactive story game with timed choices',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
