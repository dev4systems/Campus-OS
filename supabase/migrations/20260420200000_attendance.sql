-- supabase/migrations/20260420200000_attendance.sql

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS public.attendance CASCADE;

CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id, date)
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses select policy" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Courses insert policy" ON public.courses FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Courses update policy" ON public.courses FOR UPDATE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Courses delete policy" ON public.courses FOR DELETE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Attendance select policy" ON public.attendance FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR faculty_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Attendance insert policy" ON public.attendance FOR INSERT TO authenticated WITH CHECK (
  faculty_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Attendance update policy" ON public.attendance FOR UPDATE TO authenticated USING (
  (faculty_id = auth.uid() AND created_at > NOW() - INTERVAL '24 hours') OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Attendance delete policy" ON public.attendance FOR DELETE TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
