import React, { forwardRef } from 'react';

export const Input = forwardRef(
  ({ label, error, icon: Icon, rightElement, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`block w-full rounded-lg bg-slate-900/90 border px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
              Icon ? 'pl-9' : ''
            } ${rightElement ? 'pr-10' : ''} ${
              error
                ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500 text-rose-100'
                : 'border-slate-700 hover:border-slate-600'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-rose-400"></span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
