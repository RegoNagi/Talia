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

// بينشئ فصل دراسي جديد في قاعدة البيانات، وبيسجّل الطلاب المختارين فيه
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
