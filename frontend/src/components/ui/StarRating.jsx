import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, max = 5, onChange, readonly = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(starNumber)}
            className={`transition-all duration-150 ${
              readonly ? 'cursor-default' : 'hover:scale-110 cursor-pointer focus:outline-none'
            }`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-slate-600 hover:text-slate-500'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
