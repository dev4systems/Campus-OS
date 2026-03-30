import { gradesData } from "@/data/mockData";
import { Trophy, Download, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import jsPDF from "jspdf";

const generateGradeCard = (semData: { sem: number; sgpa: number; courses: any[] }, studentName: string, rollNo: string) => {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(13, 71, 161);
  doc.rect(0, 0, w, 45, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("National Institute of Technology, Durgapur", w / 2, 18, { align: "center" });
  doc.setFontSize(12);
  doc.text("Grade Card — Semester " + semData.sem, w / 2, 28, { align: "center" });
  doc.setFontSize(10);
  doc.text("Mahatma Gandhi Avenue, Durgapur - 713209, West Bengal", w / 2, 38, { align: "center" });
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Student: ${studentName}`, 20, 58);
  doc.text(`Roll No: ${rollNo}`, 20, 66);
  doc.text(`Semester: ${semData.sem}`, w - 80, 58);
  doc.text(`SGPA: ${semData.sgpa}`, w - 80, 66);
  let y = 82;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y - 6, w - 40, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Code", 24, y);
  doc.text("Subject", 50, y);
  doc.text("Credits", 130, y);
  doc.text("Score", 152, y);
  doc.text("Grade", 175, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  semData.courses.forEach((c) => {
    y += 10;
    doc.text(c.code, 24, y);
    doc.text(c.subject, 50, y);
    doc.text(String(c.credits), 134, y);
    doc.text(`${c.score}/${c.maxScore}`, 150, y);
    doc.setFont("helvetica", "bold");
    doc.text(c.grade, 178, y);
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(220, 220, 220);
    doc.line(20, y + 3, w - 20, y + 3);
  });
  y += 20;
  doc.setFillColor(13, 71, 161);
  doc.rect(20, y, w - 40, 0.5, "F");
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Semester GPA: ${semData.sgpa}`, 24, y);
  y += 25;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("This is a system-generated grade card from Nexus — NIT Durgapur Campus Portal", w / 2, y, { align: "center" });
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, w / 2, y + 6, { align: "center" });
  doc.save(`GradeCard_Sem${semData.sem}_${rollNo}.pdf`);
};

const generateCurrentGradeCard = (studentName: string, rollNo: string) => {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  const sem = gradesData.semesterGPAs.length;
  const cgpa = gradesData.semesterGPAs[sem - 1].gpa;
  doc.setFillColor(13, 71, 161);
  doc.rect(0, 0, w, 45, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("National Institute of Technology, Durgapur", w / 2, 18, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Grade Card — Semester ${sem} (Current)`, w / 2, 28, { align: "center" });
  doc.setFontSize(10);
  doc.text("Mahatma Gandhi Avenue, Durgapur - 713209, West Bengal", w / 2, 38, { align: "center" });
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Student: ${studentName}`, 20, 58);
  doc.text(`Roll No: ${rollNo}`, 20, 66);
  doc.text(`Semester: ${sem}`, w - 80, 58);
  doc.text(`CGPA: ${cgpa}`, w - 80, 66);
  let y = 82;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y - 6, w - 40, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Code", 24, y);
  doc.text("Subject", 50, y);
  doc.text("Credits", 125, y);
  doc.text("Score", 147, y);
  doc.text("Avg", 165, y);
  doc.text("Grade", 180, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  gradesData.current.forEach((c) => {
    y += 10;
    doc.text(c.code, 24, y);
    doc.text(c.subject, 50, y);
    doc.text(String(c.credits), 129, y);
    doc.text(`${c.score}/${c.maxScore}`, 145, y);
    doc.text(`${c.classAvg}%`, 165, y);
    doc.setFont("helvetica", "bold");
    doc.text(c.grade, 183, y);
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(220, 220, 220);
    doc.line(20, y + 3, w - 20, y + 3);
  });
  y += 20;
  doc.setFillColor(13, 71, 161);
  doc.rect(20, y, w - 40, 0.5, "F");
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Cumulative GPA: ${cgpa}`, 24, y);
  y += 25;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("This is a system-generated grade card from Nexus — NIT Durgapur Campus Portal", w / 2, y, { align: "center" });
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, w / 2, y + 6, { align: "center" });
  doc.save(`GradeCard_Sem${sem}_Current_${rollNo}.pdf`);
};

const Grades = () => {
  const cgpa = gradesData.semesterGPAs[gradesData.semesterGPAs.length - 1].gpa;
  const [expandedSem, setExpandedSem] = useState<number | null>(null);
  const { user } = useAuth();
  const studentName = user?.name || "Student";
  const rollNo = user?.rollNo || "21CS8042";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grades</h1>
          <p className="text-sm text-muted-foreground">Academic performance overview</p>
        </div>
      </div>

      <div className="scroll-reveal rounded-xl border border-primary/20 bg-primary/5 p-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{cgpa}</span>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">Current CGPA</p>
            <p className="text-sm text-muted-foreground">Semester {gradesData.semesterGPAs.length} · {gradesData.current.length} courses</p>
          </div>
        </div>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Trophy className="h-5 w-5 text-nexus-amber" /> GPA Progression</h2>
        <div className="flex items-end gap-3 h-32">
          {gradesData.semesterGPAs.map((sem) => (
            <div key={sem.sem} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-foreground">{sem.gpa}</span>
              <div className="w-full rounded-t-md bg-primary/20 relative" style={{ height: `${((sem.gpa - 7) / 3) * 100}%` }}>
                <div className="absolute inset-0 rounded-t-md bg-primary" style={{ opacity: sem.sem === gradesData.semesterGPAs.length ? 1 : 0.5 }} />
              </div>
              <span className="text-[10px] text-muted-foreground">Sem {sem.sem}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Current Semester (Sem {gradesData.semesterGPAs.length})</h2>
          <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => generateCurrentGradeCard(studentName, rollNo)}>
            <Download className="h-4 w-4" /> Download Grade Card
          </Button>
        </div>
        <div className="divide-y divide-border">
          {gradesData.current.map((course) => (
            <div key={course.code} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{course.subject}</p>
                <p className="text-xs text-muted-foreground">{course.code} · {course.credits} credits · Class avg: {course.classAvg}%</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{course.grade}</p>
                <p className="text-xs text-muted-foreground">{course.score}/{course.maxScore}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" /> Previous Semesters
        </h2>
        {gradesData.previousSemesters.map((sem, i) => (
          <div key={sem.sem} className="scroll-reveal rounded-xl border border-border bg-card overflow-hidden" style={{ transitionDelay: `${i * 70}ms` }}>
            <button
              onClick={() => setExpandedSem(expandedSem === sem.sem ? null : sem.sem)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{sem.sgpa}</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Semester {sem.sem}</p>
                  <p className="text-xs text-muted-foreground">{sem.courses.length} courses · SGPA: {sem.sgpa}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1 text-muted-foreground hover:text-foreground"
                  onClick={(e) => { e.stopPropagation(); generateGradeCard(sem, studentName, rollNo); }}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                {expandedSem === sem.sem ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
              </div>
            </button>
            <AnimatePresence>
              {expandedSem === sem.sem && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="divide-y divide-border border-t border-border">
                    {sem.courses.map((course) => (
                      <div key={course.code} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm">{course.subject}</p>
                          <p className="text-xs text-muted-foreground">{course.code} · {course.credits} credits</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{course.grade}</p>
                          <p className="text-xs text-muted-foreground">{course.score}/{course.maxScore}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grades;
