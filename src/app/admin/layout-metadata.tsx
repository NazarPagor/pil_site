import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Адмін-панель',
};

export default function AdminLayoutMetadata({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 