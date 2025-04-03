'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

type ScheduleDay = {
  day: number;
  title: string;
  activities: string[];
};

type EventScheduleProps = {
  schedule: ScheduleDay[];
};

const EventSchedule: React.FC<EventScheduleProps> = ({ schedule }) => {
  const [openDays, setOpenDays] = useState<number[]>([0]); // За замовчуванням відкритий перший день

  const toggleDay = (dayIndex: number) => {
    setOpenDays(prev => 
      prev.includes(dayIndex)
        ? prev.filter(day => day !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-primary-900 mb-4">Програма поїздки</h3>
      
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

export default EventSchedule; 