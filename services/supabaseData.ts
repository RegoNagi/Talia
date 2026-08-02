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

export async function getStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
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
