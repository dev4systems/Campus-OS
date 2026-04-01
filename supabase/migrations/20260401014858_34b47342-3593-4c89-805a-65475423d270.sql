
-- Add cgpa and enrollment_year to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cgpa numeric(4,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enrollment_year integer;

-- Subjects (reference data)
CREATE TABLE subjects (
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
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read subjects" ON subjects FOR SELECT TO authenticated USING (true);

-- Enrollments
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  semester integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id)
);
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own enrollments" ON enrollments FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Attendance
CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  total_classes integer NOT NULL DEFAULT 0,
  attended_classes integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id)
);
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own attendance" ON attendance FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Grades
CREATE TABLE grades (
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
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own grades" ON grades FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Assignments (shared data)
CREATE TABLE assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  due_date date NOT NULL,
  professor text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read assignments" ON assignments FOR SELECT TO authenticated USING (true);

-- Assignment submissions (per student)
CREATE TABLE assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  grade text,
  feedback text,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, assignment_id)
);
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own submissions" ON assignment_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Fees
CREATE TABLE fees (
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
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own fees" ON fees FOR SELECT TO authenticated USING (auth.uid() = user_id);
