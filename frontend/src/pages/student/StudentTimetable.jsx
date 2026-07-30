import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const StudentTimetable = () => {
  const { user } = useAuth(); const [timetable, setTimetable] = useState({});
  useEffect(() => { studentApi.getPortal(user.id).then((d) => setTimetable(d.timetable)); }, [user.id]);
  return <DashboardLayout role="student">
    <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Weekly timetable</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Regular class schedule for the current semester.</p>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{Object.entries(timetable).map(([day, classes]) => <section key={day} className="card-surface overflow-hidden"><h2 className="bg-cyan-500/10 px-5 py-3 font-display font-semibold text-cyan-600 dark:text-cyan-300">{day}</h2><div className="p-4 space-y-2">{classes.map((item) => <div key={item} className="rounded-lg bg-slate-50 dark:bg-white/[0.04] px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200">{item}</div>)}</div></section>)}</div>
  </DashboardLayout>;
};
export default StudentTimetable;
