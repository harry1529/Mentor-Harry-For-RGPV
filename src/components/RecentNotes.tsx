import React, { useState } from 'react';
import { Resource } from '../types';

interface RecentNotesProps {
  resources: Resource[];
  onOpenPdf: (resource: Resource) => void;
  onDownloadPdf: (resource: Resource) => void;
}

export const RecentNotes: React.FC<RecentNotesProps> = ({
  resources,
  onOpenPdf,
  onDownloadPdf,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'handwritten' | 'guidebook'>('all');

  const filtered = resources.filter((res) => {
    if (activeFilter === 'handwritten') return res.resourceType.toLowerCase() === 'handwritten';
    if (activeFilter === 'guidebook') return res.resourceType.toLowerCase() === 'guidebook';
    return true;
  });

  return (
    <section className="max-w-[1280px] mx-auto w-full px-4 md:px-8 mb-16" id="recent-notes">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-xs text-[#004ac6] uppercase font-bold tracking-wider">
            Verified Uploads
          </span>
          <h2 className="text-2xl sm:text-3xl text-[#131b2e] font-extrabold mt-1">
            Recently Added Notes &amp; PDFs
          </h2>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#eaedff] text-[#004ac6] shadow-sm'
                : 'bg-[#f2f3ff] text-[#434655] hover:text-[#131b2e]'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setActiveFilter('handwritten')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'handwritten'
                ? 'bg-[#eaedff] text-[#004ac6] font-bold shadow-sm'
                : 'bg-[#f2f3ff] text-[#434655] hover:text-[#131b2e]'
            }`}
          >
            Handwritten
          </button>
          <button
            onClick={() => setActiveFilter('guidebook')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'guidebook'
                ? 'bg-[#eaedff] text-[#004ac6] font-bold shadow-sm'
                : 'bg-[#f2f3ff] text-[#434655] hover:text-[#131b2e]'
            }`}
          >
            Guidebooks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((res) => {
          let badgeBg = 'bg-[#dbe1ff] text-[#00174b]';
          let icon = 'description';
          if (res.resourceType === 'Guidebook') {
            badgeBg = 'bg-[#e2dfff] text-[#3323cc]';
            icon = 'menu_book';
          } else if (res.resourceType === 'Exam Prep') {
            badgeBg = 'bg-[#c4e7ff] text-[#004c69]';
            icon = 'grade';
          } else if (res.resourceType === 'Class Notes') {
            badgeBg = 'bg-[#eaedff] text-[#004ac6]';
            icon = 'electric_bolt';
          }

          return (
            <div
              key={res.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${badgeBg}`}>
                      <span className="material-symbols-outlined text-[22px]">{icon}</span>
                    </span>
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#004ac6] text-[11px] font-bold">
                        {res.resourceType}
                      </span>
                      <span className="text-[11px] text-[#737686] ml-2">
                        {res.pages ? `${res.pages} Pages` : 'Unit 01'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#737686] font-semibold">
                    {res.fileSize}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg text-[#131b2e] font-bold mb-2">
                  {res.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#434655] leading-relaxed line-clamp-3">
                  {res.description}
                </p>

                <div className="flex items-center gap-3 mt-4 text-xs text-[#737686]">
                  <span className="flex items-center gap-1 font-medium text-emerald-700">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {res.verifiedBadge || 'Verified Content'}
                  </span>
                  <span>•</span>
                  <span>{res.author}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onOpenPdf(res)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>View PDF</span>
                </button>
                <button
                  onClick={() => onDownloadPdf(res)}
                  className="flex-1 py-2.5 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
