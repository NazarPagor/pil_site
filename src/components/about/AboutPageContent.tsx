'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

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

// Компонент з членами команди
const teamMembers = [
  {
    name: "Отець Іван",
    role: "Духовний наставник",
    image: "https://randomuser.me/api/portraits/men/72.jpg",
    bio: "Отець Іван має 20-річний досвід організації паломницьких поїздок та духовного супроводу вірян.",
  },
  {
    name: "Оксана Шевченко",
    role: "Керівник центру",
    image: "https://randomuser.me/api/portraits/women/42.jpg",
    bio: "Оксана заснувала наш центр у 2010 році з місією зробити паломництво доступним для кожного вірянина.",
  },
  {
    name: "Андрій Мельник",
    role: "Координатор поїздок",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    bio: "Андрій відповідає за логістику та координацію всіх поїздок, забезпечуючи їх комфорт та безпеку.",
  },
  {
    name: "Наталія Ковальчук",
    role: "Гід-перекладач",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    bio: "Наталія володіє 5 мовами та має глибокі знання з історії релігії, що робить її незамінним гідом.",
  },
];

// Віхи історії центру
const milestones = [
  {
    year: "2010",
    title: "Заснування центру",
    description: "Паломницький центр був заснований з метою організації поїздок до святих місць для українських вірян.",
  },
  {
    year: "2012",
    title: "Перша велика група",
    description: "Організовано паломництво для 50 осіб до Святої Землі, що стало важливою віхою в історії нашого центру.",
  },
  {
    year: "2015",
    title: "Розширення діяльності",
    description: "Відкриття нових напрямків паломництва, включаючи Грецію, Італію та монастирі України.",
  },
  {
    year: "2018",
    title: "Міжнародне визнання",
    description: "Наш центр отримав міжнародне визнання як один з найкращих організаторів паломницьких поїздок у Східній Європі.",
  },
  {
    year: "2023",
    title: "Нові програми",
    description: "Запуск нових програм для молоді та сімейних паломництв, а також спеціальних духовних ретритів.",
  },
];

export default function AboutPageContent() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
            <AnimateOnScroll animation="animate-slide-in-left" delay={100}>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-primary-900 leading-tight drop-shadow-sm">
                  Про наш паломницький центр
                </h1>
                <div className="w-20 h-1 bg-primary-600 mb-8 rounded-full"></div>
                <p className="text-lg text-warmGray-700 mb-6 leading-relaxed">
                  Паломницький центр "Подільський пілігрим" - це місце, де духовність поєднується з подорожами.
                  Ми організовуємо поїздки до святих місць, створюючи для вас
                  можливість доторкнутися до духовної спадщини та історії.
                </p>
                <p className="text-lg text-warmGray-700 leading-relaxed">
                  Наш центр об'єднує досвідчених духовних наставників, професійних
                  гідів та організаторів подорожей, щоб забезпечити вам найкращий
                  досвід паломництва. За роки діяльності ми організували понад
                  500 поїздок для більш ніж 5000 паломників.
                </p>
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="animate-slide-in-right" delay={100}>
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/about_us.jpg"
                  alt="Про наш паломницький центр"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Наша місія */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <AnimateOnScroll animation="animate-fade-in" delay={100}>
            <h2 className="text-3xl font-bold mb-2 text-primary-900 drop-shadow-sm">Наша місія та цінності</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-8 rounded-full"></div>
          </AnimateOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <AnimateOnScroll animation="animate-slide-in-up" delay={100}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Духовне збагачення</h3>
                <p className="text-warmGray-600">
                  Ми прагнемо створювати умови для духовного зростання через відвідування святих місць та участь у духовних практиках.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="animate-slide-in-up" delay={200}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Спільнота</h3>
                <p className="text-warmGray-600">
                  Ми створюємо спільноту однодумців, де люди можуть обмінюватися духовним досвідом та підтримувати одне одного на шляху віри.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="animate-slide-in-up" delay={300}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Безпека і комфорт</h3>
                <p className="text-warmGray-600">
                  Ми забезпечуємо безпеку та комфорт під час усіх поїздок, щоб паломники могли повністю зосередитися на духовному аспекті подорожі.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Наша історія - Віхи */}
      <section className="max-w-5xl mx-auto px-4">
        <AnimateOnScroll animation="animate-fade-in" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-primary-900 drop-shadow-sm">Історія нашого центру</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-8 rounded-full"></div>
          </div>
        </AnimateOnScroll>

        <div className="relative">
          {/* Вертикальна лінія */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform -translate-x-1/2"></div>
          
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <AnimateOnScroll 
                key={index}
                animation={index % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"}
                delay={index * 100}
              >
                <div className={`relative flex items-center ${index % 2 === 0 ? "justify-end" : ""}`}>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500">
                      <div className="flex items-center mb-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 mr-2">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-semibold text-primary-800">{milestone.title}</h3>
                      </div>
                      <p className="text-warmGray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Точка на лінії */}
                  <div className="absolute left-1/2 w-6 h-6 rounded-full bg-primary-600 border-2 border-white transform -translate-x-1/2"></div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Наша команда */}
      {/* <section className="bg-warmGray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <AnimateOnScroll animation="animate-fade-in" delay={100}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 text-primary-900 drop-shadow-sm">Наша команда</h2>
              <div className="w-20 h-1 bg-primary-600 mx-auto mb-8 rounded-full"></div>
              <p className="text-lg text-warmGray-600 max-w-3xl mx-auto">
                Знайомтеся з людьми, які роблять наші паломницькі подорожі незабутніми
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <AnimateOnScroll key={index} animation="animate-zoom-in" delay={index * 100}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-square relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1 text-primary-800">{member.name}</h3>
                    <p className="text-primary-600 mb-3">{member.role}</p>
                    <p className="text-warmGray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section> */}

      {/* Чому обирають нас */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <AnimateOnScroll animation="animate-fade-in" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-primary-800">Чому обирають нас</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-8 rounded-full"></div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animation="animate-slide-in-left" delay={100}>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex-shrink-0 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary-800">Досвід організації</h3>
                  <p className="text-warmGray-600">
                    Маємо багаторічний досвід організації паломницьких поїздок до різноманітних святих місць по всьому світу.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex-shrink-0 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary-800">Духовний супровід</h3>
                  <p className="text-warmGray-600">
                    Кожну групу супроводжує досвідчений духовний наставник, який допомагає поглибити духовний досвід паломництва.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex-shrink-0 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary-800">Зручність і безпека</h3>
                  <p className="text-warmGray-600">
                    Ми забезпечуємо комфортне проживання, харчування та транспорт, а також гарантуємо безпеку під час усіх поїздок.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="animate-slide-in-right" delay={100}>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex-shrink-0 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary-800">Невеликі групи</h3>
                  <p className="text-warmGray-600">
                    Ми організовуємо подорожі для невеликих груп, що дозволяє забезпечити індивідуальний підхід до кожного паломника.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex-shrink-0 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary-800">Гнучкі програми</h3>
                  <p className="text-warmGray-600">
                    Наші програми паломництва можуть бути адаптовані під потреби та бажання групи, враховуючи різні аспекти духовного досвіду.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex-shrink-0 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary-800">Професійні гіди</h3>
                  <p className="text-warmGray-600">
                    Наші гіди мають глибокі знання про історію, культуру та релігійні традиції місць паломництва та володіють декількома мовами.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
} 