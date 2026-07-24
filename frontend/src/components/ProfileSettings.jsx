import React, { useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const ProfileSettings = ({ role, extraFields = [] }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout role={role}>
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your profile and preferences.</p>

      <div className="grid lg:grid-cols-2 gap-5">
        <form onSubmit={handleSave} className="card-surface p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-800 dark:text-white">Profile information</h2>
          <Field label="Full name" defaultValue={user?.fullName} />
          <Field label="Email address" defaultValue={user?.email} disabled />
          {extraFields.map((f) => <Field key={f.label} {...f} />)}
          {saved && <p className="text-sm text-cyan-500">Profile updated.</p>}
          <button type="submit" className="btn-primary">Save changes</button>
        </form>

        <div className="card-surface p-6 space-y-5">
          <h2 className="font-display font-semibold text-slate-800 dark:text-white">Appearance</h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <MdDarkMode className="text-cyan-400" size={20} /> : <MdLightMode className="text-amber-500" size={20} />}
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
                <p className="text-xs text-slate-400">Switch between light and dark themes</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full p-1 transition ${theme === "dark" ? "bg-cyan-500" : "bg-slate-300"}`}
            >
              <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <h2 className="font-display font-semibold text-slate-800 dark:text-white pt-2">Change password</h2>
          <Field label="Current password" type="password" />
          <Field label="New password" type="password" />
          <button className="btn-secondary">Update password</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Field = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">{label}</label>
    <input {...props} className="input-field" />
  </div>
);

export default ProfileSettings;
