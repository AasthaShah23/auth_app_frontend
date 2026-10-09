import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Clean Architecture Next.js App',
  description: 'Next.js project configured with Clean Architecture and TypeScript',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-zinc-900 min-h-screen flex flex-col`}
      >
        <Providers>
          <main className="flex-1 w-full min-h-screen flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
