import React from 'react';
import { Settings, Wand2, LibraryBig } from 'lucide-react';
import { Language } from '../types';

interface CurriculumHubProps {
  language: Language;
  onNavigate: (view: string) => void;
}

export const CurriculumHub: React.FC<CurriculumHubProps> = ({ language, onNavigate }) => {
  return (
    <div className="max-w-[1400px] mx-auto pb-12 pt-10 min-h-screen" dir="rtl">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4 font-space">إدارة المنهج الدراسي</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          مركز التحكم الشامل لبناء الأطر التعليمية، وتخطيط الدروس، وإدارة المكتبة الرقمية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        
        {/* Card 1: Curriculum Setup */}
        <div 
          onClick={() => onNavigate('curr-setup')}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group relative overflow-hidden after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1.5 after:bg-violet-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right"
        >
          <div className="bg-violet-50 text-violet-600 w-20 h-20 flex items-center justify-center text-4xl mb-6 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
            <Settings size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">إعداد المناهج</h2>
          <p className="text-slate-500 leading-relaxed font-medium">
            تحديد الأطر التعليمية، وبناء الهيكل الأكاديمي آلياً للصفوف والمواد.
          </p>
        </div>

        {/* Card 2: Lesson Planner */}
        <div 
          onClick={() => onNavigate('lessons-planner')}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group relative overflow-hidden after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1.5 after:bg-violet-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right"
        >
          <div className="bg-violet-50 text-violet-600 w-20 h-20 flex items-center justify-center text-4xl mb-6 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
            <Wand2 size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">مخطط الدروس</h2>
          <p className="text-slate-500 leading-relaxed font-medium">
            مساحة العمل الذكية لبناء وتوليد خطط الدروس آلياً بالذكاء الاصطناعي أو يدوياً.
          </p>
        </div>

        {/* Card 3: Lesson Plan Library */}
        <div 
          onClick={() => onNavigate('lessons-library')}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group relative overflow-hidden after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1.5 after:bg-violet-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right"
        >
          <div className="bg-violet-50 text-violet-600 w-20 h-20 flex items-center justify-center text-4xl mb-6 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
            <LibraryBig size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">مكتبة خطط الدروس</h2>
          <p className="text-slate-500 leading-relaxed font-medium">
            تصفح، استكشاف، واستيراد خطط الدروس الجاهزة لموادك بضغطة زر.
          </p>
        </div>

      </div>
    </div>
  );
};
