import React, { useState } from 'react';
import { Branch, Semester, Subject, Chapter, Resource } from '../types';

interface BrowseViewProps {
  branches: Branch[];
  semesters: Semester[];
  subjects: Subject[];
  chapters: Chapter[];
  resources: Resource[];
  initialFilters?: { branchId?: string; semesterId?: string; type?: string; q?: string };
  onSelectSubject: (subject: Subject) => void;
  onOpenPdf: (resource: Resource) => void;
  onDownloadPdf: (resource: Resource) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  branches,
  semesters,
  subjects,
  chapters,
  resources,
  initialFilters,
  onSelectSubject,
  onOpenPdf,
  onDownloadPdf,
}) => {
  const [selectedBranch, setSelectedBranch] = useState(initialFilters?.branchId || 'all');
  const [selectedSemester, setSelectedSemester] = useState(initialFilters?.semesterId || 'all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState(initialFilters?.type || 'all');
  const [searchQuery, setSearchQuery] = useState(initialFilters?.q || '');

  // Filter subjects based on branch and semester
  const availableSubjects = subjects.filter((s) => {
    if (selectedBranch !== 'all' && s.branchId !== selectedBranch) return false;
    if (selectedSemester !== 'all' && s.semesterId !== selectedSemester && String(s.semNumber) !== selectedSemester) {
      return false;
    }
    return true;
  });

  // Filter resources
  const filteredResources = resources.filter((res) => {
    if (selectedBranch !== 'all' && res.branchId !== selectedBranch) return false;
    if (selectedSemester !== 'all' && res.semesterId !== selectedSemester) return false;
    if (selectedSubject !== 'all' && res.subjectId !== selectedSubject) return false;
    if (selectedType !== 'all' && res.resourceType.toLowerCase() !== selectedType.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.author.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleResetFilters = () => {
    setSelectedBranch('all');
    setSelectedSemester('all');
    setSelectedSubject('all');
    setSelectedType('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs text-[#004ac6] uppercase font-bold tracking-wider">
          University Repository • RGPV Curriculum
        </span>
        <h1 className="text-3xl font-extrabold text-[#131b2e] mt-1">
          Browse Notes &amp; Resources
        </h1>
        <p className="text-sm text-[#434655] mt-1.5 max-w-2xl leading-relaxed">
          Navigate through the complete engineering curriculum hierarchy: Branch → Semester → Subject → Chapter → Verified PDF Resources.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col gap-4">
        {/* Search bar */}
        <div className="relative flex items-center bg-[#f2f3ff] rounded-xl px-3 py-2 border border-slate-200/50">
          <span className="material-symbols-outlined text-[#737686] text-[20px] mr-2">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within resources by keyword, title, topic..."
            className="w-full bg-transparent text-sm text-[#131b2e] placeholder:text-[#737686] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#737686] hover:text-[#131b2e] text-xs px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Branch */}
          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase block mb-1">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setSelectedSubject('all');
              }}
              className="w-full bg-[#f2f3ff] text-xs font-semibold text-[#131b2e] p-2.5 rounded-xl border border-slate-200/50 focus:outline-none cursor-pointer"
            >
              <option value="all">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.shortName} - {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase block mb-1">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setSelectedSubject('all');
              }}
              className="w-full bg-[#f2f3ff] text-xs font-semibold text-[#131b2e] p-2.5 rounded-xl border border-slate-200/50 focus:outline-none cursor-pointer"
            >
              <option value="all">All Semesters</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  Semester {s.semNumber} ({s.tag})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase block mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#f2f3ff] text-xs font-semibold text-[#131b2e] p-2.5 rounded-xl border border-slate-200/50 focus:outline-none cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}: {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase block mb-1">
              Resource Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#f2f3ff] text-xs font-semibold text-[#131b2e] p-2.5 rounded-xl border border-slate-200/50 focus:outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="handwritten">Handwritten Notes</option>
              <option value="guidebook">Guidebooks / Shivani</option>
              <option value="exam prep">Exam Prep &amp; PYQs</option>
              <option value="class notes">Class Notes &amp; Capsules</option>
            </select>
          </div>
        </div>

        {/* Results summary & Clear Filters */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#737686]">
          <span>
            Showing <strong className="text-[#131b2e]">{filteredResources.length}</strong> verified resources
          </span>
          <button
            onClick={handleResetFilters}
            className="text-[#004ac6] hover:underline font-semibold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Resource Grid / List */}
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-[#c3c6d7] mb-3">
            folder_off
          </span>
          <h3 className="text-lg font-bold text-[#131b2e]">No Resources Match Your Filter</h3>
          <p className="text-xs text-[#737686] max-w-md mx-auto mt-2 mb-5">
            Try adjusting your search criteria, selecting "All Branches", or resetting the filter options.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#004ac6] text-white text-xs font-semibold shadow-sm hover:bg-[#003ea8] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const subj = subjects.find((s) => s.id === res.subjectId);

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#004ac6] text-[11px] font-bold">
                      {res.resourceType}
                    </span>
                    <span className="font-mono text-xs text-[#737686]">{res.fileSize}</span>
                  </div>

                  {subj && (
                    <button
                      onClick={() => onSelectSubject(subj)}
                      className="text-left text-xs font-bold text-[#004ac6] hover:underline mb-1 block"
                    >
                      {subj.code}: {subj.name}
                    </button>
                  )}

                  <h3 className="text-sm font-bold text-[#131b2e] mb-2 leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-[#434655] line-clamp-3 leading-relaxed mb-4">
                    {res.description}
                  </p>

                  <div className="text-[11px] text-[#737686] flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="truncate max-w-[160px]">{res.author}</span>
                    <span className="text-emerald-700 font-medium">{res.pages} Pages</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onOpenPdf(res)}
                    className="flex-1 py-2 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>View PDF</span>
                  </button>
                  <button
                    onClick={() => onDownloadPdf(res)}
                    className="flex-1 py-2 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
