import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white ${props.className || ''}`}
    />
  );
});
Input.displayName = 'Input';
