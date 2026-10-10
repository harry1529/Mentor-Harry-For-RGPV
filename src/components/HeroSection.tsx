import React, { useState } from 'react';

interface HeroSectionProps {
  onSearch: (query: string, branch: string) => void;
  onExploreNotes: () => void;
  onBrowseSemester: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onExploreNotes,
  onBrowseSemester,
}) => {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim(), selectedBranch);
  };

  const handleQuickTag = (tag: string) => {
    setSearchQuery(tag);
    onSearch(tag, selectedBranch);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 px-4 md:px-8">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[640px] h-[480px] bg-gradient-to-tr from-[#b4c5ff]/30 via-[#e2e7ff]/40 to-[#c3c0ff]/30 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        <svg className="absolute top-6 left-1/4 w-72 h-72 opacity-20 text-[#004ac6]" fill="none" viewBox="0 0 200 200">
          <circle cx="20" cy="20" fill="currentColor" r="3" />
          <circle cx="100" cy="40" fill="currentColor" r="4" />
          <circle cx="160" cy="110" fill="currentColor" r="3" />
          <circle cx="70" cy="170" fill="currentColor" r="4" />
          <path d="M20 20 L100 40 L160 110 L70 170" stroke="currentColor" strokeDasharray="4 6" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1120px] mx-auto flex flex-col items-center text-center">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f3ff] border border-blue-100 shadow-sm mb-5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#004ac6] animate-ping"></span>
          <span className="text-xs text-[#004ac6] font-bold tracking-wide">
            ✨ Your Study Partner for Engineering Success • RGPV Curriculum 2024–25
          </span>
        </div>

        {/* Large Headline & Subtext */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#131b2e] font-extrabold max-w-4xl tracking-tight leading-[1.15] mb-5">
          Find the Right Notes.{' '}
          <span className="text-[#004ac6] underline decoration-[#b4c5ff] decoration-wavy decoration-2">
            Study Smarter.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-[#434655] max-w-2xl leading-relaxed mb-8">
          High-yield handwritten notes, university guidebook summaries, chapter-wise PDFs, and verified previous year solutions tailored specifically for Rajiv Gandhi Proudyogiki Vishwavidyalaya engineering students.
        </p>

        {/* Prominent Interactive Search Suite */}
        <div className="w-full max-w-3xl bg-white p-2.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 mb-5">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Branch Selector Chip */}
            <div className="relative shrink-0">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold px-4 py-3 rounded-xl pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 transition-all"
              >
                <option value="all">All Branches</option>
                <option value="branch-cse">CSE (Computer Science)</option>
                <option value="branch-it">IT (Information Tech)</option>
                <option value="branch-ece">ECE (Electronics)</option>
                <option value="branch-me">ME (Mechanical)</option>
                <option value="branch-ce">Civil Engineering</option>
              </select>
              <span className="material-symbols-outlined text-[18px] text-[#737686] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Main Input Field */}
            <div className="relative flex-1 flex items-center min-w-0">
              <span className="material-symbols-outlined text-[#737686] text-[20px] ml-3 mr-2 shrink-0">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects, chapters, topics... e.g. Calculus, BT-102"
                className="w-full bg-transparent text-sm text-[#131b2e] placeholder:text-[#737686] focus:outline-none py-2"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Search CTA Button */}
            <button
              type="submit"
              className="shrink-0 bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-[#004ac6]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Search Notes</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-[#737686] font-bold uppercase tracking-wider mr-1">
            Trending:
          </span>
          <button
            onClick={() => handleQuickTag('Calculus Part 1')}
            className="px-3 py-1 rounded-full bg-[#e2e7ff] hover:bg-[#b4c5ff] text-[#131b2e] text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            🔥 Calculus Part 1
          </button>
          <button
            onClick={() => handleQuickTag('Engineering Chemistry')}
            className="px-3 py-1 rounded-full bg-[#e2e7ff] hover:bg-[#b4c5ff] text-[#131b2e] text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            Engineering Chemistry
          </button>
          <button
            onClick={() => handleQuickTag('Basic Computer Engineering')}
            className="px-3 py-1 rounded-full bg-[#e2e7ff] hover:bg-[#b4c5ff] text-[#131b2e] text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            Basic Computer Engineering
          </button>
          <button
            onClick={() => handleQuickTag('AC Circuits')}
            className="px-3 py-1 rounded-full bg-[#e2e7ff] hover:bg-[#b4c5ff] text-[#131b2e] text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            AC Circuits
          </button>
        </div>

        {/* Primary & Secondary Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onExploreNotes}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#004ac6] text-white text-sm font-semibold shadow-lg shadow-[#004ac6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span>Explore Notes</span>
          </button>
          <button
            onClick={onBrowseSemester}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white text-[#131b2e] hover:bg-[#f2f3ff] text-sm font-semibold border border-slate-200 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
            <span>Browse by Semester</span>
          </button>
        </div>
      </div>
    </section>
  );
};
