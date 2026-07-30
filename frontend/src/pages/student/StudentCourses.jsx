import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const StudentCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  useEffect(() => { studentApi.getPortal(user.id).then((d) => setCourses(d.courses)); }, [user.id]);

  return <DashboardLayout role="student">
    <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">My courses</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Your registered courses for the current semester.</p>
    <div className="grid md:grid-cols-2 gap-4">
      {courses.map((course) => <div key={course.code} className="card-surface p-5 border-l-4 border-cyan-400">
        <div className="flex justify-between gap-3"><div><p className="text-xs font-semibold text-cyan-500">{course.code}</p><h2 className="font-display font-semibold text-slate-800 dark:text-white mt-1">{course.name}</h2></div><span className="text-xs rounded-lg bg-slate-100 dark:bg-white/10 px-2 py-1 h-fit text-slate-500">{course.credits} credits</span></div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Instructor: {course.instructor}</p>
      </div>)}
    </div>
  </DashboardLayout>;
};
export default StudentCourses;
