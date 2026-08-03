import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { generateLessonPlan } from '../services/geminiService';
import { Button } from '../components/Button';
import { showToast } from '../components/Toast';
import { confirmDialog } from '../components/ConfirmDialog';
import {
  getCurriculumSubjectsDetailed, addCurriculumSubject, removeCurriculumSubject,
  getCurriculumWeeks, saveCurriculumWeek, deleteCurriculumWeek,
  getCurriculumResources, addCurriculumResource, updateCurriculumResource, deleteCurriculumResource,
  getCurriculumLessonPlans, createCurriculumLessonPlan, deleteCurriculumLessonPlan,
  getCurriculumFolders, createCurriculumFolder, renameCurriculumFolder, deleteCurriculumFolder,
  getAcademicYearSettings, saveAcademicYearSettings, saveEducationSystem,
  getLearningOutcomes, addLearningOutcome,
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
  Flag,
  Crown,
  Globe2,
  Star,
  UploadCloud,
  FolderPlus,
  Users,
  Pencil,
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

export const Curriculum: React.FC<CurriculumProps> = ({ language, permissions = [] }) => {
  const isRTL = language === Language.AR;
  const canEditCurriculum = permissions.length === 0 || permissions.includes('curriculum_edit');

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeSubjectTab, setActiveSubjectTab] = useState<'resources' | 'schedule' | 'plans'>('schedule');

  const [subjectsByGrade, setSubjectsByGrade] = useState<Record<string, { subject: string; code: string; nameEn: string; department: string }[]>>({});
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');

  const [weeks, setWeeks] = useState<{ id: string; weekNumber: number; startDate: string; endDate: string; topics: any[] }[]>([]);
  const [resources, setResources] = useState<{ id: string; title: string; type: string; url: string; folderId: string | null }[]>([]);
  const [lessonPlans, setLessonPlans] = useState<{ id: string; title: string; content: string; weekNumber: number | null }[]>([]);
  const [loadingSubjectData, setLoadingSubjectData] = useState(false);

  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [generatingLesson, setGeneratingLesson] = useState(false);

  const [academicSettings, setAcademicSettings] = useState<{ system: string; startDate: string; endDate: string; academicYear: string } | null>(null);
  const [loadingAcademicSettings, setLoadingAcademicSettings] = useState(true);
  const [folders, setFolders] = useState<{ id: string; name: string; parentFolderId: string | null }[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [addingTaskWeek, setAddingTaskWeek] = useState<number | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskOutcome, setNewTaskOutcome] = useState('');
  const [newTaskResourceId, setNewTaskResourceId] = useState('');
  const [isAddingOutcome, setIsAddingOutcome] = useState(false);
  const [newOutcomeText, setNewOutcomeText] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState<{ id: string; outcome: string }[]>([]);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState({ title: '', type: 'Link', url: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadTypeRef = useRef<string>('Document');

  const SYSTEM_OPTIONS = [
    { id: 'National', name: 'وطني', icon: 'flag' },
    { id: 'IG', name: 'بريطاني (IG)', icon: 'crown' },
    { id: 'IB', name: 'الباكالوريا الدولية (IB)', icon: 'globe' },
    { id: 'American', name: 'النظام الأمريكي', icon: 'star' },
  ];

  useEffect(() => {
    getAcademicYearSettings().then((s) => {
      setAcademicSettings(s);
      setLoadingAcademicSettings(false);
    });
  }, []);

  const handleSelectSystem = async (systemId: string) => {
    const ok = await saveEducationSystem(systemId);
    if (ok) {
      setAcademicSettings((prev) => ({
        system: systemId,
        startDate: prev?.startDate || '',
        endDate: prev?.endDate || '',
        academicYear: prev?.academicYear || '',
      }));
      showToast('تم تحديد النظام التعليمي بنجاح.', 'success');
    } else {
      showToast('حصل خطأ أثناء الحفظ.', 'error');
    }
  };

  // بيحسب تاريخ بداية ونهاية أسبوع معيّن، بناءً على تاريخ بداية العام الدراسي (أسبوع دراسي = 5 أيام)
  const computeWeekDates = (weekNumber: number): { startDate: string; endDate: string } => {
    if (!academicSettings?.startDate) return { startDate: '', endDate: '' };
    const start = new Date(academicSettings.startDate);
    start.setDate(start.getDate() + (weekNumber - 1) * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { startDate: fmt(start), endDate: fmt(end) };
  };

  const TOTAL_ACADEMIC_WEEKS = (() => {
    if (!academicSettings?.startDate || !academicSettings?.endDate) return 0;
    const start = new Date(academicSettings.startDate);
    const end = new Date(academicSettings.endDate);
    const diffDays = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return Math.max(1, Math.ceil(diffDays / 7));
  })();

  const handleAddTopicToWeek = async (weekNumber: number) => {
    if (!newTaskText.trim() || !selectedGrade || !selectedSubject) return;
    const existing = weeks.find(w => w.weekNumber === weekNumber);
    const { startDate, endDate } = computeWeekDates(weekNumber);
    const linkedResource = resources.find(r => r.id === newTaskResourceId);
    const newTopic = {
      text: newTaskText.trim(),
      outcome: newTaskOutcome || null,
      resourceId: newTaskResourceId || null,
      resourceTitle: linkedResource?.title || null,
    };
    const topics = [...(existing?.topics || []), newTopic];
    const ok = await saveCurriculumWeek({ grade: selectedGrade, subject: selectedSubject, weekNumber, startDate, endDate, topics });
    if (ok) {
      getCurriculumWeeks(selectedGrade, selectedSubject).then(setWeeks);
      setNewTaskText('');
      setNewTaskOutcome('');
      setNewTaskResourceId('');
      setAddingTaskWeek(null);
    } else {
      showToast('حصل خطأ أثناء حفظ المهمة.', 'error');
    }
  };

  const handleAddOutcome = async () => {
    if (!newOutcomeText.trim() || !selectedGrade || !selectedSubject) return;
    const id = await addLearningOutcome(selectedGrade, selectedSubject, newOutcomeText.trim());
    if (id) {
      getLearningOutcomes(selectedGrade, selectedSubject).then(setLearningOutcomes);
      setNewTaskOutcome(newOutcomeText.trim());
      setNewOutcomeText('');
      setIsAddingOutcome(false);
    } else {
      showToast('حصل خطأ أثناء إضافة ناتج التعلم.', 'error');
    }
  };

  const refreshFolders = () => {
    if (!selectedGrade || !selectedSubject) return;
    getCurriculumFolders(selectedGrade, selectedSubject).then(setFolders);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !selectedGrade || !selectedSubject) return;
    const id = await createCurriculumFolder({ grade: selectedGrade, subject: selectedSubject, name: newFolderName, parentFolderId: currentFolderId });
    if (id) {
      refreshFolders();
      setNewFolderName('');
      setIsCreatingFolder(false);
    } else {
      showToast('حصل خطأ أثناء إنشاء المجلد.', 'error');
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    const confirmed = await confirmDialog('متأكد إنك عايز تمسح المجلد ده وكل اللي جواه؟', 'حذف');
    if (!confirmed) return;
    const ok = await deleteCurriculumFolder(folderId);
    if (ok) {
      refreshFolders();
      showToast('تم حذف المجلد.', 'success');
    }
  };

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
    setCurrentFolderId(null);
    Promise.all([
      getCurriculumWeeks(selectedGrade, selectedSubject),
      getCurriculumResources(selectedGrade, selectedSubject),
      getCurriculumLessonPlans(selectedGrade, selectedSubject),
      getCurriculumFolders(selectedGrade, selectedSubject),
      getLearningOutcomes(selectedGrade, selectedSubject),
    ]).then(([w, r, p, f, o]) => {
      setWeeks(w);
      setResources(r);
      setLessonPlans(p);
      setFolders(f);
      setLearningOutcomes(o);
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

  const handleDeleteWeek = async (weekId: string) => {
    const confirmed = await confirmDialog('متأكد إنك عايز تمسح الأسبوع ده؟', 'حذف');
    if (!confirmed) return;
    const ok = await deleteCurriculumWeek(weekId);
    if (ok && selectedGrade && selectedSubject) {
      getCurriculumWeeks(selectedGrade, selectedSubject).then(setWeeks);
      showToast('تم حذف الأسبوع.', 'success');
    }
  };

  const handleFakeFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !selectedGrade || !selectedSubject) return;
    const id = await addCurriculumResource({
      grade: selectedGrade,
      subject: selectedSubject,
      title: file.name,
      type: pendingUploadTypeRef.current,
      url: '#',
      folderId: currentFolderId,
    });
    if (id) {
      getCurriculumResources(selectedGrade, selectedSubject).then(setResources);
      showToast('اترفع الملف (تجريبيًا) — تقدر تعيد تسميته من هنا. رفع الملفات الفعلي محتاج مساحة تخزين حقيقية لسه.', 'success');
    } else {
      showToast('حصل خطأ أثناء الإضافة.', 'error');
    }
  };

  const handleAddResource = async () => {
    if (!selectedGrade || !selectedSubject || !linkForm.title.trim() || !linkForm.url.trim()) return;
    const id = await addCurriculumResource({ grade: selectedGrade, subject: selectedSubject, title: linkForm.title, type: linkForm.type, url: linkForm.url, folderId: currentFolderId });
    if (id) {
      getCurriculumResources(selectedGrade, selectedSubject).then(setResources);
      showToast('تم إضافة المصدر بنجاح.', 'success');
      setIsAddingLink(false);
      setLinkForm({ title: '', type: 'Link', url: '' });
    } else {
      showToast('حصل خطأ أثناء إضافة المصدر.', 'error');
    }
  };

  const handleUpdateResource = async (resourceId: string) => {
    if (!linkForm.title.trim() || !linkForm.url.trim() || !selectedGrade || !selectedSubject) return;
    const ok = await updateCurriculumResource(resourceId, { title: linkForm.title, type: linkForm.type, url: linkForm.url });
    if (ok) {
      getCurriculumResources(selectedGrade, selectedSubject).then(setResources);
      showToast('تم تعديل المصدر بنجاح.', 'success');
      setEditingResourceId(null);
    } else {
      showToast('حصل خطأ أثناء التعديل.', 'error');
    }
  };

  const handleRenameFolder = async (folderId: string) => {
    if (!newFolderName.trim()) return;
    const ok = await renameCurriculumFolder(folderId, newFolderName);
    if (ok) {
      refreshFolders();
      showToast('تم تعديل اسم المجلد.', 'success');
      setRenamingFolderId(null);
      setNewFolderName('');
    } else {
      showToast('حصل خطأ أثناء التعديل.', 'error');
    }
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

  if (!loadingAcademicSettings && !academicSettings) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center overflow-y-auto min-h-[calc(100vh-140px)]" dir="rtl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">إعداد المناهج التعليمية</h2>
        <p className="text-gray-500 mb-10">حدد الأطر التعليمية لإنشاء الدرجات والمواد والأكاديميات آلياً.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
          {SYSTEM_OPTIONS.map((sys) => {
            const IconComp = sys.icon === 'flag' ? Flag : sys.icon === 'crown' ? Crown : sys.icon === 'globe' ? Globe2 : Star;
            return (
              <button
                key={sys.id}
                onClick={() => handleSelectSystem(sys.id)}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600">
                  <IconComp size={28} />
                </div>
                <span className="font-bold text-gray-900">{sys.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

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
          <h3 className="font-bold text-lg text-gray-900">{SYSTEM_OPTIONS.find(s => s.id === academicSettings?.system)?.name || 'المنهج الدراسي'}</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">{academicSettings?.academicYear || 'المراحل والصفوف'}</p>
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
                        <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xs font-bold">AI ✨</span>
                      </div>
                      {!academicSettings?.startDate ? (
                        <p className="text-center text-gray-400 py-10">لسه محتاج تفعّل العام الدراسي (بتواريخه) من "الإعدادات ← العام الدراسي" عشان تظهر الأسابيع بتواريخها هنا.</p>
                      ) : (
                        <div className="flex flex-col gap-4 w-full">
                          {Array.from({ length: TOTAL_ACADEMIC_WEEKS }).map((_, i) => {
                            const weekNumber = i + 1;
                            const { startDate, endDate } = computeWeekDates(weekNumber);
                            const week = weeks.find(w => w.weekNumber === weekNumber);
                            return (
                              <div key={weekNumber} className="bg-white rounded-2xl border border-slate-200 p-5 w-full shadow-sm group">
                                <div className="flex justify-between items-center w-full mb-4 border-b border-slate-100 pb-2">
                                  <span className="text-lg font-bold text-violet-700 tracking-wider block">الأسبوع {weekNumber}</span>
                                  <p className="text-sm font-medium text-slate-500">{formatArabicDate(startDate)} - {formatArabicDate(endDate)}</p>
                                </div>
                                {week?.topics && week.topics.length > 0 && (
                                  <div className="mt-2 space-y-2 mb-3">
                                    {week.topics.map((topic: any, ti: number) => {
                                      const isObj = typeof topic === 'object' && topic !== null;
                                      const text = isObj ? topic.text : topic;
                                      const outcome = isObj ? topic.outcome : null;
                                      const resourceTitle = isObj ? topic.resourceTitle : null;
                                      return (
                                        <div key={ti} className="p-2.5 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                          <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                            {text}
                                          </div>
                                          {(outcome || resourceTitle) && (
                                            <div className="flex flex-wrap gap-2 mt-1.5 mr-3.5">
                                              {outcome && (
                                                <span className="text-[10px] bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-full font-bold">🎯 {outcome}</span>
                                              )}
                                              {resourceTitle && (
                                                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-bold">🔗 {resourceTitle}</span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {canEditCurriculum && (
                                  addingTaskWeek === weekNumber ? (
                                    <div className="space-y-2 bg-gray-50/50 p-3 rounded-xl border border-violet-100">
                                      <input
                                        autoFocus
                                        type="text"
                                        value={newTaskText}
                                        onChange={(e) => setNewTaskText(e.target.value)}
                                        placeholder="اسم المهمة أو الموضوع..."
                                        className="w-full bg-white border border-violet-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                                      />
                                      <div className="flex gap-2">
                                        <select value={newTaskOutcome} onChange={(e) => e.target.value === '__add__' ? setIsAddingOutcome(true) : setNewTaskOutcome(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none">
                                          <option value="">🎯 ناتج تعلم (اختياري)</option>
                                          {learningOutcomes.map(o => <option key={o.id} value={o.outcome}>{o.outcome}</option>)}
                                          <option value="__add__">+ إضافة ناتج جديد...</option>
                                        </select>
                                        <select value={newTaskResourceId} onChange={(e) => setNewTaskResourceId(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none">
                                          <option value="">🔗 ربط بمورد (اختياري)</option>
                                          {resources.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                        </select>
                                      </div>
                                      {isAddingOutcome && (
                                        <div className="flex gap-2">
                                          <input
                                            autoFocus
                                            type="text"
                                            value={newOutcomeText}
                                            onChange={(e) => setNewOutcomeText(e.target.value)}
                                            placeholder="اكتب ناتج التعلم الجديد..."
                                            className="flex-1 bg-white border border-violet-200 rounded-xl px-3 py-1.5 text-xs outline-none"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddOutcome()}
                                          />
                                          <button onClick={handleAddOutcome} className="text-xs font-bold text-violet-600">إضافة</button>
                                          <button onClick={() => setIsAddingOutcome(false)} className="text-xs text-gray-400">إلغاء</button>
                                        </div>
                                      )}
                                      <div className="flex gap-2 justify-end pt-1">
                                        <button onClick={() => { setAddingTaskWeek(null); setNewTaskText(''); setNewTaskOutcome(''); setNewTaskResourceId(''); setIsAddingOutcome(false); }} className="text-xs text-gray-400 px-2">إلغاء</button>
                                        <Button onClick={() => handleAddTopicToWeek(weekNumber)} className="text-xs px-4">حفظ</Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setAddingTaskWeek(weekNumber)}
                                      className="w-full border-2 border-dashed border-gray-200 text-gray-500 rounded-xl p-2.5 flex justify-center items-center hover:bg-gray-50 hover:border-purple-200 hover:text-purple-600 transition-colors font-bold text-sm gap-2"
                                    >
                                      <Plus size={16} /> إضافة مهمة
                                    </button>
                                  )
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {!loadingSubjectData && activeSubjectTab === 'resources' && (
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-gray-50/50">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <div className="w-9 h-9 bg-violet-50 rounded-full flex items-center justify-center shadow-sm text-violet-600 shrink-0">
                            <UploadCloud size={18} />
                          </div>
                          <div className="text-right">
                            <h3 className="font-bold text-gray-900 text-sm leading-tight">رفع الموارد</h3>
                            <p className="text-xs text-gray-400 leading-tight">رفع الملفات مباشرة مش متاح لسه، محتاج مساحة تخزين</p>
                          </div>
                        </div>
                        {canEditCurriculum && (
                          <div className="flex flex-wrap justify-center gap-2">
                            {[
                              { label: 'رابط', type: 'Link' },
                              { label: 'وثيقة', type: 'Document' },
                              { label: 'فيديو', type: 'Video' },
                              { label: 'عرض تقديمي', type: 'Presentation' },
                            ].map(({ label, type }) => (
                              <button
                                key={type}
                                onClick={() => {
                                  if (type === 'Link') {
                                    setIsAddingLink(true);
                                    setLinkForm({ title: '', type, url: '' });
                                  } else {
                                    pendingUploadTypeRef.current = type;
                                    fileInputRef.current?.click();
                                  }
                                }}
                                className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-none"
                              >
                                + {label}
                              </button>
                            ))}
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFakeFileSelected} />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm">
                          <button onClick={() => setCurrentFolderId(null)} className={`font-bold ${!currentFolderId ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>المكتبة</button>
                          {currentFolderId && (
                            <>
                              <span className="text-gray-300">/</span>
                              <span className="font-bold text-violet-700">{folders.find(f => f.id === currentFolderId)?.name}</span>
                            </>
                          )}
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{folders.filter(f => f.parentFolderId === currentFolderId).length + resources.filter(r => r.folderId === currentFolderId).length}</span>
                        </div>
                        {canEditCurriculum && (
                          <button onClick={() => setIsCreatingFolder(true)} className="text-xs font-bold text-violet-600 hover:bg-violet-50 px-2 py-1 rounded flex items-center gap-1">
                            <FolderPlus size={14} /> مجلد جديد
                          </button>
                        )}
                      </div>

                      {isCreatingFolder && (
                        <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 flex gap-2 animate-fadeIn">
                          <input
                            autoFocus
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="اسم المجلد..."
                            className="flex-1 bg-white border border-violet-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                          />
                          <Button onClick={handleCreateFolder} className="py-2 px-4 text-xs">إنشاء</Button>
                          <button onClick={() => setIsCreatingFolder(false)} className="text-gray-400 hover:text-gray-600 px-2">إلغاء</button>
                        </div>
                      )}

                      {isAddingLink && (
                        <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 space-y-2 animate-fadeIn">
                          <div className="flex gap-2">
                            <input autoFocus type="text" value={linkForm.title} onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })} placeholder="العنوان..." className="flex-1 bg-white border border-violet-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                            <select value={linkForm.type} onChange={(e) => setLinkForm({ ...linkForm, type: e.target.value })} className="bg-white border border-violet-200 rounded-xl px-2 text-sm focus:outline-none">
                              <option value="Link">رابط</option>
                              <option value="Document">وثيقة</option>
                              <option value="Video">فيديو</option>
                              <option value="Presentation">عرض تقديمي</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <input type="text" value={linkForm.url} onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })} placeholder="https://..." dir="ltr" className="flex-1 bg-white border border-violet-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" onKeyDown={(e) => e.key === 'Enter' && handleAddResource()} />
                            <Button onClick={handleAddResource} className="py-2 px-4 text-xs" disabled={!linkForm.title.trim() || !linkForm.url.trim()}>إضافة</Button>
                            <button onClick={() => setIsAddingLink(false)} className="text-gray-400 hover:text-gray-600 px-2 text-xs">إلغاء</button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        {folders.filter(f => f.parentFolderId === currentFolderId).map((folder) => (
                          <div key={folder.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all group">
                            {renamingFolderId === folder.id ? (
                              <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  autoFocus
                                  type="text"
                                  value={newFolderName}
                                  onChange={(e) => setNewFolderName(e.target.value)}
                                  className="flex-1 bg-gray-50 border border-violet-200 rounded-lg px-2 py-1 text-sm focus:outline-none"
                                  onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder(folder.id)}
                                />
                                <button onClick={() => handleRenameFolder(folder.id)} className="text-xs font-bold text-violet-600">حفظ</button>
                                <button onClick={() => setRenamingFolderId(null)} className="text-xs text-gray-400">إلغاء</button>
                              </div>
                            ) : (
                              <>
                                <div onClick={() => setCurrentFolderId(folder.id)} className="flex items-center gap-4 flex-1 cursor-pointer">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-50 text-violet-600">
                                    <Folder size={20} fill="currentColor" fillOpacity={0.2} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 text-sm">{folder.name}</p>
                                    <p className="text-xs text-gray-400">
                                      {resources.filter(r => r.folderId === folder.id).length} عناصر • {folders.filter(f => f.parentFolderId === folder.id).length} مجلدات
                                    </p>
                                  </div>
                                </div>
                                {canEditCurriculum && (
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setRenamingFolderId(folder.id); setNewFolderName(folder.name); }} className="text-gray-300 hover:text-violet-600 p-1">
                                      <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteFolder(folder.id)} className="text-gray-300 hover:text-red-500 p-1">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}

                        {resources.filter(r => r.folderId === currentFolderId).map((r) => (
                          <div key={r.id} className="p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all group">
                            {editingResourceId === r.id ? (
                              <div className="space-y-2">
                                <input autoFocus type="text" value={linkForm.title} onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })} placeholder="الاسم..." className="w-full bg-gray-50 border border-violet-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                                {r.type === 'Link' && (
                                  <input type="text" value={linkForm.url} onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })} dir="ltr" placeholder="https://..." className="w-full bg-gray-50 border border-violet-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                                )}
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => setEditingResourceId(null)} className="text-xs text-gray-400 px-2">إلغاء</button>
                                  <button onClick={() => handleUpdateResource(r.id)} className="text-xs font-bold text-violet-600 px-2">حفظ</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
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
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingResourceId(r.id); setLinkForm({ title: r.title, type: r.type, url: r.url }); }} className="text-gray-300 hover:text-violet-600 p-1">
                                      <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteResource(r.id)} className="text-gray-300 hover:text-red-500 p-1">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {folders.filter(f => f.parentFolderId === currentFolderId).length === 0 && resources.filter(r => r.folderId === currentFolderId).length === 0 && (
                          <p className="text-center text-gray-400 py-10">المجلد فاضي — مفيش موارد أو مجلدات فرعية لسه.</p>
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
    </div>
  );
};
