import './globals.css';
import MainLayout from '@/components/layout/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Паломницький центр',
  description: 'Офіційний сайт паломницького центру',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
