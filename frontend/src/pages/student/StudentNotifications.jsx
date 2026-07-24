import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { MdWarningAmber, MdInfoOutline, MdCampaign, MdAssignmentLate } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { notificationApi } from "../../services/mockApi";

const ICONS = {
  "at-risk": { icon: MdWarningAmber, color: "text-coral-400 bg-coral-400/10" },
  "missing-assignment": { icon: MdAssignmentLate, color: "text-amber-500 bg-amber-400/10" },
  "low-attendance": { icon: MdWarningAmber, color: "text-amber-500 bg-amber-400/10" },
  announcement: { icon: MdCampaign, color: "text-violet-400 bg-violet-500/10" },
  general: { icon: MdInfoOutline, color: "text-cyan-500 bg-cyan-500/10" },
};

const StudentNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationApi.getMine(user.id).then(setNotifications);
  }, [user.id]);

  const markAllRead = async () => {
    await notificationApi.markAllRead(user.id);
    setNotifications((n) => n.map((x) => ({ ...x, isRead: true })));
  };

  return (
    <DashboardLayout role="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Alerts about attendance, marks, and assignments.</p>
        </div>
        <button onClick={markAllRead} className="btn-secondary !py-2 !px-3 text-xs">Mark all read</button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => {
          const cfg = ICONS[n.type] || ICONS.general;
          const Icon = cfg.icon;
          return (
            <div key={n.id} className={`card-surface p-4 flex gap-3 ${!n.isRead ? "ring-1 ring-cyan-500/30" : ""}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white">{n.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && <p className="text-center text-slate-400 py-10">You're all caught up.</p>}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;
