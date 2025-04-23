'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Головна', href: '/' },
  { name: 'Про нас', href: '/about' },
  { name: 'Поїздки', href: '/events' },
  { name: 'Галерея', href: '/gallery' },
  { name: 'Контакти', href: '/contacts' },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-warmGray-50">
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-white/60 backdrop-blur-md py-4'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Подільський пілігрим"
                  width={60}
                  height={60}
                  className="h-14 w-auto mr-3"
                />
                <span className={`text-2xl font-bold transition-colors duration-300 ${
                  scrolled ? 'text-primary-700' : 'text-primary-600'
                }`}>
                  Подільський пілігрим
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? 'text-primary-700 font-semibold'
                      : 'text-warmGray-800 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-warmGray-600 hover:text-primary-600 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Відкрити меню</span>
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 animate-fade-in">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-warmGray-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        <div className="mx-auto pt-24">
          {children}
        </div>
      </main>

      <footer className="bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
              
                <Image
                  src="/logo.png"
                  alt="Подільський пілігрим"
                  width={60}
                  height={60}
                  className="h-14 w-auto mr-3"
                />
                <h3 className="text-2xl font-semibold">Подільський пілігрим</h3>
              </div>
              <p className="text-primary-200">
                Організовуємо духовні подорожі до святих місць для зближення з вірою та традиціями.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Контакти</h3>
              <address className="not-italic">
                <p className="mb-2">м. Хмельницький</p>
                <p className="mb-2">Телефон: +380 (12) 345-67-89</p>
                <p>Email: info@pilgrim.com.ua</p>
              </address>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Швидкі посилання</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-primary-200 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-700 text-center text-primary-200 pt-2">
            <p>© {new Date().getFullYear()} Паломницький центр "Подільський пілігрим".</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 