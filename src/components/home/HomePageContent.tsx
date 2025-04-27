'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Компонент для елементів, що з'являються з анімацією при скролінгу
function AnimateOnScroll({ 
  children, 
  animation, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  animation: string; 
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${isVisible ? animation : 'opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface Testimonial {
  id: string;
  name: string;
  image: string;
  text: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image: string;
  status: string;
}

interface PopularDestination {
  title: string;
  location: string;
  image: string;
}

interface HomePageContent {
  heroTitle: string;
  heroDescription: string;
  missionTitle: string;
  missionDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  destinationsTitle: string;
  destinationsDescription: string;
  testimonialTitle: string;
  ctaTitle: string;
  ctaDescription: string;
}

export default function HomePageContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [homePage, setHomePage] = useState<HomePageContent | null>(null);
  const [popularDestinations, setPopularDestinations] = useState<PopularDestination[]>([]);
  //const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Завантаження даних
  useEffect(() => {
    async function fetchHomePageData() {
      try {
        // Отримати домашню сторінку
        const pageResponse = await fetch('/api/pages/home');
        const pageData = await pageResponse.json();
        
        if (pageData) {
          // Парсимо JSON content для отримання структурованих даних для головної сторінки
          const homeContent = JSON.parse(pageData.content);
          setHomePage(homeContent);
        }
        
        // Отримати відгуки
        const testimonialsResponse = await fetch('/api/testimonials');
        const testimonialsData = await testimonialsResponse.json();
        setTestimonials(testimonialsData);
        
        // Отримати популярні напрямки (майбутні поїздки)
        const eventsResponse = await fetch('/api/events');
        const eventsData = await eventsResponse.json();
        const upcomingData = eventsData.filter((event: Event) => event.status === 'upcoming');
        
        // Створення популярних напрямків на основі унікальних місць з подій
        const uniqueLocations = Array.from(
          new Set(upcomingData.map((event: Event) => event.location))
        ) as string[];

        const destinations: PopularDestination[] = uniqueLocations.slice(0, 3).map((location: string) => {
          const event = upcomingData.find((event: Event) => event.location === location);
          return {
            title: location.split(',')[0], 
            location: location,
            image: event?.image
          };
        });
        setPopularDestinations(destinations);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomePageData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const stats = [
    { number: "10+", label: "років досвіду" },
    { number: "500+", label: "успішних поїздок" },
    { number: "5000+", label: "задоволених паломників" },
    { number: "25+", label: "напрямків" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* Hero Section з паралакс-ефектом */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/sk2.jpg"
            alt="Паломницький центр"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
            Духовна <span className="text-primary-300">подорож</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            {homePage?.heroDescription || "Відкрийте для себе глибину духовного досвіду через паломництво з нашим центром"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-md font-medium transition-colors shadow-lg"
            >
              Найближчі поїздки
            </Link>
            <Link
              href="/contacts"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/50 px-8 py-4 rounded-md font-medium transition-colors"
            >
              Зв&apos;язатися з нами
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section з анімацією */}
      <section className="max-w-5xl mx-auto text-center px-4">
        <AnimateOnScroll animation="animate-fade-in">
          <h2 className="text-3xl font-bold mb-2 text-primary-900 drop-shadow-sm">
            Місія паломницького центру
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-warmGray-700 leading-relaxed mb-6">
            Паломницький центр виконує важливу духовну, освітню та організаційну роль у житті віруючих. Його головна місія — допомагати людям у здійсненні паломництва до святих місць, сприяти їхньому духовному зростанню та збереженню релігійних традицій.
          </p>
          <p className="text-lg text-warmGray-700 leading-relaxed mb-6">
            Паломництво — це не просто подорож, а шлях до Бога. Центр прагне зробити цю дорогу доступною для всіх, хто шукає духовного піднесення, зцілення душі та єднання з вірою.
          </p>
        </AnimateOnScroll>
      </section>

      {/* Статистика */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <AnimateOnScroll animation="animate-slide-in-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-6">
                  <p className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">{stat.number}</p>
                  <p className="text-warmGray-600 text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <AnimateOnScroll animation="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-primary-900 drop-shadow-sm">
              Основні завдання паломницького центру
            </h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mb-10">
          <AnimateOnScroll animation="animate-slide-in-left" delay={100}>
            <div className="bg-white p-8 rounded-xl shadow-lg h-full">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-900">Організація паломницьких поїздок</h3>
              <ul className="text-warmGray-600 leading-relaxed list-disc pl-5 space-y-2">
                <li>Планування маршрутів до святинь.</li>
                <li>Забезпечення комфортних та безпечних умов для паломників.</li>
                <li>Супровід духовних наставників під час поїздок.</li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-slide-in-right" delay={100}>
            <div className="bg-white p-8 rounded-xl shadow-lg h-full">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-900">Духовний супровід і просвіта</h3>
              <ul className="text-warmGray-600 leading-relaxed list-disc pl-5 space-y-2">
                <li>Проведення лекцій, семінарів та бесід на релігійні теми.</li>
                <li>Підготовка паломників до подорожі через молитву, сповідь та причастя.</li>
                <li>Ознайомлення з історією та значенням святих місць.</li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-slide-in-left" delay={200}>
            <div className="bg-white p-8 rounded-xl shadow-lg h-full">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-900">Сприяння духовному оновленню</h3>
              <ul className="text-warmGray-600 leading-relaxed list-disc pl-5 space-y-2">
                <li>Допомога у переживанні паломництва як часу молитви та покаяння.</li>
                <li>Створення можливостей для спілкування з духовенством.</li>
                <li>Організація молитовних богослужінь під час поїздки.</li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-slide-in-right" delay={200}>
            <div className="bg-white p-8 rounded-xl shadow-lg h-full">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-900">Популяризація паломництва</h3>
              <ul className="text-warmGray-600 leading-relaxed list-disc pl-5 space-y-2">
                <li>Видання літератури про святі місця.</li>
                <li>Поширення інформації через соціальні мережі, сайти, друковані матеріали.</li>
                <li>Співпраця з церквою, монастирями та іншими релігійними організаціями.</li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-slide-in-up" delay={300}>
            <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-900">Соціальна місія</h3>
              <ul className="text-warmGray-600 leading-relaxed list-disc pl-5 space-y-2">
                <li>Допомога тим, хто не має можливості здійснити паломництво самостійно.</li>
                <li>Сприяння розвитку міжконфесійного діалогу через спільні паломництва.</li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Наші цінності */}
      <section className="bg-warmGray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <AnimateOnScroll animation="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 text-primary-900 drop-shadow-sm">
                Наші цінності
              </h2>
              <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-warmGray-600 max-w-3xl mx-auto">
                Ми прагнемо втілювати християниські цінності в кожній подорожі та будувати спільноту однодумців
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimateOnScroll animation="animate-zoom-in" delay={100}>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary-900">Любов</h3>
                <p className="text-warmGray-600 leading-relaxed">
                  Любов до Бога та ближнього є основою нашого служіння. Ми створюємо атмосферу любові та підтримки під час кожної подорожі.
                </p>
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="animate-zoom-in" delay={200}>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary-900">Віра</h3>
                <p className="text-warmGray-600 leading-relaxed">
                  Віра є джерелом нашої сили та наснаги. Ми створюємо умови для поглиблення віри через духовне збагачення під час паломництва.
                </p>
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="animate-zoom-in" delay={300}>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary-900">Спільнота</h3>
                <p className="text-warmGray-600 leading-relaxed">
                  Ми будуємо спільноту однодумців, де кожен може відчути єдність з братами і сестрами у вірі, поділитися своїм досвідом і здобути нові знайомства.
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/about"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Дізнатися більше про нас
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <AnimateOnScroll animation="animate-zoom-in">
            <h2 className="text-3xl font-bold mb-6">{homePage?.ctaTitle || "Готові до духовної подорожі?"}</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              {homePage?.ctaDescription || 
                "Приєднуйтеся до наших паломницьких поїздок і відкрийте для себе глибину духовного досвіду"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="bg-white text-primary-700 px-8 py-4 rounded-md font-medium hover:bg-primary-50 transition-colors"
              >
                Знайти поїздку
              </Link>
              <Link
                href="/contacts"
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-md font-medium transition-colors"
              >
                Зв&apos;язатися з нами
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
} 