-- supabase/migrations/20260420400000_research.sql

-- 1. Research Projects Table
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

-- 2. Drop old collaboration_requests and recreate with project link
DROP TABLE IF EXISTS public.collaboration_requests CASCADE;

CREATE TABLE public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, project_id)
);

-- 3. Enable RLS
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- 4. Research Projects Policies
CREATE POLICY "Research projects select policy" ON public.research_projects 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Research projects insert policy" ON public.research_projects 
FOR INSERT TO authenticated WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'faculty')
);

CREATE POLICY "Research projects update policy" ON public.research_projects 
FOR UPDATE TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR 
  (SELECT email FROM public.profiles WHERE id = auth.uid()) = (SELECT email FROM public.professors WHERE id = professor_id)
);

-- 5. Collaboration Requests Policies
CREATE POLICY "Collaboration requests select policy" ON public.collaboration_requests 
FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR 
  (SELECT email FROM public.profiles WHERE id = auth.uid()) = (SELECT email FROM public.professors WHERE id = (SELECT professor_id FROM public.research_projects WHERE id = project_id)) OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Collaboration requests insert policy" ON public.collaboration_requests 
FOR INSERT TO authenticated WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'student' AND student_id = auth.uid()
);

CREATE POLICY "Collaboration requests update policy" ON public.collaboration_requests 
FOR UPDATE TO authenticated USING (
  (SELECT email FROM public.profiles WHERE id = auth.uid()) = (SELECT email FROM public.professors WHERE id = (SELECT professor_id FROM public.research_projects WHERE id = project_id)) OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
