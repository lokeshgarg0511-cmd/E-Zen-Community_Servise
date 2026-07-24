import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { authApi } from "../services/mockApi";

const DEPARTMENTS = ["CSE", "ECE", "MECH", "CIVIL"];

const RegisterStudent = () => {
  const [form, setForm] = useState({
    fullName: "", rollNumber: "", email: "", department: "CSE",
    semester: "1", yearOfPassing: "2028", password: "", confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const sendOtp = async () => {
    setError(""); setInfo("");
    if (!form.email) return setError("Enter your college email first");
    setLoading(true);
    const res = await authApi.sendOtp(form.email, form.fullName);
    setLoading(false);
    if (!res.success) return setError(res.message);
    setOtpSent(true);
    setDevOtp(res.devOtp);
    setInfo(res.message);
  };

  const verifyOtp = async () => {
    setError("");
    setLoading(true);
    const res = await authApi.verifyOtp(form.email, otp);
    setLoading(false);
    if (!res.success) return setError(res.message);
    setOtpVerified(true);
    setInfo("Email verified successfully.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!otpVerified) return setError("Please verify your email OTP before registering");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    const res = await authApi.registerStudent(form);
    setLoading(false);
    if (!res.success) return setError(res.message);
    navigate("/login");
  };

  return (
    <AuthShell
      title="Student registration"
      subtitle="Verify your college email, then create your account"
      footer={<>Already have an account? <Link to="/login" className="text-cyan-400 font-medium">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" value={form.fullName} onChange={update("fullName")} required />
        <Field label="Roll number" value={form.rollNumber} onChange={update("rollNumber")} required />

        <div>
          <label className="text-xs font-medium text-slate-300 mb-1.5 block">College email</label>
          <div className="flex gap-2">
            <input
              type="email" required value={form.email} onChange={update("email")} disabled={otpSent}
              className="input-field !bg-navy-700 !border-white/10 !text-white flex-1"
              placeholder="you@university.edu"
            />
            <button type="button" onClick={sendOtp} disabled={loading || otpSent} className="btn-secondary !border-white/15 !text-slate-200 whitespace-nowrap">
              Send OTP
            </button>
          </div>
        </div>

        {otpSent && !otpVerified && (
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Enter OTP {devOtp && <span className="text-cyan-400">(demo OTP: {devOtp})</span>}
            </label>
            <div className="flex gap-2">
              <input
                value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                className="input-field !bg-navy-700 !border-white/10 !text-white flex-1" placeholder="6-digit code"
              />
              <button type="button" onClick={verifyOtp} disabled={loading} className="btn-primary whitespace-nowrap">
                Verify OTP
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">Department</label>
            <select value={form.department} onChange={update("department")} className="input-field !bg-navy-700 !border-white/10 !text-white">
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <Field label="Semester" type="number" min="1" max="10" value={form.semester} onChange={update("semester")} required />
        </div>
        <Field label="Year of passing" type="number" value={form.yearOfPassing} onChange={update("yearOfPassing")} required />
        <Field label="Password" type="password" value={form.password} onChange={update("password")} required />
        <Field label="Confirm password" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} required />

        {info && <p className="text-sm text-cyan-400">{info}</p>}
        {error && <p className="text-sm text-coral-400">{error}</p>}

        <button type="submit" disabled={loading || !otpVerified} className="btn-primary w-full">
          Create account
        </button>
      </form>
    </AuthShell>
  );
};

const Field = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-medium text-slate-300 mb-1.5 block">{label}</label>
    <input {...props} className="input-field !bg-navy-700 !border-white/10 !text-white" />
  </div>
);

export default RegisterStudent;
