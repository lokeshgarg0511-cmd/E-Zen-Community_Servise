import React, { useEffect, useState } from "react";
import { MdCalendarMonth, MdEmail } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const StudentMentorMeetings = () => {
  const { user } = useAuth(); const [mentor, setMentor] = useState(null); const [booked, setBooked] = useState(false);
  useEffect(() => { studentApi.getPortal(user.id).then((d) => setMentor(d.mentor)); }, [user.id]);
  return <DashboardLayout role="student">
    <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Mentor meetings</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Connect with your faculty mentor for academic guidance.</p>
    <div className="grid lg:grid-cols-2 gap-5"><div className="card-surface p-6"><p className="text-xs uppercase tracking-wider text-cyan-500 font-semibold">Your mentor</p><h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mt-2">{mentor?.name || "Loading…"}</h2><p className="text-sm text-slate-500 mt-1">{mentor?.title}</p><a className="mt-5 flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-300" href={`mailto:${mentor?.email}`}><MdEmail /> {mentor?.email}</a></div>
      <div className="card-surface p-6"><h2 className="font-display font-semibold text-slate-800 dark:text-white">Book a meeting</h2><p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Choose a preferred slot. Your mentor will confirm it.</p><input type="datetime-local" className="input-field mb-3" /><textarea className="input-field min-h-24 mb-4" placeholder="What would you like to discuss?" />{booked && <p className="text-sm text-cyan-500 mb-3">Meeting request sent successfully.</p>}<button onClick={() => setBooked(true)} className="btn-primary flex items-center gap-2"><MdCalendarMonth /> Request meeting</button></div></div>
  </DashboardLayout>;
};
export default StudentMentorMeetings;
