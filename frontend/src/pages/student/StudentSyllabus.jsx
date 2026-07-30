import React, { useEffect, useState } from "react";
import { MdDownload, MdMenuBook } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const StudentSyllabus = () => {
  const { user } = useAuth(); const [courses, setCourses] = useState([]); const [notice, setNotice] = useState("");
  useEffect(() => { studentApi.getPortal(user.id).then((d) => setCourses(d.courses)); }, [user.id]);
  const download = (course) => { setNotice(`${course.code} syllabus download is ready (demo).`); };
  return <DashboardLayout role="student">
    <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Syllabus</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Course outlines and learning modules for this semester.</p>
    {notice && <div className="mb-4 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 p-3 text-sm">{notice}</div>}
    <div className="space-y-3">{courses.map((course, index) => <div key={course.code} className="card-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex gap-3"><MdMenuBook size={23} className="text-cyan-500 shrink-0" /><div><p className="font-medium text-slate-800 dark:text-white">{course.name}</p><p className="text-xs text-slate-400 mt-1">{course.code} · {index === 0 ? "6 modules" : "5 modules"} · {course.credits} credits</p></div></div>
      <button onClick={() => download(course)} className="btn-secondary text-sm flex items-center justify-center gap-2"><MdDownload /> Download syllabus</button>
    </div>)}</div>
  </DashboardLayout>;
};
export default StudentSyllabus;
