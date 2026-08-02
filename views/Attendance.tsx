import React, { useState } from 'react';
import { UserRole, Language, User } from '../types';
import { Button } from '../components/Button';
import { 
  Settings, 
  BarChart3, 
  List, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare,
  ChevronDown,
  Plus,
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { STUDENTS, CLASSES } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceProps {
  role: UserRole;
  language: Language;
  user: User;
}

export const Attendance: React.FC<AttendanceProps> = ({ role, language, user }) => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'admin'>('admin');
  const [adminView, setAdminView] = useState<'dashboard' | 'setup'>('setup');
  
  // Setup State
  const [attendanceMode, setAttendanceMode] = useState<'Daily' | 'Period'>('Daily');
  const [lateThreshold, setLateThreshold] = useState(15);
  const [smsOnAbsent, setSmsOnAbsent] = useState(true);
  const [smsOnLate, setSmsOnLate] = useState(false);
  
  const [statuses, setStatuses] = useState([
    { id: 'present', label: 'حاضر', color: 'bg-green-500' },
    { id: 'absent', label: 'غائب', color: 'bg-red-500' },
    { id: 'late', label: 'متأخر', color: 'bg-yellow-500' },
    { id: 'excused', label: 'معذور', color: 'bg-blue-500' }
  ]);
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [newStatusLabel, setNewStatusLabel] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('bg-purple-500');

  const availableColors = ['bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-violet-500', 'bg-teal-500'];

  const handleAddStatus = () => {
    if (newStatusLabel.trim()) {
      setStatuses([...statuses, { 
        id: newStatusLabel.toLowerCase().replace(/\s+/g, '-'), 
        label: newStatusLabel.trim(), 
        color: newStatusColor 
      }]);
      setNewStatusLabel('');
      setIsAddingStatus(false);
    }
  };

  const handleDeleteStatus = (id: string) => {
    setStatuses(statuses.filter(s => s.id !== id));
  };

  // Teacher State
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});

  // Admin State
  const [logSearch, setLogSearch] = useState('');
  const [filterDate, setFilterDate] = useState('اليوم');
  const [filterGrade, setFilterGrade] = useState('جميع الصفوف');
  const [filterClass, setFilterClass] = useState('جميع الفصول');
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const hasActiveFilters = filterDate !== 'اليوم' || filterGrade !== 'جميع الصفوف' || filterClass !== 'جميع الفصول' || filterStatuses.length > 0;

  const clearFilters = () => {
    setFilterDate('اليوم');
    setFilterGrade('جميع الصفوف');
    setFilterClass('جميع الفصول');
    setFilterStatuses([]);
    setCurrentPage(1);
  };

  const toggleStatusFilter = (status: string) => {
    setFilterStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  };

  // Mock Analytics Data
  const gradeData = [
    { name: 'الصف 9', attendance: 95 },
    { name: 'الصف 10', attendance: 92 },
    { name: 'الصف 11', attendance: 88 },
    { name: 'الصف 12', attendance: 96 },
  ];

  const mockAuditLogs = [
    { id: 1, student: 'علي حسن', class: '10-A', grade: 'الصف 10', teacher: 'سارة الماجد', time: '08:15 AM', status: 'حاضر' },
    { id: 2, student: 'عمر خالد', class: '10-A', grade: 'الصف 10', teacher: 'سارة الماجد', time: '08:32 AM', status: 'متأخر' },
    { id: 3, student: 'فاطمة نور', class: '11-B', grade: 'الصف 11', teacher: 'أحمد خليل', time: '09:00 AM', status: 'غائب' },
    { id: 4, student: 'عائشة رحمن', class: '9-C', grade: 'الصف 9', teacher: 'جون سميث', time: '08:10 AM', status: 'حاضر' },
    { id: 5, student: 'يوسف علي', class: '12-A', grade: 'الصف 12', teacher: 'ماريا غارسيا', time: '08:45 AM', status: 'متأخر' },
    { id: 6, student: 'زينب عباس', class: '10-A', grade: 'الصف 10', teacher: 'سارة الماجد', time: '08:15 AM', status: 'حاضر' },
    { id: 7, student: 'حسن طارق', class: '11-B', grade: 'الصف 11', teacher: 'أحمد خليل', time: '08:20 AM', status: 'حاضر' },
    { id: 8, student: 'مريم سعيد', class: '9-C', grade: 'الصف 9', teacher: 'جون سميث', time: '08:12 AM', status: 'حاضر' },
    { id: 9, student: 'خالد عمر', class: '12-A', grade: 'الصف 12', teacher: 'ماريا غارسيا', time: '08:14 AM', status: 'حاضر' },
    { id: 10, student: 'سارة أحمد', class: '10-A', grade: 'الصف 10', teacher: 'سارة الماجد', time: '08:16 AM', status: 'حاضر' },
    { id: 11, student: 'نور علي', class: '11-B', grade: 'الصف 11', teacher: 'أحمد خليل', time: '08:22 AM', status: 'حاضر' },
    { id: 12, student: 'أحمد حسن', class: '9-C', grade: 'الصف 9', teacher: 'جون سميث', time: '09:05 AM', status: 'غائب' },
  ];

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.student.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.class.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.teacher.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.status.toLowerCase().includes(logSearch.toLowerCase());
    
    const matchesGrade = filterGrade === 'جميع الصفوف' || log.grade === filterGrade;
    const matchesClass = filterClass === 'جميع الفصول' || log.class === filterClass;
    const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(log.status);

    return matchesSearch && matchesGrade && matchesClass && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  // Dynamic classes based on selected grade
  const availableClasses = filterGrade === 'جميع الصفوف' 
    ? Array.from(new Set(mockAuditLogs.map(l => l.class)))
    : Array.from(new Set(mockAuditLogs.filter(l => l.grade === filterGrade).map(l => l.class)));

  // Filtered Chart Data
  const filteredGradeData = gradeData.filter(g => filterGrade === 'جميع الصفوف' || g.name === filterGrade);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const newAttendance: Record<string, string> = {};
    STUDENTS.forEach(student => {
      newAttendance[student.id] = 'present';
    });
    setAttendanceData(newAttendance);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20" dir="rtl">
      {/* Header & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الحضور</h1>
          <p className="text-gray-500">تتبع وإدارة حضور الطلاب.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'teacher' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            عرض المعلم
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'admin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            عرض الإدارة
          </button>
        </div>
      </div>

      {activeTab === 'admin' && (
        <div className="space-y-6">
          {/* Admin Sub-navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setAdminView('dashboard')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                adminView === 'dashboard' ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              لوحة القيادة والسجلات
            </button>
            <button
              onClick={() => setAdminView('setup')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                adminView === 'setup' ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              إعدادات التكوين
            </button>
          </div>

          {adminView === 'setup' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Frequency & Mode */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings size={20} className="text-violet-600" />
                    Attendance Frequency
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setAttendanceMode('Daily')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${attendanceMode === 'Daily' ? 'border-violet-500 bg-violet-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <Calendar size={24} className={`mb-2 ${attendanceMode === 'Daily' ? 'text-violet-600' : 'text-gray-400'}`} />
                      <h4 className="font-bold text-gray-900">مرة يومياً</h4>
                      <p className="text-xs text-gray-500 mt-1">الأفضل للمرحلة الابتدائية. يُسجل مرة واحدة صباحاً.</p>
                    </div>
                    <div 
                      onClick={() => setAttendanceMode('Period')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${attendanceMode === 'Period' ? 'border-violet-500 bg-violet-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <Clock size={24} className={`mb-2 ${attendanceMode === 'Period' ? 'text-violet-600' : 'text-gray-400'}`} />
                      <h4 className="font-bold text-gray-900">حسب المادة/الحصة</h4>
                      <p className="text-xs text-gray-500 mt-1">الأفضل للمرحلة الثانوية. يُسجل في بداية كل حصة.</p>
                    </div>
                  </div>
                </div>

                {/* Grace Period & Automation */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-violet-600" />
                    Rules & Automation
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                        <span>فترة السماح (دقائق التأخير)</span>
                        <span className="text-violet-600">{lateThreshold} دقيقة</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="60" 
                        step="5"
                        value={lateThreshold}
                        onChange={(e) => setLateThreshold(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                      />
                      <p className="text-xs text-gray-500 mt-2">الطلاب الذين يسجلون حضورهم بعد {lateThreshold} دقيقة سيتم اعتبارهم 'متأخرين' تلقائياً.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">رسالة نصية فورية عند الغياب</p>
                          <p className="text-xs text-gray-500">إشعار أولياء الأمور فوراً عند تسجيل غياب الطالب.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={smsOnAbsent} onChange={() => setSmsOnAbsent(!smsOnAbsent)} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">رسالة نصية فورية عند التأخير</p>
                          <p className="text-xs text-gray-500">إشعار أولياء الأمور فوراً عند تسجيل تأخير الطالب.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={smsOnLate} onChange={() => setSmsOnLate(!smsOnLate)} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Statuses */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <List size={20} className="text-violet-600" />
                    Custom Statuses
                  </span>
                  <Button variant="ghost" className="p-1 h-auto" onClick={() => setIsAddingStatus(true)}><Plus size={18} /></Button>
                </h3>
                
                <div className="space-y-3">
                  {statuses.map((status) => (
                    <div key={status.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${status.color}`}></div>
                        <span className="font-bold text-gray-900">{status.label}</span>
                      </div>
                      <button onClick={() => handleDeleteStatus(status.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {isAddingStatus && (
                    <div className="p-4 border border-violet-200 rounded-xl bg-violet-50 space-y-4 animate-fadeIn">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">اسم الحالة</label>
                        <input 
                          type="text" 
                          value={newStatusLabel}
                          onChange={(e) => setNewStatusLabel(e.target.value)}
                          placeholder="مثال: رحلة ميدانية"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">اللون</label>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map(color => (
                            <button
                              key={color}
                              onClick={() => setNewStatusColor(color)}
                              className={`w-6 h-6 rounded-full ${color} ${newStatusColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="secondary" className="flex-1 py-1.5 text-xs" onClick={() => setIsAddingStatus(false)}>إلغاء</Button>
                        <Button className="flex-1 py-1.5 text-xs" onClick={handleAddStatus}>حفظ</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium mb-1">نسبة حضور اليوم</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-gray-900">94.2%</h3>
                    <span className="text-sm font-bold text-green-500 mb-1">+1.2%</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium mb-1">إجمالي الغائبين</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-gray-900">42</h3>
                    <span className="text-sm font-bold text-red-500 mb-1">-5</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium mb-1">فصول قيد الانتظار</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-gray-900">12</h3>
                    <span className="text-sm text-gray-500 mb-1">/ 45</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Global Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <select 
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option>اليوم</option>
                      <option>الأمس</option>
                      <option>هذا الأسبوع</option>
                      <option>تاريخ مخصص</option>
                    </select>

                    <select 
                      value={filterGrade}
                      onChange={(e) => {
                        setFilterGrade(e.target.value);
                        setFilterClass('جميع الفصول'); // Reset class when grade changes
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option>جميع الصفوف</option>
                      <option>الصف 9</option>
                      <option>الصف 10</option>
                      <option>الصف 11</option>
                      <option>الصف 12</option>
                    </select>

                    <select 
                      value={filterClass}
                      onChange={(e) => {
                        setFilterClass(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option>جميع الفصول</option>
                      {availableClasses.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                      {['حاضر', 'غائب', 'متأخر'].map(status => (
                        <button
                          key={status}
                          onClick={() => toggleStatusFilter(status)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                            filterStatuses.includes(status) 
                              ? status === 'حاضر' ? 'bg-green-100 text-green-800' :
                                status === 'غائب' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              : 'text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button variant="secondary" onClick={clearFilters} className="text-xs py-2">
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">معدل الحضور حسب الصف</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={filteredGradeData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} domain={[0, 100]} />
                        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="attendance" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-900">سجلات التدقيق</h3>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="البحث في السجلات..." 
                        value={logSearch}
                        onChange={(e) => {
                          setLogSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm w-full md:w-64"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-sm text-gray-500">
                          <th className="pb-3 font-medium">الطالب</th>
                          <th className="pb-3 font-medium">الفصل</th>
                          <th className="pb-3 font-medium">المعلم</th>
                          <th className="pb-3 font-medium">الوقت</th>
                          <th className="pb-3 font-medium">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLogs.length > 0 ? paginatedLogs.map(log => (
                          <tr key={log.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 text-sm font-bold text-gray-900">{log.student}</td>
                            <td className="py-3 text-sm text-gray-600">{log.class}</td>
                            <td className="py-3 text-sm text-gray-600">{log.teacher}</td>
                            <td className="py-3 text-sm text-gray-500">{log.time}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                log.status === 'حاضر' ? 'bg-green-100 text-green-800' : 
                                log.status === 'متأخر' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                              No logs found matching your filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        عرض <span className="font-bold text-gray-900">{(currentPage - 1) * logsPerPage + 1}</span> إلى <span className="font-bold text-gray-900">{Math.min(currentPage * logsPerPage, filteredLogs.length)}</span> من إجمالي <span className="font-bold text-gray-900">{filteredLogs.length}</span> نتيجة
                      </p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="secondary" 
                          className="px-3 py-1.5 text-sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                                currentPage === i + 1 ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <Button 
                          variant="secondary" 
                          className="px-3 py-1.5 text-sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'teacher' && (
        <div className="space-y-6">
          {!selectedClass ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center max-w-lg mx-auto mt-10">
              <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر فصلاً</h2>
              <p className="text-gray-500 mb-6">اختر فصلاً لبدء تسجيل حضور اليوم.</p>
              
              <div className="space-y-3">
                {CLASSES.slice(0, 3).map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-violet-500 hover:bg-violet-50 transition-all text-right"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{cls.name}</p>
                      <p className="text-xs text-gray-500">{cls.gradeLevel} • {cls.students.length} طلاب</p>
                    </div>
                    <ChevronDown size={20} className="text-gray-400 -rotate-90" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedClass(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ChevronDown size={24} className="rotate-90 text-slate-600" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{CLASSES.find(c => c.id === selectedClass)?.name}</h2>
                    <p className="text-slate-500">تسجيل الحضور للحصة 1 (الرياضيات) • 13 أبريل، 2026</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="البحث عن طلاب..." 
                      className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm w-64"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  </div>
                  <Button onClick={markAllPresent} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle2 size={16} className="mr-2" /> تحديد الكل كحاضر
                  </Button>
                </div>
              </div>

              {/* Period Selector Bar */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                 <button className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold bg-violet-600 text-white shadow-md transition-all">الحصة 1: رياضيات</button>
                 <button className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">الحصة 2: فيزياء</button>
                 <button className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">الحصة 3: إنجليزي</button>
                 <button disabled className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed">الحصة 4: استراحة</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {STUDENTS.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())).map(student => {
                  const status = attendanceData[student.id];
                  
                  return (
                    <div key={student.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&background=random`} alt={student.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.id}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-violet-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
                          <MessageSquare size={18} />
                        </button>
                      </div>
                      
                      <div className="flex bg-gray-50 p-1 rounded-xl">
                        <button
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                            status === 'present' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {status === 'present' && <CheckCircle2 size={14} />} Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                            status === 'absent' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {status === 'absent' && <XCircle size={14} />} Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                            status === 'late' ? 'bg-yellow-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {status === 'late' && <Clock size={14} />} Late
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
