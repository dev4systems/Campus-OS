import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Shield, Eye, EyeOff, ArrowLeft, Zap, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth, Portal } from "@/contexts/AuthContext";
import PortalCard from "@/components/PortalCard";
import CampusImage from "@/components/CampusImage";

const HERO_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/NIT_Durgapur_Main_Building.jpg/1280px-NIT_Durgapur_Main_Building.jpg";
const CAMPUS_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/NIT_Durgapur.jpg/1280px-NIT_Durgapur.jpg";

const portalConfig = [
  { key: "student" as Portal, title: "Student Portal", description: "Access your dashboard, timetable, grades & more", icon: GraduationCap, gradient: "bg-gradient-to-br from-primary/5 to-transparent" },
  { key: "teacher" as Portal, title: "Teacher Portal", description: "Manage classes, attendance & assignments", icon: BookOpen, gradient: "bg-gradient-to-br from-nexus-teal/5 to-transparent" },
  { key: "admin" as Portal, title: "Admin Portal", description: "Full institution management & analytics", icon: Shield, gradient: "bg-gradient-to-br from-nexus-amber/5 to-transparent" },
];

type AuthMode = "select" | "login" | "signup" | "forgot";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const Index = () => {
  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("select");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { toast } = useToast();
  const { login, signup, demoLogin, isAuthenticated, user, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.portal}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const isEmailValid = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const passwordValid = useMemo(() => PASSWORD_RULES.every((r) => r.test(password)), [password]);

  const validateEmail = () => {
    if (!email) { setEmailError("Email is required"); return false; }
    if (!isEmailValid) { setEmailError("Please enter a valid email address"); return false; }
    setEmailError("");
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortal || !validateEmail()) return;
    if (!passwordValid) { toast({ title: "Invalid Password", description: "Password doesn't meet requirements.", variant: "destructive" }); return; }
    setIsLoading(true);
    const result = await login(email, password, selectedPortal);
    if (result.success) {
      toast({ title: "Welcome!", description: `Logged into ${selectedPortal} portal.` });
      navigate(`/${selectedPortal}`);
    } else {
      toast({ title: "Login Failed", description: result.error || "Invalid credentials.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortal || !validateEmail()) return;
    if (!fullName.trim()) { toast({ title: "Name Required", description: "Please enter your full name.", variant: "destructive" }); return; }
    if (!passwordValid) { toast({ title: "Invalid Password", description: "Password doesn't meet all requirements.", variant: "destructive" }); return; }
    setIsLoading(true);
    const result = await signup(email, password, fullName, selectedPortal);
    if (result.success) {
      toast({ title: "Account Created!", description: "Please check your email to verify your account before signing in." });
      setAuthMode("login");
      setPassword("");
    } else {
      toast({ title: "Signup Failed", description: result.error || "Could not create account.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setIsLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      toast({ title: "Reset Link Sent", description: "Check your email for the password reset link." });
      setAuthMode("login");
    } else {
      toast({ title: "Error", description: result.error || "Could not send reset email.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleDemoLogin = (portal: Portal) => {
    demoLogin(portal);
    toast({ title: "Demo Mode", description: `Exploring ${portal} portal as demo user.` });
    navigate(`/${portal}`);
  };

  const selectPortal = (portal: Portal) => {
    setSelectedPortal(portal);
    setAuthMode("login");
    setEmail("");
    setPassword("");
    setFullName("");
    setEmailError("");
    setPasswordTouched(false);
  };

  const goBack = () => {
    if (authMode === "signup" || authMode === "forgot") {
      setAuthMode("login");
      setPassword("");
    } else {
      setSelectedPortal(null);
      setAuthMode("select");
      setEmail("");
      setPassword("");
      setEmailError("");
    }
  };

  const portalLabel = selectedPortal ? portalConfig.find((p) => p.key === selectedPortal)?.title : "";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <CampusImage src={HERO_IMG} alt="NIT Durgapur Campus" className="h-full w-full" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        <div className="absolute inset-0 hero-gradient opacity-60" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gradient sm:text-6xl">Nexus</h1>
          <p className="mt-2 text-base text-muted-foreground">Your Complete Campus Guide — NIT Durgapur</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {authMode === "select" ? (
            <motion.div key="portals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
              {portalConfig.map((p, i) => (
                <PortalCard key={p.key} title={p.title} description={p.description} icon={p.icon} gradient={p.gradient} delay={0.15 * i} onClick={() => selectPortal(p.key)} />
              ))}
              {/* Demo quick access */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-4">
                <p className="text-center text-xs text-muted-foreground mb-3">Or try a demo</p>
                <div className="flex gap-2 justify-center">
                  {portalConfig.map((p) => (
                    <Button key={p.key} variant="outline" size="sm" onClick={() => handleDemoLogin(p.key)} className="text-xs gap-1">
                      <Zap className="h-3 w-3" /> {p.key.charAt(0).toUpperCase() + p.key.slice(1)}
                    </Button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="auth-form" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.4 }}>
              <div className="glass rounded-xl p-6 sm:p-8">
                <button onClick={goBack} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <h2 className="mb-1 text-xl font-bold text-foreground">
                  {authMode === "login" && portalLabel}
                  {authMode === "signup" && `Create Account`}
                  {authMode === "forgot" && "Reset Password"}
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  {authMode === "login" && "Sign in to continue"}
                  {authMode === "signup" && `Sign up for ${portalLabel}`}
                  {authMode === "forgot" && "Enter your email to receive a reset link"}
                </p>

                {/* Login Form */}
                {authMode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Input placeholder="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} onBlur={validateEmail} required className="bg-muted/50 border-border" />
                      {emailError && <p className="mt-1 text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{emailError}</p>}
                    </div>
                    <div className="relative">
                      <Input placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPasswordTouched(true)} required disabled={!isEmailValid} className="bg-muted/50 border-border pr-10 disabled:opacity-40" />
                      {isEmailValid && (
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    {passwordTouched && password && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-1 overflow-hidden">
                        {PASSWORD_RULES.map((rule) => (
                          <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.test(password) ? "text-status-success" : "text-muted-foreground"}`}>
                            {rule.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {rule.label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} /> Remember me
                      </label>
                      <button type="button" onClick={() => setAuthMode("forgot")} className="text-sm text-primary hover:underline">Forgot password?</button>
                    </div>
                    <Button type="submit" className="w-full font-semibold" disabled={isLoading || !isEmailValid}>
                      {isLoading ? "Signing in…" : "Sign In"}
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button type="button" onClick={() => setAuthMode("signup")} className="text-primary hover:underline font-medium">Sign up</button>
                    </div>
                  </form>
                )}

                {/* Signup Form */}
                {authMode === "signup" && (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-muted/50 border-border" />
                    <div>
                      <Input placeholder="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} onBlur={validateEmail} required className="bg-muted/50 border-border" />
                      {emailError && <p className="mt-1 text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{emailError}</p>}
                    </div>
                    <div className="relative">
                      <Input placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPasswordTouched(true)} required disabled={!isEmailValid} className="bg-muted/50 border-border pr-10 disabled:opacity-40" />
                      {isEmailValid && (
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    {passwordTouched && password && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-1 overflow-hidden">
                        {PASSWORD_RULES.map((rule) => (
                          <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.test(password) ? "text-status-success" : "text-muted-foreground"}`}>
                            {rule.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {rule.label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                    <Button type="submit" className="w-full font-semibold" disabled={isLoading || !isEmailValid || !passwordValid}>
                      {isLoading ? "Creating account…" : "Create Account"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <button type="button" onClick={() => setAuthMode("login")} className="text-primary hover:underline font-medium">Sign in</button>
                    </p>
                  </form>
                )}

                {/* Forgot Password Form */}
                {authMode === "forgot" && (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Input placeholder="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} onBlur={validateEmail} required className="bg-muted/50 border-border" />
                      {emailError && <p className="mt-1 text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{emailError}</p>}
                    </div>
                    <Button type="submit" className="w-full font-semibold" disabled={isLoading || !isEmailValid}>
                      {isLoading ? "Sending…" : "Send Reset Link"}
                    </Button>
                  </form>
                )}

                {/* Demo credentials section for login */}
                {authMode === "login" && selectedPortal && (
                  <div className="mt-6 space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                    </div>
                    <Button variant="outline" className="w-full text-sm" onClick={() => handleDemoLogin(selectedPortal)}>
                      <Zap className="h-4 w-4 mr-2" /> Try Demo ({selectedPortal.charAt(0).toUpperCase() + selectedPortal.slice(1)})
                    </Button>
                  </div>
                )}
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
