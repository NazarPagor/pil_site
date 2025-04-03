'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaUsers, FaFileAlt, FaEnvelope, FaCog, FaDoorOpen, FaPlusCircle } from 'react-icons/fa';

interface DashboardStats {
  eventsCount: number;
  galleriesCount: number;
  // pagesCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    eventsCount: 0,
    galleriesCount: 0,
    // pagesCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statsCards = [
    { 
      title: 'Заходи',
      count: stats.eventsCount,
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/events',
      bgClass: 'bg-primary-200',
      actionText: 'Керувати заходами',
    },
    {
      title: 'Галереї',
      count: stats.galleriesCount,
      icon: (
        <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/gallery',
      bgClass: 'bg-secondary-200',
      actionText: 'Керувати галереями',
    },
    // {
    //   title: 'Сторінки',
    //   count: stats.pagesCount,
    //   icon: (
    //     <svg className="w-8 h-8 text-secondary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    //     </svg>
    //   ),
    //   href: '/admin/pages',
    //   bgClass: 'bg-secondary-100',
    //   actionText: 'Керувати сторінками',
    // },
  ];

  const quickActions = [
    { 
      title: 'Створити новий захід',
      description: 'Додайте новий захід з описом, датами, ціною та зображенням',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      href: '/admin/events/new',
      bgClass: 'bg-primary-600 hover:bg-primary-700',
    },
    { 
      title: 'Створити нову галерею',
      description: 'Додайте нову галерею з фотографіями та описом',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      href: '/admin/gallery/new',
      bgClass: 'bg-secondary-600 hover:bg-secondary-700',
    },
    { 
      title: 'Редагувати налаштування',
      description: 'Змініть загальні налаштування сайту',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/admin/settings',
      bgClass: 'bg-primary-800 hover:bg-primary-900',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-800">Панель керування</h1>
        <p className="mt-2 text-warmGray-600">
          Огляд та керування контентом сайту паломницького центру
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className={`${card.bgClass} rounded-lg overflow-hidden shadow-sm`}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {card.icon}
                </div>
                <div className="ml-5">
                  <div className="text-2xl font-bold text-warmGray-900">
                    {card.count}
                  </div>
                  <div className="text-sm font-medium text-warmGray-600">
                    {card.title}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href={card.href}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
                >
                  {card.actionText}
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Швидкі дії */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-warmGray-900">Швидкі дії</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`${action.bgClass} p-5 rounded-lg shadow-md transition-colors text-white flex items-start`}
            >
              <div className="rounded-full bg-white/20 p-2 mr-4">
                {action.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{action.title}</h3>
                <p className="text-white/80 text-sm mt-1">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 