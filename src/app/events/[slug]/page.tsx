import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import MainLayout from '@/components/layout/MainLayout';

// Динамічний імпорт компонента з контентом
const EventDetailPageContent = dynamic(() => import('@/components/events/EventDetailPageContent'), {
  loading: () => <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div></div>,
  ssr: true
});

type Props = {
  params: { slug: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events/${params.slug}`);
    const event = await response.json();
    
    return {
      title: event.title,
      description: event.description?.substring(0, 160) || 'Детальна інформація про подію паломництва',
      openGraph: {
        title: event.title,
        description: event.description?.substring(0, 160) || 'Детальна інформація про подію паломництва',
        images: [event.coverImage],
      },
    };
  } catch {
    return {
      title: 'Подія паломництва',
      description: 'Детальна інформація про подію паломництва',
    };
  }
};

export default function EventDetailPage({ params }: Props) {
  return (
    <MainLayout>
      <EventDetailPageContent eventId={params.slug} />
    </MainLayout>
  );
} 