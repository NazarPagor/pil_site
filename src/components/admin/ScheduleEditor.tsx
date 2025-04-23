'use client';

import React from 'react';

type ScheduleDay = {
  day: number;
  title: string;
  activities: string[];
};

interface ScheduleEditorProps {
  schedule: ScheduleDay[];
  onChange: (newSchedule: ScheduleDay[]) => void;
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ schedule, onChange }) => {
  const addDay = () => {
    const newDay = {
      day: schedule.length + 1,
      title: `День ${schedule.length + 1}`,
      activities: ['']
    };
    onChange([...schedule, newDay]);
  };

  const removeDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule.splice(index, 1);
    // Renumber days
    newSchedule.forEach((day, idx) => {
      day.day = idx + 1;
    });
    onChange(newSchedule);
  };

  const updateDayTitle = (index: number, title: string) => {
    const newSchedule = [...schedule];
    newSchedule[index].title = title;
    onChange(newSchedule);
  };

  const addActivity = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].activities.push('');
    onChange(newSchedule);
  };

  const updateActivity = (dayIndex: number, activityIndex: number, activity: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].activities[activityIndex] = activity;
    onChange(newSchedule);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].activities.splice(activityIndex, 1);
    onChange(newSchedule);
  };

  return (
    <div className="space-y-6">
      {schedule.map((day, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-600 text-white text-sm">
                {day.day}
              </span>
              <input
                type="text"
                value={day.title}
                onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                placeholder="Назва дня"
              />
            </div>
            <button
              type="button"
              onClick={() => removeDay(dayIndex)}
              className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200"
              disabled={schedule.length === 1}
            >
              Видалити день
            </button>
          </div>

          <div className="space-y-3 ml-8">
            {day.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="Опис активності"
                />
                <button
                  type="button"
                  onClick={() => removeActivity(dayIndex, activityIndex)}
                  className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200"
                  disabled={day.activities.length === 1}
                >
                  Видалити
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addActivity(dayIndex)}
              className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
            >
              + Додати активність
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addDay}
        className="px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200"
      >
        + Додати день
      </button>
    </div>
  );
};

export default ScheduleEditor; 