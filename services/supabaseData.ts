import { supabase } from '../lib/supabaseClient';
import { Student } from '../types';

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
