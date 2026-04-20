-- supabase/migrations/20260420500000_placements.sql

-- 1. Placement Drives Table
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

-- 2. Placement Rounds Table
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

-- 3. Placement Notifications (Subscribers)
CREATE TABLE IF NOT EXISTS public.placement_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES public.placement_drives(id) ON DELETE CASCADE,
  notify_on_round INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, drive_id)
);

-- 4. Enable RLS
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_notifications ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Placement drives select policy" ON public.placement_drives FOR SELECT TO authenticated USING (true);
CREATE POLICY "Placement drives manage policy" ON public.placement_drives FOR ALL TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'placement_officer'));

CREATE POLICY "Placement rounds select policy" ON public.placement_rounds FOR SELECT TO authenticated USING (true);
CREATE POLICY "Placement rounds manage policy" ON public.placement_rounds FOR ALL TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'placement_officer'));

CREATE POLICY "Placement notifications select policy" ON public.placement_notifications FOR SELECT TO authenticated 
USING (student_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Placement notifications manage policy" ON public.placement_notifications FOR ALL TO authenticated 
USING (student_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
