'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Інтерфейс для компонента анімації
interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation: string;
  delay?: number;
}

// Компонент для елементів, що з'являються з анімацією при скролінгу
function AnimateOnScroll({ children, animation, delay = 0 }: AnimateOnScrollProps) {
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

const contactSchema = z.object({
  name: z.string().min(2, 'Ім&apos;я має містити мінімум 2 символи'),
  email: z.string().email('Введіть коректну електронну адресу'),
  phone: z.string().min(10, 'Введіть коректний номер телефону'),
  subject: z.string().min(2, 'Тема має містити мінімум 2 символи'),
  message: z.string().min(10, 'Повідомлення має містити мінімум 10 символів'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const faqItems = [
  {
    question: 'Як зареєструватися на паломницьку поїздку?',
    answer: 'Для реєстрації на поїздку потрібно заповнити форму на сторінці конкретної поїздки або зв&apos;язатися з нами за телефоном. Після цього ми зв&apos;яжемося з вами для уточнення деталей та оплати.'
  },
  {
    question: 'Які документи потрібні для паломницької поїздки?',
    answer: 'Для поїздок за кордон потрібен закордонний паспорт (термін дії не менше 6 місяців після дати повернення) та віза (якщо потрібна). Для поїздок Україною достатньо внутрішнього паспорта.'
  },
  {
    question: 'Чи є знижки для груп або постійних клієнтів?',
    answer: 'Так, ми пропонуємо знижки для груп від 10 осіб, а також для клієнтів, які вже здійснювали з нами поїздки раніше. Детальніше про знижки можна дізнатися, зв&apos;язавшись з нами.'
  },
  {
    question: 'Що включено у вартість поїздки?',
    answer: 'Вартість поїздки зазвичай включає проживання, харчування (згідно з програмою), транспортне обслуговування, екскурсійний супровід, духовний супровід та страхування. Детальна інформація вказана на сторінці кожної поїздки.'
  },
  {
    question: 'Чи можна змінити або скасувати бронювання?',
    answer: 'Зміна або скасування бронювання можливі відповідно до умов, зазначених у договорі. Зазвичай, за 30 днів до поїздки повертається повна сума, за 15-29 днів – 50%, менше ніж за 15 днів – кошти не повертаються.'
  }
];

export default function ContactsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const mapRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Відправляємо дані форми до API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Помилка відправки форми');
      }
      
      console.log('Form data:', data);
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Виникла помилка при відправці форми. Будь ласка, спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Додавання карти, коли компонент завантажується
  useEffect(() => {
    if (mapRef.current) {
      const mapElement = mapRef.current as HTMLDivElement;
      const iframe = document.createElement('iframe');
      iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.4538498378075!2d30.517767776942374!3d50.45143728538563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce505e05713f%3A0x97dd4edf7f2cb5f7!2z0JrQuNC10LLQviDQnNGW0YHRgtC-LCDQntC70YzQs9C40L3RgdGM0LrQsCDQv9C70L7RidCwLCAxLCDQmtC40ZfQsiwgMDIwMDA!5e0!3m2!1suk!2sua!4v1708539462248!5m2!1suk!2sua";
      iframe.width = "100%";
      iframe.height = "450";
      iframe.style.border = "0";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      
      mapElement.appendChild(iframe);
    }
    
    return () => {
      if (mapRef.current) {
        const mapElement = mapRef.current as HTMLDivElement;
        mapElement.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="space-y-16">
      {/* Заголовок сторінки */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <AnimateOnScroll animation="animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-primary-800">Контакти</h1>
          <p className="text-lg text-warmGray-600">
            Зв&apos;яжіться з нами для отримання додаткової інформації про паломницькі поїздки
            або задайте будь-які питання, що вас цікавлять
          </p>
        </AnimateOnScroll>
      </section>

      {/* Інформаційні картки */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimateOnScroll animation="animate-zoom-in" delay={100}>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary-500">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-800">Адреса</h3>
              <p className="text-warmGray-600 mb-2">
                вул. Свята, 1<br />
                Київ, 01001
              </p>
              <p className="text-warmGray-600">
                <span className="text-primary-600 font-medium">Графік роботи:</span><br />
                Пн-Пт: 9:00 - 18:00<br />
                Сб: 10:00 - 15:00
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-zoom-in" delay={200}>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary-500">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-800">Телефони</h3>
              <p className="text-warmGray-600 mb-2">
                <span className="text-primary-600 font-medium">Основний:</span><br />
                <a href="tel:+380441234567" className="hover:text-primary-600 transition-colors">+380 (44) 123-45-67</a>
              </p>
              <p className="text-warmGray-600">
                <span className="text-primary-600 font-medium">Мобільний:</span><br />
                <a href="tel:+380971234567" className="hover:text-primary-600 transition-colors">+380 (97) 123-45-67</a>
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-zoom-in" delay={300}>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary-500">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-800">Електронна пошта</h3>
              <p className="text-warmGray-600 mb-2">
                <span className="text-primary-600 font-medium">Загальні питання:</span><br />
                <a href="mailto:info@pilgrimage-center.com" className="hover:text-primary-600 transition-colors">info@pilgrimage-center.com</a>
              </p>
              <p className="text-warmGray-600">
                <span className="text-primary-600 font-medium">Бронювання:</span><br />
                <a href="mailto:booking@pilgrimage-center.com" className="hover:text-primary-600 transition-colors">booking@pilgrimage-center.com</a>
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Форма контактів і карта */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimateOnScroll animation="animate-slide-in-left">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-primary-800">Напишіть нам</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-warmGray-700 mb-1">
                      Ім&apos;я *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      placeholder="Ваше ім&apos;я"
                      className="w-full px-4 py-3 rounded-lg border border-warmGray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-warmGray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-warmGray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-warmGray-700 mb-1">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      placeholder="+380 XX XXX XX XX"
                      className="w-full px-4 py-3 rounded-lg border border-warmGray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-warmGray-700 mb-1">
                      Тема *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      {...register('subject')}
                      placeholder="Тема повідомлення"
                      className="w-full px-4 py-3 rounded-lg border border-warmGray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-warmGray-700 mb-1">
                    Повідомлення *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message')}
                    placeholder="Ваше повідомлення"
                    className="w-full px-4 py-3 rounded-lg border border-warmGray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Відправка...
                    </span>
                  ) : (
                    'Надіслати повідомлення'
                  )}
                </button>

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p>Дякуємо! Ваше повідомлення успішно відправлено. Ми зв&apos;яжемося з вами найближчим часом.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="animate-slide-in-right">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-[450px]" ref={mapRef}></div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Поширені запитання */}
      <section className="max-w-4xl mx-auto px-4">
        <AnimateOnScroll animation="animate-fade-in">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-primary-800">Поширені запитання</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-warmGray-600">
              Відповіді на найбільш поширені запитання про наші паломницькі поїздки
            </p>
          </div>
        </AnimateOnScroll>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <AnimateOnScroll key={index} animation="animate-fade-in" delay={index * 100}>
              <div className="bg-white rounded-lg shadow-sm">
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <h3 className="text-lg font-medium text-primary-800">{item.question}</h3>
                  <svg
                    className={`w-5 h-5 text-primary-600 transition-transform ${expandedFaq === index ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 animate-fade-in">
                    <p className="text-warmGray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Заклик до дії */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <AnimateOnScroll animation="animate-zoom-in">
            <h2 className="text-3xl font-bold mb-6">Почніть свою духовну подорож сьогодні</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Зв&apos;яжіться з нами або відвідайте наш офіс, щоб обрати паломницьку поїздку своєї мрії
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+380441234567"
                className="flex items-center bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Зателефонувати
              </a>
              <a
                href="mailto:info@pilgrimage-center.com"
                className="flex items-center bg-transparent border-2 border-white hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Написати email
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
} 