import React from 'react';

const ResponsiveCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'dashboard':
        return 'dashboard-card bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700';
      case 'flashcard':
        return 'flashcard-mobile md:flashcard-desktop bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300';
      case 'question':
        return 'question-card bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700';
      default:
        return 'bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'p-3 md:p-4';
      case 'large':
        return 'p-4 md:p-6 lg:p-8';
      default:
        return 'p-4 md:p-6';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${getSizeClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveCard;

