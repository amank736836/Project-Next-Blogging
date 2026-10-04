import React, { useId } from 'react';

/**
 * Labelled field with a focus halo and a shake on validation error.
 * `float` switches to the floating-label treatment used on the marketing forms.
 */
const Input = React.forwardRef(function Input(
  { label, type = 'text', className = '', error, hint, float = false, icon, ...props },
  ref
) {
  const id = useId();

  const input = (
    <input
      type={type}
      id={id}
      ref={ref}
      placeholder={float ? props.placeholder ?? ' ' : props.placeholder}
      {...props}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
      className={[
        'field',
        type === 'file' && 'file:mr-3 file:rounded-full file:border-0 file:bg-accent/12 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-accent',
        error && 'field-error shake',
        float && 'pt-5',
        icon && 'pl-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );

  return (
    <div className="w-full text-fg">
      {label && !float && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}

      <div className={`float-wrap group ${error ? 'shake' : ''}`}>
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-faint transition-colors duration-300 group-focus-within:text-accent">
            {icon}
          </span>
        )}
        {input}
        {float && label && <label className="float-label" htmlFor={id}>{label}</label>}
      </div>

      {error ? (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#e5484d]">
          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-[#e5484d]" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
