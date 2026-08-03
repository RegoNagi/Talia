import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getAllCurriculumLessonPlans, deleteCurriculumLessonPlan, assignLessonPlanToSubject, getAllDistinctSubjects } from '../services/supabaseData';
import { showToast } from '../components/Toast';
import { confirmDialog } from '../components/ConfirmDialog';
import { 
  Search, 
  BookOpen, 
  Eye, 
  Pencil,
  Trash2,
  CheckCircle2,
  Layers,
  Calendar,
} from 'lucide-react';

interface LessonPlanLibraryProps {
  language: Language;
  permissions?: string[];
  onOpenPlan: (planId: string, mode: 'edit' | 'view') => void;
}

export const LessonPlanLibrary: React.FC<LessonPlanLibraryProps> = ({ language, permissions = [], onOpenPlan }) => {
  const canEditLessonPlans = permissions.length === 0 || permissions.includes('curriculum_lesson_plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [plans, setPlans] = useState<{ id: string; title: string; content: string; grade: string; subject: string; createdAt: string; assigned: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState<string[]>([]);

  const isRTL = language === Language.AR;
  const GRADE_LEVELS_LIB = ['الصف 9', 'الصف 10', 'الصف 11', 'الصف 12'];

  const refreshPlans = () => {
    setIsLoading(true);
    getAllCurriculumLessonPlans().then((data) => {
      setPlans(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getAllCurriculumLessonPlans(), getAllDistinctSubjects()]).then(([plansData, subjectsData]) => {
      setPlans(plansData);
      setAllSubjects(subjectsData);
      setIsLoading(false);
    });
  }, []);

  const grades = GRADE_LEVELS_LIB;
  const subjects = allSubjects;

  const filteredPlans = plans.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedGrade || p.grade === selectedGrade) &&
    (!selectedSubject || p.subject === selectedSubject)
  );

  const handleDelete = async (planId: string) => {
    const confirmed = await confirmDialog('متأكد إنك عايز تمسح خطة الدرس دي؟', 'حذف');
    if (!confirmed) return;
    const ok = await deleteCurriculumLessonPlan(planId);
    if (ok) {
      refreshPlans();
      showToast('تم حذف الخطة.', 'success');
    } else {
      showToast('حصل خطأ أثناء الحذف.', 'error');
    }
  };

  const handleAssign = async (planId: string) => {
    const ok = await assignLessonPlanToSubject(planId);
    if (ok) {
      refreshPlans();
      showToast('تمت إضافة الخطة لتاب "خطط الدروس" بتاع المادة.', 'success');
    } else {
      showToast('حصل خطأ أثناء الإضافة.', 'error');
    }
  };

  const parseContent = (content: string): { blocks: any[]; topic: string } => {
    try {
      const parsed = JSON.parse(content);
      return { blocks: parsed.blocks || [], topic: parsed.topic || '' };
    } catch {
      return { blocks: [], topic: '' };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 min-h-screen" dir="rtl">
      
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
          </div>
        </div>

      </div>

      {isLoading && (
        <p className="text-center text-gray-400 py-20">جاري تحميل خطط الدروس...</p>
      )}

      {!isLoading && filteredPlans.length === 0 && (
        <p className="text-center text-gray-400 py-20">مفيش خطط دروس محفوظة لسه — أنشئ واحدة من "مخطط الدروس".</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const { blocks, topic } = parseContent(plan.content);
          return (
            <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                    {plan.subject} · {plan.grade}
                  </span>
                  {plan.assigned && (
                    <span className="flex items-center gap-1 text-emerald-600" title="مضافة لخطط الدروس بتاعة المادة">
                      <CheckCircle2 size={16} />
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{plan.title}</h3>
                {topic && (
                  <p className="text-xs text-gray-400 font-medium mb-3 line-clamp-1">{topic}</p>
                )}

                <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                  <span className="flex items-center gap-1"><Layers size={12} /> {blocks.length} عناصر</span>
                  {plan.createdAt && <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(plan.createdAt)}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-4 py-3 border-t border-gray-50">
                <button 
                  onClick={() => onOpenPlan(plan.id, 'view')}
                  className="flex-1 text-gray-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg py-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                >
                  <Eye size={14} />
                  معاينة
                </button>
                {canEditLessonPlans && (
                  <button 
                    onClick={() => onOpenPlan(plan.id, 'edit')}
                    className="w-8 h-8 shrink-0 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg flex items-center justify-center transition-colors"
                    title="تعديل"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                {canEditLessonPlans && !plan.assigned && (
                  <button 
                    onClick={() => handleAssign(plan.id)}
                    className="w-8 h-8 shrink-0 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center transition-colors"
                    title="إضافة لخطط الدروس بتاعة المادة"
                  >
                    <CheckCircle2 size={14} />
                  </button>
                )}
                {canEditLessonPlans && (
                  <button 
                    onClick={() => handleDelete(plan.id)}
                    className="w-8 h-8 shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
