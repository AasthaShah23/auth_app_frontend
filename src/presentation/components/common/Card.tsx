import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{title}</h3>}
      {children}
    </div>
  );
};

