import React, { useId } from "react";

const Input = React.forwardRef(function Input(
    { label, type = "text", className = "", error, ...props },
    ref
) {
    const id = useId();
    return (
        <div className="w-full dark:text-white">
            {label && (
                <label className="inline-block pl-1 mb-1" htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-gray-700 duration-200 border w-full ${className} ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                ref={ref}
                {...props}
                id={id}
                suppressHydrationWarning
            />
            {error && <p className="mt-1 text-red-600">{error}</p>}
        </div>
    );
});

export default Input;
