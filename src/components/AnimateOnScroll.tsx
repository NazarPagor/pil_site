'use client';

import { useState, useRef, useEffect } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation: string;
  delay?: number;
}

export default function AnimateOnScroll({ children, animation, delay = 0 }: AnimateOnScrollProps) {
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