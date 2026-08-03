import React, { useEffect, useState } from 'react';

interface ConfirmState {
  open: boolean;
  message: string;
  confirmLabel: string;
  danger: boolean;
}

let state: ConfirmState = { open: false, message: '', confirmLabel: 'تأكيد', danger: true };
let listeners: ((s: ConfirmState) => void)[] = [];
let resolver: ((v: boolean) => void) | null = null;

function emit() {
  listeners.forEach((l) => l(state));
}

// بديل لـ confirm() الأصلية بتاعة المتصفح — نافذة تأكيد داخل التطبيق نفسه، متسقة بصريًا وبدون أي اهتزاز
export function confirmDialog(message: string, confirmLabel: string = 'تأكيد', danger: boolean = true): Promise<boolean> {
  return new Promise((resolve) => {
    resolver = resolve;
    state = { open: true, message, confirmLabel, danger };
    emit();
  });
}

export const ConfirmDialogContainer: React.FC = () => {
  const [s, setS] = useState<ConfirmState>(state);

  useEffect(() => {
    listeners.push(setS);
    return () => {
      listeners = listeners.filter((l) => l !== setS);
    };
  }, []);

  if (!s.open) return null;

  const handle = (value: boolean) => {
    state = { ...state, open: false };
    setS(state);
    if (resolver) {
      resolver(value);
      resolver = null;
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-900/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <p className="text-gray-800 font-bold mb-6 leading-relaxed">{s.message}</p>
        <div className="flex gap-3">
          <button
            onClick={() => handle(false)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm"
          >
            إلغاء
          </button>
          <button
            onClick={() => handle(true)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm ${s.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-violet-600 hover:bg-violet-700'}`}
          >
            {s.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
