import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { authApi } from "../services/mockApi";

const RegisterParent = () => {
  const [form, setForm] = useState({
    fullName: "", parentEmail: "", mobileNumber: "", relationship: "Father",
    studentRollNumber: "", studentEmail: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    const res = await authApi.registerParent(form);
    setLoading(false);
    if (!res.success) return setError(res.message);
    navigate("/login");
  };

  return (
    <AuthShell
      title="Parent registration"
      subtitle="Link your account to your child's student profile"
      footer={<>Already have an account? <Link to="/login" className="text-cyan-400 font-medium">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Parent full name" value={form.fullName} onChange={update("fullName")} required />
        <Field label="Parent email" type="email" value={form.parentEmail} onChange={update("parentEmail")} required />
        <Field label="Mobile number" value={form.mobileNumber} onChange={update("mobileNumber")} required />
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1.5 block">Relationship</label>
          <select value={form.relationship} onChange={update("relationship")} className="input-field !bg-navy-700 !border-white/10 !text-white">
            <option>Father</option><option>Mother</option><option>Guardian</option>
          </select>
        </div>
        <Field label="Student roll number" value={form.studentRollNumber} onChange={update("studentRollNumber")} required />
        <Field label="Student college email" type="email" value={form.studentEmail} onChange={update("studentEmail")} required />
        <Field label="Password" type="password" value={form.password} onChange={update("password")} required />
        <Field label="Confirm password" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} required />

        {error && <p className="text-sm text-coral-400">{error}</p>}
        <p className="text-xs text-slate-500">
          Try the demo: roll <span className="text-cyan-400">CSE21B045</span>, email <span className="text-cyan-400">akshaj.mehta@university.edu</span>
        </p>
        <button type="submit" disabled={loading} className="btn-primary w-full">Create account</button>
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

export default RegisterParent;
