import React, { useEffect, useState } from "react";
import {
  MdMenuBook,
  MdFileDownload,
  MdSearch,
  MdFolderZip,
  MdPictureAsPdf,
  MdDescription,
  MdCheckCircle,
  MdClass,
  MdVisibility,
  MdClose,
  MdBookmarkBorder,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { studyResourceApi } from "../../services/mockApi";

const StudentResources = () => {
  const { user } = useAuth();
  const instType = user?.institutionType || (user?.schoolClass ? "school" : "college");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadedIds, setDownloadedIds] = useState([]);
  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    loadResources();
  }, [instType]);

  const loadResources = async () => {
    setLoading(true);
    const list = await studyResourceApi.getResources(instType);
    setResources(list);
    setLoading(false);
  };

  const handleDownload = (res) => {
    setDownloadingId(res.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedIds((prev) => [...new Set([...prev, res.id])]);
      // Trigger a clean synthetic file download
      const element = document.createElement("a");
      const file = new Blob(
        [
          `E-ZEN ACADEMIC STUDY REPOSITORY\n\nTitle: ${res.title}\nCourse / Class: ${res.courseOrClass}\nSubject: ${res.subject}\nAuthor / Faculty: ${res.uploadedBy}\nPublished: ${res.updatedAt}\n\nSummary Overview:\n${res.description}\n\nOfficial Academic Reference Material - E-Zen Institutional Portal.`,
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = `${res.title.replace(/[^a-zA-Z0-9]/g, "_")}_EZen.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  const categories = ["all", ...new Set(resources.map((r) => r.courseOrClass || r.subject).filter(Boolean))];

  const filtered = resources.filter((r) => {
    const matchCat =
      selectedCategory === "all" ||
      r.courseOrClass === selectedCategory ||
      r.subject === selectedCategory;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#0D0819] border border-white/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#8E4585]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00E5FF] mb-3">
                <MdMenuBook className="text-sm" />
                <span>{instType === "school" ? "School Curricular Repository" : "University Course Ware"}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white tracking-tight">
                Study Resources & Digital Library
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Access official syllabi, lecture notes, formula handbooks, and reference problem sets curated by your
                faculty for {instType === "school" ? user?.schoolClass || "Class 10" : user?.department || "B.Tech CSE"}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-center">
                <span className="text-xs text-slate-400 block font-medium">Available</span>
                <span className="text-xl font-display font-bold text-white">{resources.length}</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-center">
                <span className="text-xs text-slate-400 block font-medium">Downloaded</span>
                <span className="text-xl font-display font-bold text-[#00E5FF]">{downloadedIds.length}</span>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search notes, topics, formulas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#00E5FF] to-[#8E4585] text-white shadow-glow"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {cat === "all" ? "All Subjects" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#0D0819] rounded-2xl border border-white/10">
            <MdMenuBook className="mx-auto text-4xl text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-white">No study resources found</h3>
            <p className="text-xs text-slate-400 mt-1">Try refining your search terms or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((res) => {
              const isDownloaded = downloadedIds.includes(res.id);
              const isDownloading = downloadingId === res.id;

              return (
                <div
                  key={res.id}
                  className="bg-[#0D0819] border border-white/10 hover:border-[#00E5FF]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-glow/20"
                >
                  <div>
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-semibold text-[#00E5FF]">
                        {res.courseOrClass || res.subject}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        {res.fileType === "ZIP" ? (
                          <MdFolderZip className="text-amber-400 text-sm" />
                        ) : res.fileType === "PDF" ? (
                          <MdPictureAsPdf className="text-rose-400 text-sm" />
                        ) : (
                          <MdDescription className="text-cyan-400 text-sm" />
                        )}
                        <span>{res.fileSize || "PDF"}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-display font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {res.description || "Official course reading notes and reference syllabus prepared by faculty."}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      <span className="block text-slate-300 font-medium truncate max-w-[140px]">{res.uploadedBy}</span>
                      <span className="text-[10px] text-slate-500">{res.updatedAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewResource(res)}
                        title="Quick View Details"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                      >
                        <MdVisibility className="text-base" />
                      </button>

                      <button
                        onClick={() => handleDownload(res)}
                        disabled={isDownloading}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isDownloaded
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-gradient-to-r from-[#00E5FF] to-[#8E4585] text-white hover:shadow-glow"
                        }`}
                      >
                        {isDownloading ? (
                          <span className="animate-spin text-sm">⏳</span>
                        ) : isDownloaded ? (
                          <>
                            <MdCheckCircle className="text-sm" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <MdFileDownload className="text-sm" />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Resource Preview */}
        {previewResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#0D0819] border border-white/20 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setPreviewResource(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-semibold mb-3">
                <MdBookmarkBorder className="text-sm" />
                <span>{previewResource.courseOrClass} • {previewResource.subject}</span>
              </div>

              <h2 className="text-lg font-display font-extrabold text-white pr-6">
                {previewResource.title}
              </h2>

              <div className="my-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Author / Faculty:</span>
                  <span className="text-white font-medium">{previewResource.uploadedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Format:</span>
                  <span className="text-white font-medium">{previewResource.fileType} ({previewResource.fileSize})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Published Date:</span>
                  <span className="text-white font-medium">{previewResource.updatedAt}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {previewResource.description}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewResource);
                    setPreviewResource(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00E5FF] to-[#8E4585] text-white shadow-glow hover:opacity-95 transition-opacity"
                >
                  <MdFileDownload className="text-sm" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentResources;
