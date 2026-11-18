import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdminPanelSettings,
  MdArrowForward,
  MdClose,
  MdPerson,
  MdSchool,
  MdCoPresent,
  MdBusiness,
  MdInfoOutline,
} from "react-icons/md";

const ROLES = [
  {
    id: "student",
    label: "Student",
    icon: MdPerson,
    desc: "Access attendance, marks, assignments, study resources & AI learning support.",
  },
  {
    id: "faculty",
    label: "Faculty",
    icon: MdCoPresent,
    desc: "Manage classes, record attendance, grade assignments & mentor learners.",
  },
  {
    id: "admin",
    label: "Admin",
    icon: MdAdminPanelSettings,
    desc: "Oversee institutional structure, courses, faculty coordination & reports.",
  },
];

const INSTITUTIONS = [
  {
    id: "school",
    label: "School",
    icon: MdSchool,
    desc: "K-12 & Senior Secondary classrooms, sections & periodic report cards.",
  },
  {
    id: "college",
    label: "College",
    icon: MdBusiness,
    desc: "Departments, semesters, degree courses & higher-education workflows.",
  },
];

const GetStartedModal = ({ open, initialInstitution = "college", onClose }) => {
  const dialogRef = useRef(null);
  const pressedOutsideRef = useRef(false);
  const navigate = useNavigate();

  const [institution, setInstitution] = useState(initialInstitution);
  const [role, setRole] = useState("student");

  useEffect(() => {
    setInstitution(initialInstitution || "college");
  }, [initialInstitution, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
  };

  // Pointer-position light-dismiss fallback when dialog closedby="any" is unsupported
  const isOutsideDialog = (e, dialog) => {
    const rect = dialog.getBoundingClientRect();
    return (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    );
  };

  const handlePointerDown = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    pressedOutsideRef.current = isOutsideDialog(e, dialog);
  };

  const handlePointerUp = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pressedOutsideRef.current && isOutsideDialog(e, dialog)) {
      onClose();
    }
    pressedOutsideRef.current = false;
  };

  const goToRoute = (path) => {
    onClose();
    navigate(path);
  };

  const roleLabel = ROLES.find((r) => r.id === role)?.label || "User";
  const instLabel = INSTITUTIONS.find((i) => i.id === institution)?.label || "Institution";

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="get-started-title"
      onCancel={handleCancel}
      onClose={onClose}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="ezen-dialog w-[calc(100%-2rem)] max-w-2xl m-auto p-0 rounded-3xl border border-white/15 bg-[#0D0819] text-slate-100 shadow-card overflow-hidden"
    >
      <div className="relative p-6 sm:p-8 max-h-[90dvh] overflow-y-auto">
        {/* Top gradient highlight */}
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8E4585] to-[#00E5FF]"
          aria-hidden="true"
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className="badge badge-cyan text-[11px] mb-2">Portal Access Setup</span>
            <h2 id="get-started-title" className="font-display text-xl sm:text-2xl font-bold text-white">
              Get Started with E-Zen
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your institution type and role to continue to the existing authentication flow.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Get Started dialog"
            className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center shrink-0 transition"
          >
            <MdClose size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Step 1: School or College */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
            1. Select Institution Environment
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INSTITUTIONS.map(({ id, label, icon: Icon, desc }) => {
              const active = institution === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setInstitution(id)}
                  aria-pressed={active}
                  className={`text-left p-4 rounded-2xl border transition flex items-start gap-3 ${active
                      ? "bg-[#00E5FF]/12 border-[#00E5FF] shadow-glow"
                      : "bg-white/[0.03] border-white/10 hover:border-white/25"
                    }`}
                >
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active
                        ? "bg-[#00E5FF] text-[#06030C]"
                        : "bg-white/[0.06] text-[#00E5FF]"
                      }`}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-white">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">{desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Role Selection */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
            2. Select Your Role
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROLES.map(({ id, label, icon: Icon, desc }) => {
              const active = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  aria-pressed={active}
                  className={`text-left p-4 rounded-2xl border transition flex flex-col gap-2 ${active
                      ? "bg-[#8E4585]/25 border-[#C476BB] shadow-glowPurple"
                      : "bg-white/[0.03] border-white/10 hover:border-white/25"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${active
                          ? "bg-[#8E4585] text-white"
                          : "bg-white/[0.06] text-[#C476BB]"
                        }`}
                    >
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${active ? "bg-[#00E5FF] shadow-glow" : "bg-white/15"
                        }`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-display font-bold text-sm text-white">{label}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contextual Auth Path Note */}
        <div className="mb-6 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
          <MdInfoOutline size={18} className="text-[#00E5FF] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="leading-relaxed">
            <p>
              Selected path:{" "}
              <strong className="text-white">
                {instLabel} {roleLabel}
              </strong>
              . On the Sign In screen, select{" "}
              <span className="text-[#00E5FF] font-medium">
                {instLabel} {roleLabel}
              </span>{" "}
              to authenticate with password, OTP, or available demo credentials.
            </p>
            {role === "student" && institution === "school" && (
              <p className="text-slate-400 mt-1">
                Note: The standalone student registration page currently captures college department and semester fields; School Students can sign in via the main login portal.
              </p>
            )}
            {(role === "faculty" || role === "admin") && (
              <p className="text-slate-400 mt-1">
                Faculty and Admin accounts access the platform directly through the Institutional Sign In portal.
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => goToRoute("/login")}
            className="btn-primary flex-1 !py-3 text-sm"
          >
            <span>Continue to Sign In</span>
            <MdArrowForward size={17} aria-hidden="true" />
          </button>

          {role === "student" && (
            <button
              type="button"
              onClick={() => goToRoute("/register/student")}
              className="btn-secondary flex-1 !py-3 text-sm"
            >
              New Student Registration
            </button>
          )}
        </div>

        {/* Parent link */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          Are you a parent or guardian?{" "}
          <button
            type="button"
            onClick={() => goToRoute("/register/parent")}
            className="text-[#00E5FF] font-semibold hover:underline"
          >
            Go to Parent Registration
          </button>{" "}
          or{" "}
          <button
            type="button"
            onClick={() => goToRoute("/login")}
            className="text-[#C476BB] font-semibold hover:underline"
          >
            Sign In
          </button>
          .
        </div>
      </div>
    </dialog>
  );
};

export default GetStartedModal;
