import React, { useEffect, useState } from "react";
import {
  MdQrCodeScanner,
  MdRefresh,
  MdCheckCircle,
  MdPeople,
  MdClose,
  MdPlayCircle,
  MdStopCircle,
  MdSecurity,
  MdTimer,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { qrApi } from "../../services/mockApi";

const FacultyQrSession = () => {
  const [session, setSession] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load session
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    setLoading(true);
    const res = await qrApi.getSession();
    if (res.success) {
      setSession(res.session);
      setIsActive(res.session.active);
    }
    setLoading(false);
  };

  // 5-second dynamic rotating token loop
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(async () => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Rotate token on server
          qrApi.rotateToken().then((res) => {
            if (res.success) {
              setSession((s) => ({ ...s, currentToken: res.currentToken }));
            }
          });
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleToggleSession = async () => {
    if (isActive) {
      await qrApi.closeSession();
      setIsActive(false);
    } else {
      setIsActive(true);
      setCountdown(5);
    }
  };

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-white">Dynamic QR Attendance Generator</h1>
              <span className="badge-cyan text-xs">5s ROTATING TOKEN</span>
            </div>
            <p className="text-xs text-slate-400">
              Project this screen in the lecture hall. Tokens refresh every 5 seconds to eliminate proxy attendance.
            </p>
          </div>

          <button
            onClick={handleToggleSession}
            className={`btn-primary !py-2.5 !px-5 text-xs flex items-center gap-2 ${
              isActive ? "!bg-rose-500 hover:!bg-rose-400 !text-white" : "!bg-[#00E5FF] !text-[#06030C]"
            }`}
          >
            {isActive ? (
              <>
                <MdStopCircle size={18} /> Close Session
              </>
            ) : (
              <>
                <MdPlayCircle size={18} /> Restart Session
              </>
            )}
          </button>
        </div>

        {/* Main Grid: QR Display & Live Verified List */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Dynamic QR Generator Display */}
          <div className="lg:col-span-6 card-surface p-6 sm:p-8 border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {isActive ? (
              <>
                {/* Session Info */}
                <div className="mb-4">
                  <span className="badge-purple text-xs mb-2">
                    {session?.classOrSection || "CSE-A (Sem 5)"}
                  </span>
                  <h2 className="font-display font-bold text-lg text-white">
                    {session?.courseOrSubject || "CS301 - Data Structures & Algorithms"}
                  </h2>
                </div>

                {/* Animated Dynamic QR Container */}
                <div className="relative p-6 rounded-2xl bg-white border-4 border-[#00E5FF] shadow-glow my-3 transition-all duration-300">
                  {/* Stylized QR Visual Representation */}
                  <div className="w-56 h-56 flex flex-col items-center justify-center relative">
                    <MdQrCodeScanner size={190} className="text-[#06030C]" />
                    <div className="absolute inset-0 bg-[#00E5FF]/10 animate-pulse pointer-events-none rounded-lg" />
                  </div>
                </div>

                {/* Rotating Token & Countdown */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <MdTimer size={18} className="text-[#00E5FF] animate-spin" />
                    <span className="text-xs font-semibold text-slate-300">
                      Token refreshes in: <strong className="text-[#00E5FF] font-mono text-base">{countdown}s</strong>
                    </span>
                  </div>

                  <div className="p-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-sm tracking-wider font-bold text-white">
                    {session?.currentToken || "EZEN-QR-9821-SEC"}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Students must scan and submit while this token is active on screen.
                  </p>
                </div>
              </>
            ) : (
              <div className="py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
                  <MdClose size={32} />
                </div>
                <h3 className="font-display font-bold text-xl text-white">Session Closed</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Attendance recording for this session is locked. All verified student scans have been recorded to the
                  academic database.
                </p>
              </div>
            )}
          </div>

          {/* Right: Live Scanned Students List */}
          <div className="lg:col-span-6 card-surface p-6 border border-white/10 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <MdPeople className="text-[#00E5FF]" size={22} />
                <h3 className="font-display font-bold text-base text-white">Verified Scans</h3>
              </div>
              <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {session?.verifiedStudents?.length || 0} Students Present
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[380px]">
              {session?.verifiedStudents?.length ? (
                session.verifiedStudents.map((stud, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs hover:border-[#00E5FF]/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{stud.name}</p>
                        <p className="text-[11px] text-slate-400">{stud.roll}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{stud.scannedAt}</span>
                      <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <MdCheckCircle size={12} /> {stud.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Awaiting student scans. Tell students to open their E-Zen QR Scanner.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MdSecurity className="text-[#00E5FF]" size={15} /> Server Verified
              </span>
              <span>Replay protection enabled</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyQrSession;
