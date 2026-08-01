import React, { useEffect, useState } from "react";
import { MdPhotoCamera } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const emptyProfile = {
  fullName: "",
  rollNumber: "",
  semester: "",
  dateOfBirth: "",
  contactNumber: "",
  address: "",
  applicationNumber: "",
  admissionDate: "",
  profilePhoto: "",
};

const profileKey = (studentId) => `spms_student_profile_${studentId}`;

const StudentSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    studentApi.getProfile(user.id).then((student) => {
      const savedProfile = JSON.parse(localStorage.getItem(profileKey(user.id)) || "{}");
      setProfile({ ...emptyProfile, ...student, ...savedProfile });
      setLoading(false);
    });
  }, [user.id]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const changePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfile((current) => ({ ...current, profilePhoto: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    localStorage.setItem(profileKey(user.id), JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Student profile</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Keep your academic and contact details up to date.</p>

      <form onSubmit={saveProfile} className="max-w-4xl card-surface p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-white/10">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-cyan-500/15 flex items-center justify-center text-2xl font-bold text-cyan-600 shrink-0">
            {profile.profilePhoto ? (
              <img src={profile.profilePhoto} alt="Student profile" className="w-full h-full object-cover" />
            ) : (
              profile.fullName?.charAt(0)?.toUpperCase() || "S"
            )}
          </div>
          <div>
            <p className="font-display font-semibold text-slate-800 dark:text-white">Profile photo</p>
            <p className="text-xs text-slate-400 mt-1 mb-3">Upload a clear JPG or PNG photo.</p>
            <label className="btn-secondary text-sm cursor-pointer inline-flex items-center gap-2">
              <MdPhotoCamera size={18} /> Upload photo
              <input type="file" accept="image/png,image/jpeg" onChange={changePhoto} className="hidden" />
            </label>
          </div>
        </div>

        <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-4">Academic information</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-7">
          <Field label="Full name" name="fullName" value={profile.fullName} onChange={updateField} required />
          <Field label="Roll number" name="rollNumber" value={profile.rollNumber} onChange={updateField} required />
          <Field label="Semester" name="semester" type="number" min="1" max="8" value={profile.semester} onChange={updateField} required />
          <Field label="Application number" name="applicationNumber" value={profile.applicationNumber} onChange={updateField} placeholder="Example: APP-2026-001" />
          <Field label="Date of birth" name="dateOfBirth" type="date" value={profile.dateOfBirth} onChange={updateField} />
          <Field label="Date of admission" name="admissionDate" type="date" value={profile.admissionDate} onChange={updateField} />
        </div>

        <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-4">Contact information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email address" name="email" type="email" value={profile.email || ""} disabled />
          <Field label="Contact number" name="contactNumber" type="tel" value={profile.contactNumber} onChange={updateField} placeholder="Example: +91 98765 43210" />
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Address</label>
            <textarea name="address" value={profile.address} onChange={updateField} rows="3" className="input-field resize-y" placeholder="Enter your current address" />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-7">
          <button type="submit" className="btn-primary">Save profile</button>
          {saved && <p className="text-sm text-cyan-600 dark:text-cyan-300">Profile updated successfully.</p>}
        </div>
      </form>
    </DashboardLayout>
  );
};

const Field = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">{label}</label>
    <input {...props} className="input-field" />
  </div>
);

export default StudentSettings;
