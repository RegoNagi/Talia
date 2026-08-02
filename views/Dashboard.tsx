import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { UserRole, Language } from '../types';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, GraduationCap, Activity, 
  BrainCircuit, AlertTriangle, CreditCard, UserMinus, ArrowRight, Bell,
  BookOpenCheck, MessageSquare, CalendarDays, BookOpen, Radar
} from 'lucide-react';

interface DashboardProps {
  role: UserRole;
  language: Language;
  activeFilterProp?: string;
  onFilterChange?: (filter: string) => void;
}

// --- MOCK DATA ---

const KPI_SPARKLINE_1 = [{v: 2300}, {v: 2350}, {v: 2340}, {v: 2380}, {v: 2410}, {v: 2450}];
const KPI_SPARKLINE_2 = [{v: 1.0}, {v: 1.1}, {v: 1.05}, {v: 1.15}, {v: 1.2}, {v: 1.24}];
const KPI_SPARKLINE_3 = [{v: 86}, {v: 85}, {v: 85.5}, {v: 84.8}, {v: 84.5}, {v: 84.2}];
const KPI_SPARKLINE_4 = [{v: 2800}, {v: 2900}, {v: 2850}, {v: 3000}, {v: 3050}, {v: 3120}];

const CASH_FLOW_DATA = [
  { month: 'Oct', revenue: 1100, expenses: 800 },
  { month: 'Nov', revenue: 1150, expenses: 820 },
  { month: 'Dec', revenue: 1000, expenses: 900 },
  { month: 'Jan', revenue: 1200, expenses: 850 },
  { month: 'Feb', revenue: 1220, expenses: 860 },
  { month: 'Mar', revenue: 1240, expenses: 880 },
];

const ATTENDANCE_STUDENTS = [
  { name: 'Present', value: 85, color: '#10b981' },
  { name: 'Late', value: 10, color: '#f59e0b' },
  { name: 'Absent', value: 5, color: '#f43f5e' },
];

const ATTENDANCE_STAFF = [
  { name: 'Present', value: 95, color: '#10b981' },
  { name: 'Late', value: 3, color: '#f59e0b' },
  { name: 'Absent', value: 2, color: '#f43f5e' },
];

const SPACES_DATA = [
  { day: 'Mon', students: 1200, parents: 400, teachers: 150 },
  { day: 'Tue', students: 1300, parents: 450, teachers: 160 },
  { day: 'Wed', students: 1250, parents: 420, teachers: 155 },
  { day: 'Thu', students: 1400, parents: 500, teachers: 165 },
  { day: 'Fri', students: 1350, parents: 480, teachers: 160 },
];

const getHeatmapSubjects = (isRTL: boolean) => isRTL ? ['الرياضيات', 'العلوم', 'الإنجليزية', 'التاريخ'] : ['Math', 'Science', 'English', 'History'];
const getHeatmapData = (isRTL: boolean) => [
  { grade: isRTL ? 'الصف 9' : 'Grade 9', scores: [82, 85, 88, 91] },
  { grade: isRTL ? 'الصف 10' : 'Grade 10', scores: [68, 74, 82, 85] },
  { grade: isRTL ? 'الصف 11' : 'Grade 11', scores: [75, 65, 89, 92] },
  { grade: isRTL ? 'الصف 12' : 'Grade 12', scores: [91, 88, 94, 95] },
];

const getLiveFeed = (isRTL: boolean) => [
  { id: 1, text: isRTL ? 'تم استلام دفعة رسوم دراسية بقيمة 4,500 ج.م من حمد حسن (الصف 10)' : 'Tuition payment of 4,500 EGP received from Hamad Hassan (Grade 10)', time: isRTL ? 'منذ دقيقتين' : '2m ago', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 2, text: isRTL ? 'قام أ. عبدالله بنشر درجات منتصف الفصل لفيزياء الصف 11' : 'Mr. Abdullah published Midterm Grades for Grade 11 Physics', time: isRTL ? 'منذ 15 دقيقة' : '15m ago', icon: BookOpenCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, text: isRTL ? 'تسجيل غياب بدون عذر لـ 3 طلاب في الصف 9' : 'Unexcused absence recorded for 3 students in Grade 9', time: isRTL ? 'منذ ساعة' : '1h ago', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 4, text: isRTL ? 'اكتشاف تفاعل عالٍ في مساحة رياضيات الصف 12' : 'High engagement detected in Grade 12 Math Space', time: isRTL ? 'منذ ساعتين' : '2h ago', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 5, text: isRTL ? 'استلام رسوم مكتبة بقيمة 150 ج.م من عائشة (الصف 8)' : 'Library fee of 150 EGP received from Aisha (Grade 8)', time: isRTL ? 'منذ 3 ساعات' : '3h ago', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 6, text: isRTL ? 'إضافة مهمة جديدة لتاريخ الصف 10' : 'New assignment added to Grade 10 History', time: isRTL ? 'منذ 4 ساعات' : '4h ago', icon: BookOpenCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 7, text: isRTL ? 'تم تحديد موعد لاجتماع أولياء الأمور لمعلمي علوم الصف 9' : 'Parent-teacher meeting scheduled for Grade 9 Science', time: isRTL ? 'منذ 5 ساعات' : '5h ago', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
];

export const Dashboard: React.FC<DashboardProps> = ({ role, language, activeFilterProp, onFilterChange }) => {
  const isRTL = language === Language.AR;
  const [activeFilter, setActiveFilterInternal] = useState(activeFilterProp || (isRTL ? 'المدرسة بأكملها' : 'All School'));
  
  const setActiveFilter = (filter: string) => {
    setActiveFilterInternal(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  useEffect(() => {
    if (activeFilterProp) {
      setActiveFilterInternal(activeFilterProp);
    }
  }, [activeFilterProp]);

  const [attendanceView, setAttendanceView] = useState<'Students' | 'Staff'>('Students');
  
  const filters = isRTL 
    ? ['المدرسة بأكملها', 'الثانوية', 'المتوسطة', 'الابتدائية'] 
    : ['All School', 'High School', 'Middle School', 'Elementary'];

  // Change language-specific filters back to generic for matching if needed, but since it's just state here, it's fine.

  const getHeatmapColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (score >= 70) return 'bg-gray-50 text-gray-700 border-gray-100';
    return 'bg-rose-50 text-rose-700 border-rose-100';
  };

  const currentAttendanceData = attendanceView === 'Students' ? ATTENDANCE_STUDENTS : ATTENDANCE_STAFF;
  const LIVE_FEED = getLiveFeed(isRTL);
  const HEATMAP_SUBJECTS = getHeatmapSubjects(isRTL);
  const HEATMAP_DATA = getHeatmapData(isRTL);

  return (
    <div className="space-y-6 pb-10 animate-fadeIn min-h-full" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* GLOBAL HEADER & FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isRTL ? 'مركز القيادة التنفيذي' : 'Executive Command Center'}</h1>
          <p className="text-sm text-gray-500 mt-1">{isRTL ? 'العمليات الموحدة، الأكاديميات، والمالية' : 'Unified Operations, Academics, and Financials'}</p>
        </div>
        <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeFilter === filter 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* TOP ROW: THE VITAL SIGNS (4 KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* KPI 1: Active Enrollment */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} /> {isRTL ? 'التسجيل النشط (شؤون الطلاب)' : 'Active Enrollment (SIS)'}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-gray-900 font-mono">2,450</h3>
                <span className="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <TrendingUp size={10} className="mr-0.5" /> +2.4%
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-400 mt-1">{isRTL ? 'حضور اليوم 96%' : "96% Today's Attendance"}</p>
            </div>
          </div>
          <div className="h-12 w-full mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={KPI_SPARKLINE_1}>
                <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI 2: Monthly Revenue */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={14} /> {isRTL ? 'الإيرادات الشهرية (تخطيط الموارد)' : 'Monthly Revenue (ERP)'}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-gray-900 font-mono">4.5M ج.م</h3>
                <span className="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <TrendingUp size={10} className="mr-0.5" /> +8.1%
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-400 mt-1">{isRTL ? '95% من الهدف 4.5 مليون' : '95% of 4.7M ج.م Target'}</p>
            </div>
          </div>
          <div className="h-12 w-full mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={KPI_SPARKLINE_2}>
                <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI 3: Academic Health */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap size={14} /> {isRTL ? 'الصحة الأكاديمية (نظام إدارة التعلم)' : 'Academic Health (LMS)'}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-gray-900 font-mono">84.2%</h3>
                <span className="text-xs font-bold text-rose-500 flex items-center bg-rose-50 px-1.5 py-0.5 rounded-md">
                  <TrendingDown size={10} className="mr-0.5" /> -1.2%
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-400 mt-1">{isRTL ? 'متوسط درجات المدرسة' : 'School-wide Average Grade'}</p>
            </div>
          </div>
          <div className="h-12 w-full mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={KPI_SPARKLINE_3}>
                <Area type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={2} fill="#f43f5e" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI 4: System Adoption */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} /> {isRTL ? 'اعتماد النظام (المساحات)' : 'System Adoption (Spaces)'}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-gray-900 font-mono">3,120</h3>
                <span className="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <TrendingUp size={10} className="mr-0.5" /> +12.5%
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-400 mt-1">{isRTL ? 'المستخدمون النشطون يومياً (موظفين + طلاب)' : 'Daily Active Users (Staff + Students)'}</p>
            </div>
          </div>
          <div className="h-12 w-full mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={KPI_SPARKLINE_4}>
                <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* MAIN BENTO GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: AI Copilot & Operations (3 cols) */}
        <div className="xl:col-span-3 flex flex-col space-y-6">
          
          {/* AI Copilot */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BrainCircuit size={18} className="text-indigo-500" /> {isRTL ? 'المساعد الذكي والإجراءات الحرجة' : 'AI Copilot & Critical Actions'}
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Alert 1: Academic */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/60 group">
                <div className="flex gap-3 mb-3">
                  <div className="mt-0.5 text-orange-500"><AlertTriangle size={16} /></div>
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    {isRTL ? (
                      <>
                        <strong className="text-gray-900">رياضيات الصف 10 المتقدمة</strong> <span className="text-orange-600 font-bold">متأخرة بنسبة 15%</span> عن الخطة.
                      </>
                    ) : (
                      <>
                        <strong className="text-gray-900">Grade 10 Advanced Math</strong> is <span className="text-orange-600 font-bold">15% behind</span> syllabus schedule.
                      </>
                    )}
                  </p>
                </div>
                <button className={`w-full py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all flex items-center justify-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {isRTL ? 'إشعار المعلمين' : 'Notify Teachers'} <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                </button>
              </div>

              {/* Alert 2: Financial */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/60 group">
                <div className="flex gap-3 mb-3">
                  <div className="mt-0.5 text-rose-500"><CreditCard size={16} /></div>
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    {isRTL ? (
                      <>
                        <strong className="text-gray-900">12 من أولياء أمور الصف 8</strong> متأخرون عن سداد رسوم الفصل الثاني (<span className="text-rose-600 font-bold font-mono">125,000 ج.م</span>).
                      </>
                    ) : (
                      <>
                        <strong className="text-gray-900">12 Parents in Grade 8</strong> are overdue on Term 2 fees (<span className="text-rose-600 font-bold font-mono">125,000 ج.م</span>).
                      </>
                    )}
                  </p>
                </div>
                <button className={`w-full py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 shadow-sm transition-all flex items-center justify-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {isRTL ? 'إرسال تذكيرات' : 'Send Reminders'} <Bell size={14} />
                </button>
              </div>

              {/* Alert 3: Retention */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/60 group">
                <div className="flex gap-3 mb-3">
                  <div className="mt-0.5 text-purple-500"><UserMinus size={16} /></div>
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    {isRTL ? (
                      <>
                        <strong className="text-gray-900">5 طلاب في الصف 11</strong> يظهرون تراجعاً في درجات وحضور <span className="font-bold">الفيزياء</span>.
                      </>
                    ) : (
                      <>
                        <strong className="text-gray-900">5 students in Grade 11</strong> show a drop in <span className="font-bold">Physics</span> grades & attendance.
                      </>
                    )}
                  </p>
                </div>
                <button className={`w-full py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all flex items-center justify-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {isRTL ? 'عرض الطلاب' : 'View Students'} <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                </button>
              </div>

            </div>
          </div>

          {/* Staff Coverage */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-blue-500" /> {isRTL ? "تغطية طاقم العمل اليوم" : "Today's Staff Coverage"}
              </h3>
              <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-md border border-rose-100">
                {isRTL ? "غياب 3 معلمين" : "3 Teachers Absent"}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-black text-gray-900 font-mono">12</p>
              <p className="text-xs text-gray-500 font-medium">{isRTL ? "فصول بحاجة للتغطية" : "Classes Need Coverage"}</p>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-700">{isRTL ? "تم تغطية 90%" : "90% Covered"}</span>
                <span className="text-gray-500 font-mono">10/12</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden" dir="ltr">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <button className="w-full py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all">
              {isRTL ? "إدارة البدلاء" : "Manage Substitutes"}
            </button>
          </div>

          {/* Grading Pipeline */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col relative overflow-hidden flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpenCheck size={18} className="text-emerald-500" /> {isRTL ? "مسار رصد الدرجات" : "Grading Pipeline"}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-2xl font-black text-gray-900 font-mono">450</p>
                <p className="text-[11px] text-gray-500 font-medium leading-tight mt-1">{isRTL ? <>تقييمات<br/>قيد الانتظار</> : <>Pending<br/>Assessments</>}</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600 font-mono">48h</p>
                <p className="text-[11px] text-gray-500 font-medium leading-tight mt-1">{isRTL ? <>متوسط وقت<br/>التصحيح</> : <>Avg Turnaround<br/>Time</>}</p>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-700">{isRTL ? "الأسبوع الحالي" : "Current Week"}</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5" dir="ltr">
                <div className="bg-emerald-500" style={{ width: '75%' }} title="Graded: 75%"></div>
                <div className="bg-gray-200" style={{ width: '25%' }} title="Pending: 25%"></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-400">
                <span className="text-emerald-600 font-bold">{isRTL ? "تم الرصد (75%)" : "Graded (75%)"}</span>
                <span>{isRTL ? "قيد الانتظار (25%)" : "Pending (25%)"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN: Financials, Attendance, Engagement, Matrix (6 cols) */}
        <div className="xl:col-span-6 flex flex-col space-y-6">
          
          {/* Cash Flow Chart */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{isRTL ? 'التدفق النقدي (المالية)' : 'Cash Flow (ERP)'}</h3>
                <p className="text-sm text-gray-500 mt-1">{isRTL ? 'الإيرادات مقابل المصروفات على مدار 6 أشهر' : 'Revenue vs Expenses over 6 months'}</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-3 h-3 rounded-md bg-emerald-400"></span> {isRTL ? 'الإيرادات' : 'Revenue'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-3 h-3 rounded-md bg-gray-200"></span> {isRTL ? 'المصروفات' : 'Expenses'}
                </div>
              </div>
            </div>
            
            <div className="h-[240px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={CASH_FLOW_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontFamily: 'JetBrains Mono'}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontFamily: 'JetBrains Mono'}} tickFormatter={(val) => `$${val}k`} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)', fontFamily: 'JetBrains Mono', fontSize: '13px'}} 
                    formatter={(value: number) => [`$${value}k`, undefined]}
                  />
                  <Bar yAxisId="left" dataKey="revenue" name={isRTL ? 'الإيرادات' : 'Revenue'} fill="#34d399" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar yAxisId="left" dataKey="expenses" name={isRTL ? 'المصروفات' : 'Expenses'} fill="#e5e7eb" radius={[6, 6, 0, 0]} barSize={24} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Attendance Pulse */}
            <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-900">{isRTL ? 'نبض الحضور اليومي' : 'Daily Attendance Pulse'}</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setAttendanceView('Students')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${attendanceView === 'Students' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                  >
                    {isRTL ? 'طلاب' : 'Students'}
                  </button>
                  <button 
                    onClick={() => setAttendanceView('Staff')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${attendanceView === 'Staff' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                  >
                    {isRTL ? 'موظفين' : 'Staff'}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={currentAttendanceData} innerRadius={28} outerRadius={40} dataKey="value" stroke="none" paddingAngle={2}>
                        {currentAttendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 flex-1 pl-4">
                  {currentAttendanceData.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-gray-600 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900 font-mono">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spaces Engagement */}
            <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h3 className="text-base font-bold text-gray-900 mb-4">{isRTL ? 'تفاعل المساحات' : 'Spaces Engagement'}</h3>
              <div className="h-[120px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SPACES_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                    <Bar dataKey="students" stackId="a" fill="#3b82f6" name="Students" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="parents" stackId="a" fill="#8b5cf6" name="Parents" />
                    <Bar dataKey="teachers" stackId="a" fill="#10b981" name="Teachers" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Academic Matrix */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex-1 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{isRTL ? 'الخريطة الحرارية للأداء المدرسي' : 'School Performance Heatmap'}</h3>
                <p className="text-sm text-gray-500 mt-1">{isRTL ? 'متوسط الدرجات حسب الصف والمواد الأساسية' : 'Average scores by Grade and Core Subject'}</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200"></span> &gt;90%</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></span> 70-89%</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-100 border border-rose-200"></span> &lt;70%</div>
              </div>
            </div>

            <div className={`overflow-x-auto pb-2 ${isRTL ? "dir-rtl" : ""}`}>
              <table className={`w-full text-sm border-separate border-spacing-y-2 border-spacing-x-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    {HEATMAP_SUBJECTS.map(subject => (
                      <th key={subject} className="p-2 font-bold text-gray-500 text-center">{subject}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HEATMAP_DATA.map((row, i) => (
                    <tr key={i} className="group">
                      <td className="p-2 font-bold text-gray-900 whitespace-nowrap group-hover:text-primary-600 transition-colors">
                        {row.grade}
                      </td>
                      {row.scores.map((score, j) => {
                        const colorClass = getHeatmapColor(score);
                        return (
                          <td key={j} className="p-0">
                            <div className={`w-full h-12 rounded-2xl border flex items-center justify-center font-mono font-bold text-sm transition-transform hover:scale-105 cursor-pointer shadow-sm ${colorClass}`}>
                              {score}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Feed & Upcoming Radar (3 cols) */}
        <div className="xl:col-span-3 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex-1 flex flex-col h-full max-h-[450px] xl:max-h-none">
            <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-gray-400" /> {isRTL ? 'بث النظام المباشر' : 'System Live Feed'}
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 -ml-4 pl-4 custom-scrollbar">
              <div className="relative ps-4 border-s-2 border-gray-100 space-y-6 py-2">
                {LIVE_FEED.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="relative">
                      <div className={`absolute -start-[29px] w-6 h-6 rounded-full flex items-center justify-center border-[3px] border-white ${item.bg} ${item.color} shadow-sm`}>
                        <Icon size={12} />
                      </div>
                      <div className="ps-3">
                        <p className="text-sm font-medium text-gray-800 leading-snug">{item.text}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-wider font-mono">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Radar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col relative overflow-hidden">
            <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Radar size={18} className="text-gray-400" /> {isRTL ? "أهم المواعيد القادمة" : "Upcoming Radar"}
            </h3>
            
            <div className="space-y-4">
              {/* Event 1 */}
              <div className="flex gap-3 items-start group">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100/50 group-hover:scale-105 transition-transform">
                  <CalendarDays size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">{isRTL ? "الموعد النهائي للرسوم" : "Term 3 Tuition Deadline"}</p>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md whitespace-nowrap border border-rose-100">{isRTL ? "غداً" : "Tomorrow"}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{isRTL ? "340 طالباً قيد الانتظار" : "340 students pending"}</p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex gap-3 items-start group">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-blue-100/50 group-hover:scale-105 transition-transform">
                  <BookOpen size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">{isRTL ? "بدء امتحانات الفصل" : "Grade 10 Midterm Exams Begin"}</p>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md whitespace-nowrap border border-gray-100">{isRTL ? "خلال 3 أيام" : "In 3 Days"}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{isRTL ? "العلوم والرياضيات" : "Science & Math"}</p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex gap-3 items-start group">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0 border border-purple-100/50 group-hover:scale-105 transition-transform">
                  <Users size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">{isRTL ? "اجتماع المجلس" : "Parent-Teacher Council Meeting"}</p>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md whitespace-nowrap border border-gray-100">{isRTL ? "الجمعة، 2:00 مساءً" : "Friday, 2:00 PM"}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{isRTL ? "القاعة الرئيسية" : "Main Auditorium"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
