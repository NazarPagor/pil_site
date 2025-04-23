'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayoutMetadata from './layout-metadata';

// Цей лайаут впливає тільки на адмін-панель і не використовує глобальний лайаут
// Metadata cannot be exported from a client component
// export const metadata = {
//   title: 'Адмін-панель',
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShowNavigation, setIsShowNavigation] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make the request to the check-auth endpoint to verify the hash
        const response = await fetch('/api/admin/check-auth');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // If authentication fails, redirect to login
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Перевіряємо, чи збережений у локальному сховищі стан згорнутості бічної панелі
    const savedCollapseState = localStorage.getItem('adminSidebarCollapsed');
    if (savedCollapseState) {
      setIsCollapsed(savedCollapseState === 'true');
    }

    checkAuth();
  }, [router]);

  useEffect(() => {
    if(!isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated]);

  useEffect(()=>{
    if(isAuthenticated){
      setIsShowNavigation(true);
    }
  }, [isAuthenticated, router])

  // Зберігаємо стан згорнутості бічної панелі у локальне сховище
  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  if (isLoading) {
    return (
      <AdminLayoutMetadata>
        <html lang="uk">
          <body>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                <p className="mt-4 text-primary-800 font-medium">Завантаження...</p>
              </div>
            </div>
          </body>
        </html>
      </AdminLayoutMetadata>
    );
  }

  const navigationItems = [
    { href: '/admin', label: 'Дашборд', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: '/admin/events', label: 'Заходи', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { href: '/admin/gallery', label: 'Галерея', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    // { href: '/admin/pages', label: 'Сторінки', icon: (
    //   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    //   </svg>
    // )},
    { href: '/admin/settings', label: 'Налаштування', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  return (
    <AdminLayoutMetadata>
      <html lang="uk">
        <body>
          <div className="min-h-screen flex bg-gray-50">
            {isShowNavigation ? (
              <>
                {/* Sidebar - Desktop */}
                <div className={`fixed top-0 bottom-0 left-0 z-30 hidden md:flex md:flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
                  <div className="flex flex-col w-full h-full border-r border-gray-200 bg-white shadow-sm">
                    {/* Кнопка згортання бічної панелі */}
                    <button 
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      className="absolute -right-3 top-20 w-6 h-6 bg-primary-100 rounded-full border border-primary-300 flex items-center justify-center text-primary-700 hover:bg-primary-200 transition-colors z-10"
                      aria-label={isCollapsed ? "Розгорнути панель" : "Згорнути панель"}
                    >
                      <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-200`}>
                      <Link href="/admin" className={`${isCollapsed ? 'text-center w-full' : 'text-xl'} font-bold text-primary-800 flex items-center`}>
                        <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {!isCollapsed && <span className="ml-2">Адмін-панель</span>}
                      </Link>
                    </div>
                    
                    <div className="flex-grow flex flex-col py-6 overflow-y-auto">
                      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} space-y-2`}>
                        {navigationItems.map((item) => {
                          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`group flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-2 rounded-md transition-all ${
                                isActive
                                  ? 'bg-primary-100 text-primary-800'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                              title={isCollapsed ? item.label : undefined}
                            >
                              <span className={`${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'}`}>
                                {item.icon}
                              </span>
                              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                            </Link>
                          );
                        })}
                      </nav>
                    </div>
                    
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                      <div className="flex-shrink-0 w-full group block">
                        <Link href="/" className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'text-left px-3'} py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors mb-2`} target="_blank" title={isCollapsed ? 'Відкрити сайт' : undefined}>
                          <svg className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 text-gray-500 group-hover:text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {!isCollapsed && <span>Відкрити сайт</span>}
                        </Link>
                        <button
                          onClick={async () => {
                            await fetch('/api/admin/logout', { method: 'POST' });
                            router.push('/admin/login');
                          }}
                          className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'text-left px-3'} py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors`}
                          title={isCollapsed ? 'Вийти з системи' : undefined}
                        >
                          <svg className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 text-gray-500 group-hover:text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {!isCollapsed && <span>Вийти з системи</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile header and menu */}
                <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between h-16 px-4">
                    <Link href="/admin" className="text-xl font-bold text-primary-800 flex items-center">
                      <svg className="w-8 h-8 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="truncate max-w-[180px]">
                        {pathname === '/admin' 
                          ? 'Адмін-панель' 
                          : navigationItems.find(item => pathname?.startsWith(item.href) && item.href !== '/admin')?.label || 'Адмін-панель'}
                      </span>
                    </Link>
                    <div className="flex items-center space-x-3">
                      <Link href="/" className="text-gray-500 p-2 rounded-full hover:bg-gray-100 hover:text-gray-700" target="_blank" aria-label="Відкрити сайт">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        className="text-gray-500 p-2 rounded-full hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
                      >
                        {isMobileMenuOpen ? (
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {isMobileMenuOpen && (
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg animate-slide-in-top">
                      {navigationItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                              isActive
                                ? 'bg-primary-100 text-primary-800'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'}`}>
                              {item.icon}
                            </span>
                            {item.label}
                          </Link>
                        );
                      })}
                      <button
                        onClick={async () => {
                          await fetch('/api/admin/logout', { method: 'POST' });
                          router.push('/admin/login');
                        }}
                        className="flex items-center w-full px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        <svg className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Вийти з системи
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile bottom navigation */}
                <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-sm">
                  <div className="grid grid-cols-4 h-16">
                    {navigationItems.slice(0, 4).map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex flex-col items-center justify-center transition-colors ${
                            isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span className={isActive ? 'text-primary-600' : 'text-gray-500'}>
                            {item.icon}
                          </span>
                          <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}

            {/* Main content */}
            <div className={`flex flex-col flex-1 ${isShowNavigation ? (isCollapsed ? 'md:ml-20' : 'md:ml-64') : ''}`}>
              {/* Верхня панель навігації для поточного розділу */}
              {isShowNavigation && pathname !== '/admin' && (
                <div className="hidden md:block sticky top-0 bg-white border-b border-gray-200 shadow-sm z-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                      <div className="flex">
                        <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </Link>
                        <span className="ml-4 text-lg font-medium text-gray-900">
                          {navigationItems.find(item => pathname?.startsWith(item.href) && item.href !== '/admin')?.label || 'Адміністрування'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {/* Швидкі дії в залежності від поточного розділу */}
                        {pathname?.startsWith('/admin/events') && (
                          <Link href="/admin/events/new" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Створити подію
                          </Link>
                        )}
                        {pathname?.startsWith('/admin/gallery') && (
                          <Link href="/admin/gallery/new" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Створити галерею
                          </Link>
                        )}
                        <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center space-x-1" target="_blank">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="text-sm">Відкрити сайт</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <main className="flex-1 overflow-y-auto pt-16 pb-20 md:pb-10 md:pt-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </div>
              </main>

              {/* Мобільна кнопка швидкої дії (FAB) */}
              {isShowNavigation && (
                <>
                  {pathname?.startsWith('/admin/events') && !pathname?.includes('/new') && (
                    <Link 
                      href="/admin/events/new"
                      className="md:hidden fixed right-6 bottom-20 z-30 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center"
                      aria-label="Створити подію"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </Link>
                  )}
                  {pathname?.startsWith('/admin/gallery') && !pathname?.includes('/new') && (
                    <Link 
                      href="/admin/gallery/new"
                      className="md:hidden fixed right-6 bottom-20 z-30 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center"
                      aria-label="Створити галерею"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </body>
      </html>
    </AdminLayoutMetadata>
  );
} 