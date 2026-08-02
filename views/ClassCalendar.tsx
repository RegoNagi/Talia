import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, ChevronDown, BookOpen } from 'lucide-react';

// Custom Select Component to avoid native selects
const CustomSelect = ({ value, options, onChange, icon: Icon }: { value: string, options: string[], onChange: (val: string) => void, icon?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm">
          {Icon && <Icon size={16} className="text-slate-400" />}
          {value}
        </span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 max-h-48 overflow-y-auto">
          {options.map((opt: string) => (
            <div 
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ClassCalendar = () => {
  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string } | null>(null);

  // Form State
  const [formSubject, setFormSubject] = useState('Mathematics');
  const [formStartTime, setFormStartTime] = useState('09:00 AM');
  const [formEndTime, setFormEndTime] = useState('10:00 AM');

  // Mock sessions
  const [sessions, setSessions] = useState([
    { id: 1, subject: 'Mathematics', day: 'Mon 12', startTime: '09:00 AM', endTime: '10:00 AM', color: 'blue' },
    { id: 2, subject: 'Science', day: 'Tue 13', startTime: '10:00 AM', endTime: '11:00 AM', color: 'emerald' },
    { id: 3, subject: 'Arabic', day: 'Wed 14', startTime: '11:00 AM', endTime: '12:00 PM', color: 'amber' },
    { id: 4, subject: 'English', day: 'Thu 15', startTime: '08:00 AM', endTime: '09:00 AM', color: 'indigo' },
  ]);

  const days = ['Sun 11', 'Mon 12', 'Tue 13', 'Wed 14', 'Thu 15'];
  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'];
  const subjects = ['Mathematics', 'Science', 'Arabic', 'English', 'History', 'Art'];

  const colorMap: Record<string, string> = {
    blue: 'bg-violet-100 border-l-4 border-violet-600 text-violet-800',
    emerald: 'bg-emerald-100 border-l-4 border-emerald-500 text-emerald-800',
    amber: 'bg-violet-100 border-l-4 border-violet-600 text-violet-800',
    indigo: 'bg-violet-100 border-l-4 border-violet-500 text-violet-800',
  };

  const handleSlotClick = (day: string, time: string) => {
    setSelectedSlot({ day, time });
    setFormStartTime(time);
    const nextTimeIndex = times.indexOf(time) + 1;
    setFormEndTime(nextTimeIndex < times.length ? times[nextTimeIndex] : '03:00 PM');
    setIsModalOpen(true);
  };

  const renderGrid = () => {
    if (view === 'Month') {
      return (
        <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="p-3 border-r border-slate-200 text-center text-sm font-bold text-slate-700 last:border-r-0">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
            {Array.from({ length: 35 }).map((_, i) => {
              const date = i - 3; // Offset to start month on Thursday
              const isCurrentMonth = date > 0 && date <= 31;
              const displayDate = isCurrentMonth ? date : (date <= 0 ? 30 + date : date - 31);
              
              return (
                <div 
                  key={i} 
                  onClick={() => setIsModalOpen(true)}
                  className={`p-2 border-r border-b border-slate-100 transition-colors hover:bg-violet-50 cursor-pointer ${!isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'text-slate-700'}`}
                >
                  <span className="text-sm font-medium">{displayDate}</span>
                  {isCurrentMonth && date === 12 && (
                    <div className="mt-1 p-1 text-[10px] font-bold bg-violet-100 text-violet-800 rounded">Math (09:00 AM)</div>
                  )}
                  {isCurrentMonth && date === 13 && (
                    <div className="mt-1 p-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">Science (10:00 AM)</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const activeDays = view === 'Day' ? ['Mon 12'] : days;

    return (
      <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className={`grid ${view === 'Day' ? 'grid-cols-2' : 'grid-cols-6'} border-b border-slate-200 bg-slate-50 sticky top-0 z-10`}>
            <div className="p-4 border-r border-slate-200 text-center text-sm font-medium text-slate-500">Time</div>
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
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Today
          </button>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={20} className="text-slate-600" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight size={20} className="text-slate-600" /></button>
          </div>
          <h2 className="text-xl font-bold text-slate-900">October 2026</h2>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            {(['Day', 'Week', 'Month'] as const).map(v => (
              <button 
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 md:flex-none px-4 py-1.5 text-sm rounded-md transition-all ${view === v ? 'bg-white text-slate-800 font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button 
            onClick={() => { setSelectedSlot(null); setIsModalOpen(true); }}
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Schedule New Session</h3>
            
            <div className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                <CustomSelect 
                  value={formSubject} 
                  options={subjects} 
                  onChange={setFormSubject}
                  icon={BookOpen}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly
                    value={selectedSlot ? `October ${selectedSlot.day.split(' ')[1]}, 2026` : 'October 12, 2026'}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer hover:border-slate-300 transition-colors"
                  />
                  <CalendarIcon className="absolute right-4 top-2.5 text-slate-400" size={18} />
                </div>
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Day of Week</label>
                <input 
                  type="text" 
                  readOnly
                  value={selectedSlot ? selectedSlot.day.split(' ')[0] : 'Monday'}
                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl px-4 py-2.5 cursor-not-allowed"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Time Slot</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <CustomSelect 
                      value={formStartTime} 
                      options={times} 
                      onChange={setFormStartTime}
                      icon={Clock}
                    />
                  </div>
                  <span className="text-slate-400 font-medium">-</span>
                  <div className="flex-1">
                    <CustomSelect 
                      value={formEndTime} 
                      options={times} 
                      onChange={setFormEndTime}
                      icon={Clock}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
