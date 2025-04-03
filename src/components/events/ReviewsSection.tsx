'use client';

import React from 'react';
import Image from 'next/image';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

type Review = {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  rating: number;
  text: string;
};

type ReviewsSectionProps = {
  reviews: Review[];
  eventName: string;
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, eventName }) => {
  // Функція для рендерингу зірок рейтингу
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarSolid key={i} className="h-5 w-5 text-yellow-400" />);
      } else {
        stars.push(<StarOutline key={i} className="h-5 w-5 text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 mb-10">
      <h2 className="text-2xl font-semibold text-primary-900 mb-2">
        Відгуки про поїздку
      </h2>
      <p className="text-gray-600 mb-8">
        Що говорять учасники про {eventName}
      </p>

      {reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">Ця поїздка поки не має відгуків</p>
          <button className="mt-4 inline-flex items-center text-primary-700 hover:text-primary-800">
            Залишити перший відгук
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {review.author.avatar ? (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={review.author.avatar}
                        alt={review.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {review.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{review.author.name}</h3>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  
                  <div className="flex mt-1 mb-3">
                    {renderStars(review.rating)}
                  </div>
                  
                  <p className="text-gray-700">{review.text}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4 text-center">
            <button className="inline-block px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors">
              Залишити відгук
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection; 