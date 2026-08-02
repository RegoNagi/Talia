import React, { useState } from 'react';
import { MOCK_ADMINS, MOCK_PARENTS, CLASSES } from '../services/mockData';
import { getStudents, getTeachers, createTeacher } from '../services/supabaseData';
import { Language, Student, Teacher, Admin, Parent, UserRole } from '../types';
import { ParentsManagement } from './ParentsManagement';
import { StudentProfile } from './StudentProfile';
import { Button } from '../components/Button';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  User, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck,
  Upload,
  FileSpreadsheet,
  MoreVertical,
  Calendar,
  Mail,
  Phone,
  Lock,
  Download,
  Settings,
  X,
  ToggleLeft,
  ToggleRight,
  Users,
  LayoutTemplate
} from 'lucide-react';

import { useEffect } from 'react';

interface UserManagementProps {
  language: Language;
  role: UserRole;
  onEditProfile?: () => void;
  activeTabProp?: 'students' | 'parents' | 'teachers' | 'admins';
  onTabChange?: (tab: 'students' | 'parents' | 'teachers' | 'admins') => void;
}

// Mock Permission Data
const PERMISSION_GROUPS = [
   { 
      category: 'User Management', 
      perms: [
         { id: 'users_create', label: 'Create/Edit Users' },
         { id: 'users_delete', label: 'Delete Users' },
         { id: 'users_reset', label: 'Reset Passwords' }
      ]
   },
   { 
      category: 'Academic Affairs', 
      perms: [
         { id: 'aca_curriculum', label: 'Manage Curriculum' },
         { id: 'aca_schedule', label: 'Manage Schedule' },
         { id: 'aca_grades', label: 'Approve Grades' }
      ]
   },
   { 
      category: 'Finance', 
      perms: [
         { id: 'fin_view', label: 'View Financials' },
         { id: 'fin_manage', label: 'Manage Fees' }
      ]
   },
   { 
      category: 'System', 
      perms: [
         { id: 'sys_settings', label: 'Global Settings' },
         { id: 'sys_logs', label: 'View Audit Logs' }
      ]
   }
];

const ADMIN_TEMPLATES: Record<string, string[]> = {
    'Super Admin': ['users_create', 'users_delete', 'users_reset', 'aca_curriculum', 'aca_schedule', 'aca_grades', 'fin_view', 'fin_manage', 'sys_settings', 'sys_logs'],
    'Academic Manager': ['aca_curriculum', 'aca_schedule', 'aca_grades', 'users_create'],
    'Registrar': ['users_create', 'users_reset', 'aca_schedule'],
    'Finance Officer': ['fin_view', 'fin_manage'],
    'IT Support': ['sys_settings', 'sys_logs', 'users_reset']
};

export const UserManagement: React.FC<UserManagementProps> = ({ language, role, onEditProfile, activeTabProp = 'students', onTabChange }) => {
  const isRTL = language === Language.AR;
  const [activeTab, setActiveTabInternal] = useState<'students' | 'parents' | 'teachers' | 'admins'>(activeTabProp);

  const setActiveTab = (tab: 'students' | 'parents' | 'teachers' | 'admins') => {
    setActiveTabInternal(tab);
    if (onTabChange) onTabChange(tab);
  };

  useEffect(() => {
    setActiveTabInternal(activeTabProp);
  }, [activeTabProp]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Data State (Lifted from constants to state to allow adding)
  // studentsList بيتم تحميلها الآن من قاعدة بيانات حقيقية (Supabase) بدل الـ mock data
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState<boolean>(true);
  const [parentsList, setParentsList] = useState<Parent[]>(MOCK_PARENTS);
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState<boolean>(true);
  const [adminsList, setAdminsList] = useState<Admin[]>(MOCK_ADMINS);

  const refreshTeachers = () => {
    setTeachersLoading(true);
    getTeachers().then((data) => {
      setTeachersList(data);
      setTeachersLoading(false);
    });
  };

  useEffect(() => {
    let isMounted = true;
    setStudentsLoading(true);
    getStudents().then((data) => {
      if (isMounted) {
        setStudentsList(data);
        setStudentsLoading(false);
      }
    });
    refreshTeachers();
    return () => { isMounted = false; };
  }, []);

  // Modal States
  const [uploadModalType, setUploadModalType] = useState<'student' | 'teacher' | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  // --- Form States ---
  
  // Student Form
  const [newStudent, setNewStudent] = useState({
     firstName: '', secondName: '', thirdName: '', lastName: '', grade: 'Grade 10', dob: ''
  });

  // Teacher Form
  const [newTeacher, setNewTeacher] = useState({
     name: '', 
     email: '', 
     hiringDate: new Date().toISOString().split('T')[0], 
     type: 'Full-time', 
     subject: 'رياضيات'
  });

  // Admin Form
  const [newAdmin, setNewAdmin] = useState({
     name: '', email: '', title: '', department: 'Administration'
  });
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);
  const [selectedAdminTemplate, setSelectedAdminTemplate] = useState('Custom');

  const handleTemplateChange = (template: string) => {
      setSelectedAdminTemplate(template);
      if (template !== 'Custom' && ADMIN_TEMPLATES[template]) {
          setAdminPermissions(ADMIN_TEMPLATES[template]);
          // Auto-set title if empty
          if (!newAdmin.title) setNewAdmin(prev => ({...prev, title: template}));
      }
  };

  const togglePermission = (id: string) => {
     if (adminPermissions.includes(id)) {
        setAdminPermissions(prev => prev.filter(p => p !== id));
        setSelectedAdminTemplate('Custom');
     } else {
        setAdminPermissions(prev => [...prev, id]);
        setSelectedAdminTemplate('Custom');
     }
  };

  const handleCreateStudent = () => {
      const student: Student = {
          id: `ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          name: [newStudent.firstName, newStudent.secondName, newStudent.thirdName, newStudent.lastName].filter(Boolean).join(' ') || 'New Student',
          grade: newStudent.grade,
          attendance: 100,
          performance: 100,
          status: 'Active',
          fees: [],
          installmentPlans: [],
          reportCards: []
      };
      setStudentsList([student, ...studentsList]);
      setIsAddStudentOpen(false);
      setNewStudent({ firstName: '', secondName: '', thirdName: '', lastName: '', grade: 'Grade 10', dob: '' });
  };

  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);

  const handleCreateTeacher = async () => {
      if (!newTeacher.name.trim()) return;
      setIsCreatingTeacher(true);
      const id = await createTeacher({
        name: newTeacher.name,
        email: newTeacher.email,
        hiringDate: newTeacher.hiringDate,
        employmentType: newTeacher.type,
        subject: newTeacher.subject,
      });
      setIsCreatingTeacher(false);
      if (id) {
        refreshTeachers();
        setIsAddTeacherOpen(false);
        setNewTeacher({ name: '', email: '', hiringDate: new Date().toISOString().split('T')[0], type: 'Full-time', subject: 'رياضيات' });
      } else {
        alert('حصل خطأ أثناء إنشاء المعلم. تأكد إنك شغّلت كود إضافة عمود hiring_date في Supabase.');
      }
  };

  const handleCreateAdmin = () => {
      const admin: Admin = {
          id: `adm-${Date.now()}`,
          name: newAdmin.name || 'New Admin',
          role: UserRole.ADMIN,
          avatar: `https://ui-avatars.com/api/?name=${newAdmin.name}&background=random`,
          email: newAdmin.email,
          title: newAdmin.title,
          department: newAdmin.department,
          permissions: adminPermissions,
          lastActive: 'Just now'
      };
      setAdminsList([admin, ...adminsList]);
      setIsAddAdminOpen(false);
      setNewAdmin({ name: '', email: '', title: '', department: 'Administration' });
      setAdminPermissions([]);
      setSelectedAdminTemplate('Custom');
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All Grades');

  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'All Grades' || student.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  // --- SUB-COMPONENTS ---

  // 1. Student List
  const StudentListView = () => {
    const t_search = isRTL ? 'البحث عن طلاب...' : 'Search students...';
    const t_all_grades = isRTL ? 'جميع الصفوف' : 'All Grades';
    const t_import = isRTL ? 'استيراد CSV' : 'Import CSV';
    const t_add_student = isRTL ? 'إضافة طالب' : 'Add Student';
    const t_name = isRTL ? 'الاسم' : 'Name';
    const t_id = isRTL ? 'الرقم التعريفي' : 'ID Number';
    const t_gradeLevel = isRTL ? 'الصف الدراسي' : 'Grade Level';
    const t_attendance = isRTL ? 'الحضور' : 'Attendance';
    const t_status = isRTL ? 'الحالة' : 'Status';
    const t_actions = isRTL ? 'الإجراءات' : 'Actions';

    const getTranslatedGrade = (grade: string) => {
      if (!isRTL) return grade;
      return grade.replace('Grade ', 'الصف ');
    };

    const getTranslatedStatus = (status: string) => {
      if (!isRTL) return status;
      if (status === 'Active') return 'نشط';
      if (status === 'At Risk') return 'في خطر';
      if (status === 'Inactive') return 'غير نشط';
      return status;
    };

    const trName = (name: string) => {
       if (!isRTL) return name;
       const words = name.split(' ');
       const map: Record<string, string> = {
          'Layla': 'ليلى', 'Omar': 'عمر', 'Yousef': 'يوسف', 'Ahmed': 'أحمد', 'Ali': 'علي'
       };
       return words.map(w => map[w] || w).join(' ');
    };

    return (
    <div className="space-y-6 animate-fadeIn" dir={isRTL ? "rtl" : "ltr"}>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm gap-4">
          <div className="flex flex-1 w-full sm:max-w-xl gap-3">
            <div className="relative flex-1">
               <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} size={18} />
               <input 
                 type="text" 
                 placeholder={t_search}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className={`w-full border border-gray-200 bg-gray-50 rounded-full py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none ${isRTL ? 'pr-11 pl-5' : 'pl-11 pr-5'}`}
               />
            </div>
            <div className="relative w-40 shrink-0">
               <Filter className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} size={16} />
               <select
                 value={gradeFilter}
                 onChange={(e) => setGradeFilter(e.target.value)}
                 className={`w-full border border-gray-200 bg-gray-50 rounded-full py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none appearance-none font-medium text-gray-700 ${isRTL ? 'pr-10 pl-8' : 'pl-10 pr-8'}`}
               >
                 <option value="All Grades">{t_all_grades}</option>
                 <option value="Grade 9">{getTranslatedGrade('Grade 9')}</option>
                 <option value="Grade 10">{getTranslatedGrade('Grade 10')}</option>
                 <option value="Grade 11">{getTranslatedGrade('Grade 11')}</option>
                 <option value="Grade 12">{getTranslatedGrade('Grade 12')}</option>
               </select>
               <ChevronRight className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90 ${isRTL ? 'left-3' : 'right-3'}`} size={16} />
            </div>
          </div>
          <div className={`flex gap-2 w-full sm:w-auto ${isRTL ? 'flex-row-reverse sm:flex-row' : ''}`}>
             <Button variant="secondary" onClick={() => setUploadModalType('student')} className="flex-1 sm:flex-none justify-center whitespace-nowrap">
                <Upload size={18} /> {t_import}
             </Button>
             <Button variant="primary" onClick={() => setIsAddStudentOpen(true)} className="flex-1 sm:flex-none justify-center bg-violet-600 hover:bg-violet-700 text-white whitespace-nowrap rounded-lg">
                <Plus size={18} /> {t_add_student}
             </Button>
          </div>
       </div>

       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">{t_name}</th>
                <th className="px-6 py-5">{t_id}</th>
                <th className="px-6 py-5">{t_gradeLevel}</th>
                <th className="px-6 py-5">{t_attendance}</th>
                <th className="px-6 py-5">{t_status}</th>
                <th className="px-6 py-5 text-center">{t_actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {studentsLoading && (
                <tr><td colSpan={6} className="px-8 py-10 text-center text-gray-400">{isRTL ? 'جاري تحميل الطلاب من قاعدة البيانات...' : 'Loading students from the database...'}</td></tr>
              )}
              {!studentsLoading && filteredStudents.length === 0 && (
                <tr><td colSpan={6} className="px-8 py-10 text-center text-gray-400">{isRTL ? 'لا يوجد طلاب بعد' : 'No students yet'}</td></tr>
              )}
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-violet-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedStudent(student)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shadow-sm ring-2 ring-white">
                          <User size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{trName(student.name)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-500 font-mono">{student.id}</td>
                  <td className="px-6 py-5">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {getTranslatedGrade(student.grade)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-100 rounded-full h-2 flex-shrink-0" dir="ltr">
                        <div 
                          className={`h-2 rounded-full ${student.attendance >= 90 ? 'bg-green-500' : 'bg-violet-500'}`} 
                          style={{ width: `${student.attendance}%`, float: isRTL ? 'right' : 'left' }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-700">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      student.status === 'Active' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : student.status === 'At Risk' 
                        ? 'bg-red-50 text-red-700 border-red-100'
                        : 'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                      {getTranslatedStatus(student.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                      <ChevronRight size={18} className={isRTL ? "rotate-180" : ""} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )};

  // 2. Parent Management View
  const ParentListView = () => (
     <ParentsManagement isRTL={isRTL} />
  );

  // 3. Teacher Management View
  const TeacherListView = () => {
     const t = {
        filter: isRTL ? 'تصفية' : 'Filter',
        searchFaculty: isRTL ? 'البحث عن معلمين...' : 'Search faculty...',
        bulkImport: isRTL ? 'استيراد جماعي' : 'Bulk Import',
        addTeacher: isRTL ? 'إضافة معلم' : 'Add Teacher',
        hiredDate: isRTL ? 'تاريخ التعيين' : 'Hired Date',
        employment: isRTL ? 'نوع العقد' : 'Employment',
        subjectDistribution: isRTL ? 'توزيع المواد' : 'Subject Distribution',
        class: isRTL ? 'الفصل' : 'Class',
        subject: isRTL ? 'المادة' : 'Subject',
        hrsWeek: isRTL ? 'ساعات المادة / أسبوع' : 'Hrs/Week',
        noClasses: isRTL ? 'لا توجد فصول دراسية' : 'No classes assigned',
        totalLoad: isRTL ? 'إجمالي العبء الأكاديمي' : 'Total Academic Load',
        hoursWeek: isRTL ? 'ساعة / أسبوع' : 'Hours / Week',
        fullTime: isRTL ? 'دوام كامل' : 'Full-time',
        contract: isRTL ? 'عقد مؤقت' : 'Contract'
     };

     const trName = (name: string) => {
        if (!isRTL) return name;
        const map: Record<string, string> = { 'Ahmed Khalil': 'أحمد خليل', 'Sarah Al-Majed': 'سارة الماجد', 'Omar Hassan': 'عمر حسن', 'Emily Davis': 'نورة إبراهيم' };
        return map[name] || name;
     };

     const trSubj = (subj: string) => {
        if (!isRTL) return subj;
        const map: Record<string, string> = { 'Physics': 'فيزياء', 'Mathematics': 'رياضيات', 'Arabic': 'لغة عربية', 'English Literature': 'أدب إنجليزي' };
        return map[subj] || subj;
     };

     return (
     <div className="space-y-6 animate-fadeIn" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div className={`flex gap-2 w-full md:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="secondary" className="rounded-full whitespace-nowrap"><Filter size={16}/> {t.filter}</Button>
              <div className="relative w-full md:w-auto">
                 <input type="text" placeholder={t.searchFaculty} className={`bg-white border border-gray-200 rounded-full py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 w-full md:w-64 ${isRTL ? 'pr-4 pl-4' : 'px-4'}`} />
              </div>
           </div>
           <div className={`flex gap-2 w-full md:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="secondary" onClick={() => setUploadModalType('teacher')} className="shadow-sm whitespace-nowrap">
                 <Upload size={18} /> {t.bulkImport}
              </Button>
              <Button variant="primary" onClick={() => setIsAddTeacherOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200 whitespace-nowrap rounded-lg">
                 <Plus size={18} /> {t.addTeacher}
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
           {teachersList.map(teacher => {
              const assignedClassDetails = CLASSES.filter(c => teacher.assignedClasses.includes(c.id));
              
              return (
                 <div key={teacher.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex gap-4">
                          <img src={teacher.avatar} alt={teacher.name} referrerPolicy="no-referrer" className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm" />
                          <div>
                             <h3 className="font-bold text-lg text-gray-900">{trName(teacher.name)}</h3>
                             <p className="text-violet-600 font-medium text-sm">{trSubj(teacher.specialization)}</p>
                             <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                                <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Mail size={12}/> <span dir="ltr">{teacher.email}</span></span>
                                <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Phone size={12}/> <span dir="ltr">{teacher.phone || 'N/A'}</span></span>
                             </div>
                          </div>
                       </div>
                       <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={20} /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">{t.hiredDate}</p>
                          <p className="font-bold text-gray-900 flex items-center gap-2"><Calendar size={14}/> <span dir="ltr">{teacher.hiringDate}</span></p>
                       </div>
                       <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">{t.employment}</p>
                          <p className="font-bold text-gray-900 flex items-center gap-2"><Briefcase size={14}/> {teacher.employmentType === 'Full-time' ? t.fullTime : teacher.employmentType === 'Contract' ? t.contract : teacher.employmentType}</p>
                       </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                       <h4 className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ${isRTL ? 'text-right' : ''}`}>{t.subjectDistribution}</h4>
                       <table className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                          <thead>
                             <tr className={`text-gray-400 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                                <th className="pb-2 font-medium">{t.class}</th>
                                <th className="pb-2 font-medium">{t.subject}</th>
                                <th className={`pb-2 font-medium ${isRTL ? 'text-left' : 'text-right'}`}>{t.hrsWeek}</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {assignedClassDetails.map((cls, idx) => (
                                <tr key={idx}>
                                   <td className="py-2 font-bold text-gray-800">{isRTL ? cls.name.replace('Grade', 'الصف') : cls.name} <span className="text-gray-400 font-normal text-xs mx-1">({cls.gradeLevel})</span></td>
                                   <td className="py-2 text-gray-600">{trSubj(teacher.specialization)}</td>
                                   <td className={`py-2 font-mono font-medium ${isRTL ? 'text-left' : 'text-right'}`}>4</td>
                                </tr>
                             ))}
                             {assignedClassDetails.length === 0 && (
                                <tr><td colSpan={3} className="py-2 text-center text-gray-400 italic">{t.noClasses}</td></tr>
                             )}
                          </tbody>
                       </table>
                       <div className="mt-4 flex justify-between items-center text-xs">
                          <span className="text-gray-500">{t.totalLoad}</span>
                          <span className="bg-violet-50 text-violet-700 px-2 py-1 rounded font-bold">{teacher.academicLoad} {t.hoursWeek}</span>
                       </div>
                    </div>
                 </div>
              );
           })}
        </div>
     </div>
  )};

  // 4. Admin Management View
  const AdminListView = () => {
     const t = {
        adminHub: isRTL ? 'مركز الإدارة' : 'Administration Hub',
        manageRoles: isRTL ? 'إدارة الأدوار والصلاحيات' : 'Manage Roles & Permissions',
        subtitle: isRTL ? 'تكوين وصول النظام لمسؤولي النظام، ومسجلي البيانات، والمنسقين الأكاديميين. لضمان الامتثال لصلاحيات الوصول.' : 'Configure system access for co-teachers, registrars, and academic coordinators. Ensure RBAC compliance.',
        addNewAdmin: isRTL ? 'إضافة مسؤول جديد +' : 'Add New Admin +',
        user: isRTL ? 'المستخدم' : 'User',
        roleTitle: isRTL ? 'المسمى الوظيفي' : 'Role Title',
        department: isRTL ? 'القسم' : 'Department',
        activeStatus: isRTL ? 'حالة النشاط' : 'Active Status',
        permissions: isRTL ? 'الصلاحيات' : 'Permissions',
     };

     const trName = (name: string) => {
        if (!isRTL) return name;
        const map: Record<string, string> = { 'Dr. Faisal Omar': 'د. فيصل عمر', 'Mona Rashid': 'منى راشد', 'Yasser Ali': 'ياسر علي' };
        return map[name] || name;
     };

     const trRoleDeptStatus = (text: string) => {
        if (!isRTL) return text;
        const map: Record<string, string> = {
           'School Principal': 'مدير المدرسة',
           'Academic Coordinator': 'منسق أكاديمي',
           'Registrar': 'مسجل بيانات',
           'Administration': 'الإدارة',
           'Academics': 'الشؤون الأكاديمية',
           'Admissions': 'القبول والتسجيل',
           'Active now': 'نشط الآن'
        };
        if (map[text]) return map[text];
        if (text.includes('hours ago')) {
           return text.replace('hours ago', 'ساعات مضت').replace('2', 'ساعتين');
        }
        return text;
     };

     return (
     <div className="space-y-6 animate-fadeIn" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-gradient-to-r from-violet-900 to-violet-700 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-end md:items-center relative overflow-hidden">
           <div className={`absolute top-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 ${isRTL ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}`}></div>
           <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-violet-300 text-sm font-bold uppercase tracking-wider">
                 <ShieldCheck size={16} /> {t.adminHub}
              </div>
              <h2 className="text-3xl font-bold">{t.manageRoles}</h2>
              <p className="text-violet-200 max-w-xl">{t.subtitle}</p>
           </div>
           <Button variant="primary" onClick={() => setIsAddAdminOpen(true)} className="relative z-10 mt-6 md:mt-0 bg-violet-600 hover:bg-violet-700 text-white whitespace-nowrap rounded-lg shadow-sm border border-violet-500/30">
              <Plus size={16} /> {t.addNewAdmin}
           </Button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
           <table className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>
              <thead className="bg-gray-50 text-gray-500 font-semibold text-sm">
                 <tr>
                    <th className="px-6 py-4">{t.user}</th>
                    <th className="px-6 py-4">{t.roleTitle}</th>
                    <th className="px-6 py-4">{t.department}</th>
                    <th className="px-6 py-4">{t.activeStatus}</th>
                    <th className="px-6 py-4">{t.permissions}</th>
                    <th className="px-6 py-4"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {adminsList.map(admin => (
                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <img src={admin.avatar} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover" alt="" />
                             <div>
                                <p className="font-bold text-gray-900 text-sm">{trName(admin.name)}</p>
                                <p className="text-xs text-gray-400" dir="ltr">{admin.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-sm font-medium text-gray-700">{trRoleDeptStatus(admin.title)}</td>
                       <td className="px-6 py-4 text-sm text-gray-500">{trRoleDeptStatus(admin.department)}</td>
                       <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-bold w-fit px-2 py-1 rounded-full ${
                             admin.lastActive === 'Active now' 
                              ? 'text-green-600 bg-green-50' 
                              : 'text-gray-600 bg-gray-50'
                          }`}>
                             {admin.lastActive === 'Active now' && <div className="w-2 h-2 rounded-full bg-green-500"></div>} {trRoleDeptStatus(admin.lastActive)}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                             {admin.permissions.slice(0, 2).map(p => (
                                <span key={p} className="text-[10px] bg-gray-100 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                   {p.replace('_', ' ')}
                                </span>
                             ))}
                             {admin.permissions.length > 2 && (
                                <span className="text-[10px] bg-gray-100 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                   +{admin.permissions.length - 2}
                                </span>
                             )}
                          </div>
                       </td>
                       <td className={`px-6 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
                          <button className="text-gray-400 hover:text-violet-600 transition-colors"><Settings size={18}/></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  )};

  // --- MAIN RENDER ---

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} language={language} onBack={() => setSelectedStudent(null)} onEditProfile={onEditProfile} />;
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
       
       {/* 1. UPLOAD MODAL (Generic) */}
       {uploadModalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-gray-900">{isRTL ? (uploadModalType === "student" ? "استيراد طلاب" : "استيراد معلمين") : `Bulk Import ${uploadModalType === "student" ? "Students" : "Teachers"}`}</h3>
                   <button onClick={() => setUploadModalType(null)} className="text-gray-400 hover:text-gray-700"><X size={24}/></button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-6">
                   <FileSpreadsheet size={48} className="mx-auto text-green-600 mb-4" />
                   <p className="font-bold text-gray-900">Click to upload or drag & drop</p>
                   <p className="text-sm text-gray-500">CSV, Excel (max 10MB)</p>
                </div>

                <div className="flex justify-between items-center bg-violet-50 p-4 rounded-xl text-sm text-violet-800 mb-8">
                   <span className="flex items-center gap-2"><Download size={16}/> Download Template</span>
                   <button className="font-bold hover:underline">Get CSV</button>
                </div>

                <div className="flex gap-4">
                   <Button variant="secondary" className="flex-1" onClick={() => setUploadModalType(null)}>{isRTL ? "إلغاء" : "Cancel"}</Button>
                   <Button variant="primary" className="flex-1" onClick={() => setUploadModalType(null)}>Start Import</Button>
                </div>
             </div>
          </div>
       )}

       {/* 2. ADD STUDENT MODAL */}
       {isAddStudentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                   <div>
                     <h3 className="text-xl font-bold text-gray-900">{isRTL ? "تسجيل طالب جديد" : "Enroll New Student"}</h3>
                     <p className="text-sm text-gray-500">Add a single student record to the system.</p>
                   </div>
                   <button onClick={() => setIsAddStudentOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={24}/></button>
                </div>
                
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-4">
                         <label className="block text-sm font-bold text-gray-700 mb-2">Student Name</label>
                      </div>
                      <div>
                         <input 
                           type="text" 
                           placeholder="First" 
                           value={newStudent.firstName}
                           onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                        />
                      </div>
                      <div>
                         <input 
                           type="text" 
                           placeholder="Second" 
                           value={newStudent.secondName}
                           onChange={(e) => setNewStudent({...newStudent, secondName: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                        />
                      </div>
                      <div>
                         <input 
                           type="text" 
                           placeholder="Third" 
                           value={newStudent.thirdName}
                           onChange={(e) => setNewStudent({...newStudent, thirdName: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                        />
                      </div>
                      <div>
                         <input 
                           type="text" 
                           placeholder="Last" 
                           value={newStudent.lastName}
                           onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                        />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-gray-700 mb-2">Grade Level</label>
                         <select 
                           value={newStudent.grade}
                           onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                         >
                           {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => <option key={g} value={g}>{g}</option>)}
                         </select>
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                         <input 
                           type="date" 
                           value={newStudent.dob}
                           onChange={(e) => setNewStudent({...newStudent, dob: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                         />
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                   <Button variant="secondary" className="flex-1" onClick={() => setIsAddStudentOpen(false)}>{isRTL ? "إلغاء" : "Cancel"}</Button>
                   <Button variant="primary" className="flex-1" onClick={handleCreateStudent}>Create Student</Button>
                </div>
             </div>
          </div>
       )}

       {/* 3. ADD TEACHER MODAL */}
       {isAddTeacherOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                   <div>
                     <h3 className="text-xl font-bold text-gray-900">{isRTL ? "إضافة عضو هيئة تدريس" : "Add Faculty Member"}</h3>
                     <p className="text-sm text-gray-500">Create a new teacher profile and assign subjects.</p>
                   </div>
                   <button onClick={() => setIsAddTeacherOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={24}/></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Sarah Al-Majed" 
                        value={newTeacher.name}
                        onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="teacher@school.edu" 
                        value={newTeacher.email}
                        onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hiring Date</label>
                      <input 
                        type="date" 
                        value={newTeacher.hiringDate}
                        onChange={(e) => setNewTeacher({...newTeacher, hiringDate: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Employment Type</label>
                      <select 
                        value={newTeacher.type}
                        onChange={(e) => setNewTeacher({...newTeacher, type: e.target.value as any})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Primary Subject</label>
                      <select 
                        value={newTeacher.subject}
                        onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                      >
                        <option value="رياضيات">رياضيات</option>
                        <option value="علوم">علوم</option>
                        <option value="لغة إنجليزية">لغة إنجليزية</option>
                        <option value="لغة عربية">لغة عربية</option>
                        <option value="تاريخ">تاريخ</option>
                        <option value="فنون">فنون</option>
                      </select>
                   </div>
                </div>

                <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                   <Button variant="secondary" className="flex-1" onClick={() => setIsAddTeacherOpen(false)}>{isRTL ? "إلغاء" : "Cancel"}</Button>
                   <Button variant="primary" className="flex-1 bg-violet-600 hover:bg-violet-700" disabled={isCreatingTeacher} onClick={handleCreateTeacher}>{isCreatingTeacher ? 'جاري الإنشاء...' : 'Create Teacher'}</Button>
                </div>
             </div>
          </div>
       )}

       {/* 4. ADD ADMIN MODAL */}
       {isAddAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                   <div>
                     <h3 className="text-xl font-bold text-gray-900">{isRTL ? "تكوين مسؤول" : "Configure Administrator"}</h3>
                     <p className="text-sm text-gray-500">Assign role-based access control (RBAC) permissions.</p>
                   </div>
                   <button onClick={() => setIsAddAdminOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={24}/></button>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8">
                   {/* Left: Basic Info */}
                   <div className="flex-1 space-y-4">
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Role Template</label>
                         <div className="relative">
                            <select 
                              value={selectedAdminTemplate}
                              onChange={(e) => handleTemplateChange(e.target.value)}
                              className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 appearance-none font-medium"
                            >
                               <option value="Custom">Custom Configuration</option>
                               {Object.keys(ADMIN_TEMPLATES).map(t => (
                                  <option key={t} value={t}>{t}</option>
                               ))}
                            </select>
                            <LayoutTemplate size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                         </div>
                         <p className="text-xs text-gray-500 mt-1">Select a template to auto-configure permissions.</p>
                      </div>

                      <hr className="border-gray-100" />

                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                         <input 
                           type="text" 
                           value={newAdmin.name}
                           onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                        />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                         <input 
                           type="email" 
                           value={newAdmin.email}
                           onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                        />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Role Title</label>
                         <input 
                           type="text" 
                           placeholder="e.g. Registrar" 
                           value={newAdmin.title}
                           onChange={(e) => setNewAdmin({...newAdmin, title: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" 
                        />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                         <select 
                           value={newAdmin.department}
                           onChange={(e) => setNewAdmin({...newAdmin, department: e.target.value})}
                           className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                         >
                           <option>Administration</option>
                           <option>Academics</option>
                           <option>Admissions</option>
                           <option>Finance</option>
                           <option>IT Support</option>
                         </select>
                      </div>
                   </div>

                   {/* Right: Permissions */}
                   <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2"><Lock size={16}/> Access Permissions</h4>
                        <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-1 rounded-md">{adminPermissions.length} Active</span>
                      </div>
                      
                      <div className="space-y-6 h-[400px] overflow-y-auto pr-2">
                         {PERMISSION_GROUPS.map((group) => (
                            <div key={group.category}>
                               <p className="text-xs font-bold text-gray-500 uppercase mb-3 sticky top-0 bg-gray-50 py-1">{group.category}</p>
                               <div className="space-y-2">
                                  {group.perms.map((perm) => (
                                     <div key={perm.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                        <span className="text-sm font-medium text-gray-700">{perm.label}</span>
                                        <button 
                                          onClick={() => togglePermission(perm.id)}
                                          className={`transition-colors ${adminPermissions.includes(perm.id) ? 'text-green-500' : 'text-gray-300'}`}
                                        >
                                           {adminPermissions.includes(perm.id) ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                        </button>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                   <Button variant="secondary" className="flex-1" onClick={() => setIsAddAdminOpen(false)}>{isRTL ? "إلغاء" : "Cancel"}</Button>
                   <Button variant="primary" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" onClick={handleCreateAdmin}>{isRTL ? "إنشاء مسؤول" : "Create Administrator"}</Button>
                </div>
             </div>
          </div>
       )}

       {/* Header & Tabs */}
       <div className={`flex flex-col md:flex-row justify-between items-end md:items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
             <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{isRTL ? "إدارة المستخدمين" : "User Management"}</h1>
             <p className="text-gray-500">{isRTL ? "الدليل والتحكم في الوصول للمؤسسة." : "Directory and access control for the institution."}</p>
          </div>
          
          {/* Permission-aware Tabs */}
          <div className={`bg-white p-1 rounded-full border border-gray-200 shadow-sm flex ${isRTL ? 'flex-row-reverse' : ''}`}>
             <button 
               onClick={() => setActiveTab('students')}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
             >
                <GraduationCap size={16} /> {isRTL ? "الطلاب" : "Students"}
             </button>
             
             {(role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) && (
                <>
                  <button 
                     onClick={() => setActiveTab('parents')}
                     className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'parents' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                     <Users size={16} /> {isRTL ? "أولياء الأمور" : "Parents"}
                  </button>
                  <button 
                     onClick={() => setActiveTab('teachers')}
                     className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                     <Briefcase size={16} /> {isRTL ? "المعلمون" : "Teachers"}
                  </button>
                  <button 
                     onClick={() => setActiveTab('admins')}
                     className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'admins' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                     <ShieldCheck size={16} /> {isRTL ? "الإدارة" : "Admins"}
                  </button>
                </>
             )}
          </div>
       </div>

       {/* View Content */}
       {activeTab === 'students' && <StudentListView />}
       {activeTab === 'parents' && <ParentListView />}
       {activeTab === 'teachers' && <TeacherListView />}
       {activeTab === 'admins' && <AdminListView />}
    </div>
  );
};