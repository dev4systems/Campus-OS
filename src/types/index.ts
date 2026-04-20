export interface Professor {
  id: string;
  name: string;
  designation: string;
  designation_short: string;
  department?: string;
  email: string;
  phone: string;
  joined: number;
  initials: string;
  color: string;
  research: string[];
  subjects: string[];
  lab: string | null;
  profile_url: string;
}

export interface PlacementDrive {
  id: string;
  company_name: string;
  company_logo_url: string | null;
  role: string;
  package_min: number;
  package_max: number;
  eligible_branches: string[];
  minimum_cgpa: number;
  year: number;
  status: 'upcoming' | 'active' | 'completed';
  created_at: string;
  placement_rounds?: PlacementRound[];
}

export interface PlacementRound {
  id: string;
  drive_id: string;
  round_name: string;
  round_date: string | null;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  selected_count: number | null;
  notes: string | null;
  sequence_order: number;
  created_at: string;
}

export interface PlacementNotification {
  id: string;
  student_id: string;
  drive_id: string;
  notify_on_round: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | 'placement_officer';
  department: string | null;
  semester: number | null;
  roll_no: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  created_at?: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  course_id: string;
  faculty_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  created_at: string;
  courses?: Course;
  profiles?: Partial<Profile>;
}

export interface BugReport {
  id?: string;
  title: string;
  page_section: string;
  description: string;
  severity: string;
  contact_email: string | null;
  user_id: string | null;
  status?: 'pending' | 'resolved' | 'in_progress';
  created_at?: string;
}

export interface Event {
  id: number;
  author: string;
  avatar: string;
  time: string;
  type: string;
  content: string;
  hashtags: string[];
  likes: number;
  comments: number;
}

export interface TimetableSlot {
  time: string;
  subject: string;
  professor: string;
  building: string;
  room: string;
  type: "Lecture" | "Lab";
}

export interface TimetableDay {
  day: string;
  slots: TimetableSlot[];
}

export interface ResearchProject {
  id: string;
  professor_id: string;
  title: string;
  description: string | null;
  status: 'active' | 'completed' | 'seeking_students';
  domain_tags: string[];
  max_students: number;
  created_at: string;
  professors?: Professor;
}

export interface CollaborationRequest {
  id: string;
  student_id: string;
  project_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  profiles?: Profile;
  research_projects?: ResearchProject;
}
