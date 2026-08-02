import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, ChevronDown, BookOpen } from 'lucide-react';
import { getPeriods, createPeriod } from '../services/supabaseData';

const ARABIC_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const todayArabicDay = () => {
  const map = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return map[new Date().getDay()];
};

export const ClassCalendar = ({ sectionId }: { sectionId: string }) => {
  const [view, setView] = useState<'Day' | 'Week'>('Week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formSubject, setFormSubject] = useState('رياضيات');
  const [formDay, setFormDay] = useState(ARABIC_DAYS[0]);
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('09:45');

  // الحصص الحقيقية بتاعة الفصل ده — بتتحمّل من قاعدة البيانات
  const [sessions, setSessions] = useState<{ id: string; subject: string; day: string; startTime: string; endTime: string; color: string }[]>([]);

  const loadPeriods = () => {
    if (!sectionId) return;
    getPeriods(sectionId).then(periods => {
      setSessions(periods.map(p => ({ ...p, color: 'blue' })));
    });
  };

  React.useEffect(() => {
    loadPeriods();
  }, [sectionId]);

  const days = ARABIC_DAYS;
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
  const subjects = ['رياضيات', 'علوم', 'لغة عربية', 'لغة إنجليزية', 'تاريخ', 'فنون'];

  const colorMap: Record<string, string> = {
    blue: 'bg-violet-100 border-l-4 border-violet-600 text-violet-800',
    emerald: 'bg-emerald-100 border-l-4 border-emerald-500 text-emerald-800',
    amber: 'bg-violet-100 border-l-4 border-violet-600 text-violet-800',
    indigo: 'bg-violet-100 border-l-4 border-violet-500 text-violet-800',
  };

  const handleSlotClick = (day: string, time: string) => {
    setSelectedSlot({ day, time });
    setFormDay(day);
    setFormStartTime(time);
    const nextTimeIndex = times.indexOf(time) + 1;
    setFormEndTime(nextTimeIndex < times.length ? times[nextTimeIndex] : '15:00');
    setIsModalOpen(true);
  };

  const renderGrid = () => {
    const activeDays = view === 'Day' ? [todayArabicDay()] : days;

    return (
      <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className={`grid ${view === 'Day' ? 'grid-cols-2' : 'grid-cols-6'} border-b border-slate-200 bg-slate-50 sticky top-0 z-10`}>
            <div className="p-4 border-r border-slate-200 text-center text-sm font-medium text-slate-500">الوقت</div>
            {activeDays.map(day => (
              <div key={day} className="p-4 border-r border-slate-200 text-center text-sm font-bold text-slate-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          {/* Time Rows */}
          {times.map(time => (
            <div key={time} className={`grid ${view === 'Day' ? 'grid-cols-2' : 'grid-cols-6'} border-b border-slate-100 last:border-b-0`}>
              <div className="p-4 border-r border-slate-200 text-center text-xs font-medium text-slate-500 bg-slate-50/50">
                {time}
              </div>
              {activeDays.map(day => {
                const session = sessions.find(s => s.day === day && s.startTime === time);
                return (
                  <div 
                    key={`${day}-${time}`} 
                    onClick={() => !session && handleSlotClick(day, time)}
                    className={`p-2 border-r border-slate-100 last:border-r-0 h-24 transition-colors relative group ${!session ? 'hover:bg-violet-50 cursor-pointer' : ''}`}
                  >
                    {!session && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Plus size={24} className="text-violet-400" />
                      </div>
                    )}
                    {session && (
                      <div className={`h-full w-full rounded p-3 ${colorMap[session.color]} flex flex-col shadow-sm`}>
                        <span className="text-sm font-bold">{session.subject}</span>
                        <span className="text-xs opacity-80 mt-1">{session.startTime} - {session.endTime}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex-1 flex flex-col animate-in fade-in duration-500">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">الجدول الأسبوعي</h2>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            {(['Day', 'Week'] as const).map(v => (
              <button 
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 md:flex-none px-4 py-1.5 text-sm rounded-md transition-all ${view === v ? 'bg-white text-slate-800 font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                {v === 'Day' ? 'اليوم' : 'الأسبوع'}
              </button>
            ))}
          </div>
          <button 
            onClick={() => { setSelectedSlot(null); setFormDay(todayArabicDay()); setIsModalOpen(true); }}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={18} /> إضافة حصة +
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {renderGrid()}

      {/* إضافة حصة + Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">إضافة حصة جديدة</h3>
            
            <div className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">المادة</label>
                <select
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">اليوم</label>
                <select
                  value={formDay}
                  onChange={e => setFormDay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {ARABIC_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">الوقت</label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <span className="text-slate-400 font-medium">-</span>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button 
                disabled={isSaving || !formSubject}
                onClick={async () => {
                  setIsSaving(true);
                  const id = await createPeriod({
                    sectionId,
                    subject: formSubject,
                    day: formDay,
                    startTime: formStartTime,
                    endTime: formEndTime,
                  });
                  setIsSaving(false);
                  if (id) {
                    loadPeriods();
                    setIsModalOpen(false);
                  } else {
                    alert('حصل خطأ أثناء حفظ الحصة. تأكد إنك شغّلت كود إنشاء جدول class_periods في Supabase.');
                  }
                }}
                className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ الحصة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
