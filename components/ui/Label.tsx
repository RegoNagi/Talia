import React from 'react';

export const Label = ({ children, required, className = '' }: { children: React.ReactNode, required?: boolean, className?: string }) => (
  <label className={`block text-sm font-medium text-slate-700 mb-1 ${className}`}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);
