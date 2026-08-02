import React, { useState } from 'react';
import { CurriculumSystem, CurriculumTree, Language, GradeLevelNode, SubjectNode, AcademicWeek, ContentResource, LessonPlan, LibraryFolder } from '../types';
import { generateCurriculumTree, MOCK_TEACHERS } from '../services/mockData';
import { generateLessonPlan } from '../services/geminiService';
import { Button } from '../components/Button';
import { 
  ArrowLeft, 
  Folder, 
  BookOpen, 
  Wand2,
  FolderOpen,
  Calendar,
  UploadCloud, 
  FileText, 
  Video, 
  Presentation, 
  Trash2, 
  Sparkles, 
  Globe2, 
  Flag, 
  Crown, 
  Star,
  MoreVertical,
  Plus,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Pencil,
  X as XIcon,
  Search,
  Check,
  Users,
  Download,
  FileSpreadsheet,
  Upload,
  Info,
  Clock,
  Package,
  Code
} from 'lucide-react';

interface CurriculumProps {
  language: Language;
}

const formatArabicDate = (dateString: string) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const monthMap = monthNames[monthIndex] || parts[1];
  return `${parts[2]} ${monthMap}`;
};

const TeacherRoleSegmentedControl = ({ isRTL }: { isRTL: boolean }) => {
  const [role, setRole] = useState<'primary' | 'assistant'>('primary');
  return (
    <div className="flex bg-gray-50 border border-gray-100 p-0.5 rounded-lg" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setRole('primary')}
        className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-colors shadow-none outline-none focus:outline-none ${role === 'primary' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        {isRTL ? 'معلم أساسي' : 'Primary'}
      </button>
      <button
        onClick={() => setRole('assistant')}
        className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-colors shadow-none outline-none focus:outline-none ${role === 'assistant' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        {isRTL ? 'معلم مساعد' : 'Assistant'}
      </button>
    </div>
  );
};

const InlineTaskForm = ({ onSave, onCancel }: { onSave: (task: any) => void; onCancel: () => void }) => {
  const [taskName, setTaskName] = useState('');
  const [outcome, setOutcome] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const outcomes = [
    { code: 'LO-AR-1.1', desc: 'تحديد الفكرة الرئيسية' },
    { code: 'LO-MA-2.3', desc: 'جمع الكسور غير متشابهة المقامات' },
    { code: 'LO-SC-3.1', desc: 'وصف خصائص المادة' },
    { code: 'LO-EN-4.2', desc: 'Identify main idea' }
  ];

  return (
    <div className="mt-4 p-4 border border-gray-100 bg-white shadow-none rounded-xl block">
      <input
        type="text"
        autoFocus
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="اسم المهمة (مثال: الدرس، اختبار، نشاط)..."
        className="w-full text-sm p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all font-medium text-gray-900 mb-3 shadow-none text-start"
      />
      <div className="flex gap-2 items-center relative">
        <div className="relative flex-1">
          <button 
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full text-start text-sm p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 text-gray-700 font-medium flex justify-between items-center shadow-none"
          >
            {outcome ? outcomes.find(o => o.code === outcome)?.desc : 'اربط بناتج تعلم / معيار...'}
            <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && (
            <div className="absolute z-10 bottom-full mb-1 w-full bg-white border border-gray-100 rounded-xl shadow-none py-1 max-h-48 overflow-y-auto">
              {outcomes.map(o => (
                <div 
                  key={o.code}
                  onClick={() => { setOutcome(o.code); setShowDropdown(false); }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer shadow-none flex flex-col items-start"
                >
                  <span className="font-bold text-purple-700">{o.code}</span>
                  <span className="text-gray-500 text-xs text-start">{o.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button 
          onClick={() => {
            if (taskName.trim()) {
              onSave({ name: taskName.trim(), outcome });
              setTaskName('');
              setOutcome('');
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-none outline-none focus:outline-none shrink-0"
        >
          حفظ
        </button>
        <button 
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors shadow-none outline-none focus:outline-none shrink-0"
        >
          <XIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export const Curriculum: React.FC<CurriculumProps> = ({ language }) => {
  const [tree, setTree] = useState<CurriculumTree | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<CurriculumSystem | null>(null);
  const [activeNode, setActiveNode] = useState<{ type: 'grade' | 'subject' | 'week', data: any } | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [generatingTimeline, setGeneratingTimeline] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [selectedSubjectForTeachers, setSelectedSubjectForTeachers] = useState<SubjectNode | null>(null);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingWeekId, setEditingWeekId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [activeSubjectTab, setActiveSubjectTab] = useState<'resources' | 'schedule' | 'plans'>('resources');
  const [newSubject, setNewSubject] = useState({
    code: '',
    nameEn: '',
    nameAr: '',
    department: 'General'
  });
  const [uploadType, setUploadType] = useState<'Document' | 'Video' | 'Presentation' | 'Link' | 'SCORM'>('Document');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isRTL = language === Language.AR;

  // --- Handlers ---
  const handleCreateSystem = (system: CurriculumSystem) => {
    const newTree = generateCurriculumTree(system);
    setTree(newTree);
    setSelectedSystem(system);
  };

  const handleGenerateAIPlan = async (subject: SubjectNode) => {
    setGeneratingLesson(true);
    const topic = "Introduction to " + subject.name;
    const plan = await generateLessonPlan(topic, "Grade Level", subject.name, language);
    if (plan) {
      const updatedTree = { ...tree! };
      const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === subject.id));
      if (grade) {
        const sub = grade.subjects.find(s => s.id === subject.id);
        if (sub) sub.lessonPlans.push(plan);
      }
      setTree(updatedTree);
    }
    setGeneratingLesson(false);
  };

  const handleGenerateAITimeline = async (subject: SubjectNode) => {
    setGeneratingTimeline(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (tree) {
      const updatedTree = { ...tree };
      const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === subject.id));
      if (grade) {
        const sub = grade.subjects.find(s => s.id === subject.id);
        if (sub) {
          const aiTasks = ["مقدمة المنهج", "تطبيقات عملية", "مراجعة منتصف الوحدة", "اختبار قصير"];
          sub.weeks.slice(0, 4).forEach((week, i) => {
             week.topics = [...(week.topics || []), aiTasks[i]];
          });
        }
      }
      setTree(updatedTree);
    }
    setGeneratingTimeline(false);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim() || !activeNode || activeNode.type !== 'subject') return;
    
    const subject = activeNode.data as SubjectNode;
    const newFolder: LibraryFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      resources: [],
      subFolders: []
    };

    const updatedTree = { ...tree! };
    const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === subject.id));
    if (grade) {
      const sub = grade.subjects.find(s => s.id === subject.id);
      if (sub) {
        if (currentFolderId) {
          // Add to subfolder (recursive search would be better, but for now let's assume one level)
          const parentFolder = sub.folders.find(f => f.id === currentFolderId);
          if (parentFolder) parentFolder.subFolders.push(newFolder);
        } else {
          sub.folders.push(newFolder);
        }
      }
    }
    
    setTree(updatedTree);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleRenameFolder = (folderId: string) => {
    if (!newFolderName.trim() || !activeNode || activeNode.type !== 'subject') return;
    
    const updatedTree = { ...tree! };
    const subject = activeNode.data as SubjectNode;
    const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === subject.id));
    if (grade) {
      const sub = grade.subjects.find(s => s.id === subject.id);
      if (sub) {
        const folder = sub.folders.find(f => f.id === folderId);
        if (folder) folder.name = newFolderName;
      }
    }
    
    setTree(updatedTree);
    setNewFolderName('');
    setEditingFolderId(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    if (!activeNode || activeNode.type !== 'subject') return;
    
    const updatedTree = { ...tree! };
    const subject = activeNode.data as SubjectNode;
    const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === subject.id));
    if (grade) {
      const sub = grade.subjects.find(s => s.id === subject.id);
      if (sub) {
        sub.folders = sub.folders.filter(f => f.id !== folderId);
      }
    }
    
    setTree(updatedTree);
    if (currentFolderId === folderId) setCurrentFolderId(null);
  };

  const handleDeleteResource = (resourceId: string) => {
    if (!activeNode || activeNode.type !== 'subject') return;
    
    const updatedTree = { ...tree! };
    const subject = activeNode.data as SubjectNode;
    const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === subject.id));
    if (grade) {
      const sub = grade.subjects.find(s => s.id === subject.id);
      if (sub) {
        if (currentFolderId) {
          const folder = sub.folders.find(f => f.id === currentFolderId);
          if (folder) folder.resources = folder.resources.filter(r => r.id !== resourceId);
        } else {
          sub.resources = sub.resources.filter(r => r.id !== resourceId);
        }
      }
    }
    
    setTree(updatedTree);
  };

  const handleFileUpload = (source: 'Local' | 'Google Drive' | 'OneDrive', fileName?: string) => {
    if (!activeNode || activeNode.type !== 'subject') return;
    
    const type = uploadType === 'Link' ? 'Document' : uploadType;
    const name = fileName || `New ${type} Material`;
    
    const newResource: ContentResource = {
      id: `res-${Date.now()}`,
      title: name,
      type: type,
      url: '#',
      source: source,
      size: source === 'Local' ? '2.4 MB' : '--',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    const updatedTree = { ...tree! };
    const subject = activeNode.data as SubjectNode;
    const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === subject.id));
    
    if (grade) {
      const sub = grade.subjects.find(s => s.id === subject.id);
      if (sub) {
        if (currentFolderId) {
          const folder = sub.folders.find(f => f.id === currentFolderId);
          if (folder) folder.resources.push(newResource);
        } else {
          sub.resources.push(newResource);
        }
      }
    }
    
    setTree(updatedTree);
    setIsUploadModalOpen(false);
  };

  const handleAddSubject = () => {
    if (!newSubject.code || !newSubject.nameEn || !newSubject.nameAr || !activeNode || activeNode.type !== 'grade') return;
    
    const grade = activeNode.data as GradeLevelNode;
    const newNode: SubjectNode = {
      id: `s-${grade.id}-${Date.now()}`,
      name: isRTL ? newSubject.nameAr : newSubject.nameEn,
      code: newSubject.code,
      nameEn: newSubject.nameEn,
      nameAr: newSubject.nameAr,
      department: newSubject.department,
      weeks: [], 
      resources: [],
      folders: [],
      lessonPlans: [],
      assignedTeacherIds: []
    };

    const updatedTree = { ...tree! };
    const targetGrade = updatedTree.grades.find(g => g.id === grade.id);
    if (targetGrade) {
      targetGrade.subjects.push(newNode);
    }
    
    setTree(updatedTree);
    setIsAddSubjectModalOpen(false);
    setNewSubject({ code: '', nameEn: '', nameAr: '', department: 'General' });
  };

  const handleExportSubjects = () => {
    if (!activeNode || activeNode.type !== 'grade' || !tree) return;
    const grade = activeNode.data as GradeLevelNode;
    const subjects = grade.subjects;
    
    const headers = ['Code', 'NameEn', 'NameAr', 'Department'];
    const rows = subjects.map(s => [
      s.code || '',
      s.nameEn || '',
      s.nameAr || '',
      s.department || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subjects_${grade.name.replace(/\s+/g, '_').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSubjectTemplate = () => {
    const headers = ['Code', 'NameEn', 'NameAr', 'Department'];
    const example = ['MATH101', 'Mathematics', 'الرياضيات', 'Mathematics'];
    const csvContent = [headers.join(','), example.join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'subject_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubjects = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeNode || activeNode.type !== 'grade' || !tree) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const grade = activeNode.data as GradeLevelNode;
      const newSubjects: SubjectNode[] = [];

      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [code, nameEn, nameAr, department] = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
        
        if (code && nameEn && nameAr) {
          newSubjects.push({
            id: `s-${grade.id}-${Date.now()}-${i}`,
            name: isRTL ? nameAr : nameEn,
            code,
            nameEn,
            nameAr,
            department: department || 'General',
            weeks: [],
            resources: [],
            folders: [],
            lessonPlans: [],
            assignedTeacherIds: []
          });
        }
      }

      if (newSubjects.length > 0) {
        const updatedTree = { ...tree };
        const targetGrade = updatedTree.grades.find(g => g.id === grade.id);
        if (targetGrade) {
          targetGrade.subjects = [...targetGrade.subjects, ...newSubjects];
        }
        setTree(updatedTree);
      }
      setIsImportModalOpen(false);
    };
    reader.readAsText(file);
  };

  const handleToggleTeacher = (teacherId: string) => {
    if (!selectedSubjectForTeachers || !tree) return;
    
    const updatedTree = { ...tree };
    const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === selectedSubjectForTeachers.id));
    if (grade) {
      const sub = grade.subjects.find(s => s.id === selectedSubjectForTeachers.id);
      if (sub) {
        const currentIds = sub.assignedTeacherIds || [];
        if (currentIds.includes(teacherId)) {
          sub.assignedTeacherIds = currentIds.filter(id => id !== teacherId);
        } else {
          sub.assignedTeacherIds = [...currentIds, teacherId];
        }
        setSelectedSubjectForTeachers({ ...sub });
      }
    }
    setTree(updatedTree);
  };

  const onLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload('Local', file.name);
    }
  };

  const goBack = () => {
    if (currentFolderId) {
      setCurrentFolderId(null);
      return;
    }
    if (activeNode?.type === 'subject') {
      // Find parent grade to return to
      if (tree) {
        const parentGrade = tree.grades.find(g => g.subjects.find(s => s.id === activeNode.data.id));
        if (parentGrade) {
          setActiveNode({ type: 'grade', data: parentGrade });
          return;
        }
      }
    }
    setActiveNode(null);
  };

  // --- Icon Helpers ---
  const getSystemIcon = (sys: string) => {
    switch (sys) {
      case 'National': return <Flag size={32} />;
      case 'IG': return <Crown size={32} />;
      case 'IB': return <Globe2 size={32} />;
      case 'American': return <Star size={32} />;
      default: return <Globe2 size={32} />;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'Document': return <FileText size={16} className="text-white" />;
      case 'Presentation': return <Presentation size={16} className="text-white" />;
      case 'Video': return <Video size={16} className="text-white" />;
      case 'SCORM': return <Globe2 size={16} className="text-white" />;
      default: return <FileText size={16} className="text-white" />;
    }
  };

  // --- Helpers ---
  const translateSystemName = (sys: string) => {
    switch (sys) {
      case 'American': return 'النظام الأمريكي';
      case 'IB': return 'الباكالوريا الدولية (IB)';
      case 'IG': return 'بريطاني (IG)';
      case 'National': return 'وطني';
      default: return sys;
    }
  };

  // --- Components ---
  const SetupView = () => {
    return (
    <div className="max-w-5xl mx-auto py-12 animate-fadeIn text-center" dir="rtl">
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">إعداد المناهج التعليمية</h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">حدد الأطر التعليمية لإنشاء الدرجات والمواد والأكاديميات آلياً.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {(['American', 'IB', 'IG', 'National'] as CurriculumSystem[]).map(sys => (
          <div 
            key={sys}
            onClick={() => handleCreateSystem(sys)}
            className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center"
          >
            <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-violet-400 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 mb-6 group-hover:bg-violet-100 transition-colors">
              {getSystemIcon(sys)}
            </div>
            <h3 className="font-bold text-xl text-gray-900">{translateSystemName(sys)}</h3>
          </div>
        ))}
      </div>
      <Button variant="secondary" className="mx-auto bg-transparent border-none shadow-none text-violet-600 hover:bg-violet-50 font-bold" onClick={() => setIsImporting(true)} isLoading={isImporting}>
        <UploadCloud size={18} />
        استيراد من ملف CSV
      </Button>
    </div>
  )};

  const TreeView = () => {
    if (!tree) return null;

    // Mobile Navigation States
    const isMobile = true; // In a real app, use a hook. For now, we rely on responsive CSS classes.
    // However, for logical rendering, let's treat "no active node" as Home, and "active node" as drill down.

    return (
      <>
        <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-140px)] animate-fadeIn gap-6 relative" dir="rtl">
        
        {/* Mobile Header / Back Button */}
        {activeNode && (
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <button onClick={goBack} className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <span className="font-bold text-gray-900">
              {activeNode.type === 'grade' ? (activeNode.data as GradeLevelNode).name : (activeNode.data as SubjectNode).name}
            </span>
          </div>
        )}

        {/* Sidebar / Mobile Home View */}
        <div className={`
          w-full lg:w-80 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col
          ${activeNode ? 'hidden lg:flex' : 'flex'}
        `}>
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 className="font-bold text-lg text-gray-900">{translateSystemName(tree.system)}</h3>
             <p className="text-xs text-gray-500 font-medium mt-1">{tree.academicYear}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {tree.grades.map(grade => (
              <div key={grade.id} className="mb-2">
                <div 
                  onClick={() => setActiveNode({ type: 'grade', data: grade })}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group ${activeNode?.data.id === grade.id ? 'bg-violet-50 text-violet-800' : 'hover:bg-gray-50'}`}
                >
                  <Folder size={20} className={`${activeNode?.data.id === grade.id ? 'text-violet-600 fill-violet-200' : 'text-gray-400 fill-gray-50 group-hover:text-violet-400 group-hover:fill-violet-100'}`} />
                  <span className={`text-sm font-medium ${activeNode?.data.id === grade.id ? 'font-bold' : 'text-gray-700'}`}>
                    {{
                      'Grade 1': 'الصف الأول', 'Grade 2': 'الصف الثاني', 'Grade 3': 'الصف الثالث',
                      'Grade 4': 'الصف الرابع', 'Grade 5': 'الصف الخامس', 'Grade 6': 'الصف السادس',
                      'Grade 7': 'الصف السابع', 'Grade 8': 'الصف الثامن', 'Grade 9': 'الصف التاسع',
                      'Grade 10': 'الصف العاشر', 'Grade 11': 'الصف الحادي عشر', 'Grade 12': 'الصف الثاني عشر'
                    }[grade.name] || grade.name.replace('Grade', 'الصف')}
                  </span>
                </div>
                
                {/* Desktop: Nested Subjects */}
                <div className="hidden lg:block">
                  {(activeNode?.data.id === grade.id || (activeNode?.type === 'subject' && grade.subjects.some(s => s.id === activeNode.data.id))) && (
                    <div className="pr-9 space-y-1 mt-1 mb-2 border-r-2 border-gray-100 mr-5">
                      {grade.subjects.map(subject => (
                        <div key={subject.id}>
                          <div 
                            onClick={(e) => { e.stopPropagation(); setActiveNode({ type: 'subject', data: subject }); }}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${activeNode?.data.id === subject.id ? 'bg-violet-100 border-r-4 border-violet-600 text-violet-800 font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                          >
                            {activeNode?.data.id === subject.id ? <FolderOpen size={16} className="ml-1" /> : <Folder size={16} className="ml-1" />}
                            <span className="text-sm">
                              {{
                                'Mathematics': 'الرياضيات', 'Islamic Studies': 'التربية الإسلامية',
                                'Arabic Language': 'اللغة العربية', 'English Language': 'اللغة الإنجليزية',
                                'General Science': 'العلوم العامة', 'Art': 'التربية الفنية', 'Art Education': 'التربية الفنية', 'Social Studies': 'الدراسات الاجتماعية',
                                'Digital Skills': 'المهارات الرقمية', 'Physics': 'الفيزياء', 'Chemistry': 'الكيمياء', 'Biology': 'الأحياء', 'Business Studies': 'دراسات الأعمال',
                                'Computer Science': 'علوم الحاسب', 'English Literature': 'الأدب الإنجليزي', 'Theory of Knowledge': 'نظرية المعرفة', 'Language A': 'اللغة أ',
                                'Language B': 'اللغة ب', 'Individuals & Societies': 'الأفراد والمجتمعات', 'Sciences': 'العلوم', 'Arts': 'الفنون',
                                'English Language Arts': 'فنون اللغة الإنجليزية', 'Science': 'العلوم', 'Electives': 'المواد الاختيارية', 'Physical Education': 'التربية البدنية'
                              }[subject.nameEn || subject.name] || subject.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`
          flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col
          ${activeNode ? 'flex' : 'hidden lg:flex'}
        `}>
          {!activeNode ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Folder size={48} className="text-gray-300" />
              </div>
              <p className="text-xl font-medium text-gray-900">لا يوجد تحديد</p>
              <p className="text-sm">اختر صفاً من القائمة الجانبية لإدارة المواد والمحتوى.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
              
              {/* GRADE DETAIL VIEW (Mobile & Desktop) */}
              {activeNode.type === 'grade' && (
                <div>
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                     <div>
                       <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                         {{
                           'Grade 1': 'الصف الأول',
                           'Grade 2': 'الصف الثاني',
                           'Grade 3': 'الصف الثالث',
                           'Grade 4': 'الصف الرابع',
                           'Grade 5': 'الصف الخامس',
                           'Grade 6': 'الصف السادس',
                           'Grade 7': 'الصف السابع',
                           'Grade 8': 'الصف الثامن',
                           'Grade 9': 'الصف التاسع',
                           'Grade 10': 'الصف العاشر',
                           'Grade 11': 'الصف الحادي عشر',
                           'Grade 12': 'الصف الثاني عشر',
                         }[(activeNode.data as GradeLevelNode).name] || (activeNode.data as GradeLevelNode).name.replace('Grade', 'الصف')}
                       </h2>
                       <p className="text-sm text-gray-500 mt-1">{(activeNode.data as GradeLevelNode).subjects.length} مواد إجمالية</p>
                     </div>
                     <div className="flex flex-wrap items-center gap-2">
                     </div>
                   </div>

                   <div className="mb-8 hidden">
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
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(activeNode.data as GradeLevelNode).subjects
                        .filter(sub => 
                          sub.name.toLowerCase().includes(subjectSearchQuery.toLowerCase()) || 
                          sub.code?.toLowerCase().includes(subjectSearchQuery.toLowerCase()) ||
                          sub.department?.toLowerCase().includes(subjectSearchQuery.toLowerCase())
                        )
                        .slice(0, 6)
                        .map((sub: SubjectNode) => {
                          const translatedNames: Record<string, string> = {
                            'Mathematics': 'الرياضيات',
                            'Islamic Studies': 'التربية الإسلامية',
                            'Arabic Language': 'اللغة العربية',
                            'English Language': 'اللغة الإنجليزية',
                            'General Science': 'العلوم العامة',
                            'Art': 'التربية الفنية', 'Art Education': 'التربية الفنية', 'Social Studies': 'الدراسات الاجتماعية',
                            'Digital Skills': 'المهارات الرقمية', 'Physics': 'الفيزياء', 'Chemistry': 'الكيمياء', 'Biology': 'الأحياء', 'Business Studies': 'دراسات الأعمال',
                            'Computer Science': 'علوم الحاسب', 'English Literature': 'الأدب الإنجليزي', 'Theory of Knowledge': 'نظرية المعرفة', 'Language A': 'اللغة أ',
                            'Language B': 'اللغة ب', 'Individuals & Societies': 'الأفراد والمجتمعات', 'Sciences': 'العلوم', 'Arts': 'الفنون',
                            'English Language Arts': 'فنون اللغة الإنجليزية', 'Science': 'العلوم', 'Electives': 'المواد الاختيارية', 'Physical Education': 'التربية البدنية'
                          };
                          const displayName = translatedNames[sub.nameEn || sub.name] || sub.name;
                          return (
                          <div 
                            key={sub.id} 
                            onClick={() => setActiveNode({ type: 'subject', data: sub })} 
                            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between aspect-auto h-48 cursor-pointer group"
                          >
                             <div>
                               <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                 <BookOpen size={24} strokeWidth={1.5} />
                               </div>
                               <h3 className="text-xl font-bold text-slate-800">{displayName}</h3>
                             </div>

                             <div className="flex items-center gap-3 mt-auto">
                                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium">
                                  <Users size={14} /> {sub.assignedTeacherIds?.length || 0}
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium">
                                  <Folder size={14} /> {(sub.resources?.length || 0) + (sub.folders?.length || 0)}
                                </span>
                             </div>
                          </div>
                        )})}
                        
                        <div 
                          onClick={() => setIsAddSubjectModalOpen(true)}
                          className="h-48 rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50/30 hover:bg-violet-50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors text-violet-600 group"
                        >
                          <Plus size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                          <span className="font-bold border-none">إضافة مادة +</span>
                        </div>
                   </div>
                </div>
              )}

              {/* SUBJECT DETAIL VIEW */}
              {activeNode.type === 'subject' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center w-full mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-violet-50 p-3 rounded-xl text-violet-600 flex items-center justify-center">
                        <BookOpen size={28} />
                      </div>
                      <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                        {
                          {
                            'Mathematics': 'الرياضيات', 'Islamic Studies': 'التربية الإسلامية',
                            'Arabic Language': 'اللغة العربية', 'English Language': 'اللغة الإنجليزية',
                            'General Science': 'العلوم العامة', 'Art': 'التربية الفنية', 'Art Education': 'التربية الفنية', 'Social Studies': 'الدراسات الاجتماعية',
                            'Digital Skills': 'المهارات الرقمية', 'Physics': 'الفيزياء', 'Chemistry': 'الكيمياء', 'Biology': 'الأحياء', 'Business Studies': 'دراسات الأعمال',
                            'Computer Science': 'علوم الحاسب', 'English Literature': 'الأدب الإنجليزي', 'Theory of Knowledge': 'نظرية المعرفة', 'Language A': 'اللغة أ',
                            'Language B': 'اللغة ب', 'Individuals & Societies': 'الأفراد والمجتمعات', 'Sciences': 'العلوم', 'Arts': 'الفنون',
                            'English Language Arts': 'فنون اللغة الإنجليزية', 'Science': 'العلوم', 'Electives': 'المواد الاختيارية', 'Physical Education': 'التربية البدنية'
                          }[(activeNode.data as SubjectNode).nameEn || (activeNode.data as SubjectNode).name] || (activeNode.data as SubjectNode).name
                        }
                      </h2>
                    </div>
                    
                    <div className="flex gap-4 items-center">
                      <button 
                        onClick={() => { setIsTeacherModalOpen(true); setSelectedSubjectForTeachers(activeNode.data as SubjectNode); }}
                        className="border border-violet-200 text-violet-700 bg-white hover:bg-violet-50 text-sm py-2 px-4 rounded-lg flex items-center gap-2"
                      >
                         <Users size={16} /> إضافة معلمين
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-6 border-b border-slate-200 mb-8 w-full">
                    <button 
                      onClick={() => setActiveSubjectTab('resources')}
                      className={activeSubjectTab === 'resources' ? 'text-violet-700 border-b-2 border-violet-600 pb-3 font-bold flex items-center gap-2' : 'text-slate-500 hover:text-slate-700 pb-3 flex items-center gap-2 cursor-pointer transition'}
                    >
                      <Folder size={18} /> الموارد
                    </button>
                    <button 
                      onClick={() => setActiveSubjectTab('schedule')}
                      className={activeSubjectTab === 'schedule' ? 'text-violet-700 border-b-2 border-violet-600 pb-3 font-bold flex items-center gap-2' : 'text-slate-500 hover:text-slate-700 pb-3 flex items-center gap-2 cursor-pointer transition'}
                    >
                      <Calendar size={18} /> الجدول الأكاديمي
                    </button>
                    <button 
                      onClick={() => setActiveSubjectTab('plans')}
                      className={activeSubjectTab === 'plans' ? 'text-violet-700 border-b-2 border-violet-600 pb-3 font-bold flex items-center gap-2' : 'text-slate-500 hover:text-slate-700 pb-3 flex items-center gap-2 cursor-pointer transition'}
                    >
                      <FileText size={18} /> خطط الدروس
                    </button>
                  </div>

                  <div className="max-w-5xl mx-auto w-full">
                    {activeSubjectTab === 'schedule' && (
                       <div className="bg-gray-50/50 rounded-3xl p-6 h-fit w-full">
                          <div className="flex justify-between items-center w-full mb-6 border-b border-slate-100 pb-4">
                            <h3 className="text-lg font-bold text-slate-800">الخطة الزمنية للمادة</h3>
                            <button 
                              onClick={() => handleGenerateAITimeline(activeNode.data)} 
                              disabled={generatingTimeline}
                              className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white border-none shadow-sm hover:shadow-md transition font-bold"
                            >
                               <Wand2 size={16} /> {generatingTimeline ? 'جاري الإنشاء...' : 'AI'}
                            </button>
                          </div>
                          <div className="flex flex-col gap-4 w-full">
                             {(activeNode.data as SubjectNode).weeks.slice(0, 5).map((week, index) => (
                               <div key={week.id} className="bg-white rounded-2xl border border-slate-200 p-5 w-full shadow-sm">
                                 <div className="flex justify-between items-center w-full mb-4 border-b border-slate-100 pb-2">
                                   <span className="text-lg font-bold text-violet-700 tracking-wider block">الأسبوع {week.weekNumber}</span>
                                   <p className="text-sm font-medium text-slate-500">{formatArabicDate(week.startDate)} - {formatArabicDate(week.endDate)}</p>
                                 </div>
                                 
                                 {week.topics && week.topics.length > 0 && (
                                   <div className="mt-2 space-y-3">
                                      {week.topics.map((topic, ti) => {
                                        const isObj = typeof topic === 'object' && topic !== null;
                                        const topicName = isObj ? topic.name : topic;
                                        const topicOutcome = isObj ? topic.outcome : null;
                                        return (
                                        <div key={ti} className="group flex justify-between items-center p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-100 shadow-none mb-2">
                                          <div className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                                            <div className="flex items-center gap-2">
                                              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                              <span className="font-bold text-gray-900">{topicName}</span>
                                            </div>
                                            {topicOutcome && (
                                              <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded border border-purple-100 w-fit ms-3.5">
                                                ناتج: {topicOutcome}
                                              </span>
                                            )}
                                          </div>
                                          <div className="opacity-0 group-hover:opacity-100 flex gap-3 transition-opacity text-gray-400">
                                            <Pencil size={14} className="hover:text-purple-600" onClick={(e) => { e.stopPropagation(); /* edit handler */ }} />
                                            <Trash2 size={14} className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); /* delete handler */ }} />
                                          </div>
                                        </div>
                                        );
                                      })}
                                   </div>
                                 )}

                                 {editingWeekId === week.id ? (
                                    <InlineTaskForm 
                                      onSave={(task) => {
                                        const updatedTree = { ...tree! };
                                        const st = activeNode.data as SubjectNode;
                                        const grade = updatedTree.grades.find(g => g.subjects.some(s => s.id === st.id));
                                        if (grade) {
                                          const sub = grade.subjects.find(s => s.id === st.id);
                                          if (sub) {
                                            const w = sub.weeks.find(x => x.id === week.id);
                                            if (w) w.topics = [...(w.topics || []), task];
                                            setTree(updatedTree);
                                          }
                                        }
                                        setEditingWeekId(null);
                                      }}
                                      onCancel={() => setEditingWeekId(null)}
                                    />
                                 ) : (
                                    <div className="mt-5">
                                       <button 
                                         onClick={(e) => {
                                            e.preventDefault();
                                            setEditingWeekId(week.id);
                                         }}
                                         className="w-full border-2 border-dashed border-gray-200 text-gray-500 rounded-xl p-3 flex justify-center items-center hover:bg-gray-50 hover:border-purple-200 hover:text-purple-600 transition-colors font-bold text-sm gap-2 shadow-none"
                                       >
                                         <Plus size={18} /> إضافة مهمة
                                       </button>
                                    </div>
                                 )}
                               </div>
                             ))}
                             <div className="text-center p-4">
                               <p className="text-xs text-gray-400 italic">... 35 أسبوع إضافي</p>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeSubjectTab === 'resources' && (
                      <div className="space-y-6">
                         {/* Drop Zone */}
                         <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-violet-50/30 hover:border-violet-200 transition-colors group">
                            <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-violet-600 group-hover:scale-110 transition-transform">
                              <UploadCloud size={32} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">رفع الموارد</h3>
                            <p className="text-sm text-gray-500 mb-6">سحب وإفلات الملفات أو الاستيراد</p>
                            <div className="flex flex-wrap justify-center gap-3">
                               {['وثيقة', 'فيديو', 'عرض تقديمي', 'رابط'].map((type) => (
                                 <button 
                                   key={type} 
                                   onClick={() => {
                                     setUploadType(type === 'وثيقة' ? 'Document' : type === 'فيديو' ? 'Video' : type === 'عرض تقديمي' ? 'Presentation' : 'Link');
                                     setIsUploadModalOpen(true);
                                   }}
                                   className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-none"
                                 >
                                   + {type}
                                 </button>
                               ))}
                               <button 
                                 onClick={() => {
                                   setUploadType('Package');
                                   setIsUploadModalOpen(true);
                                 }}
                                 className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-none flex items-center gap-1.5"
                               >
                                 <Package size={14} /> حزمة (SCORM / xAPI)
                               </button>
                               <button 
                                 onClick={() => {
                                   setUploadType('SourceCode');
                                   setIsUploadModalOpen(true);
                                 }}
                                 className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-none flex items-center gap-1.5"
                               >
                                 <Code size={14} /> مقتطف برمجي
                               </button>
                            </div>
                         </div>

                         {/* Upload Modal */}
                         {isUploadModalOpen && (
                           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
                               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                 <h3 className="text-xl font-bold text-gray-900">رفع {uploadType === 'Document' ? 'وثيقة' : uploadType === 'Video' ? 'فيديو' : uploadType === 'Presentation' ? 'عرض تقديمي' : uploadType === 'Package' ? 'حزمة' : uploadType === 'SourceCode' ? 'مقتطف' : 'رابط'}</h3>
                                 <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                   <XIcon size={20} />
                                 </button>
                               </div>
                               <div className="p-8 space-y-6">
                                 <div className="grid grid-cols-1 gap-4">
                                   <button 
                                     onClick={() => fileInputRef.current?.click()}
                                     className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-violet-50 hover:border-violet-200 transition-all group"
                                   >
                                     <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                       <UploadCloud size={24} />
                                     </div>
                                     <div className="text-left">
                                       <p className="font-bold text-gray-900">الجهاز المحلي</p>
                                       <p className="text-xs text-gray-500">الرفع من الكمبيوتر</p>
                                     </div>
                                   </button>

                                   <button 
                                     onClick={() => handleFileUpload('Google Drive')}
                                     className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                                   >
                                     <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                       <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                         <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5H1.15L7.71 3.5zm1.05 8.5l3.44 6 3.44-6h-6.88zm14.09 3L16.29 3.5l-6.55 11.5h13.11z"/>
                                       </svg>
                                     </div>
                                     <div className="text-left">
                                       <p className="font-bold text-gray-900">جوجل درايف</p>
                                       <p className="text-xs text-gray-500">استيراد من جوجل درايف</p>
                                     </div>
                                   </button>

                                   <button 
                                     onClick={() => handleFileUpload('OneDrive')}
                                     className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                                   >
                                     <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                       <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                         <path d="M16.5 13.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm-10-4c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm10-6c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/>
                                       </svg>
                                     </div>
                                     <div className="text-left">
                                       <p className="font-bold text-gray-900">ون درايف</p>
                                       <p className="text-xs text-gray-500">استيراد من مايكروسوفت 365</p>
                                     </div>
                                   </button>
                                 </div>
                                 <input 
                                   type="file" 
                                   ref={fileInputRef} 
                                   className="hidden" 
                                   onChange={onLocalFileChange}
                                   accept={uploadType === 'Document' ? '.pdf,.doc,.docx,.txt' : uploadType === 'Video' ? 'video/*' : uploadType === 'Presentation' ? '.ppt,.pptx' : uploadType === 'SCORM' ? '.zip' : '*'}
                                 />
                               </div>
                               <div className="p-6 bg-gray-50 border-t border-gray-100">
                                 <Button variant="secondary" className="w-full" onClick={() => setIsUploadModalOpen(false)}>إلغاء</Button>
                               </div>
                             </div>
                           </div>
                         )}

                         {/* Resource List */}
                         <div>
                           <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-gray-900 flex items-center gap-2">
                               المكتبة <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                 {currentFolderId 
                                   ? (activeNode.data as SubjectNode).folders.find(f => f.id === currentFolderId)?.resources.length || 0
                                   : (activeNode.data as SubjectNode).resources.length + (activeNode.data as SubjectNode).folders.length
                                 }
                               </span>
                             </h3>
                             <div className="flex gap-2">
                               {currentFolderId && (
                                 <button 
                                   onClick={() => setCurrentFolderId(null)}
                                   className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
                                 >
                                   <ArrowLeft size={14} /> رجوع
                                 </button>
                               )}
                               <button 
                                 onClick={() => setIsCreatingFolder(true)}
                                 className="text-xs font-bold text-violet-600 hover:bg-violet-50 px-2 py-1 rounded flex items-center gap-1"
                               >
                                 <FolderPlus size={14} /> مجلد جديد
                               </button>
                             </div>
                           </div>

                           {isCreatingFolder && (
                             <div className="mb-4 p-4 bg-violet-50 rounded-2xl border border-violet-100 flex gap-2 animate-fadeIn">
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

                           <div className="space-y-3">
                             {/* Render Folders if at root */}
                             {!currentFolderId && (activeNode.data as SubjectNode).folders.map((folder) => (
                               <div 
                                 key={folder.id} 
                                 className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all group"
                               >
                                  <div 
                                    onClick={() => setCurrentFolderId(folder.id)}
                                    className="flex items-center gap-4 flex-1 cursor-pointer"
                                  >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-50 text-violet-600">
                                      <Folder size={20} fill="currentColor" fillOpacity={0.2} />
                                    </div>
                                    {editingFolderId === folder.id ? (
                                      <div className="flex gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                          autoFocus
                                          type="text" 
                                          value={newFolderName}
                                          onChange={(e) => setNewFolderName(e.target.value)}
                                          className="flex-1 bg-white border border-violet-200 rounded-lg px-2 py-1 text-sm focus:outline-none"
                                          onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder(folder.id)}
                                        />
                                        <button onClick={() => handleRenameFolder(folder.id)} className="text-xs font-bold text-violet-600">حفظ</button>
                                        <button onClick={() => setEditingFolderId(null)} className="text-xs text-gray-400">إلغاء</button>
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="font-bold text-gray-900 text-sm">
                                          {{
                                            'Week 1': 'الأسبوع 1',
                                            'Week 2': 'الأسبوع 2',
                                            'Assessments': 'التقييمات',
                                            'Presentations': 'العروض التقديمية',
                                            'Syllabus': 'توصيف المادة',
                                            'Lesson Plans': 'خطط الدروس',
                                            'Teacher Resources': 'موارد المعلم',
                                            'Homeworks': 'الواجبات'
                                          }[folder.name] || folder.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{folder.resources.length} عناصر • {folder.subFolders.length} مجلدات</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {editingFolderId !== folder.id && (
                                      <>
                                        <button 
                                          onClick={() => { setEditingFolderId(folder.id); setNewFolderName(folder.name); }}
                                          className="p-2 text-gray-300 hover:text-violet-500 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                        >
                                          <Pencil size={16} />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteFolder(folder.id)}
                                          className="p-2 text-gray-300 hover:text-violet-500 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-violet-500 transition-colors" />
                                      </>
                                    )}
                                  </div>
                               </div>
                             ))}

                             {/* Render Resources */}
                             {(currentFolderId 
                               ? (activeNode.data as SubjectNode).folders.find(f => f.id === currentFolderId)?.resources || []
                               : (activeNode.data as SubjectNode).resources
                             ).map((file, i) => (
                               <div key={file.id || i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all group">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs ${file.type === 'Document' ? 'bg-violet-500' : file.type === 'Presentation' ? 'bg-violet-500' : file.type === 'SCORM' ? 'bg-teal-500' : 'bg-blue-500'}`}>
                                      {getFileIcon(file.type)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-gray-900 text-sm">{file.title}</p>
                                      <p className="text-xs text-gray-400">{file.size || '2.4 MB'} • {file.uploadedAt || 'تم الرفع بالأمس'}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => handleDeleteResource(file.id)}
                                    className="text-gray-300 hover:text-violet-500 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                               </div>
                             ))}
                           </div>
                         </div>
                      </div>
                    )}

                    {activeSubjectTab === 'plans' && (
                      <div className="space-y-6">
                         <div className="flex justify-between items-center w-full mb-6 border-b border-slate-100 pb-4">
                           <h3 className="text-xl font-bold text-slate-800">خطط الدروس</h3>
                           <div className="flex items-center gap-3">
                             <button className="text-sm py-2 px-4 rounded-lg flex items-center gap-2 bg-violet-600 text-white hover:bg-violet-700 transition shadow-sm">
                               <Plus size={16} /> إضافة خطة درس
                             </button>
                             <button 
                               onClick={() => handleGenerateAIPlan(activeNode.data as SubjectNode)}
                               className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white border-none shadow-sm hover:shadow-md transition font-bold"
                             >
                               <Wand2 size={16} /> AI
                             </button>
                           </div>
                         </div>
                         {/* AI Plans List */}
                         <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="rounded-3xl shadow-sm border border-slate-100 p-6 flex items-start gap-6 hover:shadow-lg transition bg-white">
                                 <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                                   <span className="text-[10px] font-bold leading-tight">A/B</span>
                                   <BookOpen size={14} />
                                 </div>
                                 <div className="flex-1 w-full">
                                     <div className="flex justify-between items-start mb-2">
                                       <h4 className="font-bold text-slate-900 text-lg">الدرس 1: الحروف الهجائية</h4>
                                       <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">مكتملة</span>
                                     </div>
                                     <p className="text-sm text-slate-500 leading-relaxed mb-4">مراجعة شاملة لنطق وكتابة الحروف الهجائية بأشكالها المختلفة.</p>
                                     <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                       <span className="flex items-center gap-1"><Users size={14} /> سارة منصور</span>
                                       <span className="flex items-center gap-1"><Clock size={14} /> 45 دقيقة</span>
                                     </div>
                                 </div>
                               </div>

                               <div className="rounded-3xl shadow-sm border border-slate-100 p-6 flex items-start gap-6 hover:shadow-lg transition bg-white">
                                 <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                                   <span className="text-[10px] font-bold leading-tight">A/B</span>
                                   <BookOpen size={14} />
                                 </div>
                                 <div className="flex-1 w-full">
                                     <div className="flex justify-between items-start mb-2">
                                       <h4 className="font-bold text-slate-900 text-lg">الدرس 2: المدود القصيرة والطويلة</h4>
                                       <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">مكتملة</span>
                                     </div>
                                     <p className="text-sm text-slate-500 leading-relaxed mb-4">التمييز بين حركات المد المختلفة وتطبيقها في الكلمات.</p>
                                     <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                       <span className="flex items-center gap-1"><Users size={14} /> سارة منصور</span>
                                       <span className="flex items-center gap-1"><Clock size={14} /> 45 دقيقة</span>
                                     </div>
                                 </div>
                               </div>

                               <div className="rounded-3xl shadow-sm border border-slate-100 p-6 flex items-start gap-6 hover:shadow-lg transition bg-white">
                                 <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                                   <span className="text-[10px] font-bold leading-tight">A/B</span>
                                   <BookOpen size={14} />
                                 </div>
                                 <div className="flex-1 w-full">
                                     <div className="flex justify-between items-start mb-2">
                                       <h4 className="font-bold text-slate-900 text-lg">الدرس 3: تركيب الكلمات البسيطة</h4>
                                       <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">قيد الانتظار</span>
                                     </div>
                                     <p className="text-sm text-slate-500 leading-relaxed mb-4">تدريب الطلاب على دمج الحروف لتكوين كلمات ذات معنى.</p>
                                     <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                       <span className="flex items-center gap-1"><Users size={14} /> سارة منصور</span>
                                       <span className="flex items-center gap-1"><Clock size={14} /> 50 دقيقة</span>
                                     </div>
                                 </div>
                               </div>

                               <div className="rounded-3xl shadow-sm border border-slate-100 p-6 flex items-start gap-6 hover:shadow-lg transition bg-white">
                                 <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                                   <span className="text-[10px] font-bold leading-tight">A/B</span>
                                   <BookOpen size={14} />
                                 </div>
                                 <div className="flex-1 w-full">
                                     <div className="flex justify-between items-start mb-2">
                                       <h4 className="font-bold text-slate-900 text-lg">الدرس 4: اختبار قراءة أولي</h4>
                                       <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">قيد الانتظار</span>
                                     </div>
                                     <p className="text-sm text-slate-500 leading-relaxed mb-4">تقييم مستوى قراءة وفهم الطلاب الأولي.</p>
                                     <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                       <span className="flex items-center gap-1"><Users size={14} /> سارة منصور</span>
                                       <span className="flex items-center gap-1"><Clock size={14} /> 30 دقيقة</span>
                                     </div>
                                 </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Add Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{isRTL ? 'إضافة مادة جديدة' : 'Add New Subject'}</h3>
                  <p className="text-sm text-gray-500">{isRTL ? 'أدخل تفاصيل المادة الدراسية الجديدة' : 'Enter the details for the new academic subject'}</p>
                </div>
              </div>
              <button onClick={() => setIsAddSubjectModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{isRTL ? 'رمز المادة' : 'Subject Code'}</label>
                <input 
                  type="text" 
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                  placeholder="مثال: MATH101"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{isRTL ? 'الاسم بالإنجليزية' : 'Name (EN)'}</label>
                  <input 
                    type="text" 
                    value={newSubject.nameEn}
                    onChange={(e) => setNewSubject({...newSubject, nameEn: e.target.value})}
                    placeholder="مثال: Mathematics"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{isRTL ? 'الاسم بالعربية' : 'Name (AR)'}</label>
                  <input 
                    type="text" 
                    value={newSubject.nameAr}
                    onChange={(e) => setNewSubject({...newSubject, nameAr: e.target.value})}
                    placeholder="مثال: الرياضيات"
                    className={`w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all ${isRTL ? 'text-right' : ''}`}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{isRTL ? 'القسم' : 'Department'}</label>
                <select 
                  value={newSubject.department}
                  onChange={(e) => setNewSubject({...newSubject, department: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all appearance-none"
                >
                  <option value="Science">العلوم</option>
                  <option value="Mathematics">الرياضيات</option>
                  <option value="Languages">اللغات</option>
                  <option value="Social Studies">الدراسات الاجتماعية</option>
                  <option value="Arts">الفنون</option>
                  <option value="General">عام</option>
                </select>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-3">
              <Button variant="secondary" className="flex-1 h-12 rounded-2xl" onClick={() => setIsAddSubjectModalOpen(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button className="flex-1 h-12 rounded-2xl shadow-lg shadow-violet-100" onClick={handleAddSubject}>
                {isRTL ? 'إضافة المادة' : 'Add Subject'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Selection Modal */}
      {isTeacherModalOpen && selectedSubjectForTeachers && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{isRTL ? 'تعيين المعلمين' : 'Assign Teachers'}</h3>
                  <p className="text-sm text-gray-500">{selectedSubjectForTeachers.name}</p>
                </div>
              </div>
              <button onClick={() => setIsTeacherModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-3 text-gray-400`} size={18} />
                <input 
                  type="text" 
                  placeholder={isRTL ? 'البحث عن معلم...' : 'Search teachers...'}
                  className={`w-full p-3 ${isRTL ? 'pr-12' : 'pl-12'} bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition-all`}
                  value={teacherSearchQuery}
                  onChange={(e) => setTeacherSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {MOCK_TEACHERS.filter(t => 
                t.name.toLowerCase().includes(teacherSearchQuery.toLowerCase()) || 
                t.specialization.toLowerCase().includes(teacherSearchQuery.toLowerCase())
              ).map(teacher => {
                const isSelected = selectedSubjectForTeachers.assignedTeacherIds?.includes(teacher.id);
                const arabicNames: Record<string, string> = {
                  'Sarah Al-Majed': 'سارة الماجد',
                  'Ahmed Khalil': 'أحمد خليل',
                  'Emily Davis': 'إيميلي ديفيس',
                  'Michael Chen': 'مايكل تشين'
                };
                const arabicSpecs: Record<string, string> = {
                  'Mathematics': 'الرياضيات',
                  'Physics': 'الفيزياء',
                  'English Literature': 'اللغة الإنجليزية',
                  'Computer Science': 'علوم الحاسب'
                };
                const displayName = arabicNames[teacher.name] || teacher.name;
                const displaySpec = arabicSpecs[teacher.specialization] || teacher.specialization;
                return (
                  <div 
                    key={teacher.id}
                    onClick={() => handleToggleTeacher(teacher.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-200' 
                        : 'bg-white border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src={teacher.avatar} 
                      alt={displayName} 
                      className="w-12 h-12 rounded-xl object-cover shadow-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{displaySpec}</p>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-3">
                        <TeacherRoleSegmentedControl isRTL={isRTL} />
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center">
                          <Check size={14} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-3">
              <Button className="w-full h-12 rounded-2xl shadow-lg shadow-violet-100" onClick={() => setIsTeacherModalOpen(false)}>
                {isRTL ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{isRTL ? 'استيراد المواد' : 'Import Subjects'}</h3>
                  <p className="text-sm text-gray-500">{isRTL ? 'ارفع ملف CSV لإضافة عدة مواد' : 'Upload a CSV file to add multiple subjects'}</p>
                </div>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <Info size={20} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-blue-900 text-sm">{isRTL ? 'التعليمات' : 'Instructions'}</h4>
                  <p className="text-xs text-blue-700">
                    {isRTL ? 'يجب أن يحتوي الملف على الأعمدة التالية:' : 'File must contain the following columns:'}
                    <br />
                    <strong>Code, NameEn, NameAr, Department</strong>
                  </p>
                  <button 
                    onClick={downloadSubjectTemplate}
                    type="button"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Download size={12} /> {isRTL ? 'تحميل النموذج' : 'Download Template'}
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed rounded-[2rem] p-12 text-center transition-all border-gray-200 bg-gray-50/30 hover:border-violet-300 hover:bg-gray-50">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-violet-600">
                  <Upload size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{isRTL ? 'ارفع ملف CSV' : 'Upload your CSV file'}</h4>
                <p className="text-sm text-gray-500 mb-8">{isRTL ? 'اسحب الملف هنا أو اضغط للاختيار' : 'Drag and drop your file here, or click to browse'}</p>
                <input type="file" className="hidden" id="subject-csv-import" accept=".csv" onChange={handleImportSubjects} />
                <label htmlFor="subject-csv-import">
                  <div className="inline-flex items-center justify-center px-8 py-3 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 cursor-pointer">
                    {isRTL ? 'اختيار ملف' : 'Select File'}
                  </div>
                </label>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <Button variant="secondary" className="w-full h-12 rounded-2xl" onClick={() => setIsImportModalOpen(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  };

  return tree ? <TreeView /> : <SetupView />;
};