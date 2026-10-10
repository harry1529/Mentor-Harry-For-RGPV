import React from 'react';
import { AdminStats } from '../types';

interface StatsRibbonProps {
  stats?: AdminStats | null;
}

export const StatsRibbon: React.FC<StatsRibbonProps> = ({ stats }) => {
  return (
    <section className="w-full bg-white py-6 shadow-sm border-y border-slate-100 mb-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl text-[#004ac6] font-extrabold tracking-tight">
              8 Semesters
            </span>
            <span className="text-xs sm:text-sm text-[#434655] mt-1">
              Complete RGPV Syllabus Coverage
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl text-[#4b41e1] font-extrabold tracking-tight">
              {stats ? `${stats.totalSubjects}+ Subjects` : '54+ Subjects'}
            </span>
            <span className="text-xs sm:text-sm text-[#434655] mt-1">
              Foundational to Final Electives
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl text-[#005b7c] font-extrabold tracking-tight">
              {stats ? `${stats.publishedResources}+ PDFs` : '1,200+ PDFs'}
            </span>
            <span className="text-xs sm:text-sm text-[#434655] mt-1">
              Verified Handwritten & Shivani Sets
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl text-[#004ac6] font-extrabold tracking-tight">
              {stats && stats.totalDownloads > 0
                ? `${stats.totalDownloads.toLocaleString()}+`
                : '45,000+'}
            </span>
            <span className="text-xs sm:text-sm text-[#434655] mt-1">
              Student Exam Downloads
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
