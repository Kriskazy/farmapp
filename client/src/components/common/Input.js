import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600
            bg-white dark:bg-slate-800 text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            transition-all duration-200 outline-none
            disabled:bg-slate-50 disabled:text-slate-500
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
