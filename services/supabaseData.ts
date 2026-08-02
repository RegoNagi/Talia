import { supabase } from '../lib/supabaseClient';
import { Student, ClassSection, Teacher } from '../types';

// بيجيب الطلاب الحقيقيين من قاعدة البيانات (Supabase) بدل الـ mock data.
// بعض الحقول (fees, reportCards, transcript, attendance, performance) لسه
// مش لها جداول في قاعدة البيانات، فبنحطلها قيم افتراضية فارغة مؤقتًا
// لحد ما نبني موديول الحضور والدرجات والمصروفات.
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

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.users?.name ?? 'بدون اسم',
    grade: row.grade ?? '',
    attendance: 0,
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
export async function getTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select(`
      id,
      specialization,
      employment_type,
      users ( name, email )
    `);

  if (error) {
    console.error('Error fetching teachers from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
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
  }));
}

// بيجيب الحصص الحقيقية المُنشأة لفصل معيّن
export async function getPeriods(sectionId: string): Promise<{ id: string; subject: string; day: string; startTime: string; endTime: string }[]> {
  const { data, error } = await supabase
    .from('class_periods')
    .select('id, subject, day, start_time, end_time')
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
  }));
}

// بينشئ حصة حقيقية جديدة لفصل معيّن (من تاب "الجدول" جوه الفصل)
export async function createPeriod(input: {
  sectionId: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('class_periods')
    .insert({
      section_id: input.sectionId,
      subject: input.subject,
      day: input.day,
      start_time: input.startTime,
      end_time: input.endTime,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating period:', error);
    return null;
  }
  return data.id;
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
