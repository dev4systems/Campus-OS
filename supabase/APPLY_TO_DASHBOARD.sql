-- ============================================================================
-- NEXUS CAMPUS PORTAL - CONSOLIDATED DATABASE MIGRATION GUIDE
-- ============================================================================
-- This script contains all schema definitions, RLS policies, and functions
-- required to set up the Nexus database on Supabase.
-- Paste this into the Supabase SQL Editor (dashboard.supabase.com).

-- ----------------------------------------------------------------------------
-- 1. CORE IDENTITY & RBAC (from 20260326195954_cf735215...)
-- ----------------------------------------------------------------------------

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  portal TEXT NOT NULL DEFAULT 'student' CHECK (portal IN ('student', 'teacher', 'admin')),
  department TEXT DEFAULT '',
  semester INTEGER DEFAULT 1,
  roll_no TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  cgpa numeric(4,2),
  enrollment_year integer,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin', 'placement_officer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user roles enum and table
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, portal, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'portal', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'portal', 'student')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Role Escalation Protection
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

DROP TRIGGER IF EXISTS enforce_role_protection ON public.profiles;
CREATE TRIGGER enforce_role_protection
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION prevent_role_escalation();

-- RBAC Policies
CREATE POLICY "Profiles select policy" ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Profiles update policy" ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Profiles delete policy" ON public.profiles FOR DELETE TO authenticated
USING (role = 'admin');

-- ----------------------------------------------------------------------------
-- 2. ACADEMIC DATA (from 20260401014858_34b47342... & 20260403095711...)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.professors (
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
CREATE POLICY "Professors select policy" ON public.professors FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  credits integer NOT NULL DEFAULT 3,
  professor text NOT NULL DEFAULT '',
  office text DEFAULT '',
  semester integer NOT NULL,
  department text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read subjects" ON public.subjects FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses select policy" ON public.courses FOR SELECT TO authenticated USING (true);

-- ----------------------------------------------------------------------------
-- 3. STUDENT RECORDS (Attendance, Grades, Enrollments, Fees)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  semester integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Attendance select policy" ON public.attendance FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR faculty_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE TABLE IF NOT EXISTS public.grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  semester integer NOT NULL,
  grade text NOT NULL DEFAULT '',
  score numeric(5,2) DEFAULT 0,
  max_score numeric(5,2) DEFAULT 100,
  class_avg numeric(5,2) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id)
);

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own grades" ON public.grades FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fee_type text NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  paid numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  due_date date NOT NULL,
  txn_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own fees" ON public.fees FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 4. CAMPUS OPERATIONS (Timetable, Research, Placements, Bug Reports)
-- ----------------------------------------------------------------------------

-- Timetable
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

-- Research
CREATE TABLE IF NOT EXISTS public.research_projects (
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
CREATE POLICY "Research projects select policy" ON public.research_projects FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, project_id)
);

ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collaboration requests select policy" ON public.collaboration_requests FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR 
  (SELECT email FROM public.profiles WHERE id = auth.uid()) = (SELECT email FROM public.professors WHERE id = (SELECT professor_id FROM public.research_projects WHERE id = project_id)) OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Placements
CREATE TABLE IF NOT EXISTS public.placement_drives (
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
CREATE POLICY "Placement drives select policy" ON public.placement_drives FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.placement_rounds (
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
CREATE POLICY "Placement rounds select policy" ON public.placement_rounds FOR SELECT TO authenticated USING (true);

-- Bug Reports
CREATE TABLE IF NOT EXISTS public.bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bug reports select policy" ON public.bug_reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR role = 'admin');

-- ----------------------------------------------------------------------------
-- 5. ANALYTICS & MONITORING (from 20260420600000_analytics.sql)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  path TEXT NOT NULL,
  feature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read all page views" ON public.page_views FOR SELECT TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Analytics Views
CREATE OR REPLACE VIEW public.analytics_dau AS
SELECT date_trunc('day', created_at)::date as day, count(distinct user_id) as count
FROM public.page_views WHERE created_at > now() - interval '30 days' GROUP BY 1 ORDER BY 1;

CREATE OR REPLACE VIEW public.analytics_feature_usage AS
SELECT feature, date_trunc('week', created_at)::date as week, count(*) as count
FROM public.page_views WHERE feature IS NOT NULL GROUP BY 1, 2 ORDER BY 2, 3 DESC;

CREATE OR REPLACE VIEW public.analytics_attendance_health AS
WITH student_stats AS (
  SELECT student_id, count(*) filter (where status = 'present') * 1.0 / count(*) as attendance_rate
  FROM public.attendance GROUP BY student_id
)
SELECT
  CASE WHEN attendance_rate >= 0.75 THEN 'Safe (>=75%)' WHEN attendance_rate >= 0.60 THEN 'Warning (60-74%)' ELSE 'Critical (<60%)' END as health_status,
  count(*) as student_count
FROM student_stats GROUP BY 1;

CREATE OR REPLACE VIEW public.analytics_placement_funnel AS
SELECT round_name, sum(selected_count) as count, min(sequence_order) as seq
FROM public.placement_rounds WHERE status = 'completed' GROUP BY 1 ORDER BY 3;
- -   N o t i f i c a t i o n s   a n d   A n n o u n c e m e n t s   S c h e m a  
  
 - -   1 .   A n n o u n c e m e n t s   T a b l e  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   p u b l i c . a n n o u n c e m e n t s   (  
     i d   U U I D   P R I M A R Y   K E Y   D E F A U L T   g e n _ r a n d o m _ u u i d ( ) ,  
     t i t l e   T E X T   N O T   N U L L ,  
     c o n t e n t   T E X T   N O T   N U L L ,  
     t a r g e t _ r o l e   T E X T   C H E C K   ( t a r g e t _ r o l e   I N   ( ' s t u d e n t ' ,   ' f a c u l t y ' ,   ' a d m i n ' ,   ' a l l ' ) )   D E F A U L T   ' a l l ' ,  
     c r e a t e d _ b y   U U I D   R E F E R E N C E S   a u t h . u s e r s ( i d )   O N   D E L E T E   S E T   N U L L ,  
     c r e a t e d _ a t   T I M E S T A M P T Z   D E F A U L T   N O W ( ) ,  
     u p d a t e d _ a t   T I M E S T A M P T Z   D E F A U L T   N O W ( )  
 ) ;  
  
 A L T E R   T A B L E   p u b l i c . a n n o u n c e m e n t s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
  
 C R E A T E   P O L I C Y   " A n n o u n c e m e n t s   s e l e c t   p o l i c y "   O N   p u b l i c . a n n o u n c e m e n t s  
 F O R   S E L E C T   T O   a u t h e n t i c a t e d   U S I N G   (  
     t a r g e t _ r o l e   =   ' a l l '   O R    
     t a r g e t _ r o l e   =   ( S E L E C T   r o l e   F R O M   p u b l i c . p r o f i l e s   W H E R E   i d   =   a u t h . u i d ( ) )   O R  
     ( S E L E C T   r o l e   F R O M   p u b l i c . p r o f i l e s   W H E R E   i d   =   a u t h . u i d ( ) )   =   ' a d m i n '  
 ) ;  
  
 C R E A T E   P O L I C Y   " A n n o u n c e m e n t s   i n s e r t   p o l i c y "   O N   p u b l i c . a n n o u n c e m e n t s  
 F O R   I N S E R T   T O   a u t h e n t i c a t e d   W I T H   C H E C K   (  
     ( S E L E C T   r o l e   F R O M   p u b l i c . p r o f i l e s   W H E R E   i d   =   a u t h . u i d ( ) )   =   ' a d m i n '  
 ) ;  
  
 C R E A T E   P O L I C Y   " A n n o u n c e m e n t s   u p d a t e   p o l i c y "   O N   p u b l i c . a n n o u n c e m e n t s  
 F O R   U P D A T E   T O   a u t h e n t i c a t e d   U S I N G   (  
     ( S E L E C T   r o l e   F R O M   p u b l i c . p r o f i l e s   W H E R E   i d   =   a u t h . u i d ( ) )   =   ' a d m i n '  
 ) ;  
  
 C R E A T E   P O L I C Y   " A n n o u n c e m e n t s   d e l e t e   p o l i c y "   O N   p u b l i c . a n n o u n c e m e n t s  
 F O R   D E L E T E   T O   a u t h e n t i c a t e d   U S I N G   (  
     ( S E L E C T   r o l e   F R O M   p u b l i c . p r o f i l e s   W H E R E   i d   =   a u t h . u i d ( ) )   =   ' a d m i n '  
 ) ;  
  
 - -   2 .   N o t i f i c a t i o n s   T a b l e  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   p u b l i c . n o t i f i c a t i o n s   (  
     i d   U U I D   P R I M A R Y   K E Y   D E F A U L T   g e n _ r a n d o m _ u u i d ( ) ,  
     u s e r _ i d   U U I D   R E F E R E N C E S   a u t h . u s e r s ( i d )   O N   D E L E T E   C A S C A D E ,  
     t i t l e   T E X T   N O T   N U L L ,  
     m e s s a g e   T E X T   N O T   N U L L ,  
     t y p e   T E X T   N O T   N U L L   D E F A U L T   ' s y s t e m ' ,  
     i s _ r e a d   B O O L E A N   N O T   N U L L   D E F A U L T   f a l s e ,  
     l i n k   T E X T ,  
     c r e a t e d _ a t   T I M E S T A M P T Z   D E F A U L T   N O W ( )  
 ) ;  
  
 A L T E R   T A B L E   p u b l i c . n o t i f i c a t i o n s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
  
 C R E A T E   P O L I C Y   " N o t i f i c a t i o n s   s e l e c t   p o l i c y "   O N   p u b l i c . n o t i f i c a t i o n s  
 F O R   S E L E C T   T O   a u t h e n t i c a t e d   U S I N G   ( u s e r _ i d   =   a u t h . u i d ( ) ) ;  
  
 C R E A T E   P O L I C Y   " N o t i f i c a t i o n s   i n s e r t   p o l i c y "   O N   p u b l i c . n o t i f i c a t i o n s  
 F O R   I N S E R T   T O   a u t h e n t i c a t e d   W I T H   C H E C K   (  
     ( S E L E C T   r o l e   F R O M   p u b l i c . p r o f i l e s   W H E R E   i d   =   a u t h . u i d ( ) )   I N   ( ' a d m i n ' ,   ' f a c u l t y ' )   O R   u s e r _ i d   =   a u t h . u i d ( )  
 ) ;  
  
 C R E A T E   P O L I C Y   " N o t i f i c a t i o n s   u p d a t e   p o l i c y "   O N   p u b l i c . n o t i f i c a t i o n s  
 F O R   U P D A T E   T O   a u t h e n t i c a t e d   U S I N G   ( u s e r _ i d   =   a u t h . u i d ( ) ) ;  
  
 C R E A T E   P O L I C Y   " N o t i f i c a t i o n s   d e l e t e   p o l i c y "   O N   p u b l i c . n o t i f i c a t i o n s  
 F O R   D E L E T E   T O   a u t h e n t i c a t e d   U S I N G   ( u s e r _ i d   =   a u t h . u i d ( ) ) ;  
 