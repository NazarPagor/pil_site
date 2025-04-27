'use client';

import React from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  ShareIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

type EventActionSidebarProps = {
  startDate: string;
  endDate: string;
  price: string;
  duration: string;
  status: 'open' | 'closed';  
  filledPercentage: number;   // Відсоток заповненості для прогрес-бару
  documentsRequired: string[];
};

const EventActionSidebar: React.FC<EventActionSidebarProps> = ({
  startDate,
  endDate,
  price,
  duration,
  status,
  filledPercentage,
  documentsRequired
}) => {
  // Форматування дат
  const formattedStartDate = format(parseISO(startDate), 'd MMMM yyyy', { locale: uk });
  const formattedEndDate = format(parseISO(endDate), 'd MMMM yyyy', { locale: uk });
  
  // Обробник кнопки бронювання
  const handleBooking = () => {
    // У майбутньому тут буде логіка бронювання або перенаправлення на форму бронювання
    console.log('Booking action triggered');
  };
  
  // Обробник кнопки поділитися
  const handleShare = () => {
    // У майбутньому тут буде логіка для поділу посиланням
    if (navigator.share) {
      navigator.share({
        title: 'Паломницька поїздка',
        text: 'Перегляньте цю паломницьку поїздку',
        url: window.location.href,
      });
    } else {
      alert('Поділитися посиланням можна, скопіювавши його з адресного рядка браузера');
    }
  };

  const isOpen = status === 'open';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-2xl font-bold text-primary-900">{price}</span>
          <span className="text-gray-600">на особу</span>
        </div>

        <p className="text-gray-600 text-[14px]">ЗАБРОНЮВАТИ МІСЦЕ ЧИ ОТРИМАТИ ДОДАТКОВУ ІНФОРМАЦІЮ </p>
        <a href="tel:+380964649967"><h3 className="text-gray-600 mt-2 text-[18px] underline" >096 46 49 967</h3></a>
        
        {/* Індикатор заповненості */}
        <div className="mb-4">
          <div className="text-sm mb-1">
           
            {/* <span className="font-medium text-primary-800">{isOpen ? 'Відкрито' : 'Закрито'}</span> */}
          </div>
          {/* <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${filledPercentage}%` }}
            ></div>
          </div> */}
          {/* <div className="mt-1 text-sm text-gray-600">
            {isOpen ? 'Ви можете забронювати цю поїздку' : 'На жаль, місць більше немає'}
          </div> */}
        </div>
        
        {/* <button
          onClick={handleBooking}
          className={`w-full py-3 px-4 font-medium rounded-md transition-colors ${
            isOpen 
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isOpen}
        >
          {isOpen ? 'Забронювати місце' : 'Бронювання закрито'}
        </button> */}
      </div>
      
      <div className="p-6 space-y-4">
        {/* Ключова інформація про поїздку */}
        <div className="space-y-3">
          <div className="flex items-start">
            <CalendarIcon className="h-5 w-5 text-primary-700 mt-0.5 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Дати поїздки:</div>
              <div className="text-gray-800">{formattedStartDate} - {formattedEndDate}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <ClockIcon className="h-5 w-5 text-primary-700 mt-0.5 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Тривалість:</div>
              <div className="text-gray-800">{duration}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CurrencyDollarIcon className="h-5 w-5 text-primary-700 mt-0.5 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Передоплата:</div>
              <div className="text-gray-800">30% від вартості</div>
            </div>
          </div>
        </div>
        
        {/* Необхідні документи */}
        {documentsRequired.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start">
              <DocumentTextIcon className="h-5 w-5 text-primary-700 mt-0.5 mr-3" />
              <div>
                <div className="font-medium text-gray-800 mb-1">Необхідні документи:</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  {documentsRequired.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 inline-flex items-center justify-center mr-1 text-primary-700">•</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Додаткові дії */}
        <div className="pt-4 border-t border-gray-200 flex justify-between">
          <button 
            onClick={handleShare}
            className="inline-flex items-center text-gray-700 hover:text-primary-700"
          >
            <ShareIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">Поділитись</span>
          </button>
          
          <a 
            href="tel:+380964649967"
            className="inline-flex items-center text-gray-700 hover:text-primary-700"
          >
            <PhoneIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">Зателефонувати</span>
          </a>
          
          <button 
            className="inline-flex items-center text-gray-700 hover:text-primary-700"
            onClick={() => window.location.href = '/contacts'}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">Запитати</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventActionSidebar; 