import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { generateLessonPlan } from '../services/geminiService';
import { Button } from '../components/Button';
import { showToast } from '../components/Toast';
import { confirmDialog } from '../components/ConfirmDialog';
import {
  getCurriculumSubjectsDetailed, addCurriculumSubject, removeCurriculumSubject,
  getCurriculumWeeks, saveCurriculumWeek, deleteCurriculumWeek,
  getCurriculumResources, addCurriculumResource, deleteCurriculumResource,
  getCurriculumLessonPlans, createCurriculumLessonPlan, deleteCurriculumLessonPlan,
} from '../services/supabaseData';
import {
  Folder,
  FolderOpen,
  BookOpen,
  Wand2,
  Calendar,
  FileText,
  Trash2,
  Plus,
  X as XIcon,
  Search,
  Clock,
  ArrowLeft,
  Link2,
} from 'lucide-react';

interface CurriculumProps {
  language: Language;
  permissions?: string[];
}

const GRADE_LEVELS = ['الصف 9', 'الصف 10', 'الصف 11', 'الصف 12'];

const formatArabicDate = (dateString: string) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const monthMap = monthNames[monthIndex] || parts[1];
  return `${parts[2]} ${monthMap}`;
};

const AddSubjectModal: React.FC<{ grade: string; onClose: () => void; onSubmit: (data: any) => Promise<boolean> }> = ({ grade, onClose, onSubmit }) => {
  const [form, setForm] = useState({ subject: '', code: '', nameEn: '', department: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.subject.trim()) return;
    setIsSubmitting(true);
    const ok = await onSubmit(form);
    setIsSubmitting(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">إضافة مادة لـ{grade}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><XIcon size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">اسم المادة</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="مثال: الرياضيات" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">القسم (اختياري)</label>
            <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="مثال: العلوم" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>إلغاء</Button>
          <Button className="bg-violet-600 text-white hover:bg-violet-700 flex-1" onClick={handleSubmit} disabled={!form.subject.trim() || isSubmitting}>
            {isSubmitting ? 'جاري الإضافة...' : 'إضافة'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddWeekModal: React.FC<{ nextWeekNumber: number; onClose: () => void; onSubmit: (data: any) => Promise<boolean> }> = ({ nextWeekNumber, onClose, onSubmit }) => {
  const [form, setForm] = useState({ weekNumber: nextWeekNumber, startDate: '', endDate: '', topicsText: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const topics = form.topicsText.split('\n').map(t => t.trim()).filter(Boolean);
    const ok = await onSubmit({ ...form, topics });
    setIsSubmitting(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">إضافة أسبوع {form.weekNumber}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><XIcon size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">من تاريخ</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">إلى تاريخ</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">المواضيع (سطر لكل موضوع)</label>
            <textarea value={form.topicsText} onChange={(e) => setForm({ ...form, topicsText: e.target.value })} rows={4} placeholder={"مقدمة الوحدة\nتطبيقات عملية\nمراجعة"} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>إلغاء</Button>
          <Button className="bg-violet-600 text-white hover:bg-violet-700 flex-1" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ الأسبوع'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddResourceModal: React.FC<{ onClose: () => void; onSubmit: (data: any) => Promise<boolean> }> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({ title: '', type: 'Link', url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.url.trim()) return;
    setIsSubmitting(true);
    const ok = await onSubmit(form);
    setIsSubmitting(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">إضافة مصدر</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><XIcon size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">العنوان</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: شرح الوحدة الأولى" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">النوع</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500">
              <option value="Link">رابط</option>
              <option value="Document">وثيقة</option>
              <option value="Video">فيديو</option>
              <option value="Presentation">عرض تقديمي</option>
              <option value="SCORM">حزمة (SCORM)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">الرابط (URL)</label>
            <input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" dir="ltr" />
          </div>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>إلغاء</Button>
          <Button className="bg-violet-600 text-white hover:bg-violet-700 flex-1" onClick={handleSubmit} disabled={!form.title.trim() || !form.url.trim() || isSubmitting}>
            {isSubmitting ? 'جاري الإضافة...' : 'إضافة'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Curriculum: React.FC<CurriculumProps> = ({ language, permissions = [] }) => {
  const isRTL = language === Language.AR;
  const canEditCurriculum = permissions.length === 0 || permissions.includes('curriculum_edit');

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeSubjectTab, setActiveSubjectTab] = useState<'resources' | 'schedule' | 'plans'>('schedule');

  const [subjectsByGrade, setSubjectsByGrade] = useState<Record<string, { subject: string; code: string; nameEn: string; department: string }[]>>({});
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');

  const [weeks, setWeeks] = useState<{ id: string; weekNumber: number; startDate: string; endDate: string; topics: string[] }[]>([]);
  const [resources, setResources] = useState<{ id: string; title: string; type: string; url: string; folderId: string | null }[]>([]);
  const [lessonPlans, setLessonPlans] = useState<{ id: string; title: string; content: string; weekNumber: number | null }[]>([]);
  const [loadingSubjectData, setLoadingSubjectData] = useState(false);

  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddWeekOpen, setIsAddWeekOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [generatingLesson, setGeneratingLesson] = useState(false);

  const refreshGradeSubjects = (grade: string) => {
    getCurriculumSubjectsDetailed(grade).then((subjects) => {
      setSubjectsByGrade((prev) => ({ ...prev, [grade]: subjects }));
    });
  };

  useEffect(() => {
    setLoadingSubjects(true);
    Promise.all(GRADE_LEVELS.map((g) => getCurriculumSubjectsDetailed(g))).then((results) => {
      const map: Record<string, any[]> = {};
      GRADE_LEVELS.forEach((g, i) => { map[g] = results[i]; });
      setSubjectsByGrade(map);
      setLoadingSubjects(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedGrade || !selectedSubject) return;
    setLoadingSubjectData(true);
    Promise.all([
      getCurriculumWeeks(selectedGrade, selectedSubject),
      getCurriculumResources(selectedGrade, selectedSubject),
      getCurriculumLessonPlans(selectedGrade, selectedSubject),
    ]).then(([w, r, p]) => {
      setWeeks(w);
      setResources(r);
      setLessonPlans(p);
      setLoadingSubjectData(false);
    });
  }, [selectedGrade, selectedSubject]);

  const goBack = () => {
    if (selectedSubject) setSelectedSubject(null);
    else if (selectedGrade) setSelectedGrade(null);
  };

  const handleAddSubject = async (form: any): Promise<boolean> => {
    if (!selectedGrade) return false;
    const ok = await addCurriculumSubject({ grade: selectedGrade, subject: form.subject, code: form.code, nameEn: form.nameEn, department: form.department });
    if (ok) {
      refreshGradeSubjects(selectedGrade);
      showToast('تم إضافة المادة بنجاح.', 'success');
    } else {
      showToast('حصل خطأ أثناء إضافة المادة (ممكن تكون موجودة بالفعل لنفس الصف).', 'error');
    }
    return ok;
  };

  const handleRemoveSubject = async (subject: string) => {
    if (!selectedGrade) return;
    const confirmed = await confirmDialog(`متأكد إنك عايز تمسح مادة "${subject}" من ${selectedGrade}؟ هيتمسح معاها كل الأسابيع والموارد وخطط الدروس المرتبطة بيها.`, 'حذف');
    if (!confirmed) return;
    const ok = await removeCurriculumSubject(selectedGrade, subject);
    if (ok) {
      refreshGradeSubjects(selectedGrade);
      showToast('تم حذف المادة.', 'success');
    } else {
      showToast('حصل خطأ أثناء حذف المادة.', 'error');
    }
  };

  const handleAddWeek = async (form: any): Promise<boolean> => {
    if (!selectedGrade || !selectedSubject) return false;
    const ok = await saveCurriculumWeek({ grade: selectedGrade, subject: selectedSubject, weekNumber: form.weekNumber, startDate: form.startDate, endDate: form.endDate, topics: form.topics });
    if (ok) {
      getCurriculumWeeks(selectedGrade, selectedSubject).then(setWeeks);
      showToast('تم حفظ الأسبوع بنجاح.', 'success');
    } else {
      showToast('حصل خطأ أثناء حفظ الأسبوع.', 'error');
    }
    return ok;
  };

  const handleDeleteWeek = async (weekId: string) => {
    const confirmed = await confirmDialog('متأكد إنك عايز تمسح الأسبوع ده؟', 'حذف');
    if (!confirmed) return;
    const ok = await deleteCurriculumWeek(weekId);
    if (ok && selectedGrade && selectedSubject) {
      getCurriculumWeeks(selectedGrade, selectedSubject).then(setWeeks);
      showToast('تم حذف الأسبوع.', 'success');
    }
  };

  const handleAddResource = async (form: any): Promise<boolean> => {
    if (!selectedGrade || !selectedSubject) return false;
    const id = await addCurriculumResource({ grade: selectedGrade, subject: selectedSubject, title: form.title, type: form.type, url: form.url });
    if (id) {
      getCurriculumResources(selectedGrade, selectedSubject).then(setResources);
      showToast('تم إضافة المصدر بنجاح.', 'success');
    } else {
      showToast('حصل خطأ أثناء إضافة المصدر.', 'error');
    }
    return !!id;
  };

  const handleDeleteResource = async (resourceId: string) => {
    const confirmed = await confirmDialog('متأكد إنك عايز تمسح المصدر ده؟', 'حذف');
    if (!confirmed) return;
    const ok = await deleteCurriculumResource(resourceId);
    if (ok && selectedGrade && selectedSubject) {
      getCurriculumResources(selectedGrade, selectedSubject).then(setResources);
      showToast('تم حذف المصدر.', 'success');
    }
  };

  const handleGenerateAIPlan = async () => {
    if (!selectedGrade || !selectedSubject) return;
    setGeneratingLesson(true);
    const topic = `مقدمة في ${selectedSubject}`;
    const plan = await generateLessonPlan(topic, selectedGrade, selectedSubject, isRTL ? 'ar' : 'en');
    if (plan) {
      const id = await createCurriculumLessonPlan({
        grade: selectedGrade,
        subject: selectedSubject,
        title: plan.topic || topic,
        content: JSON.stringify(plan),
      });
      if (id) {
        getCurriculumLessonPlans(selectedGrade, selectedSubject).then(setLessonPlans);
        showToast('تم إنشاء خطة الدرس وحفظها بنجاح.', 'success');
      } else {
        showToast('اتولّدت الخطة لكن حصل خطأ أثناء حفظها.', 'error');
      }
    } else {
      showToast('حصل خطأ أثناء توليد خطة الدرس.', 'error');
    }
    setGeneratingLesson(false);
  };

  const handleDeleteLessonPlan = async (planId: string) => {
    const confirmed = await confirmDialog('متأكد إنك عايز تمسح خطة الدرس دي؟', 'حذف');
    if (!confirmed) return;
    const ok = await deleteCurriculumLessonPlan(planId);
    if (ok && selectedGrade && selectedSubject) {
      getCurriculumLessonPlans(selectedGrade, selectedSubject).then(setLessonPlans);
      showToast('تم حذف خطة الدرس.', 'success');
    }
  };

  const currentSubjects = selectedGrade ? (subjectsByGrade[selectedGrade] || []) : [];
  const filteredSubjects = currentSubjects.filter(s =>
    s.subject.toLowerCase().includes(subjectSearchQuery.toLowerCase()) ||
    s.department?.toLowerCase().includes(subjectSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-140px)] animate-fadeIn gap-6 relative" dir="rtl">

      {(selectedGrade || selectedSubject) && (
        <div className="lg:hidden flex items-center gap-2 mb-2">
          <button onClick={goBack} className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <span className="font-bold text-gray-900">{selectedSubject || selectedGrade}</span>
        </div>
      )}

      <div className={`w-full lg:w-80 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col ${(selectedGrade || selectedSubject) ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-lg text-gray-900">المنهج الدراسي</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">المراحل والصفوف</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {GRADE_LEVELS.map((grade) => (
            <div key={grade} className="mb-2">
              <div
                onClick={() => { setSelectedGrade(grade); setSelectedSubject(null); }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group ${selectedGrade === grade ? 'bg-violet-50 text-violet-800' : 'hover:bg-gray-50'}`}
              >
                <Folder size={20} className={`${selectedGrade === grade ? 'text-violet-600 fill-violet-200' : 'text-gray-400 fill-gray-50 group-hover:text-violet-400 group-hover:fill-violet-100'}`} />
                <span className={`text-sm font-medium ${selectedGrade === grade ? 'font-bold' : 'text-gray-700'}`}>{grade}</span>
              </div>
              <div className="hidden lg:block">
                {selectedGrade === grade && (
                  <div className="pr-9 space-y-1 mt-1 mb-2 border-r-2 border-gray-100 mr-5">
                    {(subjectsByGrade[grade] || []).map((s) => (
                      <div
                        key={s.subject}
                        onClick={(e) => { e.stopPropagation(); setSelectedSubject(s.subject); }}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedSubject === s.subject ? 'bg-violet-100 border-r-4 border-violet-600 text-violet-800 font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                      >
                        {selectedSubject === s.subject ? <FolderOpen size={16} className="ml-1" /> : <Folder size={16} className="ml-1" />}
                        <span className="text-sm">{s.subject}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col ${(selectedGrade || selectedSubject) ? 'flex' : 'hidden lg:flex'}`}>
        {!selectedGrade ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Folder size={48} className="text-gray-300" />
            </div>
            <p className="text-xl font-medium text-gray-900">لا يوجد تحديد</p>
            <p className="text-sm">اختر صفاً من القائمة الجانبية لإدارة المواد والمحتوى.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">

            {!selectedSubject && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">{selectedGrade}</h2>
                    <p className="text-sm text-gray-500 mt-1">{currentSubjects.length} مواد إجمالية</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="relative max-w-md">
                    <Search className="absolute right-4 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="البحث في المواد..."
                      className="w-full p-3 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      value={subjectSearchQuery}
                      onChange={(e) => setSubjectSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {loadingSubjects ? (
                  <p className="text-center text-gray-400 py-10">جاري تحميل المواد...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubjects.map((s) => (
                      <div
                        key={s.subject}
                        onClick={() => setSelectedSubject(s.subject)}
                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer group relative"
                      >
                        {canEditCurriculum && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveSubject(s.subject); }}
                          className="absolute top-4 left-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                        )}
                        <div>
                          <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} strokeWidth={1.5} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">{s.subject}</h3>
                          {s.department && <p className="text-xs text-gray-400 mt-1">{s.department}</p>}
                        </div>
                      </div>
                    ))}

                    {canEditCurriculum && (
                    <div
                      onClick={() => setIsAddSubjectOpen(true)}
                      className="h-48 rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50/30 hover:bg-violet-50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors text-violet-600 group"
                    >
                      <Plus size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                      <span className="font-bold border-none">إضافة مادة +</span>
                    </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedSubject && (
              <div className="space-y-8">
                <div className="flex justify-between items-center w-full mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-violet-50 p-3 rounded-xl text-violet-600 flex items-center justify-center">
                      <BookOpen size={28} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{selectedSubject}</h2>
                  </div>
                </div>

                <div className="flex gap-6 border-b border-slate-200 mb-8 w-full">
                  <button onClick={() => setActiveSubjectTab('schedule')} className={activeSubjectTab === 'schedule' ? 'text-violet-700 border-b-2 border-violet-600 pb-3 font-bold flex items-center gap-2' : 'text-slate-500 hover:text-slate-700 pb-3 flex items-center gap-2 cursor-pointer transition'}>
                    <Calendar size={18} /> الخطة الأسبوعية
                  </button>
                  <button onClick={() => setActiveSubjectTab('resources')} className={activeSubjectTab === 'resources' ? 'text-violet-700 border-b-2 border-violet-600 pb-3 font-bold flex items-center gap-2' : 'text-slate-500 hover:text-slate-700 pb-3 flex items-center gap-2 cursor-pointer transition'}>
                    <Folder size={18} /> الموارد
                  </button>
                  <button onClick={() => setActiveSubjectTab('plans')} className={activeSubjectTab === 'plans' ? 'text-violet-700 border-b-2 border-violet-600 pb-3 font-bold flex items-center gap-2' : 'text-slate-500 hover:text-slate-700 pb-3 flex items-center gap-2 cursor-pointer transition'}>
                    <FileText size={18} /> خطط الدروس
                  </button>
                </div>

                <div className="max-w-5xl mx-auto w-full">
                  {loadingSubjectData && <p className="text-center text-gray-400 py-10">جاري التحميل...</p>}

                  {!loadingSubjectData && activeSubjectTab === 'schedule' && (
                    <div className="bg-gray-50/50 rounded-3xl p-6 h-fit w-full">
                      <div className="flex justify-between items-center w-full mb-6 border-b border-slate-100 pb-4">
                        <h3 className="text-lg font-bold text-slate-800">الخطة الزمنية للمادة</h3>
                        {canEditCurriculum && (
                        <Button onClick={() => setIsAddWeekOpen(true)} className="bg-violet-600 text-white hover:bg-violet-700 text-sm">
                          <Plus size={16} /> إضافة أسبوع
                        </Button>
                        )}
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        {weeks.map((week) => (
                          <div key={week.id} className="bg-white rounded-2xl border border-slate-200 p-5 w-full shadow-sm group">
                            <div className="flex justify-between items-center w-full mb-4 border-b border-slate-100 pb-2">
                              <span className="text-lg font-bold text-violet-700 tracking-wider block">الأسبوع {week.weekNumber}</span>
                              <div className="flex items-center gap-3">
                                <p className="text-sm font-medium text-slate-500">{formatArabicDate(week.startDate)} - {formatArabicDate(week.endDate)}</p>
                                {canEditCurriculum && (
                                <button onClick={() => handleDeleteWeek(week.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 size={16} />
                                </button>
                                )}
                              </div>
                            </div>
                            {week.topics && week.topics.length > 0 ? (
                              <div className="mt-2 space-y-2">
                                {week.topics.map((topic, ti) => (
                                  <div key={ti} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                    {topic}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400">مفيش مواضيع مسجّلة للأسبوع ده لسه.</p>
                            )}
                          </div>
                        ))}
                        {weeks.length === 0 && (
                          <p className="text-center text-gray-400 py-10">مفيش أسابيع متعملة لسه — دوس "إضافة أسبوع" فوق.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {!loadingSubjectData && activeSubjectTab === 'resources' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          المكتبة <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{resources.length}</span>
                        </h3>
                        {canEditCurriculum && (
                        <Button onClick={() => setIsAddResourceOpen(true)} className="bg-violet-600 text-white hover:bg-violet-700 text-sm">
                          <Plus size={16} /> إضافة مصدر
                        </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {resources.map((r) => (
                          <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all group">
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 flex-1">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-50 text-violet-600">
                                <Link2 size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{r.title}</p>
                                <p className="text-xs text-gray-400">{r.type}</p>
                              </div>
                            </a>
                            {canEditCurriculum && (
                            <button onClick={() => handleDeleteResource(r.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={16} />
                            </button>
                            )}
                          </div>
                        ))}
                        {resources.length === 0 && (
                          <p className="text-center text-gray-400 py-10">مفيش موارد متضافة لسه.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {!loadingSubjectData && activeSubjectTab === 'plans' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center w-full mb-2 border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-800">خطط الدروس</h3>
                        {canEditCurriculum && (
                        <button
                          onClick={handleGenerateAIPlan}
                          disabled={generatingLesson}
                          className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white border-none shadow-sm hover:shadow-md transition font-bold disabled:opacity-60"
                        >
                          <Wand2 size={16} /> {generatingLesson ? 'جاري الإنشاء...' : 'إنشاء بالذكاء الاصطناعي'}
                        </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lessonPlans.map((p) => {
                          let parsed: any = null;
                          try { parsed = JSON.parse(p.content); } catch { parsed = null; }
                          return (
                            <div key={p.id} className="rounded-3xl shadow-sm border border-slate-100 p-6 flex items-start gap-6 hover:shadow-lg transition bg-white group relative">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100">
                                <BookOpen size={18} />
                              </div>
                              <div className="flex-1 w-full">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-slate-900 text-lg">{p.title}</h4>
                                  {canEditCurriculum && (
                                  <button onClick={() => handleDeleteLessonPlan(p.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                  </button>
                                  )}
                                </div>
                                {parsed?.objectives && (
                                  <p className="text-sm text-slate-500 leading-relaxed mb-3">{parsed.objectives.slice(0, 2).join(' • ')}</p>
                                )}
                                {parsed?.outline && (
                                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {parsed.outline.length} خطوات</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {lessonPlans.length === 0 && (
                          <p className="col-span-full text-center text-gray-400 py-10">مفيش خطط دروس متعملة لسه.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isAddSubjectOpen && selectedGrade && (
        <AddSubjectModal grade={selectedGrade} onClose={() => setIsAddSubjectOpen(false)} onSubmit={handleAddSubject} />
      )}
      {isAddWeekOpen && (
        <AddWeekModal nextWeekNumber={weeks.length + 1} onClose={() => setIsAddWeekOpen(false)} onSubmit={handleAddWeek} />
      )}
      {isAddResourceOpen && (
        <AddResourceModal onClose={() => setIsAddResourceOpen(false)} onSubmit={handleAddResource} />
      )}
    </div>
  );
};
