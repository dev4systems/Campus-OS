import { supabase } from "@/integrations/supabase/client";
import { Attendance, Course } from "@/types";

export async function fetchStudentAttendance(studentId: string): Promise<Attendance[]> {
  const { data, error } = await (supabase as any)
    .from("attendance")
    .select("*, courses(*)")
    .eq("student_id", studentId)
    .order("date", { ascending: false });
  
  if (error) throw new Error(error.message);
  return data as Attendance[];
}

export async function fetchFacultyCourses(_facultyId: string): Promise<Course[]> {
  // In a real app, there'd be a course_faculty mapping table.
  // Assuming we just fetch all courses for now, or assume all courses are available to all faculty in demo
  const { data, error } = await (supabase as any)
    .from("courses")
    .select("*");
  
  if (error) throw new Error(error.message);
  return data as Course[];
}

export async function fetchCourseStudents(_courseId: string) {
  // Demo function: In reality we query enrollments joined with profiles.
  const { data, error } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("role", "student");
    
  if (error) throw new Error(error.message);
  return data; // returning all students for the demo course
}

export async function fetchAttendanceForDate(courseId: string, date: string): Promise<Attendance[]> {
  const { data, error } = await (supabase as any)
    .from("attendance")
    .select("*")
    .eq("course_id", courseId)
    .eq("date", date);
    
  if (error) throw new Error(error.message);
  return data as Attendance[];
}

export async function markAttendance(records: Partial<Attendance>[]): Promise<void> {
  const { error } = await (supabase as any)
    .from("attendance")
    .upsert(records, { onConflict: 'student_id,course_id,date' });
    
  if (error) throw new Error(error.message);
}
