import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { generateLessonPlan } from '../services/geminiService';
import { getCurriculumSubjectsDetailed, createCurriculumLessonPlan } from '../services/supabaseData';
import { showToast } from '../components/Toast';
import { 
  Sparkles, 
  Send,
  Save,
  Download,
  FileText,
  Clock,
  Target,
  List,
  CheckCircle2,
  PenTool,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Plus,
  BookOpen,
  Lock,
  Calculator,
  ChevronDown
} from 'lucide-react';

interface LessonPlannerProps {
  language: Language;
  permissions?: string[];
}

const AI_BLOCKS = [
  {
    id: 'ai-1',
    type: 'objectives',
    title: 'الأهداف التعليمية',
    rawHtml: `<ul class="list-disc list-inside space-y-2"><li>أن يتعرف الطالب على مفهوم الجاذبية الأرضية.</li><li>أن يدرك الطالب أثر الجاذبية على الأشياء ذات الأوزان المختلفة.</li><li>أن يستنتج الطالب أهمية الجاذبية في حياتنا اليومية.</li></ul>`
  },
  {
    id: 'ai-2',
    type: 'materials',
    title: 'المواد والأدوات اللازمة',
    rawHtml: `<ul class="list-disc list-inside space-y-2"><li>كرات مختلفة الحجم والوزن (كرة تنس، كرة سلة، كرة بينج بونج)</li><li>ريشة وعملة معدنية</li><li>جهاز عرض (بروجكتور) لعرض فيديو قصير</li><li>أوراق عمل وأقلام تلوين</li></ul>`
  },
  {
    id: 'ai-3',
    type: 'timeline',
    title: 'المسار الزمني للدرس (45 دقيقة)',
    items: [
      { time: '5 دقائق', title: 'التمهيد وإثارة الانتباه', desc: 'طرح سؤال افتتاحي: "ماذا سيحدث إذا رمينا هذا القلم في الهواء؟ ولماذا يسقط للأسفل دائمًا؟"' },
      { time: '15 دقيقة', title: 'الشرح والتجربة العملية', desc: 'عرض مرئي مبسّط لمفهوم الجاذبية. ثم القيام بتجربة سقوط كرات مختلفة الأوزان من نفس الارتفاع لملاحظة أنها تسقط في نفس الوقت.' },
      { time: '15 دقيقة', title: 'نشاط المجموعات (ورقة العمل)', desc: 'تقسيم الطلاب لمجموعات صغيرة لحل ورقة العمل ورسم تخيل لبيئة بدون جاذبية.' },
      { time: '10 دقائق', title: 'التقييم الخاتمي والخلاصة', desc: 'مراجعة سريعة لما تم تعلمه، وتقييم شفهي لبعض المفاهيم، وتلخيص الدرس.' },
    ]
  },
  {
    id: 'ai-4',
    type: 'assessment',
    title: 'التقييم المستمر',
    rawHtml: `<p>توجيه أسئلة سريعة أثناء فترة التجربة للتأكد من استيعاب الطلاب لفكرة أن الوزن ليس هو العامل الوحيد المؤثر في سرعة السقوط، بل مقاومة الهواء (باستخدام الريشة والعملة).</p>`
  }
];

const StandardsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  
  const options = [
    "المجال الأول: الفهم والاستيعاب - المعيار 1.1",
    "المجال الثاني: التفكير الناقد - المعيار 2.1",
    "المجال الثالث: التطبيق العملي - المعيار 3.2"
  ];

  return (
    <div className="relative w-full pr-4 mt-2 mb-4">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm rounded-xl border border-gray-100 p-4 bg-white font-medium text-gray-700 hover:border-purple-200 transition-colors shadow-none cursor-pointer flex justify-between items-center"
      >
        <span>{selected || "اختر معايير المناهج والمجال..."}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-[calc(100%-1rem)] right-4 mt-1 bg-white border border-gray-100 rounded-xl shadow-none py-1">
          {options.map((opt, i) => (
            <div 
              key={i}
              onClick={() => { setSelected(opt); setIsOpen(false); }}
              className="px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer transition-colors"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const LessonPlanner: React.FC<LessonPlannerProps> = ({ language, permissions = [] }) => {
  const canEditLessonPlans = permissions.length === 0 || permissions.includes('curriculum_lesson_plans');
  const GRADE_LEVELS_LP = ['الصف 9', 'الصف 10', 'الصف 11', 'الصف 12'];
  const [grade, setGrade] = useState(GRADE_LEVELS_LP[0]);
  const [subject, setSubject] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [topic, setTopic] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [aiBlocks, setAiBlocks] = useState<any[]>([]);
  const [manualBlocks, setManualBlocks] = useState<any[]>([]);

  const isRTL = language === Language.AR;

  useEffect(() => {
    getCurriculumSubjectsDetailed(grade).then((subs) => {
      const names = subs.map(s => s.subject);
      setAvailableSubjects(names);
      if (names.length > 0 && !names.includes(subject)) setSubject(names[0]);
    });
  }, [grade]);

  const handleGeneratePlan = async () => {
    if (!topic.trim() || !subject) {
      showToast('اكتب موضوع الدرس واختار المادة الأول.', 'error');
      return;
    }
    setIsGenerating(true);
    const plan = await generateLessonPlan(topic, grade, subject, isRTL ? 'ar' : 'en');
    setIsGenerating(false);
    if (!plan) {
      showToast('حصل خطأ أثناء توليد الخطة.', 'error');
      return;
    }
    const blocks: any[] = [];
    if (plan.objectives?.length) {
      blocks.push({ id: 'objectives', type: 'objectives', title: 'الأهداف التعليمية', rawHtml: `<ul class="list-disc list-inside space-y-2">${plan.objectives.map(o => `<li>${o}</li>`).join('')}</ul>` });
    }
    if (plan.materials?.length) {
      blocks.push({ id: 'materials', type: 'materials', title: 'المواد والأدوات اللازمة', rawHtml: `<ul class="list-disc list-inside space-y-2">${plan.materials.map(m => `<li>${m}</li>`).join('')}</ul>` });
    }
    if (plan.outline?.length) {
      blocks.push({ id: 'timeline', type: 'timeline', title: 'المسار الزمني للدرس', items: plan.outline.map(o => ({ time: o.duration, title: o.activity, desc: o.description })) });
    }
    if (plan.quiz?.length) {
      blocks.push({
        id: 'assessment', type: 'assessment', title: 'التقييم المستمر',
        rawHtml: `<ul class="list-disc list-inside space-y-2">${plan.quiz.map(q => `<li>${q.question}</li>`).join('')}</ul>`,
      });
    }
    setAiBlocks(blocks);
    setHasGenerated(true);
    showToast('تم توليد خطة الدرس بنجاح.', 'success');
  };

  const handleSaveToLibrary = async () => {
    const blocksToSave = activeTab === 'ai' ? aiBlocks : manualBlocks;
    if (blocksToSave.length === 0) {
      showToast('لسه معملتش أي محتوى للخطة عشان تحفظه.', 'error');
      return;
    }
    if (!subject) {
      showToast('اختار المادة الأول.', 'error');
      return;
    }
    setIsSaving(true);
    const id = await createCurriculumLessonPlan({
      grade,
      subject,
      title: topic ? `خطة درس: ${topic}` : 'خطة درس بدون عنوان',
      content: JSON.stringify({ blocks: blocksToSave, topic }),
    });
    setIsSaving(false);
    if (id) {
      showToast('تم حفظ الخطة في المكتبة بنجاح.', 'success');
    } else {
      showToast('حصل خطأ أثناء الحفظ.', 'error');
    }
  };

  const grades = GRADE_LEVELS_LP;
  const subjects = availableSubjects;

  const getEmptyBlock = (type: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    switch (type) {
      case 'objectives':
        return { id, type, title: 'الأهداف التعليمية', rawHtml: '<ul class="list-disc list-inside"><li>اكتب هدفاً هنا...</li></ul>' };
      case 'materials':
        return { id, type, title: 'المواد والأدوات اللازمة', rawHtml: '<ul class="list-disc list-inside"><li>أضف أداة...</li></ul>' };
      case 'timeline':
        return { id, type, title: 'المسار الزمني للدرس', items: [{ time: 'مدة', title: 'عنوان الفقرة...', desc: 'اكتب وصف النشاط هنا...' }] };
      case 'assessment':
        return { id, type, title: 'التقييم', rawHtml: '<p>اكتب طريقة التقييم هنا...</p>' };
      case 'standards':
        return { id, type, title: 'معايير المناهج والمجال', rawHtml: '' };
      case 'notes':
        return { id, type, title: 'ملاحظات خاصة للمشرف والتحضير (مخفية عن الطلاب)', rawHtml: '' };
      default:
        return { id, type, title: 'فقرة جديدة', rawHtml: '<p>نص...</p>' };
    }
  };

  const addManualBlock = (type: string) => {
    setManualBlocks(prev => [...prev, getEmptyBlock(type)]);
  };

  const addTimelineItem = (blockId: string) => {
    const updateBlocks = (blocks: any[]) => blocks.map(block => {
      if (block.id === blockId && block.type === 'timeline') {
        return {
          ...block,
          items: [...block.items, { time: 'مدة جديدة', title: 'إجراء جديد...', desc: 'اكتب وصف النشاط هنا...' }]
        };
      }
      return block;
    });

    if (activeTab === 'ai') {
      setAiBlocks(updateBlocks(aiBlocks));
    } else {
      setManualBlocks(updateBlocks(manualBlocks));
    }
  };

  const currentBlocks = activeTab === 'ai' ? aiBlocks : manualBlocks;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'objectives': return <Target size={18} className="text-purple-600" />;
      case 'materials': return <List size={18} className="text-purple-600" />;
      case 'timeline': return <Clock size={18} className="text-purple-600" />;
      case 'assessment': return <CheckCircle2 size={18} className="text-purple-600" />;
      case 'standards': return <BookOpen size={18} className="text-purple-600" />;
      case 'notes': return <Lock size={18} className="text-purple-600" />;
      default: return <FileText size={18} className="text-purple-600" />;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-6 h-[calc(100vh-100px)]" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Column 1: Control Panel (Right Side in RTL) lg:col-span-4 */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-none overflow-hidden h-full">
          
          {/* Tabs */}
          <div className="flex bg-gray-50 p-1.5 mx-4 mt-4 rounded-xl shrink-0 border border-gray-100">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all shadow-none border ${activeTab === 'ai' ? 'bg-white text-purple-600 border-gray-100' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
            >
              المساعد الذكي
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all shadow-none border ${activeTab === 'manual' ? 'bg-white text-purple-600 border-gray-100' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
            >
              إنشاء يدوي
            </button>
          </div>

          {/* Context Selectors - Always Visible */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <select 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-100 p-2 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white font-medium text-gray-700 hover:border-purple-300 transition-colors shadow-none"
                  >
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-100 p-2 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white font-medium text-gray-700 hover:border-purple-300 transition-colors shadow-none"
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <input 
                  type="text" 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="الموضوع (مثال: الجاذبية الأرضية)" 
                  className="w-full text-sm rounded-xl border border-gray-100 p-2 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white font-medium text-gray-700 hover:border-purple-300 transition-colors shadow-none"
                />
              </div>
              {activeTab === 'ai' && (
                <button onClick={handleGeneratePlan} disabled={isGenerating} className="w-full mt-2 bg-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-none border border-purple-600 text-sm disabled:opacity-60">
                  <Sparkles size={18} />
                  {isGenerating ? 'جاري التوليد...' : '✨ توليد الخطة آلياً'}
                </button>
              )}
            </div>
          </div>

          {activeTab === 'ai' && (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 font-medium">
                {/* User Message */}
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tr-sm p-4 text-sm max-w-[85%] leading-relaxed shadow-none">
                    قم بإنشاء خطة درس تفاعلية عن الجاذبية الأرضية للصف الخامس.
                  </div>
                </div>
                {/* AI Message */}
                <div className="flex justify-end">
                  <div className="bg-purple-600 text-white rounded-2xl rounded-tl-sm p-4 text-sm max-w-[90%] shadow-none border border-purple-600 leading-relaxed">
                    <p className="flex items-center gap-2 mb-2 opacity-90 text-[11px] uppercase tracking-wider font-bold">
                      <Sparkles size={12} /> المساعد الذكي
                    </p>
                    بالتأكيد! جاري إعداد خطة الدرس مع التركيز على التجارب العملية والأنشطة التفاعلية لتناسب مستوى الصف الخامس...
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                <div className="rounded-full border border-gray-200 bg-white p-1.5 flex items-center shadow-none relative focus-within:border-purple-500 transition-all">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="تحدث مع المساعد الذكي..."
                    className="flex-1 bg-transparent border-none outline-none text-sm px-4 text-gray-800 placeholder-gray-400 font-medium h-9"
                  />
                  <button className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors flex-shrink-0 focus:outline-none shadow-none mr-2 text-center" dir="ltr">
                    <Send size={15} className="-ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="flex flex-col flex-1 p-6 bg-gray-50/30 overflow-y-auto">
              <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <PenTool size={20} className="text-purple-600" />
                أدوات بناء الخطة
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => addManualBlock('objectives')} 
                  className="border border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50 text-gray-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-none text-sm font-bold w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <Target className="text-purple-500 shrink-0" size={20} />
                  + إضافة أهداف تعليمية
                </button>
                <button 
                  onClick={() => addManualBlock('standards')} 
                  className="border border-dashed border-gray-200 bg-transparent hover:border-purple-300 hover:bg-purple-50 text-gray-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-none text-sm font-bold w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <BookOpen className="text-purple-500 shrink-0" size={20} />
                  + إضافة معايير المناهج
                </button>
                <button 
                  onClick={() => addManualBlock('materials')} 
                  className="border border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50 text-gray-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-none text-sm font-bold w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <List className="text-purple-500 shrink-0" size={20} />
                  + إضافة مواد وأدوات
                </button>
                <button 
                  onClick={() => addManualBlock('timeline')} 
                  className="border border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50 text-gray-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-none text-sm font-bold w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <Clock className="text-purple-500 shrink-0" size={20} />
                  + إضافة مسار زمني
                </button>
                <button 
                  onClick={() => addManualBlock('assessment')} 
                  className="border border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50 text-gray-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-none text-sm font-bold w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <CheckCircle2 className="text-purple-500 shrink-0" size={20} />
                  + إضافة تقييم
                </button>
                <button 
                  onClick={() => addManualBlock('notes')} 
                  className="border border-dashed border-gray-200 bg-transparent hover:border-purple-300 hover:bg-purple-50 text-gray-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-none text-sm font-bold w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <Lock className="text-purple-500 shrink-0" size={20} />
                  + إضافة ملاحظات خاصة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Live Document Preview & Library Action (Left Side in RTL) lg:col-span-8 */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-none p-8 h-full flex flex-col relative overflow-hidden">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100 shrink-0">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-purple-500 shrink-0" size={24} />
                <h2 
                  contentEditable 
                  suppressContentEditableWarning 
                  className="text-2xl font-bold text-gray-900 outline-none focus:bg-gray-50 hover:bg-gray-50 rounded-lg p-1 min-w-[200px] transition-colors"
                >
                  {topic ? `خطة درس: ${topic}` : 'عنوان الدرس...'}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <span 
                  contentEditable 
                  suppressContentEditableWarning
                  className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded border border-purple-100 outline-none focus:ring-1 focus:ring-purple-400"
                >
                  {subject || 'المادة'}
                </span>
                <span className="opacity-50">•</span>
                <span 
                  contentEditable 
                  suppressContentEditableWarning
                  className="outline-none focus:bg-gray-100 px-1 rounded"
                >
                  {grade || 'الصف'}
                </span>
                <span className="opacity-50">•</span>
                <span
                   contentEditable 
                   suppressContentEditableWarning
                   className="outline-none focus:bg-gray-100 px-1 rounded"
                >
                  45 دقيقة
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors focus:outline-none">
                <Download size={20} />
              </button>
              <button className="border border-purple-200 text-purple-700 bg-white hover:bg-purple-50 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all focus:outline-none shadow-none">
                نشر لعدة فصول
              </button>
              {canEditLessonPlans && (
              <button onClick={handleSaveToLibrary} disabled={isSaving} className="bg-purple-600 text-white flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold hover:bg-purple-700 transition-all focus:outline-none shadow-none border border-purple-600 disabled:opacity-60">
                <Save size={18} />
                {isSaving ? 'جاري الحفظ...' : 'حفظ في المكتبة'}
              </button>
              )}
            </div>
          </div>

          {/* Formatting Toolbar - Always Visible */}
          <div className="flex items-center gap-1 bg-white border border-gray-100 p-1.5 rounded-lg text-gray-500 mb-6 w-fit shrink-0 shadow-none">
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none bg-gray-50 text-purple-600"><Bold size={16} /></button>
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none"><Italic size={16} /></button>
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none"><Underline size={16} /></button>
            <div className="w-px h-5 bg-gray-200 mx-1"></div>
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none"><Calculator size={16} /></button>
            <div className="w-px h-5 bg-gray-200 mx-1"></div>
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none"><List size={16} /></button>
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none"><ListOrdered size={16} /></button>
            <div className="w-px h-5 bg-gray-200 mx-1"></div>
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none"><AlignRight size={16} /></button>
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none"><AlignCenter size={16} /></button>
            <button className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-all focus:outline-none"><AlignLeft size={16} /></button>
          </div>

          {/* Document Content - Rich Text Editable blocks */}
          <div className="flex-1 overflow-y-auto pr-2 pb-8 text-gray-700 font-medium relative">
            
            {currentBlocks.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-gray-400 text-lg">ابدأ بإضافة بلوك من القائمة اليمنى...</span>
              </div>
            ) : (
              currentBlocks.map((block) => (
                <div key={block.id} className="mb-8 group">
                  <h3 
                    contentEditable 
                    suppressContentEditableWarning
                    className="text-lg font-bold text-purple-900 flex items-center gap-2 mb-4 outline-none focus:bg-purple-50 rounded-lg p-1 -ml-1 transition-colors"
                  >
                    <span contentEditable={false}>{renderIcon(block.type)}</span>
                    {block.title}
                  </h3>

                  {block.type === 'timeline' ? (
                    <div className="space-y-4 pr-2">
                       {block.items.map((item: any, idx: number) => (
                         <div key={idx} className="flex gap-4 p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-colors group/item shadow-none">
                           <div 
                             contentEditable 
                             suppressContentEditableWarning 
                             className="w-16 h-8 shrink-0 flex items-center justify-center bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-500 shadow-none outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400"
                           >
                              {item.time}
                           </div>
                           <div className="flex-1">
                              <h4 
                                contentEditable 
                                suppressContentEditableWarning 
                                className="font-bold text-gray-900 text-[15px] outline-none hover:bg-gray-100 focus:bg-white focus:ring-1 focus:ring-purple-400 rounded p-1 -ml-1 transition-all"
                              >
                                {item.title}
                              </h4>
                              <p 
                                contentEditable 
                                suppressContentEditableWarning 
                                className="text-[14px] text-gray-600 mt-1.5 leading-relaxed outline-none hover:bg-gray-100 focus:bg-white focus:ring-1 focus:ring-purple-400 rounded p-1 -ml-1 transition-all"
                              >
                                {item.desc}
                              </p>
                           </div>
                         </div>
                       ))}
                       <button onClick={() => addTimelineItem(block.id)} className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-2 p-2 hover:bg-purple-50 rounded-lg transition-colors focus:outline-none shadow-none">
                         <Plus size={16} /> إضافة فقرة زمنية
                       </button>
                    </div>
                  ) : block.type === 'standards' ? (
                    <StandardsDropdown />
                  ) : block.type === 'notes' ? (
                    <div className="pr-4 mt-2">
                      <textarea 
                        placeholder="اكتب ملاحظاتك الخاصة هنا..." 
                        className="w-full text-sm rounded-xl border border-gray-100 p-4 min-h-[120px] focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none bg-slate-50 font-medium text-gray-700 hover:border-purple-300 transition-colors shadow-none resize-y"
                      ></textarea>
                    </div>
                  ) : (
                    <div 
                      contentEditable 
                      suppressContentEditableWarning 
                      className="pr-4 text-gray-700 outline-none hover:bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-400 rounded-xl p-3 transition-all min-h-[3rem] shadow-none"
                      dangerouslySetInnerHTML={{ __html: block.rawHtml }} 
                    />
                  )}
                </div>
              ))
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};
