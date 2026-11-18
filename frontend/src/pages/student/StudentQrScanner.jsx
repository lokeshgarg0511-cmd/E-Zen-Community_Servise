import React, { useState, useEffect } from "react";
import {
  MdQrCodeScanner,
  MdCheckCircle,
  MdErrorOutline,
  MdCameraAlt,
  MdSecurity,
  MdFlashOn,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { qrApi } from "../../services/mockApi";

const StudentQrScanner = () => {
  const { user } = useAuth();
  const [tokenInput, setTokenInput] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const res = await qrApi.getSession();
    if (res.success) {
      setActiveSession(res.session);
    }
  };

  const handleVerify = async (tokenToUse) => {
    const token = tokenToUse || tokenInput;
    if (!token.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await qrApi.verifyToken({
      sessionId: activeSession?.id || "qr_sess_demo",
      token: token.trim(),
      studentId: user?.id,
    });

    setLoading(false);
    setResult(res);
  };

  const handleSimulateCameraScan = () => {
    setIsSimulatingCamera(true);
    setTimeout(async () => {
      setIsSimulatingCamera(false);
      // Fetch latest rotating token from session
      const sessRes = await qrApi.getSession();
      const latestToken = sessRes.session?.currentToken;
      setTokenInput(latestToken);
      handleVerify(latestToken);
    }, 1500);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-white">QR Attendance Scanner</h1>
            <span className="badge-cyan text-xs">SMART VERIFICATION</span>
          </div>
          <p className="text-xs text-slate-400">
            Scan the dynamic QR code displayed on the classroom projector to record your physical presence.
          </p>
        </div>

        {/* Current Active Class Card */}
        <div className="card-surface p-5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Active Classroom Session</p>
            <p className="font-display font-bold text-base text-white mt-0.5">
              {activeSession?.courseOrSubject || "CS301 - Data Structures & Algorithms"}
            </p>
            <p className="text-[11px] text-[#00E5FF] mt-0.5">
              {activeSession?.classOrSection || "CSE-A (Sem 5)"} • Faculty: {activeSession?.facultyName || "Dr. Meera Krishnan"}
            </p>
          </div>
          <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Live Session
          </span>
        </div>

        {/* Camera Scanner Simulation Area */}
        <div className="card-surface p-8 border border-white/15 text-center flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-2xl border-2 border-dashed border-[#00E5FF]/50 bg-white/[0.02] flex flex-col items-center justify-center overflow-hidden mb-6">
            {isSimulatingCamera ? (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-[#00E5FF] font-semibold animate-pulse">Capturing live QR token...</p>
              </div>
            ) : (
              <>
                <MdCameraAlt size={48} className="text-slate-500 mb-2" />
                <p className="text-xs text-slate-300 font-medium">Point Camera at Classroom Board</p>
                <p className="text-[10px] text-slate-500">Auto-detects 5-second dynamic code</p>
              </>
            )}

            {/* Scanning line animation */}
            {isSimulatingCamera && (
              <div className="absolute inset-x-0 h-1 bg-[#00E5FF] shadow-glow top-1/2 -translate-y-1/2 animate-bounce" />
            )}
          </div>

          <button
            type="button"
            onClick={handleSimulateCameraScan}
            disabled={isSimulatingCamera || loading}
            className="btn-primary !py-3 !px-6 text-sm flex items-center gap-2 shadow-glow"
          >
            <MdQrCodeScanner size={18} />
            <span>{isSimulatingCamera ? "Scanning Camera..." : "Simulate Optical Scan"}</span>
          </button>
        </div>

        {/* Manual Token Verification Fallback */}
        <div className="card-surface p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white">Manual Token Entry Fallback</h3>
            <span className="text-[11px] text-slate-400">If camera is unavailable</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. EZEN-QR-9821-SEC"
              className="input-field font-mono font-bold text-center"
            />
            <button
              onClick={() => handleVerify()}
              disabled={loading || !tokenInput.trim()}
              className="btn-secondary !py-2 shrink-0 text-xs"
            >
              {loading ? "Verifying..." : "Verify Token"}
            </button>
          </div>

          {/* Quick Auto-fill button for testing */}
          <button
            type="button"
            onClick={async () => {
              const res = await qrApi.getSession();
              if (res.session?.currentToken) {
                setTokenInput(res.session.currentToken);
                handleVerify(res.session.currentToken);
              }
            }}
            className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1"
          >
            <MdFlashOn size={14} /> Quick-Fill Classroom Active Token
          </button>
        </div>

        {/* Verification Result Banner */}
        {result && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              result.success
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/30 text-rose-300"
            }`}
          >
            {result.success ? (
              <MdCheckCircle size={22} className="shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <MdErrorOutline size={22} className="shrink-0 mt-0.5 text-rose-400" />
            )}
            <div>
              <p className="font-bold text-sm">{result.success ? "Attendance Recorded!" : "Verification Failed"}</p>
              <p className="mt-0.5 opacity-90">{result.message}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentQrScanner;
