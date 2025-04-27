import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="Подільський пілігрим"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <span className="ml-3 text-xl font-semibold">
                Подільський пілігрим
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Організація паломницьких подорожей до святих місць України та світу.
              Духовні подорожі, екскурсії та паломництва.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Швидкі посилання</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Про нас
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors">
                  Поїздки
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">
                  Галерея
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-400 hover:text-white transition-colors">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакти</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="tel:+380964649967" className="hover:text-white transition-colors">
                  +38 (096) 46-49-967
      
                </a>
              </li>
              <li>
                <a href="mailto:podilskiypiligrim@gmail.com" className="hover:text-white transition-colors">
                  podilskiypiligrim@gmail.com
                </a>
              </li>
              {/* <li>м. Хмельницький</li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Паломницький центр "Подільський пілігрим". Всі права захищено.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}; 