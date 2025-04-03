'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShowNavigation, setIsShowNavigation] = useState(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
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
    <div className="min-h-screen flex bg-warmGray-50">
    {isShowNavigation ? <>
       {/* Sidebar */}
       <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-warmGray-200 bg-white">
          <div className="h-16 flex items-center px-6 border-b border-warmGray-200">
            <Link href="/admin" className="text-xl font-bold text-primary-800">
              Адмін-панель
            </Link>
          </div>
          <div className="flex-grow flex flex-col py-4 overflow-y-auto">
            <nav className="flex-1 px-4 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-warmGray-600 hover:bg-warmGray-100 hover:text-warmGray-900'
                    }`}
                  >
                    <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-warmGray-500 group-hover:text-warmGray-600'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-warmGray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <button
                onClick={async () => {
                  await fetch('/api/admin/logout', { method: 'POST' });
                  router.push('/admin/login');
                }}
                className="flex items-center w-full text-left px-3 py-2 text-sm font-medium rounded-md text-warmGray-600 hover:bg-warmGray-100 hover:text-warmGray-900"
              >
                <svg className="mr-3 h-5 w-5 text-warmGray-500 group-hover:text-warmGray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Вийти з системи
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-warmGray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/admin" className="text-xl font-bold text-primary-800">
            Адмін-панель
          </Link>
          <button
            type="button"
            className="text-warmGray-500 hover:text-warmGray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

        {isMobileMenuOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1 animate-slide-in-top">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-warmGray-600 hover:bg-warmGray-100 hover:text-warmGray-900'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-warmGray-500 group-hover:text-warmGray-600'}`}>
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
              className="flex items-center w-full px-3 py-2 text-base font-medium rounded-md text-warmGray-600 hover:bg-warmGray-100 hover:text-warmGray-900"
            >
              <svg className="mr-3 h-5 w-5 text-warmGray-500 group-hover:text-warmGray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Вийти з системи
            </button>
          </div>
        )}
      </div>
    </> : null}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 