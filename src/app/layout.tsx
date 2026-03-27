
import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'SOS Emergency',
  description: 'Instant help at your fingertips',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-primary/30">
        <LanguageProvider>
          <main className="flex-1 overflow-x-hidden pb-20">
            {children}
          </main>
          <Navigation />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
