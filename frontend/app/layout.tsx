import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CorpTech — Portal Corporativo',
  description: 'Portal interno CorpTech S.A.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, fontFamily: '-apple-system, Arial, sans-serif', background: '#f0f2f5' }}>
        {children}
      </body>
    </html>
  );
}
