import React, { useEffect, useState } from "react";
import {
  MdMenuBook,
  MdAdd,
  MdFileDownload,
  MdSearch,
  MdFolderZip,
  MdPictureAsPdf,
  MdDescription,
  MdCheckCircle,
  MdClose,
  MdCloudUpload,
  MdDeleteOutline,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { studyResourceApi } from "../../services/mockApi";

const FacultyResources = () => {
  const { user } = useAuth();
  const instType = user?.institutionType || (user?.schoolClass ? "school" : "college");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    courseOrClass: instType === "school" ? "Class 10-A" : "CS301",
    subject: instType === "school" ? "Mathematics" : "Data Structures",
    fileType: "PDF",
    fileSize: "2.5 MB",
    description: "",
  });

  useEffect(() => {
    loadResources();
  }, [instType]);

  const loadResources = async () => {
    setLoading(true);
    const list = await studyResourceApi.getResources(instType);
    setResources(list);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setPublishing(true);
    const res = await studyResourceApi.uploadResource({
      ...form,
      institutionType: instType,
      uploadedBy: user?.fullName || "Faculty Member",
    });

    setPublishing(false);
    if (res.success) {
      setResources((prev) => [res.resource, ...prev]);
      setUploadModalOpen(false);
      setForm({
        title: "",
        courseOrClass: instType === "school" ? "Class 10-A" : "CS301",
        subject: instType === "school" ? "Mathematics" : "Data Structures",
        fileType: "PDF",
        fileSize: "2.5 MB",
        description: "",
      });
      setToastMsg("Resource published to student repository successfully!");
      setTimeout(() => setToastMsg(""), 3500);
    }
  };

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase()) ||
      r.courseOrClass?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#0D0819] border border-white/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#8E4585]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#8E4585] mb-3">
                <MdMenuBook className="text-sm" />
                <span>Faculty Curricular Repository</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white tracking-tight">
                Study Materials & Syllabi
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Publish lecture slide decks, syllabus outlines, question banks, and lab instructions accessible by
                enrolled students in your classes.
              </p>
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8E4585] text-white font-display font-bold text-sm shadow-glow hover:opacity-95 transition-all shrink-0"
            >
              <MdAdd className="text-lg" />
              <span>Publish New Material</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search published resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-white">{filtered.length}</strong> published materials
            </span>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <MdCheckCircle className="text-base shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Resources Table/Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#0D0819] rounded-2xl border border-white/10">
            <MdMenuBook className="mx-auto text-4xl text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-white">No resources found</h3>
            <p className="text-xs text-slate-400 mt-1">Click "Publish New Material" above to upload notes or guides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((res) => (
              <div
                key={res.id}
                className="bg-[#0D0819] border border-white/10 hover:border-[#8E4585]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-semibold text-[#8E4585]">
                      {res.courseOrClass} • {res.subject}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      {res.fileType === "ZIP" ? (
                        <MdFolderZip className="text-amber-400 text-sm" />
                      ) : res.fileType === "PDF" ? (
                        <MdPictureAsPdf className="text-rose-400 text-sm" />
                      ) : (
                        <MdDescription className="text-cyan-400 text-sm" />
                      )}
                      <span>{res.fileSize}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-white leading-snug">{res.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {res.description || "Course handbook and lecture notes repository file."}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <span className="block text-slate-400 font-medium">{res.uploadedBy}</span>
                    <span>{res.updatedAt}</span>
                  </div>

                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Upload Material */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#0D0819] border border-white/20 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-0.5">
                  <div className="w-full h-full bg-[#0D0819] rounded-[6px] flex items-center justify-center text-[#00E5FF]">
                    <MdCloudUpload />
                  </div>
                </div>
                <h2 className="text-lg font-display font-bold text-white">Publish Course Material</h2>
              </div>
              <p className="text-xs text-slate-400 mb-5">
                Uploaded materials will be instantly available to all students enrolled in this course/grade.
              </p>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Unit 3 - Dynamic Programming & Trees Handbook"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {instType === "school" ? "Class / Grade" : "Course Code"}
                    </label>
                    <input
                      type="text"
                      value={form.courseOrClass}
                      onChange={(e) => setForm({ ...form, courseOrClass: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Domain</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Format</label>
                    <select
                      value={form.fileType}
                      onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="PDF" className="bg-[#0D0819]">PDF Document</option>
                      <option value="ZIP" className="bg-[#0D0819]">ZIP Archive / Code</option>
                      <option value="DOCX" className="bg-[#0D0819]">Word DOCX</option>
                      <option value="PPTX" className="bg-[#0D0819]">Presentation PPTX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Simulated Size</label>
                    <input
                      type="text"
                      value={form.fileSize}
                      onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Key Topics</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of chapters, formulas, or assignment guidelines contained in this file..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={publishing}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00E5FF] to-[#8E4585] text-white shadow-glow hover:opacity-95 transition-opacity"
                  >
                    {publishing ? "Publishing..." : "Publish Material"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyResources;
