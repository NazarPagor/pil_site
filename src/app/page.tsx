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

// interface Page {
//   id: string;
//   title: string;
//   content: string;
//   slug: string;
//   description?: string;
//   metaTitle?: string;
//   metaDescription?: string;
// }

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

export default function Home() {
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
      //  setUpcomingEvents(upcomingData);
        
        // Створення популярних напрямків на основі унікальних місць з подій
        const uniqueLocations = Array.from(
          new Set(upcomingData.map((event: Event) => event.location))
        ) as string[];

        const destinations: PopularDestination[] = uniqueLocations.slice(0, 3).map((location: string) => {
          const event = upcomingData.find((event: Event) => event.location === location);
          return {
            title: location.split(',')[0], // Використовуємо першу частину локації як заголовок
            location: location,
            image: event?.image || 'https://images.unsplash.com/photo-1577338149561-1fa5166efdc2?q=80&w=2070&auto=format&fit=crop'
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
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop"
            alt="Паломницький центр"
            fill
            className="object-cover brightness-75"
            style={{transform: "scale(1.1)"}}
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {homePage?.heroTitle || "Духовна подорож до святих місць"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
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
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-warmGray-50 to-transparent"></div>
      </section>

      {/* Візуальний роздільник з хвилею */}
      <div className="relative -mt-20 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-warmGray-50">
          <path d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,149.3C960,139,1056,85,1152,69.3C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Mission Section з анімацією */}
      <section className="max-w-4xl mx-auto text-center px-4 -mt-12">
        <AnimateOnScroll animation="animate-fade-in">
          <h2 className="text-3xl font-bold mb-2 text-primary-800">
            {homePage?.missionTitle || "Наша місія"}
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-warmGray-700 leading-relaxed">
            {homePage?.missionDescription || 
              "Ми прагнемо зробити паломницькі поїздки доступними для всіх, хто бажає відвідати свята місця. Наш центр організовує безпечні та комфортні подорожі, які дозволяють глибше пізнати духовну спадщину та збагатитися духовно."}
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

      {/* Services Section з картками */}
      <section className="max-w-7xl mx-auto px-4">
        <AnimateOnScroll animation="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-primary-800">
              {homePage?.servicesTitle || "Наші послуги"}
            </h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-warmGray-600 max-w-3xl mx-auto">
              {homePage?.servicesDescription || 
                "Ми пропонуємо повний спектр послуг для забезпечення незабутньої та комфортної подорожі"}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <AnimateOnScroll animation="animate-slide-in-up" delay={100}>
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-800">Організація поїздок</h3>
              <p className="text-warmGray-600 leading-relaxed">
                Повний комплекс послуг з організації паломницьких поїздок, включаючи
                транспорт, оформлення документів, проживання та харчування на всьому шляху вашої подорожі.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-slide-in-up" delay={200}>
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-800">Духовний супровід</h3>
              <p className="text-warmGray-600 leading-relaxed">
                Професійні гіди та духовні наставники супроводжують групи під час
                поїздок, розповідаючи про історію та духовне значення святих місць.
                Регулярні молитви та служби за вашим бажанням.
              </p>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="animate-slide-in-up" delay={300}>
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-800">Індивідуальні програми</h3>
              <p className="text-warmGray-600 leading-relaxed">
                Розробка індивідуальних програм паломництва за вашими побажаннями.
                Можливість організації приватних поїздок для окремих груп.
                Гнучкий графік та маршрути подорожей.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Популярні напрямки */}
      <section className="bg-warmGray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <AnimateOnScroll animation="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 text-primary-800">
                {homePage?.destinationsTitle || "Популярні напрямки"}
              </h2>
              <div className="w-20 h-1 bg-primary-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-warmGray-600 max-w-3xl mx-auto">
                {homePage?.destinationsDescription || 
                  "Відвідайте святі місця, що надихають мільйони паломників по всьому світу"}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((destination, index) => (
              <AnimateOnScroll key={index} animation="animate-zoom-in" delay={index * 100}>
                <div className="relative rounded-xl overflow-hidden group">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={destination.image}
                      alt={destination.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{destination.title}</h3>
                    <p className="text-sm text-white/80">{destination.location}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/events"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Переглянути всі напрямки
            </Link>
          </div>
        </div>
      </section>

      {/* Карусель з відгуками */}
      <section className="max-w-5xl mx-auto px-4">
        <AnimateOnScroll animation="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-primary-800">
              {homePage?.testimonialTitle || "Відгуки паломників"}
            </h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6 rounded-full"></div>
          </div>
        </AnimateOnScroll>

        <div className="relative">
          <div className="overflow-hidden h-[350px]">
            <div className="grid grid-cols-1 gap-8">
              {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute w-full transition-all duration-500 ${
                    index === activeTestimonial 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="bg-white p-8 rounded-xl shadow-md border border-warmGray-100">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary-500">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-lg text-warmGray-700 italic mb-6 text-center">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <h4 className="text-primary-800 font-semibold">{testimonial.name}</h4>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="bg-white p-8 rounded-xl shadow-md border border-warmGray-100">
                  <div className="flex flex-col items-center">
                    <p className="text-lg text-warmGray-700 italic mb-6 text-center">
                    &quot;Паломництво до Святої Землі назавжди змінило моє життя. Завдяки професійній організації та духовному супроводу я змогла повністю зануритися у цю неповторну подорож.&quot;
                    </p>
                    <h4 className="text-primary-800 font-semibold">Марія Петренко</h4>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.length > 0 && testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeTestimonial ? "bg-primary-600" : "bg-warmGray-300"
                }`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Відгук ${index + 1}`}
              ></button>
            ))}
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
