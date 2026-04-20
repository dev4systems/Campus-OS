-- supabase/migrations/20260420300000_timetable.sql

CREATE TABLE IF NOT EXISTS public.timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL,
  semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
  section TEXT NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('MON','TUE','WED','THU','FRI','SAT')),
  slot_number INTEGER NOT NULL CHECK (slot_number BETWEEN 1 AND 8),
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  faculty_id UUID REFERENCES auth.users(id),
  room TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department, semester, section, day_of_week, slot_number)
);

ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Timetable slots select policy" ON public.timetable_slots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Timetable slots insert policy" ON public.timetable_slots FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Timetable slots update policy" ON public.timetable_slots FOR UPDATE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Timetable slots delete policy" ON public.timetable_slots FOR DELETE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
