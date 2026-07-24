import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "./AuthShell";
import { authApi } from "../services/mockApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    setLoading(true);
    const res = await authApi.forgotPassword(email);
    setLoading(false);
    if (!res.success) return setError(res.message);
    setInfo(res.message);
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your registered email and we'll send a reset link"
      footer={<>Remembered it? <Link to="/login" className="text-cyan-400 font-medium">Back to sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1.5 block">Email address</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="input-field !bg-navy-700 !border-white/10 !text-white"
            placeholder="you@university.edu"
          />
        </div>
        {info && <p className="text-sm text-cyan-400">{info}</p>}
        {error && <p className="text-sm text-coral-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
