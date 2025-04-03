'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

type FAQItem = {
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    question: "Які документи потрібні для паломницької поїздки за кордон?",
    answer: "Для поїздки за кордон вам необхідно мати закордонний паспорт (термін дії не менше 6 місяців після дати повернення), візу (якщо необхідно для країни призначення), та медичну страховку. Детальніша інформація надається при бронюванні конкретної поїздки."
  },
  {
    question: "Як можна оплатити паломницьку поїздку?",
    answer: "Оплату можна здійснити готівкою у нашому офісі або банківським переказом на рахунок. При бронюванні вноситься передоплата (зазвичай 30% від вартості), а повна оплата має бути здійснена не пізніше ніж за 14 днів до початку поїздки."
  },
  {
    question: "Чи можлива відмова від поїздки та повернення коштів?",
    answer: "Так, відмова можлива. Умови повернення коштів залежать від терміну до початку поїздки: при відмові більше ніж за 30 днів – повертається повна сума мінус адміністративні витрати, від 30 до 14 днів – повертається 70% суми, від 14 до 7 днів – 50%, менше 7 днів – кошти не повертаються."
  },
  {
    question: "Що включено у вартість поїздки?",
    answer: "Зазвичай у вартість включено: транспортне обслуговування, проживання, харчування (згідно з програмою), медичне страхування, послуги гіда, вхідні квитки до зазначених у програмі місць. Детально перелік послуг вказується в описі кожної поїздки."
  },
  {
    question: "Чи потрібно брати з собою їжу в паломницьку поїздку?",
    answer: "Для поїздок з харчуванням, включеним у вартість, додатково брати їжу не обов'язково. Рекомендуємо мати з собою воду та невеликий перекус. Для поїздок без включеного харчування, інформація про можливості харчування надається окремо."
  },
  {
    question: "Який одяг слід брати в паломницьку поїздку?",
    answer: "Для відвідування святих місць необхідно мати скромний одяг, що прикриває плечі та коліна. Жінкам рекомендується мати хустку для покриття голови. Також важливо мати зручне взуття для тривалих пішохідних екскурсій."
  },
  {
    question: "Чи потрібно мати медичну страховку?",
    answer: "Так, для всіх закордонних поїздок медична страховка є обов'язковою. Для поїздок Україною страховка рекомендована. У більшості випадків вартість страховки включена у вартість туру."
  },
  {
    question: "Чи можуть діти брати участь у паломницьких поїздках?",
    answer: "Так, діти можуть брати участь у більшості паломницьких поїздок у супроводі дорослих. Для деяких маршрутів встановлені вікові обмеження. Діти до 16 років отримують знижку на вартість поїздки."
  }
];

const FAQPageContent = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4 drop-shadow-sm">
            Часті запитання
          </h1>
          <div className="w-20 h-1 mx-auto bg-primary-600 mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Відповіді на найпоширеніші запитання про паломницькі поїздки від Паломницького центру "Подільський пілігрим".
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`border-b border-gray-200 ${index === faqItems.length - 1 ? 'border-b-0' : ''}`}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium text-primary-900">{item.question}</span>
                {openItem === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-primary-700" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-primary-700" />
                )}
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openItem === index ? 'max-h-96 py-4' : 'max-h-0 py-0'
                }`}
              >
                <p className="text-gray-700">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-primary-900 mb-4">Не знайшли відповідь на своє запитання?</h2>
          <p className="text-gray-700 mb-6">Зв'яжіться з нами, і ми з радістю відповімо на всі ваші запитання.</p>
          <a
            href="/contacts"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            Зв'язатися з нами
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPageContent; 