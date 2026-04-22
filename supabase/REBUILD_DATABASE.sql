-- Run this to completely reset the Nexus database. Use only for development.

-- 1. Drop everything
DROP VIEW IF EXISTS public.analytics_dau CASCADE;
DROP VIEW IF EXISTS public.analytics_feature_usage CASCADE;
DROP VIEW IF EXISTS public.analytics_attendance_health CASCADE;
DROP VIEW IF EXISTS public.analytics_placement_funnel CASCADE;

DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.bug_reports CASCADE;
DROP TABLE IF EXISTS public.fees CASCADE;
DROP TABLE IF EXISTS public.placement_rounds CASCADE;
DROP TABLE IF EXISTS public.placement_drives CASCADE;
DROP TABLE IF EXISTS public.collaboration_requests CASCADE;
DROP TABLE IF EXISTS public.research_projects CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.attendance_records CASCADE;
DROP TABLE IF EXISTS public.timetable_slots CASCADE;
DROP TABLE IF EXISTS public.timetable_templates CASCADE;
DROP TABLE IF EXISTS public.professors CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.page_views CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;

-- 2. Recreate Tables in order

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  portal TEXT NOT NULL DEFAULT 'student',
  department TEXT DEFAULT '',
  semester INTEGER DEFAULT 1,
  roll_no TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  cgpa NUMERIC(4,2),
  enrollment_year INTEGER,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin', 'placement_officer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Professors
CREATE TABLE public.professors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  designation_short TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  joined INTEGER,
  initials TEXT,
  color TEXT,
  research TEXT[],
  subjects TEXT[],
  lab TEXT,
  profile_url TEXT
);

ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;

-- Timetable Templates (Placeholder for future feature)
CREATE TABLE public.timetable_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.timetable_templates ENABLE ROW LEVEL SECURITY;

-- Timetable Slots
CREATE TABLE public.timetable_slots (
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

-- Attendance Records
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  faculty_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_name, date)
);

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Research Projects
CREATE TABLE public.research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id TEXT REFERENCES public.professors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'seeking_students')) DEFAULT 'seeking_students',
  domain_tags TEXT[] DEFAULT '{}',
  max_students INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;

-- Collaboration Requests
CREATE TABLE public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, project_id)
);

ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Placement Drives
CREATE TABLE public.placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  role TEXT NOT NULL,
  package_min NUMERIC,
  package_max NUMERIC,
  eligible_branches TEXT[] DEFAULT '{}',
  minimum_cgpa NUMERIC DEFAULT 6.0,
  year INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming','active','completed')) DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;

-- Placement Rounds
CREATE TABLE public.placement_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID REFERENCES public.placement_drives(id) ON DELETE CASCADE,
  round_name TEXT NOT NULL,
  round_date DATE,
  status TEXT NOT NULL CHECK (status IN ('scheduled','ongoing','completed','cancelled')) DEFAULT 'scheduled',
  selected_count INTEGER,
  notes TEXT,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.placement_rounds ENABLE ROW LEVEL SECURITY;

-- Bug Reports
CREATE TABLE public.bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id),
  title TEXT,
  page_section TEXT,
  description TEXT NOT NULL,
  severity TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- Fees
CREATE TABLE public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fee_type TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  txn_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_role TEXT CHECK (target_role IN ('student', 'faculty', 'admin', 'all')) DEFAULT 'all',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Page Views
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  path TEXT NOT NULL,
  feature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 3. Trigger and Functions

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'admin' THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_role_protection
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- 4. Policies

-- Profiles
CREATE POLICY "Profiles select policy" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR role = 'admin');
CREATE POLICY "Profiles update policy" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Profiles delete policy" ON public.profiles FOR DELETE TO authenticated USING (role = 'admin');

-- Events
CREATE POLICY "Events select policy" ON public.events FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Events insert policy" ON public.events FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'faculty'));
CREATE POLICY "Events update policy" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = created_by OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Events delete policy" ON public.events FOR DELETE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Professors
CREATE POLICY "Professors select policy" ON public.professors FOR SELECT TO authenticated USING (TRUE);

-- Timetable Templates
CREATE POLICY "Timetable templates select policy" ON public.timetable_templates FOR SELECT TO authenticated USING (TRUE);

-- Timetable Slots
CREATE POLICY "Timetable slots select policy" ON public.timetable_slots FOR SELECT TO authenticated USING (TRUE);

-- Attendance Records
CREATE POLICY "Attendance select policy" ON public.attendance_records FOR SELECT TO authenticated USING (student_id = auth.uid() OR faculty_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Research Projects
CREATE POLICY "Research projects select policy" ON public.research_projects FOR SELECT TO authenticated USING (TRUE);

-- Collaboration Requests
CREATE POLICY "Collaboration requests select policy" ON public.collaboration_requests FOR SELECT TO authenticated USING (student_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR (SELECT email FROM public.profiles WHERE id = auth.uid()) = (SELECT email FROM public.professors WHERE id = (SELECT professor_id FROM public.research_projects WHERE id = project_id)));

-- Placement Drives
CREATE POLICY "Placement drives select policy" ON public.placement_drives FOR SELECT TO authenticated USING (TRUE);

-- Placement Rounds
CREATE POLICY "Placement rounds select policy" ON public.placement_rounds FOR SELECT TO authenticated USING (TRUE);

-- Bug Reports
CREATE POLICY "Bug reports select policy" ON public.bug_reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Bug reports insert policy" ON public.bug_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- Fees
CREATE POLICY "Fees select policy" ON public.fees FOR SELECT TO authenticated USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Notifications
CREATE POLICY "Notifications select policy" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Notifications update policy" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Notifications delete policy" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Announcements
CREATE POLICY "Announcements select policy" ON public.announcements FOR SELECT TO authenticated USING (target_role = 'all' OR target_role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Announcements insert policy" ON public.announcements FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Page Views
CREATE POLICY "Page views select policy" ON public.page_views FOR SELECT TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Page views insert policy" ON public.page_views FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
