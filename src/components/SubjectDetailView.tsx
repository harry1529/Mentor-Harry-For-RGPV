import React, { useState } from 'react';
import { Subject, Chapter, Resource } from '../types';

interface SubjectDetailViewProps {
  subject: Subject;
  chapters: Chapter[];
  resources: Resource[];
  allSubjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onOpenPdf: (resource: Resource) => void;
  onDownloadPdf: (resource: Resource) => void;
  onShowToast: (message: string) => void;
  onBackToHome: () => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  chapters,
  resources,
  allSubjects,
  onSelectSubject,
  onOpenPdf,
  onDownloadPdf,
  onShowToast,
  onBackToHome,
}) => {
  const [activeUnitTab, setActiveUnitTab] = useState<string>('unit-1');
  const [resourceFilter, setResourceFilter] = useState<'all' | 'handwritten' | 'guidebook' | 'pyq'>('all');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'unit-2': false,
    'unit-3': false,
    'unit-4': false,
    'unit-5': false,
  });

  const toggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    onShowToast(
      next
        ? `${subject.name} added to your bookmarks!`
        : `Subject removed from bookmarks`
    );
  };

  const copySubjectLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast('Subject link copied to clipboard!');
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredResources = resources.filter((res) => {
    if (resourceFilter === 'handwritten') return res.resourceType === 'Handwritten';
    if (resourceFilter === 'guidebook') return res.resourceType === 'Guidebook';
    if (resourceFilter === 'pyq') return res.resourceType === 'Exam Prep';
    return true;
  });

  const otherSubjects = allSubjects
    .filter((s) => s.id !== subject.id && s.semesterId === subject.semesterId)
    .slice(0, 3);

  return (
    <div className="w-full pb-20">
      {/* Breadcrumb Navigation Bar */}
      <section className="w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-6 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f2f3ff]/70 backdrop-blur-md rounded-xl px-4 py-2.5 border border-slate-200/50 shadow-sm">
          <nav aria-label="Curriculum Breadcrumb" className="flex flex-wrap items-center gap-1.5 min-w-0 text-xs font-semibold">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1 text-[#434655] hover:text-[#004ac6] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">school</span>
              <span>Home</span>
            </button>
            <span className="material-symbols-outlined text-[14px] text-[#c3c6d7]">chevron_right</span>
            <span className="text-[#434655]">RGPV</span>
            <span className="material-symbols-outlined text-[14px] text-[#c3c6d7]">chevron_right</span>
            <span className="text-[#434655] truncate max-w-[140px] md:max-w-none">
              Computer Science &amp; Eng (CSE)
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#c3c6d7]">chevron_right</span>
            <span className="text-[#434655]">Semester 1</span>
            <span className="material-symbols-outlined text-[14px] text-[#c3c6d7]">chevron_right</span>
            <span className="text-[#004ac6] font-bold bg-[#e2e7ff] px-2 py-0.5 rounded-md">
              {subject.code}
            </span>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copySubjectLink}
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eaedff] text-[#434655] hover:text-[#131b2e] hover:bg-[#e2e7ff] transition-all text-xs font-semibold cursor-pointer"
              title="Copy Subject URL"
            >
              <span className="material-symbols-outlined text-[15px] group-hover:rotate-12 transition-transform">
                share
              </span>
              <span className="hidden sm:inline">Copy Link</span>
            </button>
          </div>
        </div>
      </section>

      {/* Hero & Subject Header Banner */}
      <section className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-slate-100">
          {/* Ambient Visual Background Accent */}
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-bl from-[#b4c5ff] via-[#e2dfff]/40 to-transparent blur-3xl opacity-70 pointer-events-none"></div>
          <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-[#c4e7ff]/30 blur-2xl opacity-50 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1 flex flex-col gap-3">
              {/* Taxonomy Tag Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[13px] text-[#004ac6]">account_balance</span>
                  RGPV University
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#434655] text-xs font-semibold">
                  {subject.groupTag}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#434655] text-xs font-semibold">
                  Semester 0{subject.semNumber}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#4b41e1] text-xs font-bold">
                  {subject.credits} Credits
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-xs">
                  Grade Scheme: {subject.gradeScheme}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#131b2e] font-extrabold tracking-tight">
                    {subject.name}
                  </h1>
                  <span className="text-sm sm:text-base font-bold text-[#004ac6] px-3 py-0.5 rounded-lg bg-[#e2e7ff]">
                    {subject.code}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#434655] max-w-4xl leading-relaxed mt-1">
                  {subject.description}
                </p>
              </div>

              {/* Quick Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-3 mt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#004ac6]">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#737686] uppercase font-bold">Syllabus</span>
                    <span className="text-xs font-bold text-[#131b2e]">{subject.unitsCount} Units Complete</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#4b41e1]">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#737686] uppercase font-bold">Curated Docs</span>
                    <span className="text-xs font-bold text-[#131b2e]">{subject.totalDocs} Verified PDFs</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#005b7c]">
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#737686] uppercase font-bold">Archive</span>
                    <span className="text-xs font-bold text-[#131b2e]">{subject.solvedPyqs} Solved PYQs</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-amber-500">
                    <span className="material-symbols-outlined text-[18px]">star</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#737686] uppercase font-bold">Student Rating</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#131b2e]">
                      <span>{subject.rating} / 5</span>
                      <span className="text-[#737686] font-normal">({subject.ratingCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-row lg:flex-col gap-2 shrink-0 self-start w-full lg:w-auto">
              <button
                onClick={toggleBookmark}
                className={`flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-xs font-semibold shadow-sm cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#004ac6] text-white'
                    : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isBookmarked ? 'bookmark' : 'bookmark_border'}
                </span>
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Subject'}</span>
              </button>
              <button
                onClick={() => {
                  if (resources.length > 0) onDownloadPdf(resources[0]);
                  else onShowToast('Downloading official RGPV syllabus...');
                }}
                className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#004ac6] text-white hover:bg-[#003ea8] transition-all text-xs font-semibold shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                <span>Download Syllabus PDF</span>
              </button>
              <button
                onClick={copySubjectLink}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#f2f3ff] text-[#434655] hover:text-[#131b2e] hover:bg-[#eaedff] transition-all text-xs font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span>Share Hub</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-4">
        {/* Sticky Horizontal Unit Jump Tabs */}
        <div className="sticky top-16 z-30 bg-[#faf8ff]/95 backdrop-blur-xl py-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth p-1 bg-[#f2f3ff] rounded-xl border border-slate-200/50">
            <button
              onClick={() => setActiveUnitTab('unit-1')}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeUnitTab === 'unit-1'
                  ? 'bg-[#004ac6] text-white shadow-sm'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-white/60'
              }`}
            >
              <span>Unit 1: Calculus Part 1</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeUnitTab === 'unit-1' ? 'bg-white/20 text-white' : 'bg-[#dae2fd] text-[#131b2e]'}`}>
                6 Notes
              </span>
            </button>
            <button
              onClick={() => setActiveUnitTab('unit-2')}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeUnitTab === 'unit-2'
                  ? 'bg-[#004ac6] text-white font-bold shadow-sm'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-white/60'
              }`}
            >
              <span>Unit 2: Calculus Part 2</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#dae2fd] text-[#434655] text-[10px]">
                4 Notes
              </span>
            </button>
            <button
              onClick={() => setActiveUnitTab('unit-3')}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeUnitTab === 'unit-3'
                  ? 'bg-[#004ac6] text-white font-bold shadow-sm'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-white/60'
              }`}
            >
              <span>Unit 3: Partial Diff &amp; Euler</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#dae2fd] text-[#434655] text-[10px]">
                3 Notes
              </span>
            </button>
            <button
              onClick={() => setActiveUnitTab('unit-4')}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeUnitTab === 'unit-4'
                  ? 'bg-[#004ac6] text-white font-bold shadow-sm'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-white/60'
              }`}
            >
              <span>Unit 4: Beta-Gamma &amp; Integrals</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#dae2fd] text-[#434655] text-[10px]">
                3 Notes
              </span>
            </button>
            <button
              onClick={() => setActiveUnitTab('unit-5')}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeUnitTab === 'unit-5'
                  ? 'bg-[#004ac6] text-white font-bold shadow-sm'
                  : 'text-[#434655] hover:text-[#131b2e] hover:bg-white/60'
              }`}
            >
              <span>Unit 5: Matrices &amp; Eigenvalues</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#dae2fd] text-[#434655] text-[10px]">
                4 Notes
              </span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Unit Header Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#004ac6] text-white font-bold text-sm">
                    1
                  </span>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#004ac6] font-bold block">
                      Module Focus
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                      Unit 1: Calculus Part 1 — Differential Calculus &amp; Expansions
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                  <span>High Weightage (~22 Marks)</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#434655] leading-relaxed mb-4">
                Core concepts include Rolle’s Theorem, Cauchy’s &amp; Lagrange’s Mean Value Theorems, Maclaurin’s &amp; Taylor’s expansion for single variables, and evaluation of indeterminate forms using L’Hôpital’s Rule.
              </p>

              {/* Resource Type Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 bg-[#f2f3ff] p-2 rounded-xl border border-slate-200/50">
                <span className="text-[11px] text-[#737686] uppercase font-bold px-2">Filter:</span>
                <button
                  onClick={() => setResourceFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    resourceFilter === 'all'
                      ? 'bg-[#004ac6] text-white font-bold shadow-sm'
                      : 'text-[#434655] hover:text-[#131b2e] bg-white font-medium'
                  }`}
                >
                  All ({resources.length})
                </button>
                <button
                  onClick={() => setResourceFilter('handwritten')}
                  className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    resourceFilter === 'handwritten'
                      ? 'bg-[#004ac6] text-white font-bold shadow-sm'
                      : 'text-[#434655] hover:text-[#131b2e] bg-white font-medium'
                  }`}
                >
                  Handwritten Notes (2)
                </button>
                <button
                  onClick={() => setResourceFilter('guidebook')}
                  className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    resourceFilter === 'guidebook'
                      ? 'bg-[#004ac6] text-white font-bold shadow-sm'
                      : 'text-[#434655] hover:text-[#131b2e] bg-white font-medium'
                  }`}
                >
                  Shivani / Guidebooks (2)
                </button>
                <button
                  onClick={() => setResourceFilter('pyq')}
                  className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    resourceFilter === 'pyq'
                      ? 'bg-[#004ac6] text-white font-bold shadow-sm'
                      : 'text-[#434655] hover:text-[#131b2e] bg-white font-medium'
                  }`}
                >
                  Important PYQs (2)
                </button>
              </div>
            </div>

            {/* Resource Cards */}
            <div className="flex flex-col gap-4">
              {filteredResources.map((res) => (
                <article
                  key={res.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 flex flex-col justify-between"
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          {res.verifiedBadge || 'Verified'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#434655] text-xs">
                          Unit 01 • {res.resourceType}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#131b2e]">
                        {res.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                        {res.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 pt-2 text-[#737686] text-xs">
                        <span className="inline-flex items-center gap-1 text-[#131b2e] font-medium">
                          <span className="material-symbols-outlined text-[16px] text-[#004ac6]">person</span>
                          {res.author}
                        </span>
                        <span>•</span>
                        <span>{res.pages} Pages</span>
                        <span>•</span>
                        <span className="font-mono">{res.fileSize}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">Verified by Mentor Harry</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 justify-end pt-2 md:pt-0">
                      <button
                        onClick={() => onOpenPdf(res)}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        <span>View PDF</span>
                      </button>
                      <button
                        onClick={() => onDownloadPdf(res)}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#004ac6] text-white hover:bg-[#003ea8] transition-all text-xs font-bold shadow-md shadow-[#004ac6]/15 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Download ({res.fileSize})</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Collapsible Accordion for Units 2 to 5 */}
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-base font-bold text-[#131b2e]">
                  Remaining Syllabus Units
                </h3>
                <span className="text-xs text-[#737686]">Tap to inspect modules</span>
              </div>

              {/* Unit 2 */}
              <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-100 transition-all">
                <button
                  onClick={() => toggleAccordion('unit-2')}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e2e7ff] text-[#131b2e] font-bold text-sm">
                      2
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#737686]">Unit 02</span>
                        <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] text-[10px] font-semibold">
                          4 PDFs available
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#131b2e]">
                        Calculus Part 2 — Curvature, Radius of Curvature &amp; Curve Tracing
                      </h4>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-[#737686] text-[22px] transition-transform duration-200 ${openAccordions['unit-2'] ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordions['unit-2'] && (
                  <div className="px-5 pb-5 pt-1 bg-[#f2f3ff]/40 border-t border-slate-100 text-xs">
                    <p className="text-[#434655] mb-3 leading-relaxed">
                      Topics include Curvature in Cartesian and Polar Coordinates, Radius of curvature, Center of curvature, Asymptotes in Cartesian coordinates, and Tracing of Cartesian and polar curves.
                    </p>
                    <div className="p-3.5 rounded-xl bg-white flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#004ac6] text-[24px]">
                          picture_as_pdf
                        </span>
                        <div>
                          <span className="font-bold text-[#131b2e] block">
                            Complete Unit 2 Study Bundle (4 Notes Compiled)
                          </span>
                          <span className="text-[#737686] text-[11px]">
                            38 Pages • Handwritten + Shivani • 11.4 MB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const u2 = resources.find((r) => r.title.includes('Calculus Part 2'));
                          if (u2) onOpenPdf(u2);
                          else onShowToast('Opening Unit 2 Study Bundle...');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#004ac6] text-white text-xs font-bold hover:bg-[#003ea8] transition-colors cursor-pointer"
                      >
                        Get Unit 2
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Unit 3 */}
              <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-100 transition-all">
                <button
                  onClick={() => toggleAccordion('unit-3')}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e2e7ff] text-[#131b2e] font-bold text-sm">
                      3
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#737686]">Unit 03</span>
                        <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] text-[10px] font-semibold">
                          3 PDFs available
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#131b2e]">
                        Partial Differentiation, Euler’s Theorem &amp; Jacobians
                      </h4>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-[#737686] text-[22px] transition-transform duration-200 ${openAccordions['unit-3'] ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordions['unit-3'] && (
                  <div className="px-5 pb-5 pt-1 bg-[#f2f3ff]/40 border-t border-slate-100 text-xs">
                    <p className="text-[#434655] mb-3 leading-relaxed">
                      Focus on Partial derivatives of first and higher orders, Homogeneous functions and Euler's theorem, Total differentiation, Taylor's theorem for two variables, and Maxima/Minima.
                    </p>
                    <div className="p-3.5 rounded-xl bg-white flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#004ac6] text-[24px]">
                          picture_as_pdf
                        </span>
                        <div>
                          <span className="font-bold text-[#131b2e] block">
                            Unit 3 Euler's &amp; Jacobians Solved Notes
                          </span>
                          <span className="text-[#737686] text-[11px]">
                            29 Pages • Topper Handwritten • 7.8 MB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onShowToast('Opening Unit 3 Study Material...')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#004ac6] text-white text-xs font-bold hover:bg-[#003ea8] transition-colors cursor-pointer"
                      >
                        Get Unit 3
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Unit 4 */}
              <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-100 transition-all">
                <button
                  onClick={() => toggleAccordion('unit-4')}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e2e7ff] text-[#131b2e] font-bold text-sm">
                      4
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#737686]">Unit 04</span>
                        <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] text-[10px] font-semibold">
                          3 PDFs available
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#131b2e]">
                        Definite Integrals, Beta &amp; Gamma Functions, Volume of Revolution
                      </h4>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-[#737686] text-[22px] transition-transform duration-200 ${openAccordions['unit-4'] ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordions['unit-4'] && (
                  <div className="px-5 pb-5 pt-1 bg-[#f2f3ff]/40 border-t border-slate-100 text-xs">
                    <p className="text-[#434655] mb-3 leading-relaxed">
                      Definite integrals as limits of sum, Beta and Gamma functions with properties and relations, Rectification of curves, Areas, and Volumes of solids of revolution.
                    </p>
                    <div className="p-3.5 rounded-xl bg-white flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#004ac6] text-[24px]">
                          picture_as_pdf
                        </span>
                        <div>
                          <span className="font-bold text-[#131b2e] block">
                            Unit 4 Beta-Gamma Solved Proofs &amp; Numericals
                          </span>
                          <span className="text-[#737686] text-[11px]">
                            24 Pages • Handwritten Formula Pack • 5.9 MB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onShowToast('Opening Unit 4 Formula Pack...')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#004ac6] text-white text-xs font-bold hover:bg-[#003ea8] transition-colors cursor-pointer"
                      >
                        Get Unit 4
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Unit 5 */}
              <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-100 transition-all">
                <button
                  onClick={() => toggleAccordion('unit-5')}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e2e7ff] text-[#131b2e] font-bold text-sm">
                      5
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#737686]">Unit 05</span>
                        <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] text-[10px] font-semibold">
                          4 PDFs available
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#131b2e]">
                        Matrices, System of Linear Equations, Cayley-Hamilton Theorem
                      </h4>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-[#737686] text-[22px] transition-transform duration-200 ${openAccordions['unit-5'] ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordions['unit-5'] && (
                  <div className="px-5 pb-5 pt-1 bg-[#f2f3ff]/40 border-t border-slate-100 text-xs">
                    <p className="text-[#434655] mb-3 leading-relaxed">
                      Rank of matrix, Echelon form, System of linear equations, Eigenvalues and Eigenvectors, Cayley-Hamilton Theorem and its application in finding inverse and matrix powers.
                    </p>
                    <div className="p-3.5 rounded-xl bg-white flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#004ac6] text-[24px]">
                          picture_as_pdf
                        </span>
                        <div>
                          <span className="font-bold text-[#131b2e] block">
                            Unit 5 Matrices Master Notes + 10-Yr Solved PYQs
                          </span>
                          <span className="text-[#737686] text-[11px]">
                            36 Pages • Handwritten + Shivani Model • 9.1 MB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onShowToast('Opening Unit 5 PYQs...')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#004ac6] text-white text-xs font-bold hover:bg-[#003ea8] transition-colors cursor-pointer"
                      >
                        Get Unit 5
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Aside Column (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Callout Box: Exam Strategy & High Yield Blueprint */}
            <div className="rounded-2xl bg-[#eaedff] p-6 shadow-sm border border-blue-200/60">
              <div className="flex items-center gap-2 text-[#004ac6] font-bold text-xs uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                <span>RGPV Exam Strategy Tip</span>
              </div>
              <h4 className="text-base font-bold text-[#131b2e] mb-2">
                Maximize Passing Score in M-1
              </h4>
              <p className="text-xs sm:text-sm text-[#434655] leading-relaxed mb-4">
                Prioritize <strong className="text-[#131b2e]">Unit 1 (Taylor / Maclaurin Series)</strong> and <strong className="text-[#131b2e]">Unit 5 (Cayley–Hamilton Theorem &amp; Eigenvalues)</strong>. RGPV consistently sets two mandatory 7-mark questions directly from these sections every semester.
              </p>
              <div className="p-3.5 rounded-xl bg-white flex items-center gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6] font-extrabold text-sm">
                  35+
                </div>
                <div>
                  <span className="text-xs font-bold text-[#131b2e] block">Assured Marks Target</span>
                  <span className="text-[11px] text-[#737686]">Focusing on Units 1 &amp; 5 guarantees clearing cut-off</span>
                </div>
              </div>
            </div>

            {/* Semester Syllabus Progress Widget */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-[#131b2e]">Syllabus Completion</h4>
                <span className="text-[10px] font-bold text-[#004ac6] bg-[#eaedff] px-2 py-0.5 rounded-full">
                  100% Verified
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#e2e7ff] rounded-full h-2 mb-4 overflow-hidden">
                <div className="bg-[#004ac6] h-2 rounded-full w-full"></div>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#131b2e] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Unit 1: Calculus Part 1
                  </span>
                  <span className="font-mono text-[11px] text-[#737686]">6 Files</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#131b2e] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Unit 2: Calculus Part 2
                  </span>
                  <span className="font-mono text-[11px] text-[#737686]">4 Files</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#131b2e] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Unit 3: Partial Diff &amp; Euler
                  </span>
                  <span className="font-mono text-[11px] text-[#737686]">3 Files</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#131b2e] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Unit 4: Beta-Gamma &amp; Integrals
                  </span>
                  <span className="font-mono text-[11px] text-[#737686]">3 Files</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#131b2e] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Unit 5: Matrices &amp; Eigenvalues
                  </span>
                  <span className="font-mono text-[11px] text-[#737686]">4 Files</span>
                </div>
              </div>
            </div>

            {/* Related Semester 1 Subjects Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h4 className="text-sm font-bold text-[#131b2e] mb-3">
                Other Subjects in 1st Sem
              </h4>
              <div className="flex flex-col gap-2">
                {otherSubjects.map((other) => (
                  <div
                    key={other.id}
                    onClick={() => onSelectSubject(other)}
                    className="group p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#004ac6] group-hover:scale-105 transition-transform shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">
                          {other.code.includes('205') ? 'terminal' : other.code.includes('104') ? 'electrical_services' : 'science'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#004ac6] transition-colors">
                          {other.name}
                        </span>
                        <span className="text-[11px] text-[#737686]">
                          {other.code} • {other.totalDocs} Notes
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#c3c6d7] group-hover:text-[#004ac6] transition-colors text-[18px]">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Disclaimer & Contributor Badge */}
            <div className="rounded-2xl bg-[#f2f3ff] p-5 flex flex-col gap-2 border border-slate-200/50">
              <div className="flex items-center gap-2 text-[#131b2e] font-semibold text-xs">
                <span className="material-symbols-outlined text-[#004ac6] text-[18px]">
                  verified_user
                </span>
                <span>Peer-Reviewed by CSE Batch '24</span>
              </div>
              <p className="text-xs text-[#434655] leading-relaxed">
                All files are cross-verified against RGPV standard syllabi and grading rules. Found an error or have solved lecture solutions? Contribute to Mentor Harry.
              </p>
              <button
                onClick={() => onShowToast('Thank you for contributing! Redirecting to student review board...')}
                className="inline-flex items-center gap-1 text-xs text-[#004ac6] font-bold hover:underline mt-1 text-left cursor-pointer"
              >
                <span>Report discrepancy or upload paper</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
