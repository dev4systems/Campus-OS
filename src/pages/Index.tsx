import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import PortalCard from "@/components/PortalCard";
import campusHero from "@/assets/campus-hero.jpg";

type Portal = "student" | "teacher" | "admin" | null;

const DEMO_CREDENTIALS: Record<string, { email: string; password: string; name: string }> = {
  student: { email: "arjun@nitdgp.ac.in", password: "password123", name: "Arjun Sharma" },
  teacher: { email: "prof.verma@nitdgp.ac.in", password: "password123", name: "Prof. Verma" },
  admin: { email: "admin@nitdgp.ac.in", password: "password123", name: "Admin" },
};

const portalConfig = [
  { key: "student" as Portal, title: "Student Portal", description: "Access your dashboard, timetable, grades & more", icon: GraduationCap, gradient: "bg-gradient-to-br from-primary/5 to-transparent" },
  { key: "teacher" as Portal, title: "Teacher Portal", description: "Manage classes, attendance & assignments", icon: BookOpen, gradient: "bg-gradient-to-br from-nexus-teal/5 to-transparent" },
  { key: "admin" as Portal, title: "Admin Portal", description: "Full institution management & analytics", icon: Shield, gradient: "bg-gradient-to-br from-nexus-amber/5 to-transparent" },
];

const Index = () => {
  const [selectedPortal, setSelectedPortal] = useState<Portal>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortal) return;

    setIsLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 800));

    const creds = DEMO_CREDENTIALS[selectedPortal];
    if (email === creds.email && password === creds.password) {
      if (rememberMe) {
        localStorage.setItem("nexus_session", JSON.stringify({ portal: selectedPortal, name: creds.name, email }));
      }
      toast({ title: `Welcome, ${creds.name}!`, description: `Logged into ${selectedPortal} portal.` });
      // TODO: Navigate to portal dashboard
    } else {
      toast({ title: "Login Failed", description: "Invalid credentials. Check the demo credentials below.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const portalLabel = selectedPortal ? portalConfig.find((p) => p.key === selectedPortal)?.title : "";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={campusHero} alt="NIT Durgapur Campus" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        <div className="absolute inset-0 hero-gradient opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-lg px-4 py-12">
        {/* Logo / Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-gradient sm:text-6xl">Nexus</h1>
          <p className="mt-2 text-base text-muted-foreground">Your Complete Campus Guide — NIT Durgapur</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedPortal ? (
            /* Portal Selection */
            <motion.div key="portals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
              {portalConfig.map((p, i) => (
                <PortalCard key={p.key} title={p.title} description={p.description} icon={p.icon} gradient={p.gradient} delay={0.15 * i} onClick={() => setSelectedPortal(p.key)} />
              ))}
            </motion.div>
          ) : (
            /* Login Form */
            <motion.div key="login" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.4 }}>
              <div className="glass rounded-xl p-6 sm:p-8">
                <button onClick={() => { setSelectedPortal(null); setEmail(""); setPassword(""); }} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <h2 className="mb-1 text-xl font-bold text-foreground">{portalLabel}</h2>
                <p className="mb-6 text-sm text-muted-foreground">Sign in to continue</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Input placeholder="Email / ID" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-muted/50 border-border" />
                  </div>
                  <div className="relative">
                    <Input placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-muted/50 border-border pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
                      Remember me
                    </label>
                    <button type="button" className="text-sm text-primary hover:underline">Forgot password?</button>
                  </div>

                  <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                    {isLoading ? "Signing in…" : "Sign In"}
                  </Button>
                </form>

                {/* Demo credentials hint */}
                <div className="mt-6 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-semibold text-foreground/70">Demo credentials:</p>
                  <p className="font-mono">{DEMO_CREDENTIALS[selectedPortal].email}</p>
                  <p className="font-mono">password123</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 text-center text-xs text-muted-foreground/60">
          © 2026 Nexus · NIT Durgapur
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
