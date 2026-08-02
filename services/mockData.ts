import { Student, UserRole, KPI, Fee, ReportCard, InstallmentPlan, CurriculumTree, GradeLevelNode, SubjectNode, AcademicWeek, CurriculumSystem, GradebookConfig, ClassSection, AttendanceSession, Teacher, Admin, Parent } from '../types';

// --- Generators ---
const generateFees = (type: 'Standard' | 'Scholarship' | 'Late'): Fee[] => {
  const baseFees: Fee[] = [
    { id: 'f1', title: 'Technology Resource Fee', amount: 850, dueDate: '2023-09-01', status: 'Paid' },
    { id: 'f2', title: 'Uniform & Kits', amount: 1200, dueDate: '2023-09-05', status: 'Paid' },
  ];

  if (type === 'Late') {
    return [...baseFees, { id: 'f_late', title: 'Late Registration Penalty', amount: 500, dueDate: '2023-10-01', status: 'Overdue' }];
  }
  if (type === 'Scholarship') {
    return [{ id: 'f1', title: 'Technology Resource Fee', amount: 850, dueDate: '2023-09-01', status: 'Paid' }];
  }
  return [...baseFees, { id: 'f3', title: 'Spring Field Trip', amount: 300, dueDate: '2024-03-15', status: 'Pending' }];
};

const generateInstallmentPlans = (type: 'Standard' | 'Late'): InstallmentPlan[] => {
  const annualTotal = 24000;
  
  return [{
    id: 'plan_tuition_23_24',
    title: 'Annual Tuition 2023/2024',
    totalAmount: annualTotal,
    installments: [
      { id: 'ins1', dueDate: '2023-09-01', amount: 8000, status: type === 'Late' ? 'Overdue' : 'Paid' },
      { id: 'ins2', dueDate: '2024-01-01', amount: 8000, status: 'Pending' },
      { id: 'ins3', dueDate: '2024-04-01', amount: 8000, status: 'Pending' }
    ]
  }];
};

const generateReportCards = (studentName: string, avg: number): ReportCard[] => {
  const reports: ReportCard[] = [
    {
      id: `rc_t1_${studentName.replace(/\s+/g, '_')}`,
      title: 'الفصل 1 Progress Report',
      academicYear: '2023-2024',
      issueDate: '2023-12-15',
      gradeAverage: `${avg}%`,
      type: 'Report Card',
      status: 'Draft',
      term: 'Q1',
      attendance: { totalDays: 45, absences: 2, tardies: 1 },
      behavioralComments: `${studentName} has shown great enthusiasm in class. They are a collaborative team member and always contribute to discussions.`,
      nextSteps: "Focus on refining presentation skills and ensuring all homework is submitted on time to maintain high grades.",
      subjectGrades: [
        { 
          subject: 'Mathematics', grade: avg > 90 ? 'A' : 'B', score: avg, trend: 'up', teacher: 'سارة الماجد', teacherAvatar: 'https://i.pravatar.cc/150?u=sarah',
          breakdown: [{ category: 'Quiz', score: 92 }, { category: 'Assignment', score: 95 }, { category: 'Exam', score: 90 }]
        },
        { 
          subject: 'Science', grade: 'A', score: 94, trend: 'stable', teacher: 'أحمد خليل', teacherAvatar: 'https://i.pravatar.cc/150?u=ahmed',
          breakdown: [{ category: 'Quiz', score: 95 }, { category: 'Lab', score: 98 }, { category: 'Exam', score: 92 }]
        },
        { 
          subject: 'Arabic', grade: 'B+', score: 88, trend: 'down', teacher: 'منى راشد', teacherAvatar: 'https://i.pravatar.cc/150?u=mona',
          breakdown: [{ category: 'Quiz', score: 85 }, { category: 'Participation', score: 95 }, { category: 'Exam', score: 84 }]
        }
      ],
      skills: [
        { category: 'Analytical', score: 85 },
        { category: 'Creative', score: 70 },
        { category: 'Social', score: 95 },
        { category: 'Physical', score: 80 }
      ]
    },
    {
      id: `tr_${studentName.replace(/\s+/g, '_')}`,
      title: 'Official Academic Transcript',
      academicYear: '2023-2024',
      issueDate: '2024-01-20',
      gradeAverage: (avg / 25).toFixed(2),
      type: 'Transcript'
    }
  ];

  if (avg >= 90) {
    reports.push({
      id: 'cert_honors',
      title: 'Principal\'s List Award',
      academicYear: '2023-2024',
      issueDate: '2024-01-10',
      gradeAverage: 'High Distinction',
      type: 'Certificate'
    });
  }
  return reports;
};

// --- Mock Students ---
export const STUDENTS: Student[] = [
  { 
    id: 'ST-2023-001', name: 'ليلى المنصور', grade: 'الصف 10', attendance: 98, performance: 96, status: 'Active',
    fees: generateFees('Standard'), 
    installmentPlans: generateInstallmentPlans('Standard'), 
    reportCards: generateReportCards('ليلى المنصور', 96),
    dob: '2008-05-15',
    nationalId: 'NAT-2008-5152',
    enrollmentDate: '2022-09-01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
    transcript: {
      years: [
        {
          year: '2023-2024',
          gradeLevel: 'الصف 9',
          courses: [
            { code: 'MAT101', title: 'Algebra I', credits: 1, grade: 'A', points: 4.0 },
            { code: 'SCI101', title: 'General Science', credits: 1, grade: 'A-', points: 3.7 },
            { code: 'ENG101', title: 'English Composition', credits: 1, grade: 'B+', points: 3.3 },
            { code: 'HIS101', title: 'World History I', credits: 1, grade: 'A', points: 4.0 },
            { code: 'PE101', title: 'Physical Education', credits: 0.5, grade: 'A', points: 4.0 },
          ]
        },
        {
          year: '2024-2025',
          gradeLevel: 'الصف 10',
          courses: [
            { code: 'MAT201', title: 'Geometry', credits: 1, grade: 'A', points: 4.0 },
            { code: 'SCI201', title: 'Biology', credits: 1, grade: 'A', points: 4.0 },
            { code: 'ENG201', title: 'World Literature', credits: 1, grade: 'A-', points: 3.7 },
            { code: 'HIS201', title: 'World History II', credits: 1, grade: 'B', points: 3.0 },
            { code: 'ART101', title: 'Visual Arts', credits: 0.5, grade: 'A+', points: 4.0 },
          ]
        }
      ],
      totalCreditsEarned: 18.5,
      requiredCredits: 24.0,
      cumulativeGPA: 3.78,
      degreeConferred: 'High School Diploma',
      conferredDate: 'Expected June 2026',
      honors: 'Honor Roll'
    }
  },
  { 
    id: 'ST-2023-042', name: 'عمر فاروق', grade: 'الصف 10', attendance: 82, performance: 74, status: 'At Risk',
    fees: generateFees('Late'), installmentPlans: generateInstallmentPlans('Late'), reportCards: generateReportCards('عمر فاروق', 74),
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'ST-2023-115', name: 'سارة جونسون', grade: 'الصف 11', attendance: 95, performance: 92, status: 'Active',
    fees: generateFees('Standard'), installmentPlans: generateInstallmentPlans('Standard'), reportCards: generateReportCards('سارة جونسون', 92),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'ST-2023-088', name: 'يوسف الحربي', grade: 'الصف 9', attendance: 65, performance: 58, status: 'Inactive',
    fees: generateFees('Late'), installmentPlans: generateInstallmentPlans('Late'), reportCards: generateReportCards('يوسف الحربي', 58),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'ST-2023-202', name: 'نورة إبراهيم', grade: 'الصف 12', attendance: 99, performance: 98, status: 'Active',
    fees: generateFees('Scholarship'), installmentPlans: generateInstallmentPlans('Standard'), reportCards: generateReportCards('نورة إبراهيم', 98),
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'ST-2023-305', name: 'كريم مصطفى', grade: 'الصف 10', attendance: 91, performance: 85, status: 'Active',
    fees: generateFees('Standard'), installmentPlans: generateInstallmentPlans('Standard'), reportCards: generateReportCards('كريم مصطفى', 85)
  },
  { 
    id: 'ST-2023-310', name: 'دينا كمال', grade: 'الصف 11', attendance: 88, performance: 79, status: 'Active',
    fees: generateFees('Standard'), installmentPlans: generateInstallmentPlans('Standard'), reportCards: generateReportCards('دينا كمال', 79)
  },
  { 
    id: 'ST-2023-401', name: 'فهد إبراهيم', grade: 'الصف 9', attendance: 94, performance: 88, status: 'Active',
    fees: generateFees('Standard'), installmentPlans: generateInstallmentPlans('Standard'), reportCards: generateReportCards('فهد إبراهيم', 88)
  }
];

// --- Mock Teachers ---
export const MOCK_PARENTS: Parent[] = [
  {
    id: 'PR-2023-001',
    name: 'أحمد حسن',
    email: 'ahmed.hassan@example.com',
    phone: '+20 10 123 4567',
    childrenIds: ['ST-2023-042'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'PR-2023-002',
    name: 'فاطمة السيد',
    email: 'fatima.sayed@example.com',
    phone: '+20 11 234 5678',
    childrenIds: ['ST-2023-115'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'PR-2023-003',
    name: 'محمد الحربي',
    email: 'mohammed.harbi@example.com',
    phone: '+20 12 345 6789',
    childrenIds: ['ST-2023-088'],
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'PR-2023-004',
    name: 'عائشة إبراهيم',
    email: 'aisha.ebrahim@example.com',
    phone: '+20 10 456 7890',
    childrenIds: ['ST-2023-202'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'u1',
    name: 'سارة الماجد',
    role: UserRole.TEACHER,
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    email: 'sarah.majed@alfarouk.edu',
    specialization: 'Mathematics',
    hiringDate: '2019-08-15',
    employmentType: 'Full-time',
    phone: '+20 11 123 4567',
    assignedClasses: ['c-10a', 'c-11b'],
    academicLoad: 18
  },
  {
    id: 't2',
    name: 'أحمد خليل',
    role: UserRole.TEACHER,
    avatar: 'https://i.pravatar.cc/150?u=ahmed',
    email: 'ahmed.khalil@alfarouk.edu',
    specialization: 'Physics',
    hiringDate: '2021-01-10',
    employmentType: 'Full-time',
    phone: '+20 12 987 6543',
    assignedClasses: ['c-10a'],
    academicLoad: 16
  },
  {
    id: 't3',
    name: 'إيميلي ديفيس',
    role: UserRole.TEACHER,
    avatar: 'https://i.pravatar.cc/150?u=emily',
    email: 'emily.davis@alfarouk.edu',
    specialization: 'English Literature',
    hiringDate: '2022-08-20',
    employmentType: 'Contract',
    phone: '+20 10 111 2233',
    assignedClasses: ['c-11b'],
    academicLoad: 12
  },
  {
    id: 't4',
    name: 'عمر حسن',
    role: UserRole.TEACHER,
    avatar: 'https://i.pravatar.cc/150?u=omar',
    email: 'omar.hassan@alfarouk.edu',
    specialization: 'Arabic',
    hiringDate: '2018-09-01',
    employmentType: 'Full-time',
    phone: '+20 11 222 3344',
    assignedClasses: ['c-10a', 'c-11b', 'c-12a'],
    academicLoad: 22
  },
  {
    id: 't5',
    name: 'فاطمة علي',
    role: UserRole.TEACHER,
    avatar: 'https://i.pravatar.cc/150?u=fatima',
    email: 'fatima.ali@alfarouk.edu',
    specialization: 'Mathematics',
    hiringDate: '2023-01-15',
    employmentType: 'Full-time',
    phone: '+20 12 444 5566',
    assignedClasses: ['c-9a', 'c-9b'],
    academicLoad: 14
  },
  {
    id: 't6',
    name: 'ديفيد سميث',
    role: UserRole.TEACHER,
    avatar: 'https://i.pravatar.cc/150?u=david',
    email: 'david.smith@alfarouk.edu',
    specialization: 'Physics',
    hiringDate: '2020-10-05',
    employmentType: 'Contract',
    phone: '+20 10 777 8899',
    assignedClasses: ['c-12a'],
    academicLoad: 8
  },
  {
    id: 't7',
    name: 'نور الدين',
    role: UserRole.TEACHER,
    avatar: 'https://i.pravatar.cc/150?u=nour',
    email: 'nour.eldin@alfarouk.edu',
    specialization: 'English',
    hiringDate: '2017-08-25',
    employmentType: 'Full-time',
    phone: '+20 11 999 0000',
    assignedClasses: ['c-10a', 'c-10b', 'c-11a', 'c-11b'],
    academicLoad: 25
  }
];

// --- Mock Admins ---
export const MOCK_ADMINS: Admin[] = [
  {
    id: 'adm1',
    name: 'د. فيصل عمر',
    role: UserRole.SUPER_ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=faisal',
    email: 'f.saud@alfarouk.edu',
    title: 'School Principal',
    department: 'Administration',
    permissions: ['ALL_ACCESS', 'SYSTEM_CONFIG', 'FINANCE_CONTROL'],
    lastActive: 'Active now'
  },
  {
    id: 'adm2',
    name: 'منى راشد',
    role: UserRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=mona',
    email: 'm.rashid@alfarouk.edu',
    title: 'Academic Coordinator',
    department: 'Academics',
    permissions: ['CURRICULUM_EDIT', 'CLASS_ASSIGNMENT', 'TEACHER_EVALUATION'],
    lastActive: '2 hours ago'
  },
  {
    id: 'adm3',
    name: 'ياسر علي',
    role: UserRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=yasser',
    email: 'y.ali@alfarouk.edu',
    title: 'Registrar',
    department: 'Admissions',
    permissions: ['STUDENT_ENROLLMENT', 'RECORDS_ACCESS'],
    lastActive: '5 mins ago'
  }
];

// --- KPIs ---
export const ADMIN_KPIS: KPI[] = [
  { label: 'Total Enrollment', value: 1250, trend: 5.2, trendDirection: 'up' },
  { label: 'Avg Daily Attendance', value: '94.8%', trend: 0.4, trendDirection: 'up' },
  { label: 'Tuition Collection', value: '82%', trend: 2.1, trendDirection: 'down' },
  { label: 'Staff Satisfaction', value: '4.8/5', trend: 0, trendDirection: 'up' },
];

export const TEACHER_KPIS: KPI[] = [
  { label: 'Active Students', value: 142, trend: 2, trendDirection: 'up' },
  { label: 'Lesson Completion', value: '91%', trend: 15, trendDirection: 'up' },
  { label: 'Avg Assessment Score', value: '84%', trend: 3.5, trendDirection: 'up' },
  { label: 'Parent Engagement', value: 'High', trend: 0, trendDirection: 'up' },
];

export const PERFORMANCE_DATA = [
  { name: 'Week 1', math: 72, science: 74, arabic: 80 },
  { name: 'Week 2', math: 75, science: 76, arabic: 82 },
  { name: 'Week 3', math: 74, science: 79, arabic: 84 },
  { name: 'Week 4', math: 78, science: 82, arabic: 85 },
  { name: 'Week 5', math: 82, science: 85, arabic: 86 },
  { name: 'Week 6', math: 85, science: 84, arabic: 88 },
  { name: 'Week 7', math: 84, science: 88, arabic: 89 },
  { name: 'Week 8', math: 88, science: 90, arabic: 91 },
];

// --- Curriculum Generator Utilities ---

const generateWeeks = (): AcademicWeek[] => {
  const weeks: AcademicWeek[] = [];
  let currentDate = new Date('2023-09-03'); // First Sunday of Sept

  for (let i = 1; i <= 36; i++) {
    const end = new Date(currentDate);
    end.setDate(currentDate.getDate() + 4); // Thursday

    weeks.push({
      id: `w${i}`,
      weekNumber: i,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      topics: []
    });

    // Skip to next Sunday
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return weeks;
};

export const generateCurriculumTree = (system: CurriculumSystem): CurriculumTree => {
  let grades: string[] = [];
  let subjects: string[] = [];

  switch (system) {
    case 'National':
      grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'الصف 9', 'الصف 10', 'الصف 11', 'الصف 12'];
      subjects = ['Arabic Language', 'Islamic Studies', 'Mathematics', 'General Science', 'English Language', 'Social Studies', 'Digital Skills', 'Art Education'];
      break;
    case 'IG':
      grades = ['Year 7', 'Year 8', 'Year 9', 'Year 10 (IGCSE)', 'Year 11 (IGCSE)', 'Year 12 (AS)', 'Year 13 (A2)'];
      subjects = ['Mathematics', 'English Literature', 'Physics', 'Chemistry', 'Biology', 'Business Studies', 'Computer Science'];
      break;
    case 'IB':
      grades = ['PYP 1', 'PYP 2', 'MYP 1', 'MYP 2', 'MYP 3', 'DP 1', 'DP 2'];
      subjects = ['Theory of Knowledge', 'Language A', 'Language B', 'Individuals & Societies', 'Sciences', 'Mathematics', 'Arts'];
      break;
    case 'American':
      grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'الصف 9', 'الصف 10', 'الصف 11', 'الصف 12'];
      subjects = ['English Language Arts', 'Mathematics', 'Science', 'Social Studies', 'Electives', 'Physical Education'];
      break;
  }

  const gradeNodes: GradeLevelNode[] = grades.map((gradeName, idx) => ({
    id: `g-${idx}`,
    name: gradeName,
    subjects: subjects.map((subName, sIdx) => ({
      id: `s-${idx}-${sIdx}`,
      name: subName,
      weeks: generateWeeks(),
      resources: [
        { id: `res-${sIdx}-1`, title: 'Course Syllabus', type: 'Document', url: '#', source: 'Local', size: '2.4 MB', uploadedAt: '2023-09-01' },
        { id: `res-${sIdx}-2`, title: 'Textbook Chapter 1', type: 'Document', url: '#', source: 'Google Drive', size: '12 MB', uploadedAt: '2023-09-05' }
      ],
      folders: [
        {
          id: `f-${idx}-${sIdx}-1`,
          name: 'Assessments',
          resources: [],
          subFolders: []
        },
        {
          id: `f-${idx}-${sIdx}-2`,
          name: 'Presentations',
          resources: [],
          subFolders: []
        }
      ],
      lessonPlans: sIdx === 0 ? [{
        id: 'lp-1',
        topic: 'Introduction to the Subject',
        gradeLevel: gradeName,
        subject: subName,
        objectives: ['Understand key concepts', 'Identify course requirements'],
        materials: ['Textbook', 'Whiteboard'],
        outline: [{ duration: '10 min', activity: 'Ice Breaker', description: 'Class introduction' }],
        quiz: []
      }] : [],
      assignedTeacherIds: []
    }))
  }));

  return {
    id: `curr-${Date.now()}`,
    system,
    academicYear: '2023-2024',
    grades: gradeNodes
  };
};

// --- Mock Gradebook Data ---
export const MOCK_GRADEBOOK: GradebookConfig = {
  id: 'gb-101',
  classId: 'c-10a',
  subjectName: 'Mathematics',
  categoryWeights: {
    'Homework': 10,
    'Quiz': 20,
    'Project': 30,
    'Exam': 40,
    'Participation': 0
  },
  categories: [
    { id: 'cat-1', name: 'Homework', weight: 10 },
    { id: 'cat-2', name: 'Quiz', weight: 20 },
    { id: 'cat-3', name: 'Project', weight: 30 },
    { id: 'cat-4', name: 'Exam', weight: 40 }
  ],
  passingScore: 50,
  gradingScale: [
    { grade: 'A', min: 90, max: 100, color: 'text-green-600' },
    { grade: 'B', min: 80, max: 89, color: 'text-blue-600' },
    { grade: 'C', min: 70, max: 79, color: 'text-yellow-600' },
    { grade: 'D', min: 60, max: 69, color: 'text-orange-600' },
    { grade: 'F', min: 0, max: 59, color: 'text-red-600' }
  ],
  terms: [
    { id: 't1', name: 'الفصل 1', startDate: '2023-09-01', endDate: '2023-12-20', status: 'Active' },
    { id: 't2', name: 'الفصل 2', startDate: '2024-01-05', endDate: '2024-03-30', status: 'Locked' },
    { id: 't3', name: 'الفصل 3', startDate: '2024-04-10', endDate: '2024-06-20', status: 'Active' }
  ],
  assessments: [
    { id: 'a1', title: 'Algebra Quiz', category: 'Quiz', maxScore: 20, date: '2023-09-15', termId: 't1' },
    { id: 'a2', title: 'Geometry Project', category: 'Project', maxScore: 100, date: '2023-10-10', termId: 't1' },
    { id: 'a3', title: 'Midterm Exam', category: 'Exam', maxScore: 100, date: '2023-11-05', termId: 't1' },
    { id: 'a4', title: 'Weekly HW 1', category: 'Homework', maxScore: 10, date: '2023-09-07', termId: 't1' }
  ],
  entries: [
    // Layla
    { studentId: 'ST-2023-001', assessmentId: 'a1', score: 19, status: 'Graded' },
    { studentId: 'ST-2023-001', assessmentId: 'a2', score: 98, status: 'Graded' },
    { studentId: 'ST-2023-001', assessmentId: 'a3', score: 95, status: 'Graded' },
    { studentId: 'ST-2023-001', assessmentId: 'a4', score: 10, status: 'Graded' },
    // Omar
    { studentId: 'ST-2023-042', assessmentId: 'a1', score: 12, status: 'Graded' },
    { studentId: 'ST-2023-042', assessmentId: 'a2', score: 0, status: 'Missing' },
    { studentId: 'ST-2023-042', assessmentId: 'a3', score: 65, status: 'Graded' },
    { studentId: 'ST-2023-042', assessmentId: 'a4', score: 7, status: 'Late' },
     // Karim
    { studentId: 'ST-2023-305', assessmentId: 'a1', score: 18, status: 'Graded' },
    { studentId: 'ST-2023-305', assessmentId: 'a2', score: 88, status: 'Graded' },
    { studentId: 'ST-2023-305', assessmentId: 'a3', score: 85, status: 'Graded' },
    { studentId: 'ST-2023-305', assessmentId: 'a4', score: null, status: 'Excused' },
    // Sarah
    { studentId: 'ST-2023-115', assessmentId: 'a1', score: null, status: 'Submitted' },
    { studentId: 'ST-2023-115', assessmentId: 'a2', score: 92, status: 'Graded' },
    { studentId: 'ST-2023-115', assessmentId: 'a3', score: null, status: 'Submitted' }
  ]
};

// --- Mock Classes & Attendance ---

export const CLASSES: ClassSection[] = [
  {
    id: 'c-10a',
    name: '10-A',
    gradeLevel: 'الصف 10',
    curriculumSystem: 'National',
    academicYear: '2023-2024',
    room: '102',
    teacherId: 'u1',
    students: STUDENTS.filter(s => s.grade === 'الصف 10').map(s => s.id),
    schedule: [
      { day: 'Sunday', periods: [{ subject: 'Mathematics', time: '08:00' }, { subject: 'Science', time: '09:00' }] },
      { day: 'Monday', periods: [{ subject: 'Mathematics', time: '10:00' }] }
    ]
  },
  {
    id: 'c-11b',
    name: '11-B',
    gradeLevel: 'الصف 11',
    curriculumSystem: 'American',
    academicYear: '2023-2024',
    room: '205',
    teacherId: 'u1',
    students: STUDENTS.filter(s => s.grade === 'الصف 11').map(s => s.id),
    schedule: [
      { day: 'Tuesday', periods: [{ subject: 'Physics', time: '08:00' }, { subject: 'Chemistry', time: '09:00' }] },
      { day: 'Wednesday', periods: [{ subject: 'Physics', time: '10:00' }] }
    ]
  },
  {
    id: 'c-12c',
    name: '12-C',
    gradeLevel: 'الصف 12',
    curriculumSystem: 'IB',
    academicYear: '2024-2025',
    room: '301',
    teacherId: 'u1',
    students: STUDENTS.filter(s => s.grade === 'الصف 12').map(s => s.id),
    schedule: [
      { day: 'Thursday', periods: [{ subject: 'Biology', time: '08:00' }, { subject: 'English', time: '09:00' }] },
      { day: 'Friday', periods: [{ subject: 'Biology', time: '10:00' }] }
    ]
  }
];

export const MOCK_ATTENDANCE_SESSION: AttendanceSession = {
  id: 'sess-001',
  classId: 'c-10a',
  date: new Date().toISOString().split('T')[0],
  startTime: '08:00',
  endTime: '09:00',
  status: 'Active',
  subject: 'Mathematics',
  records: [
    { id: 'rec-1', sessionId: 'sess-001', studentId: 'ST-2023-001', status: 'Present', timestamp: '08:02', method: 'QR' }
  ]
};