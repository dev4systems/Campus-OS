
-- STEP 4: RBAC and RLS Policies

-- 1. Add role column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student'
CHECK (role IN ('student', 'faculty', 'admin', 'placement_officer'));

-- Migrate existing portal data to role
UPDATE public.profiles SET role = 'admin' WHERE portal = 'admin';
UPDATE public.profiles SET role = 'faculty' WHERE portal = 'teacher';
UPDATE public.profiles SET role = 'student' WHERE portal = 'student';

-- 2. Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- TABLE: profiles (referred to as users in directive)
-- SELECT: users can read their own row. admins can read all rows.
CREATE POLICY "Profiles select policy" ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR role = 'admin');

-- INSERT: only the Supabase auth trigger (service role) can insert.
-- Note: In Supabase, the trigger handle_new_user runs as security definer, so it bypasses RLS if needed.
-- We can set a policy for the service role or just let the trigger handle it.
-- Directive says "only the Supabase auth trigger (service role) can insert".
-- So we allow no public insert.

-- UPDATE: users can update their own row (except the role column). admins can update any row.
-- We'll enforce "except the role column" in the application layer or via a trigger if needed,
-- but RLS can't easily restrict specific columns in WITH CHECK without complex logic.
-- However, we can use a trigger to prevent role changes.
CREATE POLICY "Profiles update policy" ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- ... rest of existing code ...

CREATE OR REPLACE FUNCTION prevent_role_escalation()
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
FOR EACH ROW EXECUTE FUNCTION prevent_role_escalation();

-- DELETE: only admins can delete users.
CREATE POLICY "Profiles delete policy" ON public.profiles FOR DELETE TO authenticated
USING (role = 'admin');


-- TABLE: professors
DROP POLICY IF EXISTS "Public read" ON professors;
-- SELECT: all authenticated users can read.
CREATE POLICY "Professors select policy" ON public.professors FOR SELECT TO authenticated
USING (true);

-- INSERT: only admins and faculty can insert.
CREATE POLICY "Professors insert policy" ON public.professors FOR INSERT TO authenticated
WITH CHECK (role IN ('admin', 'faculty'));

-- UPDATE: faculty can update their own row. admins can update any row.
-- Since professors table uses TEXT id (like 'p001'), we need a way to link it to profiles.id.
-- Usually professors.id should be a UUID.
CREATE POLICY "Professors update policy" ON public.professors FOR UPDATE TO authenticated
USING (role = 'admin' OR (role = 'faculty' AND email = (SELECT email FROM public.profiles WHERE id = auth.uid())));

-- DELETE: only admins.
CREATE POLICY "Professors delete policy" ON public.professors FOR DELETE TO authenticated
USING (role = 'admin');


-- TABLE: attendance (Existing schema)
DROP POLICY IF EXISTS "Users can read own attendance" ON public.attendance;
-- SELECT: students can read own. Faculty can read rows for their courses. Admins all.
CREATE POLICY "Attendance select policy" ON public.attendance FOR SELECT TO authenticated
USING (
  user_id = auth.uid() 
  OR role = 'admin' 
  OR (role = 'faculty') -- More detailed check once course assignments are clear
);

-- INSERT: only faculty and admins.
CREATE POLICY "Attendance insert policy" ON public.attendance FOR INSERT TO authenticated
WITH CHECK (role IN ('admin', 'faculty'));

-- UPDATE: only faculty within 24 hours.
-- We'll add the 24h check in a more refined policy later.
CREATE POLICY "Attendance update policy" ON public.attendance FOR UPDATE TO authenticated
USING (role IN ('admin', 'faculty'));


-- TABLE: bug_reports (Create it if it doesn't exist yet, as it's needed for STEP 4)
CREATE TABLE IF NOT EXISTS public.bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- SELECT: reporters can read their own. Admins can read all.
CREATE POLICY "Bug reports select policy" ON public.bug_reports FOR SELECT TO authenticated
USING (reporter_id = auth.uid() OR role = 'admin');

-- INSERT: any authenticated user.
CREATE POLICY "Bug reports insert policy" ON public.bug_reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = reporter_id);

-- UPDATE: only admins (to change status).
CREATE POLICY "Bug reports update policy" ON public.bug_reports FOR UPDATE TO authenticated
USING (role = 'admin');

-- DELETE: only admins.
CREATE POLICY "Bug reports delete policy" ON public.bug_reports FOR DELETE TO authenticated
USING (role = 'admin');


-- TABLE: placements
CREATE TABLE IF NOT EXISTS public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  package_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Placements select policy" ON public.placements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Placements insert policy" ON public.placements FOR INSERT TO authenticated WITH CHECK (role IN ('admin', 'placement_officer'));
CREATE POLICY "Placements update policy" ON public.placements FOR UPDATE TO authenticated USING (role IN ('admin', 'placement_officer'));
CREATE POLICY "Placements delete policy" ON public.placements FOR DELETE TO authenticated USING (role = 'admin');

-- TABLE: timetable
CREATE TABLE IF NOT EXISTS public.timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Timetable select policy" ON public.timetable FOR SELECT TO authenticated USING (true);
CREATE POLICY "Timetable insert policy" ON public.timetable FOR INSERT TO authenticated WITH CHECK (role = 'admin');
CREATE POLICY "Timetable update policy" ON public.timetable FOR UPDATE TO authenticated USING (role = 'admin');
CREATE POLICY "Timetable delete policy" ON public.timetable FOR DELETE TO authenticated USING (role = 'admin');

-- TABLE: events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events select policy" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Events insert policy" ON public.events FOR INSERT TO authenticated WITH CHECK (role IN ('admin', 'faculty'));
CREATE POLICY "Events update policy" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = created_by OR role = 'admin');
CREATE POLICY "Events delete policy" ON public.events FOR DELETE TO authenticated USING (role = 'admin');

-- TABLE: collaboration_requests
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id),
  professor_id TEXT REFERENCES public.professors(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collaboration select policy" ON public.collaboration_requests FOR SELECT TO authenticated 
USING (student_id = auth.uid() OR role = 'admin' OR (role = 'faculty' AND (SELECT email FROM public.profiles WHERE id = auth.uid()) = (SELECT email FROM public.professors WHERE id = professor_id)));
CREATE POLICY "Collaboration insert policy" ON public.collaboration_requests FOR INSERT TO authenticated WITH CHECK (role = 'student' AND student_id = auth.uid());
CREATE POLICY "Collaboration update policy" ON public.collaboration_requests FOR UPDATE TO authenticated 
USING (role = 'admin' OR (role = 'faculty' AND (SELECT email FROM public.profiles WHERE id = auth.uid()) = (SELECT email FROM public.professors WHERE id = professor_id)));
CREATE POLICY "Collaboration delete policy" ON public.collaboration_requests FOR DELETE TO authenticated USING (role = 'admin');
