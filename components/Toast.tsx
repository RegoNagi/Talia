import React, { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toasts: ToastItem[] = [];
let listeners: ((items: ToastItem[]) => void)[] = [];
let counter = 0;

function emit() {
  listeners.forEach((l) => l(toasts));
}

// بديل خفيف لـ alert() الأصلية — رسالة بتظهر وتختفي لوحدها من غير ما توقف الشاشة أو تسبب أي اهتزاز
export function showToast(message: string, type: ToastType = 'info') {
  const id = ++counter;
  toasts = [...toasts, { id, message, type }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 4000);
}

export const ToastContainer: React.FC = () => {
  const [items, setItems] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((l) => l !== setItems);
    };
  }, []);

  if (items.length === 0) return null;

  const colors: Record<ToastType, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-slate-800',
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={`px-5 py-3 rounded-xl shadow-lg text-sm font-bold text-white max-w-md text-center pointer-events-auto ${colors[t.type]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};
