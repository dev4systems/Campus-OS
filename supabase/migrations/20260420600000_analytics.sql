-- supabase/migrations/20260420600000_analytics.sql

-- 1. Page Views Table for Tracking Usage
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

-- 2. Analytics Views

-- Daily Active Users (rolling 30 days)
CREATE OR REPLACE VIEW public.analytics_dau AS
SELECT 
  date_trunc('day', created_at)::date as day,
  count(distinct user_id) as count
FROM public.page_views
WHERE created_at > now() - interval '30 days'
GROUP BY 1
ORDER BY 1;

-- Feature Usage (grouped by week)
CREATE OR REPLACE VIEW public.analytics_feature_usage AS
SELECT 
  feature,
  date_trunc('week', created_at)::date as week,
  count(*) as count
FROM public.page_views
WHERE feature IS NOT NULL
GROUP BY 1, 2
ORDER BY 2, 3 DESC;

-- Attendance Health (% students >= 75%)
CREATE OR REPLACE VIEW public.analytics_attendance_health AS
WITH student_stats AS (
  SELECT 
    student_id,
    count(*) filter (where status = 'present') * 1.0 / count(*) as attendance_rate
  FROM public.attendance
  GROUP BY student_id
)
SELECT
  CASE 
    WHEN attendance_rate >= 0.75 THEN 'Safe (>=75%)'
    WHEN attendance_rate >= 0.60 THEN 'Warning (60-74%)'
    ELSE 'Critical (<60%)'
  END as health_status,
  count(*) as student_count
FROM student_stats
GROUP BY 1;

-- Placement Funnel (Application -> Written -> Technical -> HR -> Offers)
CREATE OR REPLACE VIEW public.analytics_placement_funnel AS
SELECT 
  round_name,
  sum(selected_count) as count,
  min(sequence_order) as seq
FROM public.placement_rounds
WHERE status = 'completed'
GROUP BY 1
ORDER BY 3;
