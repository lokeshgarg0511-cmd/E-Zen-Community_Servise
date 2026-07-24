import React, { useEffect, useState } from "react";
import { MdEventAvailable, MdGrade, MdOutlineAssignment, MdWarningAmber } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import RiskGauge from "../../components/RiskGauge";
import { TrendLineChart } from "../../components/Charts";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    studentApi.getDashboard(user.id).then(setData);
  }, [user.id]);

  if (!data) {
    return (
      <DashboardLayout role="student">
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const unread = data.notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout role="student" unreadCount={unread} notificationsTo="/student/notifications">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Academic overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Here's where your composite score stands today.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="card-surface p-6 flex flex-col items-center justify-center lg:col-span-1">
          <RiskGauge
            score={data.composite.score} riskLevel={data.composite.riskLevel}
            attendancePct={data.attendancePct} marksPct={data.marksPct} submissionPct={data.submissionPct}
            size={150}
          />
          {data.composite.riskLevel === "at-risk" && (
            <p className="text-xs text-coral-400 mt-3 text-center flex items-center gap-1">
              <MdWarningAmber /> Meet your faculty advisor this week
            </p>
          )}
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Card icon={<MdEventAvailable />} label="Attendance" value={`${data.attendancePct}%`} accent="violet" />
          <Card icon={<MdGrade />} label="Avg. marks" value={`${data.marksPct}%`} accent="cyan" />
          <Card icon={<MdOutlineAssignment />} label="On-time submissions" value={`${data.submissionPct}%`} accent="amber" />
          <Card icon={<MdWarningAmber />} label="Risk level" value={data.composite.riskLevel === "at-risk" ? "At Risk" : data.composite.riskLevel === "excellent" ? "Excellent" : "Normal"} accent={data.composite.riskLevel === "at-risk" ? "coral" : "cyan"} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card-surface p-5">
          <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Semester performance trend</h2>
          <TrendLineChart data={data.trend} />
        </div>

        <div className="card-surface p-5">
          <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Upcoming & recent assignments</h2>
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
            {data.assignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03]">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.course} &middot; due {new Date(a.dueDate).toLocaleDateString()}</p>
                </div>
                <Badge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
