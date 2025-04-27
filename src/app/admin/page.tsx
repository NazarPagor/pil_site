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
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  const statsCards = [
    { 
      title: 'Заходи',
      count: stats.eventsCount,
      icon: <FaCalendarAlt className="w-8 h-8 text-primary-600" />,
      href: '/admin/events',
      bgClass: 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200',
      iconBgClass: 'bg-primary-200 text-primary-700',
      actionText: 'Керувати заходами',
    },
    {
      title: 'Галереї',
      count: stats.galleriesCount,
      icon: <FaFileAlt className="w-8 h-8 text-secondary-600" />,
      href: '/admin/gallery',
      bgClass: 'bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200',
      iconBgClass: 'bg-secondary-200 text-secondary-700',
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
      icon: <FaPlusCircle className="w-6 h-6 text-white" />,
      href: '/admin/events/new',
      bgClass: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
    },
    { 
      title: 'Створити нову галерею',
      description: 'Додайте нову галерею з фотографіями та описом',
      icon: <FaPlusCircle className="w-6 h-6 text-white" />,
      href: '/admin/gallery/new',
      bgClass: 'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800',
    },
    { 
      title: 'Редагувати налаштування',
      description: 'Змініть загальні налаштування сайту',
      icon: <FaCog className="w-6 h-6 text-white" />,
      href: '/admin/settings',
      bgClass: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900',
    },
  ];

  // Отримання поточного часу для привітання
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Доброго ранку';
    if (hour >= 12 && hour < 1) return 'Доброго дня';
    return 'Доброго вечора';
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-8">
      {/* Заголовок з привітанням */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{greeting}!</h1>
        <p className="mt-2 text-gray-600">
          Ласкаво просимо до адміністративної панелі паломницького центру.
        </p>
      </div>

      {/* Статистика */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Статистика контенту</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {statsCards.map((card, index) => (
            <div key={index} className={`rounded-lg border shadow-sm overflow-hidden ${card.bgClass}`}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${card.iconBgClass}`}>
                    {card.icon}
                  </div>
                  <div className="ml-5">
                    <div className="text-3xl font-bold text-gray-900">
                      {card.count}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {card.title}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href={card.href}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    {card.actionText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Швидкі дії */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Швидкі дії</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`${action.bgClass} p-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 text-white flex flex-col h-full`}
            >
              <div className="rounded-full bg-white/20 p-3 mb-4 w-fit">
                {action.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-white/80 text-sm mt-auto">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Додаткова інформаційна секція */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Корисна інформація</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Для ефективної роботи:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Регулярно оновлюйте інформацію на сайті</li>
              <li>Завжди додавайте якісні зображення</li>
              <li>Перевіряйте коректність інформації перед публікацією</li>
              <li>Використовуйте зрозумілі назви для подій та галерей</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 