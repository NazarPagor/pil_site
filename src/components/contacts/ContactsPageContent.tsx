'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AnimateOnScroll from '../AnimateOnScroll';

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

export default function ContactsPageContent() {
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
          <h1 className="text-4xl font-bold mb-4 text-primary-900 drop-shadow-sm">Контакти</h1>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
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
              <div className="w-14 h-14 bg-primary-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Адреса</h3>
              {/* <p className="text-warmGray-600 mb-2">
                вул. Свята, 1<br />
                Київ, 01001
              </p> */}
              <p className="text-warmGray-600">
                <span className="text-primary-600 font-medium">Графік роботи:</span><br />
                Пн-Пт: 9:00 - 18:00<br />
                {/* Сб: 10:00 - 15:00 */}
              </p>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="animate-zoom-in" delay={200}>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary-500">
              <div className="w-14 h-14 bg-primary-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Телефон</h3>
              <p className="text-warmGray-600 mb-2">
                <a href="tel:+380964649967" className="hover:text-primary-600 transition-colors">+38 (096) 46-49-967</a><br />
                {/* <a href="tel:+380964649967" className="hover:text-primary-600 transition-colors">+38 (096) 46-49-967</a> */}
              </p>
              {/* <p className="text-warmGray-600">
                <span className="text-primary-600 font-medium">Гаряча лінія:</span><br />
                <a href="tel:+380964649967" className="hover:text-primary-600 transition-colors">0 800 123 456</a> (безкоштовно)
              </p> */}
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="animate-zoom-in" delay={300}>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary-500">
              <div className="w-14 h-14 bg-primary-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Email</h3>
              <p className="text-warmGray-600 mb-2">
                <a href="mailto:info@pilgrim.te.ua" className="hover:text-primary-600 transition-colors">info@pilgrim.te.ua</a><br />
                {/* <a href="mailto:booking@pilgrim.te.ua" className="hover:text-primary-600 transition-colors">booking@pilgrim.te.ua</a> */}
              </p>
              {/* <div className="flex mt-4 space-x-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div> */}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Контактна форма та FAQ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          {/* Контактна форма */}
          {/* <AnimateOnScroll animation="animate-slide-in-up">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-primary-900">Надіслати повідомлення</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Повідомлення надіслано!</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Дякуємо за ваше звернення. Ми зв&apos;яжемося з вами найближчим часом.</p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setSubmitSuccess(false)}
                          className="text-sm font-medium text-green-600 hover:text-green-500"
                        >
                          Надіслати ще одне повідомлення
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-warmGray-700 mb-1">
                      Ваше ім&apos;я *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.name ? 'border-red-300' : 'border-warmGray-300'
                      }`}
                      placeholder="Введіть ваше ім'я"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-warmGray-700 mb-1">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                          errors.email ? 'border-red-300' : 'border-warmGray-300'
                        }`}
                        placeholder="email@example.com"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-warmGray-700 mb-1">
                        Телефон *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                          errors.phone ? 'border-red-300' : 'border-warmGray-300'
                        }`}
                        placeholder="+380 XX XXX XXXX"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-warmGray-700 mb-1">
                      Тема *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.subject ? 'border-red-300' : 'border-warmGray-300'
                      }`}
                      placeholder="Тема вашого повідомлення"
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-warmGray-700 mb-1">
                      Повідомлення *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.message ? 'border-red-300' : 'border-warmGray-300'
                      }`}
                      placeholder="Детальний опис вашого запиту"
                      {...register('message')}
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Надсилання...' : 'Надіслати повідомлення'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </AnimateOnScroll> */}
          
          {/* FAQ */}
          <AnimateOnScroll animation="animate-slide-in-up" delay={100}>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-primary-800">Поширені запитання</h2>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border border-warmGray-200 rounded-lg overflow-hidden">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left bg-warmGray-50 hover:bg-warmGray-100 transition-colors"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    >
                      <span className="font-medium text-primary-800">{item.question}</span>
                      <svg
                        className={`w-5 h-5 text-primary-600 transform transition-transform ${
                          expandedFaq === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedFaq === index ? 'max-h-40' : 'max-h-0'
                      }`}
                    >
                      <div className="p-4 bg-white text-warmGray-600">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Гугл карта */}
      {/* <section className="max-w-7xl mx-auto px-4 mb-16">
        <AnimateOnScroll animation="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-primary-800 text-center">Як нас знайти</h2>
          <div className="rounded-xl overflow-hidden shadow-md" ref={mapRef}></div>
        </AnimateOnScroll>
      </section> */}
    </div>
  );
} 