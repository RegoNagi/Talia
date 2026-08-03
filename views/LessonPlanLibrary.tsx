import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getAllCurriculumLessonPlans, deleteCurriculumLessonPlan } from '../services/supabaseData';
import { showToast } from '../components/Toast';
import { confirmDialog } from '../components/ConfirmDialog';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Eye, 
  X,
  Target,
  List,
  CheckCircle2,
  FileText,
  Trash2
} from 'lucide-react';

interface LessonPlanLibraryProps {
  language: Language;
  permissions?: string[];
}

export const LessonPlanLibrary: React.FC<LessonPlanLibraryProps> = ({ language, permissions = [] }) => {
  const canEditLessonPlans = permissions.length === 0 || permissions.includes('curriculum_lesson_plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [previewPlan, setPreviewPlan] = useState<any | null>(null);
  const [plans, setPlans] = useState<{ id: string; title: string; content: string; grade: string; subject: string; createdAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isRTL = language === Language.AR;

  const refreshPlans = () => {
    setIsLoading(true);
    getAllCurriculumLessonPlans().then((data) => {
      setPlans(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    refreshPlans();
  }, []);

  const grades = Array.from(new Set(plans.map(p => p.grade))).sort();
  const subjects = Array.from(new Set(plans.map(p => p.subject))).sort();

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

  const parseContent = (content: string): { blocks: any[]; topic: string } => {
    try {
      const parsed = JSON.parse(content);
      return { blocks: parsed.blocks || [], topic: parsed.topic || '' };
    } catch {
      return { blocks: [], topic: '' };
    }
  };

  const renderBlockIcon = (type: string) => {
    switch (type) {
      case 'objectives': return <Target size={18} className="text-violet-600" />;
      case 'materials': return <List size={18} className="text-violet-600" />;
      case 'timeline': return <Clock size={18} className="text-violet-600" />;
      case 'assessment': return <CheckCircle2 size={18} className="text-violet-600" />;
      default: return <FileText size={18} className="text-violet-600" />;
    }
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
          const { topic } = parseContent(plan.content);
          return (
            <div key={plan.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-purple-200 transition-all duration-300 flex flex-col h-[240px] group cursor-pointer shadow-none">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                  {plan.subject} - {plan.grade}
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-purple-500 transition-colors">
                  <BookOpen size={16} />
                </div>
              </div>
              
              <h3 className="text-xl font-extrabold text-gray-800 mb-2 line-clamp-1 group-hover:text-purple-700 transition-colors">{plan.title}</h3>
              {topic && (
                <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2 leading-relaxed">
                  الموضوع: {topic}
                </p>
              )}
              
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
                {canEditLessonPlans && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}
                  className="bg-red-50 text-red-600 hover:bg-red-100 rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-none border border-transparent transition-all"
                >
                  <Trash2 size={16} />
                </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PREVIEW MODAL */}
      {previewPlan && (() => {
        const { blocks, topic } = parseContent(previewPlan.content);
        return (
          <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-900/40 backdrop-blur-sm sm:items-center p-4">
            <div 
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
              dir="rtl"
            >
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
                      {topic && <><span className="opacity-50">•</span><span>{topic}</span></>}
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

              <div className="flex-1 overflow-y-auto p-8 text-slate-700 font-medium">
                {blocks.length === 0 && (
                  <p className="text-center text-gray-400 py-10">مفيش محتوى محفوظ لهذه الخطة.</p>
                )}
                {blocks.map((block: any) => (
                  <div key={block.id} className="mb-8">
                    <h3 className="text-lg font-bold text-violet-900 flex items-center gap-2 mb-4 bg-violet-50/50 p-2.5 rounded-lg border-r-4 border-violet-500">
                      {renderBlockIcon(block.type)}
                      {block.title}
                    </h3>
                    {block.type === 'timeline' ? (
                      <div className="space-y-4 pr-2">
                        {(block.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                            <div className="w-20 h-8 shrink-0 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                              {item.time}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-[15px]">{item.title}</h4>
                              <p className="text-[14px] text-slate-600 mt-1.5 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="pr-4 text-slate-700" dangerouslySetInnerHTML={{ __html: block.rawHtml || '' }} />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                <button 
                  onClick={() => setPreviewPlan(null)}
                  className="w-full bg-violet-600 text-white font-bold text-base rounded-2xl py-4 shadow-sm hover:shadow-md hover:bg-violet-700 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
