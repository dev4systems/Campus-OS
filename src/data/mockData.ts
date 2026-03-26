// Mock data for NIT Durgapur campus app

export const studentStats = {
  attendance: 82,
  cgpa: 8.45,
  activeAssignments: 4,
  pendingFees: 12500,
};

export const timetableData = [
  { day: "Monday", slots: [
    { time: "9:00 - 10:00", subject: "CS301 - Data Structures", professor: "Prof. R. Verma", room: "LH-201", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "10:00 - 11:00", subject: "CS302 - Operating Systems", professor: "Dr. S. Mukherjee", room: "LH-203", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "11:30 - 12:30", subject: "MA201 - Probability & Statistics", professor: "Dr. P. Ghosh", room: "LH-105", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "2:00 - 5:00", subject: "CS391 - DSA Lab", professor: "Prof. R. Verma", room: "CC-Lab 3", building: "Computer Centre", type: "Lab" },
  ]},
  { day: "Tuesday", slots: [
    { time: "9:00 - 10:00", subject: "CS303 - Computer Networks", professor: "Dr. A. Das", room: "LH-202", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "10:00 - 11:00", subject: "CS304 - Database Systems", professor: "Prof. N. Singh", room: "LH-204", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "11:30 - 12:30", subject: "HS201 - Economics", professor: "Dr. K. Banerjee", room: "LH-301", building: "Lecture Hall Complex", type: "Lecture" },
  ]},
  { day: "Wednesday", slots: [
    { time: "9:00 - 10:00", subject: "CS301 - Data Structures", professor: "Prof. R. Verma", room: "LH-201", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "10:00 - 11:00", subject: "MA201 - Probability & Statistics", professor: "Dr. P. Ghosh", room: "LH-105", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "2:00 - 5:00", subject: "CS392 - OS Lab", professor: "Dr. S. Mukherjee", room: "CC-Lab 2", building: "Computer Centre", type: "Lab" },
  ]},
  { day: "Thursday", slots: [
    { time: "9:00 - 10:00", subject: "CS302 - Operating Systems", professor: "Dr. S. Mukherjee", room: "LH-203", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "10:00 - 11:00", subject: "CS303 - Computer Networks", professor: "Dr. A. Das", room: "LH-202", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "11:30 - 12:30", subject: "CS304 - Database Systems", professor: "Prof. N. Singh", room: "LH-204", building: "Lecture Hall Complex", type: "Lecture" },
  ]},
  { day: "Friday", slots: [
    { time: "9:00 - 10:00", subject: "HS201 - Economics", professor: "Dr. K. Banerjee", room: "LH-301", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "10:00 - 11:00", subject: "CS301 - Data Structures", professor: "Prof. R. Verma", room: "LH-201", building: "Lecture Hall Complex", type: "Lecture" },
    { time: "2:00 - 5:00", subject: "CS393 - CN Lab", professor: "Dr. A. Das", room: "CC-Lab 1", building: "Computer Centre", type: "Lab" },
  ]},
];

export const attendanceData = [
  { code: "CS301", subject: "Data Structures", total: 42, attended: 38, percentage: 90, status: "good" as const },
  { code: "CS302", subject: "Operating Systems", total: 40, attended: 32, percentage: 80, status: "good" as const },
  { code: "CS303", subject: "Computer Networks", total: 38, attended: 30, percentage: 79, status: "good" as const },
  { code: "CS304", subject: "Database Systems", total: 36, attended: 25, percentage: 69, status: "warning" as const },
  { code: "MA201", subject: "Probability & Statistics", total: 40, attended: 35, percentage: 88, status: "good" as const },
  { code: "HS201", subject: "Economics", total: 30, attended: 17, percentage: 57, status: "danger" as const },
];

export const gradesData = {
  current: [
    { code: "CS301", subject: "Data Structures", grade: "A", score: 89, maxScore: 100, classAvg: 72, credits: 4 },
    { code: "CS302", subject: "Operating Systems", grade: "A-", score: 83, maxScore: 100, classAvg: 68, credits: 4 },
    { code: "CS303", subject: "Computer Networks", grade: "B+", score: 78, maxScore: 100, classAvg: 65, credits: 3 },
    { code: "CS304", subject: "Database Systems", grade: "A", score: 91, maxScore: 100, classAvg: 70, credits: 4 },
    { code: "MA201", subject: "Probability & Statistics", grade: "B+", score: 76, maxScore: 100, classAvg: 62, credits: 3 },
    { code: "HS201", subject: "Economics", grade: "A-", score: 85, maxScore: 100, classAvg: 74, credits: 2 },
  ],
  semesterGPAs: [
    { sem: 1, gpa: 8.2 }, { sem: 2, gpa: 8.5 }, { sem: 3, gpa: 8.1 }, { sem: 4, gpa: 8.7 }, { sem: 5, gpa: 8.45 },
  ],
  previousSemesters: [
    { sem: 1, sgpa: 8.2, courses: [
      { code: "MA101", subject: "Mathematics I", grade: "A-", score: 82, maxScore: 100, credits: 4 },
      { code: "PH101", subject: "Physics I", grade: "B+", score: 78, maxScore: 100, credits: 4 },
      { code: "CS101", subject: "Intro to Programming", grade: "A", score: 90, maxScore: 100, credits: 3 },
      { code: "ME101", subject: "Engineering Drawing", grade: "B+", score: 76, maxScore: 100, credits: 3 },
      { code: "EE101", subject: "Basic Electrical", grade: "A-", score: 84, maxScore: 100, credits: 3 },
      { code: "HS101", subject: "English", grade: "A", score: 88, maxScore: 100, credits: 2 },
    ]},
    { sem: 2, sgpa: 8.5, courses: [
      { code: "MA102", subject: "Mathematics II", grade: "A", score: 88, maxScore: 100, credits: 4 },
      { code: "CH101", subject: "Chemistry", grade: "A-", score: 83, maxScore: 100, credits: 4 },
      { code: "CS102", subject: "Data Structures Basics", grade: "A", score: 91, maxScore: 100, credits: 3 },
      { code: "ME102", subject: "Workshop Practice", grade: "B+", score: 77, maxScore: 100, credits: 3 },
      { code: "EC101", subject: "Basic Electronics", grade: "A-", score: 85, maxScore: 100, credits: 3 },
      { code: "HS102", subject: "Communication Skills", grade: "A", score: 89, maxScore: 100, credits: 2 },
    ]},
    { sem: 3, sgpa: 8.1, courses: [
      { code: "MA201", subject: "Mathematics III", grade: "B+", score: 75, maxScore: 100, credits: 4 },
      { code: "CS201", subject: "Object Oriented Programming", grade: "A", score: 92, maxScore: 100, credits: 4 },
      { code: "CS202", subject: "Digital Logic Design", grade: "B+", score: 77, maxScore: 100, credits: 3 },
      { code: "CS203", subject: "Discrete Mathematics", grade: "A-", score: 84, maxScore: 100, credits: 3 },
      { code: "CS204", subject: "Computer Organization", grade: "B", score: 72, maxScore: 100, credits: 3 },
    ]},
    { sem: 4, sgpa: 8.7, courses: [
      { code: "CS251", subject: "Design & Analysis of Algorithms", grade: "A", score: 93, maxScore: 100, credits: 4 },
      { code: "CS252", subject: "Software Engineering", grade: "A", score: 90, maxScore: 100, credits: 4 },
      { code: "CS253", subject: "Theory of Computation", grade: "A-", score: 86, maxScore: 100, credits: 3 },
      { code: "CS254", subject: "Microprocessors", grade: "A-", score: 84, maxScore: 100, credits: 3 },
      { code: "MA202", subject: "Numerical Methods", grade: "A", score: 88, maxScore: 100, credits: 3 },
    ]},
  ],
};

export const assignmentsData = [
  { id: 1, subject: "CS301", title: "Binary Tree Implementation", description: "Implement AVL tree with all rotations in C++", dueDate: "2026-03-15", status: "pending" as const, professor: "Prof. R. Verma" },
  { id: 2, subject: "CS302", title: "Process Scheduling Simulator", description: "Simulate FCFS, SJF, Round Robin scheduling algorithms", dueDate: "2026-03-12", status: "overdue" as const, professor: "Dr. S. Mukherjee" },
  { id: 3, subject: "CS303", title: "Socket Programming", description: "Build a simple chat application using TCP sockets", dueDate: "2026-03-20", status: "pending" as const, professor: "Dr. A. Das" },
  { id: 4, subject: "CS304", title: "ER Diagram Design", description: "Design ER diagram for a hospital management system", dueDate: "2026-03-10", status: "submitted" as const, professor: "Prof. N. Singh", grade: "A-", feedback: "Good design, but missing some cardinality constraints." },
];

export const feesData = [
  { type: "Tuition Fee", amount: 62500, paid: 62500, status: "paid" as const, dueDate: "2026-01-15", txnId: "TXN20260115A" },
  { type: "Hostel Fee", amount: 18000, paid: 18000, status: "paid" as const, dueDate: "2026-01-15", txnId: "TXN20260115B" },
  { type: "Examination Fee", amount: 5000, paid: 0, status: "pending" as const, dueDate: "2026-03-30" },
  { type: "Library Fee", amount: 2500, paid: 0, status: "pending" as const, dueDate: "2026-03-30" },
  { type: "Sports & Activities", amount: 5000, paid: 5000, status: "paid" as const, dueDate: "2026-01-15", txnId: "TXN20260115C" },
];

export const coursesData = [
  { code: "CS301", name: "Data Structures & Algorithms", credits: 4, professor: "Prof. R. Verma", office: "CSE-205" },
  { code: "CS302", name: "Operating Systems", credits: 4, professor: "Dr. S. Mukherjee", office: "CSE-301" },
  { code: "CS303", name: "Computer Networks", credits: 3, professor: "Dr. A. Das", office: "CSE-102" },
  { code: "CS304", name: "Database Management Systems", credits: 4, professor: "Prof. N. Singh", office: "CSE-210" },
  { code: "MA201", name: "Probability & Statistics", credits: 3, professor: "Dr. P. Ghosh", office: "MA-105" },
  { code: "HS201", name: "Engineering Economics", credits: 2, professor: "Dr. K. Banerjee", office: "HS-201" },
];

export const examsData = [
  { subject: "CS301 - Data Structures", type: "Mid Semester", date: "2026-03-25", time: "9:00 AM - 11:00 AM", building: "Examination Hall", room: "EH-101", seat: "Row 3, Seat 12" },
  { subject: "CS302 - Operating Systems", type: "Mid Semester", date: "2026-03-27", time: "9:00 AM - 11:00 AM", building: "Examination Hall", room: "EH-102", seat: "Row 5, Seat 8" },
  { subject: "CS303 - Computer Networks", type: "Mid Semester", date: "2026-03-29", time: "2:00 PM - 4:00 PM", building: "Examination Hall", room: "EH-101", seat: "Row 2, Seat 15" },
  { subject: "MA201 - Probability & Stats", type: "Mid Semester", date: "2026-03-31", time: "9:00 AM - 11:00 AM", building: "Lecture Hall Complex", room: "LH-301", seat: "Row 7, Seat 3" },
];

export const libraryBooks = [
  { id: 1, title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", isbn: "978-0262033848", edition: "3rd", year: 2009, subject: "Computer Science", status: "available" as const, quantity: 5, room: "L-201", stack: "A-15", shelf: "Shelf 3, Row 4" },
  { id: 2, title: "Operating System Concepts", author: "Silberschatz, Galvin, Gagne", isbn: "978-1119800361", edition: "10th", year: 2021, subject: "Computer Science", status: "available" as const, quantity: 3, room: "L-201", stack: "A-16", shelf: "Shelf 2, Row 1" },
  { id: 3, title: "Computer Networking: A Top-Down Approach", author: "Kurose, Ross", isbn: "978-0136681557", edition: "8th", year: 2020, subject: "Computer Science", status: "checked_out" as const, quantity: 0, returnDate: "2026-03-18", room: "L-201", stack: "A-17", shelf: "Shelf 1, Row 3" },
  { id: 4, title: "Database System Concepts", author: "Silberschatz, Korth, Sudarshan", isbn: "978-0078022159", edition: "7th", year: 2019, subject: "Computer Science", status: "available" as const, quantity: 4, room: "L-201", stack: "A-18", shelf: "Shelf 4, Row 2" },
  { id: 5, title: "Probability and Statistics for Engineers", author: "Walpole, Myers, Myers", isbn: "978-0321629111", edition: "9th", year: 2016, subject: "Mathematics", status: "available" as const, quantity: 6, room: "L-102", stack: "B-05", shelf: "Shelf 1, Row 1" },
];

export const campusBuildings = [
  { id: 1, name: "Lecture Hall Complex", code: "LHC", lat: 23.5475, lng: 87.2953, floors: 4, rooms: ["LH-101", "LH-102", "LH-103", "LH-201", "LH-202", "LH-203", "LH-204", "LH-301", "LH-302"] },
  { id: 2, name: "Computer Centre", code: "CC", lat: 23.5480, lng: 87.2960, floors: 3, rooms: ["CC-Lab 1", "CC-Lab 2", "CC-Lab 3", "CC-Lab 4", "CC-Office"] },
  { id: 3, name: "CSE Department", code: "CSE", lat: 23.5470, lng: 87.2945, floors: 3, rooms: ["CSE-101", "CSE-102", "CSE-201", "CSE-205", "CSE-210", "CSE-301"] },
  { id: 4, name: "Central Library", code: "LIB", lat: 23.5465, lng: 87.2950, floors: 3, rooms: ["L-101", "L-102", "L-201", "L-202", "L-301"] },
  { id: 5, name: "Examination Hall", code: "EH", lat: 23.5478, lng: 87.2940, floors: 2, rooms: ["EH-101", "EH-102", "EH-201"] },
  { id: 6, name: "Administrative Building", code: "ADMIN", lat: 23.5460, lng: 87.2955, floors: 3, rooms: ["Admin-101", "Admin-201", "Admin-301", "Dean Office", "Director Office"] },
  { id: 7, name: "Student Activity Centre", code: "SAC", lat: 23.5485, lng: 87.2948, floors: 2, rooms: ["SAC-Hall", "SAC-Room 1", "SAC-Room 2", "SAC-Gym"] },
  { id: 8, name: "Medical Centre", code: "MED", lat: 23.5468, lng: 87.2965, floors: 1, rooms: ["Reception", "OPD", "Pharmacy", "Emergency"] },
];

export const buzzPosts = [
  { id: 1, author: "Priya Sharma", avatar: "PS", type: "achievement" as const, content: "Just got selected for Google Summer of Code 2026! 🎉 #GSoC #Achievement #CSE", likes: 142, comments: 23, time: "2h ago", hashtags: ["GSoC", "Achievement", "CSE"] },
  { id: 2, author: "Tech Club NIT DGP", avatar: "TC", type: "event" as const, content: "🎪 UPCOMING: HackNIT 2026 - 48hr Hackathon\n📅 April 5-7\n📍 SAC Hall\n🏆 Prizes worth ₹2,00,000\nRegister now! #HackNIT #Hackathon #Events", likes: 89, comments: 45, time: "4h ago", hashtags: ["HackNIT", "Hackathon", "Events"] },
  { id: 3, author: "Rahul Kumar", avatar: "RK", type: "discussion" as const, content: "Anyone else finding the OS mid-sem syllabus huge? Let's form a study group! #OS #StudyGroup #Academic", likes: 34, comments: 18, time: "6h ago", hashtags: ["OS", "StudyGroup", "Academic"] },
  { id: 4, author: "NIT Admin", avatar: "NA", type: "news" as const, content: "📰 NIT Durgapur ranked 24th in NIRF Engineering Rankings 2026! Proud moment for all NITians! #NITDurgapur #NIRF #Achievement", likes: 256, comments: 67, time: "1d ago", hashtags: ["NITDurgapur", "NIRF", "Achievement"] },
  { id: 5, author: "Ananya Das", avatar: "AD", type: "moments" as const, content: "Beautiful sunset from the hostel rooftop today 🌅 #CampusLife #NIT-Durgapur #Moments", likes: 78, comments: 12, time: "1d ago", hashtags: ["CampusLife", "NIT-Durgapur", "Moments"] },
];

export const trendingTags = [
  { tag: "#CompetitiveProgramming", count: 2400 },
  { tag: "#GATEExam", count: 1800 },
  { tag: "#HackathonWins", count: 1500 },
  { tag: "#TechTalk", count: 1200 },
  { tag: "#CampusLife", count: 980 },
  { tag: "#Placements2026", count: 870 },
  { tag: "#GSoC", count: 650 },
  { tag: "#HackNIT", count: 520 },
];

// Teacher data
export const teacherSubjects = [
  { code: "CS301", name: "Data Structures & Algorithms", semester: 5, section: "A", students: 62, classesPerWeek: 4 },
  { code: "CS301", name: "Data Structures & Algorithms", semester: 5, section: "B", students: 58, classesPerWeek: 4 },
  { code: "CS501", name: "Machine Learning", semester: 7, section: "A", students: 45, classesPerWeek: 3 },
];

export const teacherStudents = [
  { rollNo: "21CS8001", name: "Aarav Patel", email: "aarav@nitdgp.ac.in", attendance: 92, grade: "A" },
  { rollNo: "21CS8002", name: "Ananya Das", email: "ananya@nitdgp.ac.in", attendance: 88, grade: "A-" },
  { rollNo: "21CS8003", name: "Bharat Singh", email: "bharat@nitdgp.ac.in", attendance: 75, grade: "B+" },
  { rollNo: "21CS8004", name: "Chitra Reddy", email: "chitra@nitdgp.ac.in", attendance: 95, grade: "A+" },
  { rollNo: "21CS8005", name: "Deepak Sharma", email: "deepak@nitdgp.ac.in", attendance: 62, grade: "B" },
  { rollNo: "21CS8042", name: "Arjun Sharma", email: "arjun@nitdgp.ac.in", attendance: 82, grade: "A" },
];

// Admin data
export const adminStats = {
  totalStudents: 4850,
  totalFaculty: 312,
  totalStaff: 186,
  openComplaints: 23,
  pendingFees: 1250000,
  systemUptime: "99.7%",
};

export const adminComplaints = [
  { id: "CMP-001", date: "2026-03-08", from: "Rahul Kumar", category: "Infrastructure", description: "Water leakage in Hostel Block C, Room 204", status: "pending" as const, assignedTo: "Maintenance Dept" },
  { id: "CMP-002", date: "2026-03-07", from: "Priya Sharma", category: "Academic", description: "Incorrect attendance marked for CS301 on March 5", status: "under_review" as const, assignedTo: "CSE Dept" },
  { id: "CMP-003", date: "2026-03-06", from: "Amit Gupta", category: "IT Services", description: "WiFi not working in Library 2nd floor", status: "resolved" as const, assignedTo: "IT Cell" },
  { id: "CMP-004", date: "2026-03-05", from: "Sneha Roy", category: "Hostel", description: "Mess food quality has declined significantly", status: "under_review" as const, assignedTo: "Hostel Warden" },
];

export const feedbackData = [
  { id: 1001, title: "Improve lab equipment", category: "Infrastructure", type: "suggestion" as const, priority: "high" as const, status: "under_review" as const, date: "2026-03-08", anonymous: false, student: "Arjun Sharma", description: "The CSE lab computers need upgrades. Many systems are running outdated hardware.", response: "We have approved a budget for upgrading 30 systems in CC-Lab 3. Expected completion by April 2026." },
  { id: 1002, title: "Library timings extension", category: "Services", type: "suggestion" as const, priority: "medium" as const, status: "pending" as const, date: "2026-03-07", anonymous: true, description: "Please extend library hours during exam season to 11 PM." },
  { id: 1003, title: "Great workshop series", category: "Academic", type: "feedback" as const, priority: "low" as const, status: "resolved" as const, date: "2026-03-05", anonymous: false, student: "Priya Sharma", description: "The ML workshop series was excellent. Please organize more such events.", response: "Thank you! We're planning an AI/ML boot camp in May." },
];
