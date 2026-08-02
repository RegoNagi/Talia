import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Search, 
  BookOpen, 
  Clock, 
  User, 
  Eye, 
  Plus, 
  X,
  Target,
  List,
  CheckCircle2,
  FileText,
  Star
} from 'lucide-react';

interface LessonPlanLibraryProps {
  language: Language;
}

const MOCK_PLANS = [
  {
    id: 1,
    title: 'دورة حياة النبات',
    description: 'درس تفاعلي يشرح مراحل نمو النبات من البذرة إلى الثمرة باستخدام أمثلة حية وتجارب عملية.',
    subject: 'العلوم',
    grade: 'الصف الخامس',
    duration: '45 دقيقة',
    author: 'مكتبة تاليا',
    source: 'talia'
  },
  {
    id: 2,
    title: 'مقدمة في الجاذبية الأرضية',
    description: 'شرح مبسط لقوة الجاذبية الأرضية وتأثيرها على الأجسام المختلفة من خلال التجارب المباشرة.',
    subject: 'العلوم',
    grade: 'الصف الخامس',
    duration: '45 دقيقة',
    author: 'مكتبة تاليا',
    source: 'talia'
  },
  {
    id: 3,
    title: 'الكسور العشرية والعمليات عليها',
    description: 'طريقة مبتكرة لفهم الكسور العشرية وربطها بالنقود والمشتريات اليومية.',
    subject: 'الرياضيات',
    grade: 'الصف السادس',
    duration: '60 دقيقة',
    author: 'أ. أحمد محمد',
    source: 'community'
  },
  {
    id: 4,
    title: 'الحضارة المصرية القديمة',
    description: 'رحلة عبر الزمن للتعرف على أسرار الفراعنة وبناء الأهرامات وتفاصيل الحياة اليومية.',
    subject: 'التاريخ',
    grade: 'الصف السابع',
    duration: '90 دقيقة',
    author: 'مكتبة تاليا',
    source: 'talia'
  },
  {
    id: 5,
    title: 'الخلايا الحيوانية والنباتية',
    description: 'مقارنة دقيقة بين أنواع الخلايا باستخدام النماذج ثلاثية الأبعاد والمجهر.',
    subject: 'العلوم',
    grade: 'الصف الثامن',
    duration: '45 دقيقة',
    author: 'خططي',
    source: 'my_plans'
  },
  {
    id: 6,
    title: 'قواعد النحو: المبتدأ والخبر',
    description: 'أسس الجملة الاسمية مع تطبيقات عملية وألعاب لغوية مسلية للطلاب.',
    subject: 'اللغة العربية',
    grade: 'الصف الرابع',
    duration: '45 دقيقة',
    author: 'مكتبة تاليا',
    source: 'talia'
  }
];

export const LessonPlanLibrary: React.FC<LessonPlanLibraryProps> = ({ language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [previewPlan, setPreviewPlan] = useState<any | null>(null);

  const isRTL = language === Language.AR;

  const grades = ['الصف الرابع', 'الصف الخامس', 'الصف السادس', 'الصف السابع', 'الصف الثامن'];
  const subjects = ['العلوم', 'الرياضيات', 'التاريخ', 'اللغة العربية'];
  const sources = ['مكتبة تاليا', 'خططي', 'المجتمع'];

  return (
    <div className="max-w-[1400px] mx-auto pb-12 min-h-screen" dir="rtl">
      
      {/* 1. HEADER & SEARCH/FILTER BAR */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6 font-space">مكتبة خطط الدروس</h1>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="flex-1 w-full relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="البحث عن خطة درس..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            />
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            >
              <option value="">الصف الدراسي</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            >
              <option value="">المادة</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            >
              <option value="">المصدر</option>
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

      </div>

      {/* 3. LIBRARY GRID & CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PLANS.map((plan) => (
          <div key={plan.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-purple-200 transition-all duration-300 flex flex-col h-[280px] group cursor-pointer shadow-none">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                {plan.subject} - {plan.grade}
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-purple-500 transition-colors">
                <BookOpen size={16} />
              </div>
            </div>
            
            <h3 className="text-xl font-extrabold text-gray-800 mb-2 line-clamp-1 group-hover:text-purple-700 transition-colors">{plan.title}</h3>
            <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2 leading-relaxed">
              {plan.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mt-2">
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{plan.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{plan.author}</span>
              </div>
              <div className="flex items-center gap-0.5 ms-auto" dir="ltr">
                <Star size={12} className="text-amber-400" fill="currentColor" />
                <Star size={12} className="text-amber-400" fill="currentColor" />
                <Star size={12} className="text-amber-400" fill="currentColor" />
                <Star size={12} className="text-amber-400" fill="currentColor" />
                <Star size={12} className="text-gray-200" />
              </div>
            </div>
            
            {/* Card Footer Actions */}
            <div className="mt-auto flex gap-3 pt-4 border-t border-gray-50">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewPlan(plan);
                }}
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-bold transition-colors shadow-none border border-transparent"
              >
                <Eye size={16} />
                معاينة
              </button>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="bg-purple-600 text-white hover:bg-purple-700 flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-bold shadow-none border border-purple-600 transition-all"
              >
                <Plus size={16} />
                إضافة للمادة
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. PREVIEW MODAL */}
      {previewPlan && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-900/40 backdrop-blur-sm sm:items-center p-4">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{previewPlan.title}</h2>
                  <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                    <span className="text-violet-600">{previewPlan.subject}</span>
                    <span className="opacity-50">•</span>
                    <span>{previewPlan.grade}</span>
                    <span className="opacity-50">•</span>
                    <span>{previewPlan.duration}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setPreviewPlan(null)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Simulated Document Preview */}
            <div className="flex-1 overflow-y-auto p-8 text-slate-700 font-medium">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-violet-900 flex items-center gap-2 mb-4 bg-violet-50/50 p-2.5 rounded-lg border-r-4 border-violet-500">
                  <Target size={18} className="text-violet-600" />
                  الأهداف التعليمية
                </h3>
                <ul className="list-disc list-inside space-y-2 pr-4 text-slate-700">
                  <li>أن يتعرف الطالب على المفهوم الأساسي للدرس.</li>
                  <li>استنتاج الأهمية العملية في الحياة اليومية.</li>
                  <li>تطبيق المعرفة من خلال حل المشكلات.</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-violet-900 flex items-center gap-2 mb-4 bg-violet-50/50 p-2.5 rounded-lg border-r-4 border-violet-500">
                  <List size={18} className="text-violet-600" />
                  المواد والأدوات اللازمة
                </h3>
                <ul className="list-disc list-inside space-y-2 pr-4 text-slate-700">
                  <li>جهاز عرض وعرض تقديمي (PowerPoint).</li>
                  <li>أوراق عمل للطلاب.</li>
                  <li>مواد التجربة العملية المخصصة.</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-violet-900 flex items-center gap-2 mb-5 bg-violet-50/50 p-2.5 rounded-lg border-r-4 border-violet-500">
                  <Clock size={18} className="text-violet-600" />
                  المسار الزمني
                </h3>
                <div className="space-y-4 pr-2">
                  <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-16 h-8 shrink-0 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                      10 دقائق
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15px]">التمهيد</h4>
                      <p className="text-[14px] text-slate-600 mt-1.5 leading-relaxed">نشاط افتتاحي لكسر الجليد وربط الموضوع بالدرس السابق.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-16 h-8 shrink-0 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                      20 دقيقة
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15px]">الشرح والتطبيق</h4>
                      <p className="text-[14px] text-slate-600 mt-1.5 leading-relaxed">عرض المادة العلمية وتوزيع أوراق العمل ليقوم الطلاب بحلها في مجموعات.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-16 h-8 shrink-0 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                      15 دقيقة
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15px]">التقييم الخاتمي</h4>
                      <p className="text-[14px] text-slate-600 mt-1.5 leading-relaxed">طرح أسئلة شفهية وتلخيص النقاط الرئيسية للدرس.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-violet-900 flex items-center gap-2 mb-3 bg-violet-50/50 p-2.5 rounded-lg border-r-4 border-violet-500">
                  <CheckCircle2 size={18} className="text-violet-600" />
                  التقييم المستمر
                </h3>
                <p className="text-[14px] text-slate-700 pr-4 leading-relaxed">
                  متابعة الطلاب خلال العمل الجماعي وتقديم الملاحظات الفورية والتوجيه لضمان فهم واستيعاب الجميع للدرس بفعالية وكفاءة.
                </p>
              </div>
            </div>

            {/* Modal Sticky Footer Action */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
              <button 
                onClick={() => setPreviewPlan(null)}
                className="w-full bg-violet-600 text-white font-bold text-base rounded-2xl py-4 shadow-sm hover:shadow-md hover:bg-violet-700 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-violet-200"
              >
                <Plus size={20} />
                استيراد هذه الخطة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
