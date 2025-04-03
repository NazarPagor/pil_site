'use client';

import React, { useState } from 'react';
import { CalendarDaysIcon, ClipboardDocumentListIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

type ScheduleDay = {
  day: number;
  title: string;
  activities: string[];
};

type EventTabsProps = {
  eventId: string;
  eventData: {
    description: string;
    longDescription: string;
    schedule: Array<{
      day: number;
      title: string;
      activities: string[];
    }>;
    documents: Array<{
      name: string;
      required: boolean;
    }>;
    galleryImages: string[];
    location: {
      name: string;
      description: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
  };
};

// Компонент розкладу подій
const EventSchedule: React.FC<{ schedule: ScheduleDay[] }> = ({ schedule }) => {
  const [openDays, setOpenDays] = useState<number[]>([0]); // За замовчуванням відкритий перший день

  const toggleDay = (dayIndex: number) => {
    setOpenDays(prev => 
      prev.includes(dayIndex)
        ? prev.filter(day => day !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  if (schedule.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="space-y-4">
        {schedule.map((day, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleDay(index)}
              className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 text-left"
            >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-600 text-white text-sm mr-3">
                  {day.day}
                </span>
                <span className="font-medium text-gray-900">{day.title}</span>
              </div>
              {openDays.includes(index) ? (
                <ChevronUpIcon className="h-5 w-5 text-primary-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-primary-600" />
              )}
            </button>
            
            {openDays.includes(index) && (
              <div className="px-4 py-3 bg-white">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {day.activities.map((activity, actIndex) => (
                    <li key={actIndex}>{activity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Примітка:</strong> Програма може бути змінена організаторами залежно від обставин, погодних умов 
          або інших факторів. Про будь-які зміни учасники будуть повідомлені заздалегідь.
        </p>
      </div>
    </div>
  );
};

const EventTabs: React.FC<EventTabsProps> = ({ eventId, eventData }) => {
  const [activeTab, setActiveTab] = useState('program');

  const tabs = [
    { id: 'program', name: 'Опис і програма', icon: CalendarDaysIcon },
    { id: 'documents', name: 'Необхідні документи', icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-4 text-sm font-medium whitespace-nowrap flex items-center
                ${activeTab === tab.id 
                  ? 'border-b-2 border-primary-600 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:border-gray-300'}
              `}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'program' && (
          <div>
            <h3 className="text-xl font-semibold text-primary-900 mb-4">Про поїздку</h3>
            <div 
              className="prose max-w-none text-gray-700 mb-8"
              dangerouslySetInnerHTML={{ __html: eventData.longDescription }}
            />
            
            {eventData.schedule.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-primary-900 mb-4">Програма поїздки</h3>
                <EventSchedule schedule={eventData.schedule} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h3 className="text-xl font-semibold text-primary-900 mb-4">Необхідні документи</h3>
            <ul className="space-y-3">
              {eventData.documents.map((document, index) => (
                <li key={index} className="flex items-start">
                  <svg 
                    className={`h-5 w-5 mr-2 mt-1 ${document.required ? 'text-primary-700' : 'text-gray-400'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={document.required 
                        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      } 
                    />
                  </svg>
                  <span className="text-gray-700">{document.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTabs; 