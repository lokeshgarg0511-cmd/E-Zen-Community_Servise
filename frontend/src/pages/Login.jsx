import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { useAuth } from "../context/AuthContext";
import { DEMO_PASSWORD } from "../services/seedData";

const ROLES = [
  { key: "student", label: "Student" },
  { key: "faculty", label: "Faculty" },
  { key: "parent", label: "Parent" },
  { key: "admin", label: "Admin" },
];

const DEMO_EMAILS = {
  student: "akshaj.mehta@university.edu",
  faculty: "meera.krishnan@university.edu",
  parent: "rajesh.mehta@gmail.com",
  admin: "admin@university.edu",
};

const Login = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fillDemo = () => {
    setEmail(DEMO_EMAILS[role]);
    setPassword(DEMO_PASSWORD);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password, role);
    setLoading(false);
    if (!res.success) return setError(res.message);
    navigate(`/${role}`);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your dashboard"
      footer={<>Don't have an account? <Link to="/register/student" className="text-cyan-400 font-medium">Register</Link></>}
    >
      <div className="grid grid-cols-4 gap-1.5 mb-6 p-1 bg-navy-700/50 rounded-xl">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRole(r.key)}
            className={`py-2 rounded-lg text-xs font-semibold transition ${
              role === r.key ? "bg-cyan-500 text-navy-950" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1.5 block">Email address</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="input-field !bg-navy-700 !border-white/10 !text-white"
            placeholder="you@university.edu"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-cyan-400">Forgot password?</Link>
          </div>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="input-field !bg-navy-700 !border-white/10 !text-white"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-coral-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <button type="button" onClick={fillDemo} className="btn-secondary w-full !border-white/15 !text-slate-200">
          Use demo {role} account
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
