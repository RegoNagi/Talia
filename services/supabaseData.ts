import { supabase } from '../lib/supabaseClient';
import { Student, ClassSection, Teacher } from '../types';

// بيجيب الطلاب الحقيقيين من قاعدة البيانات (Supabase) بدل الـ mock data.
// بعض الحقول (fees, reportCards, transcript, attendance, performance) لسه
// مش لها جداول في قاعدة البيانات، فبنحطلها قيم افتراضية فارغة مؤقتًا
// لحد ما نبني موديول الحضور والدرجات والمصروفات.
// بيحسب نسبة الحضور الحقيقية لكل طالب من سجلات الحضور الفعلية
async function getAttendancePercentages(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('attendance_records').select('student_id, status');
  if (error || !data) {
    console.error('Error computing attendance percentages:', error);
    return {};
  }
  const totals: Record<string, { total: number; present: number }> = {};
  data.forEach((row: any) => {
    if (!totals[row.student_id]) totals[row.student_id] = { total: 0, present: 0 };
    totals[row.student_id].total += 1;
    if (row.status === 'Present' || row.status === 'Late') totals[row.student_id].present += 1;
  });
  const result: Record<string, number> = {};
  Object.entries(totals).forEach(([studentId, t]) => {
    result[studentId] = t.total > 0 ? Math.round((t.present / t.total) * 100) : 0;
  });
  return result;
}

// بينشئ طالب حقيقي جديد (يوزر + سجل طالب)
export async function createStudent(input: {
  name: string;
  grade: string;
  dob: string;
}): Promise<string | null> {
  const { data: userRow, error: userError } = await supabase
    .from('users')
    .insert({ name: input.name, role: 'STUDENT' })
    .select('id')
    .single();

  if (userError || !userRow) {
    console.error('Error creating student user:', userError);
    return null;
  }

  const { data: studentRow, error: studentError } = await supabase
    .from('students')
    .insert({
      user_id: userRow.id,
      grade: input.grade,
      dob: input.dob || null,
      enrollment_date: new Date().toISOString().slice(0, 10),
      status: 'Active',
    })
    .select('id')
    .single();

  if (studentError || !studentRow) {
    console.error('Error creating student record:', studentError);
    return null;
  }

  return studentRow.id;
}

export async function getStudents(): Promise<(Student & { userId: string })[]> {
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      user_id,
      grade,
      national_id,
      dob,
      enrollment_date,
      status,
      users ( name )
    `);

  if (error) {
    console.error('Error fetching students from Supabase:', error);
    return [];
  }

  const attendanceMap = await getAttendancePercentages();

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    name: row.users?.name ?? 'بدون اسم',
    grade: row.grade ?? '',
    attendance: attendanceMap[row.id] ?? 0,
    performance: 0,
    status: row.status ?? 'Active',
    fees: [],
    installmentPlans: [],
    reportCards: [],
    dob: row.dob ?? undefined,
    nationalId: row.national_id ?? undefined,
    enrollmentDate: row.enrollment_date ?? undefined,
  }));
}

// بيعدّل بيانات طالب موجود
export async function updateStudent(input: {
  studentId: string;
  userId: string;
  name: string;
  grade: string;
  dob: string;
  status: string;
}): Promise<boolean> {
  const { error: userError } = await supabase.from('users').update({ name: input.name }).eq('id', input.userId);
  if (userError) {
    console.error('Error updating student user:', userError);
    return false;
  }
  const { error: studentError } = await supabase
    .from('students')
    .update({ grade: input.grade, dob: input.dob || null, status: input.status })
    .eq('id', input.studentId);
  if (studentError) {
    console.error('Error updating student record:', studentError);
    return false;
  }
  return true;
}

// بيمسح طالب واحد (مسح اليوزر بيمسح معاه سجل الطالب والتسجيلات تلقائيًا بسبب CASCADE)
export async function deleteStudent(userId: string): Promise<boolean> {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) {
    console.error('Error deleting student:', error);
    return false;
  }
  return true;
}

// بيمسح مجموعة طلاب دفعة واحدة
export async function bulkDeleteStudents(userIds: string[]): Promise<boolean> {
  if (userIds.length === 0) return true;
  const { error } = await supabase.from('users').delete().in('id', userIds);
  if (error) {
    console.error('Error bulk deleting students:', error);
    return false;
  }
  return true;
}

// بيمسح مجموعة معلمين دفعة واحدة
export async function bulkDeleteTeachers(userIds: string[]): Promise<boolean> {
  if (userIds.length === 0) return true;
  const { error } = await supabase.from('users').delete().in('id', userIds);
  if (error) {
    console.error('Error bulk deleting teachers:', error);
    return false;
  }
  return true;
}

// بيجيب الفصول الدراسية الحقيقية مع قائمة الطلاب المسجلين في كل فصل
export async function getClassSections(): Promise<ClassSection[]> {
  const { data, error } = await supabase
    .from('class_sections')
    .select(`
      id,
      name,
      grade_level,
      academic_year,
      teacher_id,
      capacity,
      enrollments ( student_id )
    `);

  if (error) {
    console.error('Error fetching class sections from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    gradeLevel: row.grade_level ?? '',
    curriculumSystem: 'National',
    academicYear: row.academic_year ?? '',
    room: '-',
    teacherId: row.teacher_id ?? '',
    capacity: row.capacity ?? 25,
    students: (row.enrollments || []).map((e: any) => e.student_id),
    schedule: [],
  }));
}

// بيجيب المدرسين الحقيقيين (مع بياناتهم من جدول users)
const ALL_SUBJECTS = ['رياضيات', 'علوم', 'لغة عربية', 'لغة إنجليزية', 'تاريخ', 'فنون'];

export async function getTeachers(): Promise<(Teacher & { userId: string; grades: string[]; subjects: string[]; teacherType: 'Main' | 'Assistant' })[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select(`
      id,
      user_id,
      specialization,
      employment_type,
      teacher_type,
      users ( name, email ),
      teacher_grades ( grade ),
      teacher_subjects ( subject )
    `);

  if (error) {
    console.error('Error fetching teachers from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    name: row.users?.name ?? 'بدون اسم',
    role: 'TEACHER' as any,
    avatar: '',
    email: row.users?.email ?? '',
    specialization: row.specialization ?? '',
    hiringDate: '',
    employmentType: row.employment_type ?? 'Full-time',
    phone: '',
    assignedClasses: [],
    academicLoad: 0,
    grades: (row.teacher_grades || []).map((g: any) => g.grade),
    subjects: (row.teacher_subjects || []).map((s: any) => s.subject),
    teacherType: row.teacher_type ?? 'Main',
  }));
}

// بيجيب المعلمين المسجّلين فعليًا على مادة معيّنة (من جدول teacher_subjects)
export async function getTeachersBySubject(subject: string): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from('teacher_subjects')
    .select(`
      subject,
      teachers ( id, specialization, employment_type, users ( name, email ) )
    `)
    .eq('subject', subject);

  if (error) {
    console.error('Error fetching teachers by subject:', error);
    return [];
  }

  return (data || [])
    .filter((row: any) => row.teachers)
    .map((row: any) => ({
      id: row.teachers.id,
      name: row.teachers.users?.name ?? 'بدون اسم',
      role: 'TEACHER' as any,
      avatar: '',
      email: row.teachers.users?.email ?? '',
      specialization: row.teachers.specialization ?? '',
      hiringDate: '',
      employmentType: row.teachers.employment_type ?? 'Full-time',
      phone: '',
      assignedClasses: [],
      academicLoad: 0,
    }));
}

// بينشئ معلم حقيقي جديد (يوزر + سجل معلم + ربطه بمواده وصفوفه ونوعه)
export async function createTeacher(input: {
  name: string;
  email: string;
  hiringDate: string;
  employmentType: string;
  subjects: string[];
  allSubjects: boolean;
  grades: string[];
  teacherType: 'Main' | 'Assistant';
}): Promise<string | null> {
  const { data: userRow, error: userError } = await supabase
    .from('users')
    .insert({ name: input.name, role: 'TEACHER', email: input.email?.trim() ? input.email.trim() : null })
    .select('id')
    .single();

  if (userError || !userRow) {
    console.error('Error creating teacher user:', userError);
    return null;
  }

  const effectiveSubjects = input.allSubjects ? ALL_SUBJECTS : input.subjects;
  const specializationLabel = input.allSubjects ? 'كل المواد' : (effectiveSubjects.join('، ') || '');

  const { data: teacherRow, error: teacherError } = await supabase
    .from('teachers')
    .insert({
      user_id: userRow.id,
      specialization: specializationLabel,
      employment_type: input.employmentType,
      hiring_date: input.hiringDate || null,
      teacher_type: input.teacherType,
    })
    .select('id')
    .single();

  if (teacherError || !teacherRow) {
    console.error('Error creating teacher record:', teacherError);
    return null;
  }

  if (effectiveSubjects.length > 0) {
    const rows = effectiveSubjects.map(s => ({ teacher_id: teacherRow.id, subject: s }));
    const { error: subjectError } = await supabase.from('teacher_subjects').insert(rows);
    if (subjectError) console.error('Error linking teacher to subjects:', subjectError);
  }

  if (input.grades.length > 0) {
    const rows = input.grades.map(g => ({ teacher_id: teacherRow.id, grade: g }));
    const { error: gradesError } = await supabase.from('teacher_grades').insert(rows);
    if (gradesError) console.error('Error linking teacher to grades:', gradesError);
  }

  return teacherRow.id;
}

// بيعدّل بيانات معلم موجود (يوزر + سجل معلم + يعيد ضبط مواده وصفوفه)
export async function updateTeacher(input: {
  teacherId: string;
  userId: string;
  name: string;
  email: string;
  employmentType: string;
  subjects: string[];
  allSubjects: boolean;
  grades: string[];
  teacherType: 'Main' | 'Assistant';
}): Promise<boolean> {
  const { error: userError } = await supabase
    .from('users')
    .update({ name: input.name, email: input.email?.trim() ? input.email.trim() : null })
    .eq('id', input.userId);

  if (userError) {
    console.error('Error updating teacher user:', userError);
    return false;
  }

  const effectiveSubjects = input.allSubjects ? ALL_SUBJECTS : input.subjects;
  const specializationLabel = input.allSubjects ? 'كل المواد' : (effectiveSubjects.join('، ') || '');

  const { error: teacherError } = await supabase
    .from('teachers')
    .update({
      specialization: specializationLabel,
      employment_type: input.employmentType,
      teacher_type: input.teacherType,
    })
    .eq('id', input.teacherId);

  if (teacherError) {
    console.error('Error updating teacher record:', teacherError);
    return false;
  }

  // بنمسح المواد والصفوف القديمة ونحط الجديدة بدل ما نحاول نعمل diff معقد
  await supabase.from('teacher_subjects').delete().eq('teacher_id', input.teacherId);
  await supabase.from('teacher_grades').delete().eq('teacher_id', input.teacherId);

  if (effectiveSubjects.length > 0) {
    const rows = effectiveSubjects.map(s => ({ teacher_id: input.teacherId, subject: s }));
    const { error } = await supabase.from('teacher_subjects').insert(rows);
    if (error) console.error('Error re-linking teacher to subjects:', error);
  }

  if (input.grades.length > 0) {
    const rows = input.grades.map(g => ({ teacher_id: input.teacherId, grade: g }));
    const { error } = await supabase.from('teacher_grades').insert(rows);
    if (error) console.error('Error re-linking teacher to grades:', error);
  }

  return true;
}

// بيمسح معلم بالكامل (مسح اليوزر بيمسح معاه تلقائيًا سجل المعلم ومواده وصفوفه، لأن العلاقات معمولة بـ CASCADE)
export async function deleteTeacher(userId: string): Promise<boolean> {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) {
    console.error('Error deleting teacher:', error);
    return false;
  }
  return true;
}

// بيجيب سجلات الحضور المُسجّلة فعليًا في تاريخ معيّن لفصل معيّن، منظّمة حسب الحصة (أو daily لو يومي)
export async function getAttendanceForDate(sectionId: string, date: string): Promise<Record<string, Record<string, string>>> {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('student_id, status, attendance_sessions!inner(section_id, date, period_id)')
    .eq('attendance_sessions.section_id', sectionId)
    .eq('attendance_sessions.date', date);

  if (error || !data) {
    console.error('Error fetching attendance for date:', error);
    return {};
  }

  const statusMap: Record<string, string> = { Present: 'present', Absent: 'absent', Late: 'late', Excused: 'excused' };
  const result: Record<string, Record<string, string>> = {};
  (data as any[]).forEach(row => {
    const periodKey = row.attendance_sessions.period_id || 'daily';
    if (!result[periodKey]) result[periodKey] = {};
    result[periodKey][row.student_id] = statusMap[row.status] || 'absent';
  });
  return result;
}


export async function getPeriods(sectionId: string): Promise<{ id: string; subject: string; day: string; startTime: string; endTime: string; teacherId: string | null }[]> {
  const { data, error } = await supabase
    .from('class_periods')
    .select('id, subject, day, start_time, end_time, teacher_id')
    .eq('section_id', sectionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching periods:', error);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    subject: row.subject,
    day: row.day ?? '',
    startTime: row.start_time ?? '',
    endTime: row.end_time ?? '',
    teacherId: row.teacher_id ?? null,
  }));
}

// بيتأكد إن مفيش حصة تانية لنفس الفصل بتتعارض في نفس اليوم والوقت قبل ما ننشئ حصة جديدة
function timesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && startB < endA;
}

// بينشئ حصة حقيقية جديدة لفصل معيّن (من تاب "الجدول" جوه الفصل)
// بيرجّع { id } لو نجح، أو { conflict: true, conflictSubject } لو فيه تعارض في الميعاد
export async function createPeriod(input: {
  sectionId: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  teacherId?: string | null;
}): Promise<{ id: string | null; conflict?: boolean; conflictSubject?: string }> {
  const existing = await getPeriods(input.sectionId);
  const conflicting = existing.find(p => p.day === input.day && timesOverlap(input.startTime, input.endTime, p.startTime, p.endTime));
  if (conflicting) {
    return { id: null, conflict: true, conflictSubject: conflicting.subject };
  }

  const { data, error } = await supabase
    .from('class_periods')
    .insert({
      section_id: input.sectionId,
      subject: input.subject,
      day: input.day,
      start_time: input.startTime,
      end_time: input.endTime,
      teacher_id: input.teacherId || null,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating period:', error);
    return { id: null };
  }
  return { id: data.id };
}

// بيجيب حالة حضور كل طالب في الفصل ده "النهاردة" (عبر كل الحصص) — present لو ظهر حاضر/متأخر في أي حصة النهاردة
export async function getTodayAttendanceForSection(sectionId: string): Promise<Record<string, 'present' | 'absent'>> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('attendance_records')
    .select('student_id, status, attendance_sessions!inner(section_id, date)')
    .eq('attendance_sessions.section_id', sectionId)
    .eq('attendance_sessions.date', today);

  if (error || !data) {
    console.error('Error fetching today attendance:', error);
    return {};
  }

  const result: Record<string, 'present' | 'absent'> = {};
  (data as any[]).forEach(row => {
    if (row.status === 'Present' || row.status === 'Late') {
      result[row.student_id] = 'present';
    } else if (!result[row.student_id]) {
      result[row.student_id] = 'absent';
    }
  });
  return result;
}


// إعدادات تسجيل الحضور (يومي أو حسب الحصة) — صف واحد عام للمدرسة كلها
export async function getAttendanceSettings(): Promise<{ mode: 'Daily' | 'Period'; lateThreshold: number }> {
  const { data, error } = await supabase
    .from('attendance_settings')
    .select('mode, late_threshold')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching attendance settings:', error);
    return { mode: 'Period', lateThreshold: 15 };
  }
  return { mode: data.mode, lateThreshold: data.late_threshold };
}

export async function saveAttendanceSettings(mode: 'Daily' | 'Period', lateThreshold: number): Promise<boolean> {
  const { error } = await supabase
    .from('attendance_settings')
    .upsert({ id: 1, mode, late_threshold: lateThreshold });

  if (error) {
    console.error('Error saving attendance settings:', error);
    return false;
  }
  return true;
}

// بيحفظ جلسة حضور جديدة (تاريخ اليوم + حالة كل طالب) في قاعدة البيانات
export async function saveAttendanceSession(input: {
  sectionId: string;
  date: string;
  subject?: string;
  periodId?: string | null;
  records: { studentId: string; status: string }[];
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert({
      section_id: input.sectionId,
      date: input.date,
      subject: input.subject || null,
      period_id: input.periodId || null,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating attendance session:', error);
    return null;
  }

  const sessionId = data.id;

  if (input.records.length > 0) {
    const rows = input.records.map((r) => ({
      session_id: sessionId,
      student_id: r.studentId,
      status: r.status,
      method: 'Manual',
    }));
    const { error: recError } = await supabase.from('attendance_records').insert(rows);
    if (recError) console.error('Error saving attendance records:', recError);
  }

  return sessionId;
}
export async function createClassSection(input: {
  name: string;
  gradeLevel: string;
  teacherId?: string;
  academicYear?: string;
  capacity?: number;
  studentIds: string[];
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('class_sections')
    .insert({
      name: input.name,
      grade_level: input.gradeLevel,
      teacher_id: input.teacherId || null,
      academic_year: input.academicYear || null,
      capacity: input.capacity ?? 25,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating class section:', error);
    return null;
  }

  const sectionId = data.id;

  if (input.studentIds.length > 0) {
    const rows = input.studentIds.map((studentId) => ({ student_id: studentId, section_id: sectionId }));
    const { error: enrollError } = await supabase.from('enrollments').insert(rows);
    if (enrollError) console.error('Error enrolling students:', enrollError);
  }

  return sectionId;
}

// بيعدّل بيانات فصل موجود
export async function updateClassSection(input: {
  sectionId: string;
  name: string;
  gradeLevel: string;
  teacherId?: string | null;
  academicYear?: string;
  capacity?: number;
}): Promise<boolean> {
  const { error } = await supabase
    .from('class_sections')
    .update({
      name: input.name,
      grade_level: input.gradeLevel,
      teacher_id: input.teacherId || null,
      academic_year: input.academicYear || null,
      capacity: input.capacity ?? 25,
    })
    .eq('id', input.sectionId);

  if (error) {
    console.error('Error updating class section:', error);
    return false;
  }
  return true;
}

// بيمسح فصل واحد (بيمسح معاه تلقائيًا التسجيلات والحصص وجلسات الحضور بتاعته بسبب CASCADE)
export async function deleteClassSection(sectionId: string): Promise<boolean> {
  const { error } = await supabase.from('class_sections').delete().eq('id', sectionId);
  if (error) {
    console.error('Error deleting class section:', error);
    return false;
  }
  return true;
}

// بيمسح مجموعة فصول دفعة واحدة
export async function bulkDeleteClassSections(sectionIds: string[]): Promise<boolean> {
  if (sectionIds.length === 0) return true;
  const { error } = await supabase.from('class_sections').delete().in('id', sectionIds);
  if (error) {
    console.error('Error bulk deleting class sections:', error);
    return false;
  }
  return true;
}

// بيجيب الإداريين الحقيقيين مع صلاحياتهم
export async function getAdmins(): Promise<{ id: string; userId: string; name: string; email: string; title: string; department: string; permissions: string[] }[]> {
  const { data, error } = await supabase
    .from('admins')
    .select(`
      id,
      user_id,
      title,
      department,
      users ( name, email ),
      admin_permissions ( permission )
    `);

  if (error) {
    console.error('Error fetching admins:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    name: row.users?.name ?? 'بدون اسم',
    email: row.users?.email ?? '',
    title: row.title ?? '',
    department: row.department ?? '',
    permissions: (row.admin_permissions || []).map((p: any) => p.permission),
  }));
}

// بينشئ إداري حقيقي جديد
export async function createAdmin(input: {
  name: string;
  email: string;
  password: string;
  title: string;
  department: string;
  permissions: string[];
}): Promise<string | null> {
  const { data: userRow, error: userError } = await supabase
    .from('users')
    .insert({ name: input.name, role: 'ADMIN', email: input.email?.trim() ? input.email.trim() : null, password: input.password || null })
    .select('id')
    .single();

  if (userError || !userRow) {
    console.error('Error creating admin user:', userError);
    return null;
  }

  const { data: adminRow, error: adminError } = await supabase
    .from('admins')
    .insert({ user_id: userRow.id, title: input.title, department: input.department })
    .select('id')
    .single();

  if (adminError || !adminRow) {
    console.error('Error creating admin record:', adminError);
    return null;
  }

  if (input.permissions.length > 0) {
    const rows = input.permissions.map((p) => ({ admin_id: adminRow.id, permission: p }));
    const { error } = await supabase.from('admin_permissions').insert(rows);
    if (error) console.error('Error linking admin permissions:', error);
  }

  return adminRow.id;
}

// بيعدّل بيانات إداري موجود
export async function updateAdmin(input: {
  adminId: string;
  userId: string;
  name: string;
  email: string;
  title: string;
  department: string;
  permissions: string[];
}): Promise<boolean> {
  const { error: userError } = await supabase
    .from('users')
    .update({ name: input.name, email: input.email?.trim() ? input.email.trim() : null })
    .eq('id', input.userId);
  if (userError) {
    console.error('Error updating admin user:', userError);
    return false;
  }

  const { error: adminError } = await supabase
    .from('admins')
    .update({ title: input.title, department: input.department })
    .eq('id', input.adminId);
  if (adminError) {
    console.error('Error updating admin record:', adminError);
    return false;
  }

  await supabase.from('admin_permissions').delete().eq('admin_id', input.adminId);
  if (input.permissions.length > 0) {
    const rows = input.permissions.map((p) => ({ admin_id: input.adminId, permission: p }));
    const { error } = await supabase.from('admin_permissions').insert(rows);
    if (error) console.error('Error re-linking admin permissions:', error);
  }

  return true;
}

// بيمسح إداري واحد
export async function deleteAdmin(userId: string): Promise<boolean> {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) {
    console.error('Error deleting admin:', error);
    return false;
  }
  return true;
}

// بيمسح مجموعة إداريين دفعة واحدة
export async function bulkDeleteAdmins(userIds: string[]): Promise<boolean> {
  if (userIds.length === 0) return true;
  const { error } = await supabase.from('users').delete().in('id', userIds);
  if (error) {
    console.error('Error bulk deleting admins:', error);
    return false;
  }
  return true;
}

// تسجيل دخول حقيقي: بيدوّر على مستخدم بنفس الإيميل والباسورد، وبيجيب دوره وصلاحياته لو كان إداري
export async function getUserByCredentials(email: string, password: string): Promise<{
  id: string;
  name: string;
  role: string;
  email: string;
  permissions: string[];
} | null> {
  const { data: userRow, error } = await supabase
    .from('users')
    .select('id, name, role, email, password')
    .eq('email', email)
    .eq('password', password)
    .maybeSingle();

  if (error || !userRow) {
    return null;
  }

  let permissions: string[] = [];
  if (userRow.role === 'ADMIN' || userRow.role === 'SUPER_ADMIN') {
    const { data: adminRow } = await supabase
      .from('admins')
      .select('id, admin_permissions ( permission )')
      .eq('user_id', userRow.id)
      .maybeSingle();
    if (adminRow) {
      permissions = ((adminRow as any).admin_permissions || []).map((p: any) => p.permission);
    }
  }

  return {
    id: userRow.id,
    name: userRow.name,
    role: userRow.role,
    email: userRow.email,
    permissions,
  };
}

// ================== الدرجات والتقييم (Gradebook) ==================

// بيجيب كل الفصول الدراسية (الترمات)، ولو مفيش ولا واحد بينشئ فصل افتراضي أول مرة
export async function getOrCreateDefaultTerm(): Promise<{ id: string; name: string }> {
  const { data, error } = await supabase.from('grading_terms').select('id, name').order('created_at', { ascending: true });
  if (!error && data && data.length > 0) {
    return { id: data[0].id, name: data[0].name };
  }
  const { data: newTerm, error: insertError } = await supabase
    .from('grading_terms')
    .insert({ name: 'الفصل الدراسي الأول' })
    .select('id, name')
    .single();
  if (insertError || !newTerm) {
    console.error('Error creating default term:', insertError);
    return { id: '', name: 'الفصل الدراسي الأول' };
  }
  return { id: newTerm.id, name: newTerm.name };
}

export async function getTerms(): Promise<{ id: string; name: string; startDate: string; endDate: string; status: string }[]> {
  const { data, error } = await supabase.from('grading_terms').select('id, name, start_date, end_date, status').order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching terms:', error);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    status: row.status ?? 'Active',
  }));
}

export async function createTerm(name: string, startDate: string, endDate: string): Promise<string | null> {
  const { data, error } = await supabase.from('grading_terms').insert({ name, start_date: startDate || null, end_date: endDate || null }).select('id').single();
  if (error || !data) {
    console.error('Error creating term:', error);
    return null;
  }
  return data.id;
}

// بيجيب كل إعدادات الدرجات (مادة + الصفوف المشتركة فيها + حالة الاعتماد)
export async function getGradebookConfigs(): Promise<{
  id: string;
  subjectName: string;
  passingScore: number;
  categoryWeights: Record<string, number>;
  gradingDisplayType: string;
  status: string;
  academicYear: string;
  grades: string[];
}[]> {
  const { data, error } = await supabase
    .from('gradebook_configs')
    .select('id, subject_name, passing_score, category_weights, grading_display_type, status, academic_year, gradebook_config_grades ( grade )');
  if (error) {
    console.error('Error fetching gradebook configs:', error);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    subjectName: row.subject_name,
    passingScore: row.passing_score,
    categoryWeights: row.category_weights || {},
    gradingDisplayType: row.grading_display_type || 'Points',
    status: row.status,
    academicYear: row.academic_year || '',
    grades: (row.gradebook_config_grades || []).map((g: any) => g.grade),
  }));
}

// بينشئ إعداد درجات جديد (مادة + صفوف مشتركة + أوزان الفئات)
export async function createGradebookConfig(input: {
  subjectName: string;
  grades: string[];
  passingScore: number;
  categoryWeights: Record<string, number>;
  academicYear?: string;
}): Promise<string | null> {
  const { data: configRow, error: configError } = await supabase
    .from('gradebook_configs')
    .insert({
      subject_name: input.subjectName,
      passing_score: input.passingScore,
      category_weights: input.categoryWeights,
      academic_year: input.academicYear || null,
      status: 'draft',
    })
    .select('id')
    .single();
  if (configError || !configRow) {
    console.error('Error creating gradebook config:', configError);
    return null;
  }
  if (input.grades.length > 0) {
    const rows = input.grades.map(g => ({ config_id: configRow.id, grade: g }));
    const { error } = await supabase.from('gradebook_config_grades').insert(rows);
    if (error) {
      console.error('Error linking gradebook config to grades:', error);
      // بدل ما نسيب النظام من غير صفوف مربوطة بيه (يبقى مستحيل نلاقيه بعد كده)، بنمسحه ونرجّع فشل واضح
      await supabase.from('gradebook_configs').delete().eq('id', configRow.id);
      return null;
    }
  }
  return configRow.id;
}

export async function updateGradebookConfigStatus(configId: string, status: 'draft' | 'pending' | 'approved' | 'archived'): Promise<boolean> {
  const { error } = await supabase.from('gradebook_configs').update({ status }).eq('id', configId);
  if (error) {
    console.error('Error updating gradebook config status:', error);
    return false;
  }
  return true;
}

// بيجيب التقييمات الحقيقية بتاعة إعداد درجات معيّن
export async function getAssessments(configId: string): Promise<{ id: string; title: string; category: string; maxScore: number; date: string; termId: string; weight: number }[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('id, title, category, max_score, date, term_id, weight')
    .eq('config_id', configId)
    .order('date', { ascending: true });
  if (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    maxScore: row.max_score,
    date: row.date,
    termId: row.term_id,
    weight: row.weight ?? 100,
  }));
}

export async function createAssessment(input: {
  configId: string;
  termId: string;
  title: string;
  category: string;
  maxScore: number;
  date: string;
  weight?: number;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      config_id: input.configId,
      term_id: input.termId,
      title: input.title,
      category: input.category,
      max_score: input.maxScore,
      date: input.date,
      weight: input.weight ?? 100,
    })
    .select('id')
    .single();
  if (error || !data) {
    console.error('Error creating assessment:', error);
    return null;
  }
  return data.id;
}

export async function deleteAssessment(assessmentId: string): Promise<boolean> {
  const { error } = await supabase.from('assessments').delete().eq('id', assessmentId);
  if (error) {
    console.error('Error deleting assessment:', error);
    return false;
  }
  return true;
}

// بيجيب درجات كل الطلاب في كل تقييمات إعداد درجات معيّن، منظّمة (studentId-assessmentId -> score)
export async function getGradeEntries(configId: string): Promise<{ studentId: string; assessmentId: string; score: number | null; status: string }[]> {
  const { data, error } = await supabase
    .from('grade_entries')
    .select('student_id, assessment_id, score, status, assessments!inner(config_id)')
    .eq('assessments.config_id', configId);
  if (error) {
    console.error('Error fetching grade entries:', error);
    return [];
  }
  return (data as any[]).map(row => ({
    studentId: row.student_id,
    assessmentId: row.assessment_id,
    score: row.score,
    status: row.status,
  }));
}

// بيحفظ مجموعة درجات دفعة واحدة (upsert)
export async function saveGradeEntries(entries: { studentId: string; assessmentId: string; score: number | null; status: string }[]): Promise<boolean> {
  if (entries.length === 0) return true;
  const rows = entries.map(e => ({
    student_id: e.studentId,
    assessment_id: e.assessmentId,
    score: e.score,
    status: e.status,
  }));
  const { error } = await supabase.from('grade_entries').upsert(rows, { onConflict: 'assessment_id,student_id' });
  if (error) {
    console.error('Error saving grade entries:', error);
    return false;
  }
  return true;
}


// بيضيف طالب حقيقي لفصل موجود (تسجيل حقيقي في جدول enrollments)
export async function addEnrollment(studentId: string, sectionId: string): Promise<boolean> {
  const { error } = await supabase.from('enrollments').insert({ student_id: studentId, section_id: sectionId });
  if (error) {
    console.error('Error adding enrollment:', error);
    return false;
  }
  return true;
}

// بيشيل طالب حقيقي من فصل موجود
export async function removeEnrollment(studentId: string, sectionId: string): Promise<boolean> {
  const { error } = await supabase.from('enrollments').delete().eq('student_id', studentId).eq('section_id', sectionId);
  if (error) {
    console.error('Error removing enrollment:', error);
    return false;
  }
  return true;
}

// بيعدّل بيانات نظام درجات موجود (المادة، الصفوف، درجة النجاح، أوزان الفئات)
export async function updateGradebookConfig(input: {
  configId: string;
  subjectName: string;
  grades: string[];
  passingScore: number;
  categoryWeights: Record<string, number>;
}): Promise<boolean> {
  const { error: configError } = await supabase
    .from('gradebook_configs')
    .update({
      subject_name: input.subjectName,
      passing_score: input.passingScore,
      category_weights: input.categoryWeights,
    })
    .eq('id', input.configId);
  if (configError) {
    console.error('Error updating gradebook config:', configError);
    return false;
  }

  await supabase.from('gradebook_config_grades').delete().eq('config_id', input.configId);
  if (input.grades.length > 0) {
    const rows = input.grades.map(g => ({ config_id: input.configId, grade: g }));
    const { error } = await supabase.from('gradebook_config_grades').insert(rows);
    if (error) {
      console.error('Error re-linking gradebook config grades:', error);
      return false;
    }
  }
  return true;
}

// بيجيب مواد المنهج الدراسي الحقيقية لصف معيّن (المصدر الصح لقايمة المواد، مش سجلات الدرجات)
export async function getCurriculumSubjects(grade: string): Promise<string[]> {
  const { data, error } = await supabase.from('curriculum_subjects').select('subject').eq('grade', grade);
  if (error) {
    console.error('Error fetching curriculum subjects:', error);
    return [];
  }
  return (data || []).map((row: any) => row.subject);
}

// ================== المنهج الدراسي (Curriculum) ==================

// بيجيب كل مواد صف معيّن مع تفاصيلها
export async function getCurriculumSubjectsDetailed(grade: string): Promise<{ subject: string; code: string; nameEn: string; department: string }[]> {
  const { data, error } = await supabase.from('curriculum_subjects').select('subject, code, name_en, department').eq('grade', grade);
  if (error) {
    console.error('Error fetching curriculum subjects:', error);
    return [];
  }
  return (data || []).map((row: any) => ({
    subject: row.subject,
    code: row.code || '',
    nameEn: row.name_en || '',
    department: row.department || '',
  }));
}

// بيضيف مادة جديدة لمنهج صف معيّن
export async function addCurriculumSubject(input: { grade: string; subject: string; code?: string; nameEn?: string; department?: string }): Promise<boolean> {
  const { error } = await supabase.from('curriculum_subjects').insert({
    grade: input.grade,
    subject: input.subject,
    code: input.code || null,
    name_en: input.nameEn || null,
    department: input.department || null,
  });
  if (error) {
    console.error('Error adding curriculum subject:', error);
    return false;
  }
  return true;
}

// بيمسح مادة من منهج صف معيّن
export async function removeCurriculumSubject(grade: string, subject: string): Promise<boolean> {
  const { error } = await supabase.from('curriculum_subjects').delete().eq('grade', grade).eq('subject', subject);
  if (error) {
    console.error('Error removing curriculum subject:', error);
    return false;
  }
  return true;
}

// بيجيب الخطة الأسبوعية الحقيقية لمادة في صف معيّن
export async function getCurriculumWeeks(grade: string, subject: string): Promise<{ id: string; weekNumber: number; startDate: string; endDate: string; topics: string[] }[]> {
  const { data, error } = await supabase
    .from('curriculum_weeks')
    .select('id, week_number, start_date, end_date, topics')
    .eq('grade', grade)
    .eq('subject', subject)
    .order('week_number', { ascending: true });
  if (error) {
    console.error('Error fetching curriculum weeks:', error);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    weekNumber: row.week_number,
    startDate: row.start_date || '',
    endDate: row.end_date || '',
    topics: row.topics || [],
  }));
}

// بيحفظ (ينشئ أو يعدّل) أسبوع كامل بمواضيعه
export async function saveCurriculumWeek(input: { grade: string; subject: string; weekNumber: number; startDate: string; endDate: string; topics: string[] }): Promise<boolean> {
  const { error } = await supabase.from('curriculum_weeks').upsert({
    grade: input.grade,
    subject: input.subject,
    week_number: input.weekNumber,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    topics: input.topics,
  }, { onConflict: 'grade,subject,week_number' });
  if (error) {
    console.error('Error saving curriculum week:', error);
    return false;
  }
  return true;
}

export async function deleteCurriculumWeek(weekId: string): Promise<boolean> {
  const { error } = await supabase.from('curriculum_weeks').delete().eq('id', weekId);
  if (error) {
    console.error('Error deleting curriculum week:', error);
    return false;
  }
  return true;
}

// بيجيب موارد مادة معيّنة (وفلاتر اختياري بالمجلد)
export async function getCurriculumResources(grade: string, subject: string): Promise<{ id: string; title: string; type: string; url: string; folderId: string | null }[]> {
  const { data, error } = await supabase
    .from('curriculum_resources')
    .select('id, title, type, url, folder_id')
    .eq('grade', grade)
    .eq('subject', subject)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching curriculum resources:', error);
    return [];
  }
  return (data || []).map((row: any) => ({ id: row.id, title: row.title, type: row.type, url: row.url, folderId: row.folder_id }));
}

export async function addCurriculumResource(input: { grade: string; subject: string; title: string; type: string; url: string; folderId?: string | null }): Promise<string | null> {
  const { data, error } = await supabase
    .from('curriculum_resources')
    .insert({ grade: input.grade, subject: input.subject, title: input.title, type: input.type, url: input.url, folder_id: input.folderId || null })
    .select('id')
    .single();
  if (error || !data) {
    console.error('Error adding curriculum resource:', error);
    return null;
  }
  return data.id;
}

export async function updateCurriculumResource(resourceId: string, input: { title: string; type: string; url: string }): Promise<boolean> {
  const { error } = await supabase.from('curriculum_resources').update({ title: input.title, type: input.type, url: input.url }).eq('id', resourceId);
  if (error) {
    console.error('Error updating curriculum resource:', error);
    return false;
  }
  return true;
}

export async function deleteCurriculumResource(resourceId: string): Promise<boolean> {
  const { error } = await supabase.from('curriculum_resources').delete().eq('id', resourceId);
  if (error) {
    console.error('Error deleting curriculum resource:', error);
    return false;
  }
  return true;
}

// مجلدات مكتبة الموارد
export async function getCurriculumFolders(grade: string, subject: string): Promise<{ id: string; name: string; parentFolderId: string | null }[]> {
  const { data, error } = await supabase.from('curriculum_folders').select('id, name, parent_folder_id').eq('grade', grade).eq('subject', subject);
  if (error) {
    console.error('Error fetching curriculum folders:', error);
    return [];
  }
  return (data || []).map((row: any) => ({ id: row.id, name: row.name, parentFolderId: row.parent_folder_id }));
}

export async function createCurriculumFolder(input: { grade: string; subject: string; name: string; parentFolderId?: string | null }): Promise<string | null> {
  const { data, error } = await supabase
    .from('curriculum_folders')
    .insert({ grade: input.grade, subject: input.subject, name: input.name, parent_folder_id: input.parentFolderId || null })
    .select('id')
    .single();
  if (error || !data) {
    console.error('Error creating curriculum folder:', error);
    return null;
  }
  return data.id;
}

export async function renameCurriculumFolder(folderId: string, name: string): Promise<boolean> {
  const { error } = await supabase.from('curriculum_folders').update({ name }).eq('id', folderId);
  if (error) {
    console.error('Error renaming curriculum folder:', error);
    return false;
  }
  return true;
}

export async function deleteCurriculumFolder(folderId: string): Promise<boolean> {
  const { error } = await supabase.from('curriculum_folders').delete().eq('id', folderId);
  if (error) {
    console.error('Error deleting curriculum folder:', error);
    return false;
  }
  return true;
}

// خطط الدروس
export async function getCurriculumLessonPlans(grade: string, subject: string): Promise<{ id: string; title: string; content: string; weekNumber: number | null }[]> {
  const { data, error } = await supabase
    .from('curriculum_lesson_plans')
    .select('id, title, content, week_number')
    .eq('grade', grade)
    .eq('subject', subject)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching lesson plans:', error);
    return [];
  }
  return (data || []).map((row: any) => ({ id: row.id, title: row.title, content: row.content || '', weekNumber: row.week_number }));
}

export async function getAllCurriculumLessonPlans(): Promise<{ id: string; title: string; content: string; grade: string; subject: string; createdAt: string }[]> {
  const { data, error } = await supabase
    .from('curriculum_lesson_plans')
    .select('id, title, content, grade, subject, created_at')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching all lesson plans:', error);
    return [];
  }
  return (data || []).map((row: any) => ({ id: row.id, title: row.title, content: row.content || '', grade: row.grade, subject: row.subject, createdAt: row.created_at }));
}

export async function createCurriculumLessonPlan(input: { grade: string; subject: string; title: string; content: string; weekNumber?: number | null }): Promise<string | null> {
  const { data, error } = await supabase
    .from('curriculum_lesson_plans')
    .insert({ grade: input.grade, subject: input.subject, title: input.title, content: input.content, week_number: input.weekNumber ?? null })
    .select('id')
    .single();
  if (error || !data) {
    console.error('Error creating lesson plan:', error);
    return null;
  }
  return data.id;
}

export async function deleteCurriculumLessonPlan(planId: string): Promise<boolean> {
  const { error } = await supabase.from('curriculum_lesson_plans').delete().eq('id', planId);
  if (error) {
    console.error('Error deleting lesson plan:', error);
    return false;
  }
  return true;
}

// إعداد النظام التعليمي والعام الدراسي (إعداد واحد عام)
export async function getAcademicYearSettings(): Promise<{ system: string; startDate: string; endDate: string; academicYear: string } | null> {
  const { data, error } = await supabase.from('academic_year_settings').select('system, start_date, end_date, academic_year').eq('id', 1).maybeSingle();
  if (error || !data || !data.system) {
    return null;
  }
  return { system: data.system, startDate: data.start_date, endDate: data.end_date, academicYear: data.academic_year || '' };
}

export async function saveAcademicYearSettings(system: string, startDate: string, endDate: string, academicYear: string): Promise<boolean> {
  const { data: existing } = await supabase.from('academic_year_settings').select('system, start_date, end_date, academic_year').eq('id', 1).maybeSingle();
  const merged = {
    id: 1,
    system: system || existing?.system || null,
    start_date: startDate || existing?.start_date || null,
    end_date: endDate || existing?.end_date || null,
    academic_year: academicYear || existing?.academic_year || null,
  };
  const { error } = await supabase.from('academic_year_settings').upsert(merged);
  if (error) {
    console.error('Error saving academic year settings:', error);
    return false;
  }
  return true;
}

// بيحفظ النظام التعليمي بس (بدون التأثير على تواريخ العام الدراسي، اللي بتتحدد من الإعدادات)
export async function saveEducationSystem(system: string): Promise<boolean> {
  return saveAcademicYearSettings(system, '', '', '');
}

// نواتج التعلم لمادة معيّنة في صف معيّن
export async function getLearningOutcomes(grade: string, subject: string): Promise<{ id: string; outcome: string }[]> {
  const { data, error } = await supabase.from('curriculum_learning_outcomes').select('id, outcome').eq('grade', grade).eq('subject', subject).order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching learning outcomes:', error);
    return [];
  }
  return data || [];
}

export async function addLearningOutcome(grade: string, subject: string, outcome: string): Promise<string | null> {
  const { data, error } = await supabase.from('curriculum_learning_outcomes').insert({ grade, subject, outcome }).select('id').single();
  if (error || !data) {
    console.error('Error adding learning outcome:', error);
    return null;
  }
  return data.id;
}
