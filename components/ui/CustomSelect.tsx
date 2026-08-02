import React from 'react';

export const CustomSelect = ({ options, value, onChange, placeholder }: { options: string[], value: string, onChange: (val: string) => void, placeholder?: string }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white"
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
};
