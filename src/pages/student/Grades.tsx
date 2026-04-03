import { useAuth } from "@/contexts/AuthContext";
import { useGrades, mockGrades } from "@/hooks/useStudentData";
import { gradesData } from "@/data/mockData";
import { Trophy, Download, ChevronDown, ChevronUp, FileText, Award } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
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
  semData.courses.forEach((c: any) => {
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

const Grades = () => {
  const { user } = useAuth();
  const isDemo = !!user?.isDemo;
  const { data: realGrades, isLoading } = useGrades(user?.id, isDemo);
  const [expandedSem, setExpandedSem] = useState<number | null>(null);
  const studentName = user?.name || "Student";
  const rollNo = user?.rollNo || "";

  // Build semester-grouped data
  const { currentGrades, semesterGPAs, previousSemesters, cgpa } = useMemo(() => {
    if (isDemo) {
      return {
        currentGrades: gradesData.current,
        semesterGPAs: gradesData.semesterGPAs,
        previousSemesters: gradesData.previousSemesters,
        cgpa: gradesData.semesterGPAs[gradesData.semesterGPAs.length - 1]?.gpa || 0,
      };
    }

    const grades = realGrades || [];
    if (grades.length === 0) {
      return { currentGrades: [], semesterGPAs: [], previousSemesters: [], cgpa: 0 };
    }

    // Group by semester
    const bySem = new Map<number, typeof grades>();
    grades.forEach(g => {
      const list = bySem.get(g.semester) || [];
      list.push(g);
      bySem.set(g.semester, list);
    });

    const semesters = Array.from(bySem.keys()).sort((a, b) => a - b);
    const maxSem = semesters[semesters.length - 1] || 1;

    const gpas = semesters.map(sem => {
      const courses = bySem.get(sem)!;
      const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
      const weightedScore = courses.reduce((s, c) => s + (c.score / c.maxScore) * 10 * c.credits, 0);
      return { sem, gpa: totalCredits > 0 ? Number((weightedScore / totalCredits).toFixed(2)) : 0 };
    });

    const currentCourses = (bySem.get(maxSem) || []).map(g => ({
      code: g.code, subject: g.subject, grade: g.grade, score: g.score,
      maxScore: g.maxScore, classAvg: g.classAvg, credits: g.credits,
    }));

    const prev = semesters.filter(s => s < maxSem).map(sem => ({
      sem,
      sgpa: gpas.find(g => g.sem === sem)?.gpa || 0,
      courses: (bySem.get(sem) || []).map(g => ({
        code: g.code, subject: g.subject, grade: g.grade,
        score: g.score, maxScore: g.maxScore, credits: g.credits,
      })),
    }));

    const lastGpa = gpas[gpas.length - 1]?.gpa || 0;

    return { currentGrades: currentCourses, semesterGPAs: gpas, previousSemesters: prev, cgpa: lastGpa };
  }, [isDemo, realGrades]);

  const loading = !isDemo && isLoading;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grades</h1>
          <p className="text-sm text-muted-foreground">Academic performance overview</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : currentGrades.length === 0 && semesterGPAs.length === 0 ? (
        <EmptyState icon={Award} title="No grades yet" subtitle="Grades will appear after assessments are published." />
      ) : (
        <>
          <div className="scroll-reveal rounded-xl border border-primary/20 bg-primary/5 p-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{cgpa}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">Current CGPA</p>
                <p className="text-sm text-muted-foreground">Semester {semesterGPAs.length} · {currentGrades.length} courses</p>
              </div>
            </div>
          </div>

          {semesterGPAs.length > 0 && (
            <div className="scroll-reveal rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Trophy className="h-5 w-5 text-nexus-amber" /> GPA Progression</h2>
              <div className="flex items-end gap-3 h-32">
                {semesterGPAs.map((sem) => (
                  <div key={sem.sem} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-foreground">{sem.gpa}</span>
                    <div className="w-full rounded-t-md bg-primary/20 relative" style={{ height: `${((sem.gpa - 7) / 3) * 100}%` }}>
                      <div className="absolute inset-0 rounded-t-md bg-primary" style={{ opacity: sem.sem === semesterGPAs[semesterGPAs.length - 1]?.sem ? 1 : 0.5 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">Sem {sem.sem}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentGrades.length > 0 && (
            <div className="scroll-reveal rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Current Semester (Sem {semesterGPAs[semesterGPAs.length - 1]?.sem || "?"})</h2>
                <Button
                  variant="outline" size="sm" className="text-xs gap-1.5"
                  onClick={() => {
                    const sem = semesterGPAs[semesterGPAs.length - 1]?.sem || 1;
                    const sgpa = semesterGPAs[semesterGPAs.length - 1]?.gpa || 0;
                    generateGradeCard({ sem, sgpa, courses: currentGrades }, studentName, rollNo);
                  }}
                >
                  <Download className="h-4 w-4" /> Download Grade Card
                </Button>
              </div>
              <div className="divide-y divide-border">
                {currentGrades.map((course) => (
                  <div key={course.code} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{course.subject}</p>
                      <p className="text-xs text-muted-foreground">{course.code} · {course.credits} credits{course.classAvg ? ` · Class avg: ${course.classAvg}%` : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{course.grade}</p>
                      <p className="text-xs text-muted-foreground">{course.score}/{course.maxScore}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previousSemesters.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" /> Previous Semesters
              </h2>
              {previousSemesters.map((sem, i) => (
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
                        variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground hover:text-foreground"
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
          )}
        </>
      )}
    </div>
  );
};

export default Grades;
