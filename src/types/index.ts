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

export interface Placement {
  id: string;
  company: string;
  logo_initial: string;
  logo_color: string;
  role: string;
  type: string;
  sector: string;
  salary: { min: number; max: number; currency: string };
  cgpa_cutoff: number;
  backlog_allowed: boolean;
  branches: string[];
  batch: string;
  location: string;
  description: string;
  requirements: string[];
  rounds: string[];
  drive_date: string;
  registration_deadline: string;
  status: string;
  applied_count: number;
}

export interface Attendance {
  id: string;
  user_id: string;
  subject_id: string;
  total_classes: number;
  attended_classes: number;
  updated_at: string;
  subjects?: {
    code: string;
    name: string;
  };
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
