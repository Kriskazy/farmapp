import React from 'react';

const Card = ({ children, className = '', hover = false, glass = false }) => {
  const baseStyles = 'p-6 bg-white dark:bg-slate-800 rounded-2xl transition-all duration-200 border border-slate-100 dark:border-slate-700';
  
  const variants = {
    default: 'shadow-soft hover:shadow-lg',
    glass: 'glass-panel border-white/40 dark:bg-slate-800/50 dark:border-slate-700/50',
    flat: 'border border-slate-200 dark:border-slate-700',
  };

  const currentVariantStyles = glass ? variants.glass : variants.default;

  const hoverStyles = hover
    ? 'hover:shadow-lg hover:-translate-y-1 hover:border-primary-100'
    : '';

  const classNameCombined = `${baseStyles} ${currentVariantStyles} ${hoverStyles} ${className}`;
  return (
    <div className={classNameCombined}>
      {children}
    </div>
  );
};

export default Card;

