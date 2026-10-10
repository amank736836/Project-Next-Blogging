import React, { forwardRef, useId } from 'react';

/** Native select, restyled — chevron rotates while open/focused. */
function Select({ options = [], label, className = '', error, ...props }, ref) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          {...props}
          id={id}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          className={`field cursor-pointer appearance-none pr-10 ${
            error ? 'field-error' : ''
          } ${className}`}
        >
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] peer-focus:rotate-180 focus-within:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-[#e5484d]">{error}</p>}
    </div>
  );
}

export default forwardRef(Select);
