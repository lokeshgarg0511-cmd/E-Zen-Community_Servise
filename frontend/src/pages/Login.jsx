import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdLockOutline,
  MdPhoneIphone,
  MdSchool,
  MdVerifiedUser,
  MdFlashOn,
  MdOutlineTimer,
  MdErrorOutline,
  MdCheckCircle,
} from "react-icons/md";
import { FaGoogle, FaGithub, FaApple } from "react-icons/fa";
import AuthShell from "./AuthShell";
import { useAuth } from "../context/AuthContext";
import { DEMO_USERS, DEMO_PASSWORD } from "../services/seedData";

const ROLE_TABS = [
  { key: "school_student", label: "School Student", role: "student", institutionType: "school" },
  { key: "school_faculty", label: "School Faculty", role: "faculty", institutionType: "school" },
  { key: "school_admin",   label: "School Admin",   role: "admin",   institutionType: "school" },
  { key: "college_student",label: "College Student",role: "student", institutionType: "college" },
  { key: "college_faculty",label: "College Faculty",role: "faculty", institutionType: "college" },
  { key: "college_admin",  label: "College Admin",  role: "admin",   institutionType: "college" },
  { key: "parent",         label: "Parent",         role: "parent",  institutionType: "college" },
];

const Login = () => {
  const [activeTab, setActiveTab] = useState("college_student");
  const [authMethod, setAuthMethod] = useState("password"); // "password" | "otp"
  const [emailOrContact, setEmailOrContact] = useState(DEMO_USERS.college_student.email);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, loginWithOtp, loginWithSocial, loginDemo, sendOtp } = useAuth();
  const navigate = useNavigate();

  // Handle Tab switch
  const handleTabChange = (key) => {
    setActiveTab(key);
    const demo = DEMO_USERS[key];
    if (demo) {
      setEmailOrContact(demo.email);
      setPassword(DEMO_PASSWORD);
      setError("");
      setOtpSent(false);
      setOtpCode("");
      setDevOtpHint("");
    }
  };

  // Cooldown countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle 1-Click Demo Login
  const handleDirectDemoLogin = async (key) => {
    setError("");
    setLoading(true);
    const res = await loginDemo(key);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    navigate(`/${res.user.role}`);
  };

  // Handle OTP Send
  const handleSendOtp = async () => {
    if (!emailOrContact.trim()) {
      setError("Please enter your registered institutional email or mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await sendOtp(emailOrContact);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
      return;
    }

    setOtpSent(true);
    setDevOtpHint(res.devOtp || "");
    setResendCooldown(60);
  };

  // Handle Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const currentTab = ROLE_TABS.find((t) => t.key === activeTab);
    const res = await login(emailOrContact, password, currentTab.role);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
      return;
    }
    navigate(`/${res.user.role}`);
  };

  // Handle OTP Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError("Please enter the 6-digit verification OTP.");
      return;
    }
    setError("");
    setLoading(true);
    const currentTab = ROLE_TABS.find((t) => t.key === activeTab);
    const res = await loginWithOtp({
      contact: emailOrContact,
      otp: otpCode,
      role: currentTab.role,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.message);
      return;
    }
    navigate(`/${res.user.role}`);
  };

  // Handle Social Login
  const handleSocialClick = async (provider) => {
    setError("");
    setLoading(true);
    const res = await loginWithSocial({ provider, demoKey: activeTab });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    navigate(`/${res.user.role}`);
  };

  const selectedRole = ROLE_TABS.find((t) => t.key === activeTab);

  return (
    <AuthShell
      maxWidth="max-w-xl"
      title="Institutional Sign In"
      subtitle="Select your role or enter authorized institutional credentials."
      footer={
        <div className="space-y-2 text-xs">
          <p>
            New student registration?{" "}
            <Link to="/register/student" className="text-[#00E5FF] font-semibold hover:underline">
              Register Student Record
            </Link>
          </p>
          <p className="text-slate-500">
            For institutional administration provisioning, contact{" "}
            <a href="mailto:admin@ezen.edu" className="text-slate-400 underline">
              admin@ezen.edu
            </a>
          </p>
        </div>
      }
    >
      {/* 6 Role Selector Grid */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Target Institutional Role
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/10">
          {ROLE_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex flex-col items-center justify-center text-center ${
                  isActive
                    ? "bg-[#00E5FF] text-[#06030C] shadow-glow"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] opacity-75 font-normal ${isActive ? "text-[#06030C]" : "text-slate-400"}`}>
                  {tab.institutionType === "school" ? "DPMS School" : tab.institutionType === "college" ? "Apex Univ" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1-Click Demo Fill Banner */}
      <div className="mb-6 p-3 rounded-xl bg-[#8E4585]/15 border border-[#8E4585]/35 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-200">
          <MdFlashOn size={18} className="text-[#00E5FF]" />
          <span>
            Demo mode active: <strong>{DEMO_USERS[activeTab]?.name}</strong> ({selectedRole?.label})
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleDirectDemoLogin(activeTab)}
          disabled={loading}
          className="btn-primary !py-1.5 !px-3 !text-xs shrink-0"
        >
          1-Click Test Login
        </button>
      </div>

      {/* Authentication Mode Switch: Password vs. OTP */}
      <div className="flex items-center border-b border-white/10 mb-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => { setAuthMethod("password"); setError(""); }}
          className={`pb-2.5 px-4 transition border-b-2 ${
            authMethod === "password"
              ? "border-[#00E5FF] text-[#00E5FF]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Password Login
        </button>
        <button
          type="button"
          onClick={() => { setAuthMethod("otp"); setError(""); }}
          className={`pb-2.5 px-4 transition border-b-2 flex items-center gap-1.5 ${
            authMethod === "otp"
              ? "border-[#00E5FF] text-[#00E5FF]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Email / Mobile OTP</span>
          <span className="badge-purple text-[9px] px-1.5 py-0.2">Secure</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <MdErrorOutline size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mode 1: Password Login Form */}
      {authMethod === "password" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Official Email or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailOrContact}
                onChange={(e) => setEmailOrContact(e.target.value)}
                className="input-field pl-10"
                placeholder="e.g. user@school.edu or user@university.edu"
              />
              <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#00E5FF] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
              />
              <MdLockOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5">
            {loading ? "Authenticating..." : `Sign in as ${selectedRole?.label}`}
          </button>
        </form>
      )}

      {/* Mode 2: Email & Mobile OTP Form */}
      {authMethod === "otp" && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Registered Email or Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={emailOrContact}
                  onChange={(e) => setEmailOrContact(e.target.value)}
                  className="input-field pl-10"
                  placeholder="e.g. 9876543210 or name@school.edu"
                />
                <MdPhoneIphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || resendCooldown > 0}
                className="btn-secondary !py-2 shrink-0 !text-xs"
              >
                {resendCooldown > 0 ? (
                  <span className="flex items-center gap-1">
                    <MdOutlineTimer size={14} /> {resendCooldown}s
                  </span>
                ) : otpSent ? (
                  "Resend OTP"
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="input-field text-center font-mono tracking-widest text-lg font-bold"
                  placeholder="------"
                />
              </div>

              {devOtpHint && (
                <div className="p-2.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[11px] flex items-center justify-between">
                  <span>Demo OTP code: <strong>{devOtpHint}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(devOtpHint)}
                    className="underline font-bold text-white hover:text-[#00E5FF]"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !otpSent}
            className="btn-primary w-full !py-2.5"
          >
            {loading ? "Verifying..." : "Verify OTP &amp; Proceed"}
          </button>
        </form>
      )}

      {/* Social Login Options */}
      <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
          Or Continue with Institutional SSO
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialClick("Google")}
            className="btn-secondary !py-2 flex items-center justify-center gap-2 !text-xs !bg-white/[0.04] !border-white/10 hover:!bg-white/[0.08]"
          >
            <FaGoogle size={14} className="text-rose-400" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialClick("GitHub")}
            className="btn-secondary !py-2 flex items-center justify-center gap-2 !text-xs !bg-white/[0.04] !border-white/10 hover:!bg-white/[0.08]"
          >
            <FaGithub size={14} className="text-slate-200" />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialClick("Apple")}
            className="btn-secondary !py-2 flex items-center justify-center gap-2 !text-xs !bg-white/[0.04] !border-white/10 hover:!bg-white/[0.08]"
          >
            <FaApple size={15} className="text-slate-100" />
            <span>Apple</span>
          </button>
        </div>
      </div>
    </AuthShell>
  );
};

export default Login;
