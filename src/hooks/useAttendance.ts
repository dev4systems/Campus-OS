import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStudentAttendance, fetchFacultyCourses, fetchCourseStudents, fetchAttendanceForDate, markAttendance } from "@/services/attendance.service";
import { Attendance } from "@/types";

export function useStudentAttendance(studentId?: string) {
  return useQuery({
    queryKey: ["attendance", "student", studentId],
    queryFn: () => fetchStudentAttendance(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFacultyCourses(facultyId?: string) {
  return useQuery({
    queryKey: ["courses", "faculty", facultyId],
    queryFn: () => fetchFacultyCourses(facultyId!),
    enabled: !!facultyId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCourseStudents(courseId?: string) {
  return useQuery({
    queryKey: ["students", "course", courseId],
    queryFn: () => fetchCourseStudents(courseId!),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAttendanceForDate(courseId?: string, date?: string) {
  return useQuery({
    queryKey: ["attendance", "course", courseId, date],
    queryFn: () => fetchAttendanceForDate(courseId!, date!),
    enabled: !!(courseId && date),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (records: Partial<Attendance>[]) => markAttendance(records),
    onSuccess: (_, variables) => {
      // Optimistic cache invalidation
      if (variables.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["attendance", "course", variables[0].course_id, variables[0].date] });
        queryClient.invalidateQueries({ queryKey: ["attendance", "student"] });
      }
    },
  });
}
