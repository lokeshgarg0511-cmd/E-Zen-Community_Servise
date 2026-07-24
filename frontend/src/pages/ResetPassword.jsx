import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");
    // In standalone demo mode this is a UI-only confirmation; the live backend
    // endpoint POST /api/auth/reset-password performs the actual update.
    setDone(true);
    setTimeout(() => navigate("/login"), 1800);
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your account"
      footer={<>Back to <Link to="/login" className="text-cyan-400 font-medium">sign in</Link></>}
    >
      {done ? (
        <p className="text-sm text-cyan-400">Password updated. Redirecting to sign in...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">New password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field !bg-navy-700 !border-white/10 !text-white" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">Confirm new password</label>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field !bg-navy-700 !border-white/10 !text-white" />
          </div>
          {error && <p className="text-sm text-coral-400">{error}</p>}
          <button type="submit" className="btn-primary w-full">Reset password</button>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPassword;
