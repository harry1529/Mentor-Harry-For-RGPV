import React from 'react';
import { Semester } from '../types';

interface SemesterGridProps {
  semesters: Semester[];
  onSelectSemester: (semesterId: string) => void;
}

export const SemesterGrid: React.FC<SemesterGridProps> = ({
  semesters,
  onSelectSemester,
}) => {
  return (
    <section className="max-w-[1280px] mx-auto w-full px-4 md:px-8 mb-16" id="semesters-grid">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-xs text-[#004ac6] uppercase font-bold tracking-wider">
            Curriculum Navigation
          </span>
          <h2 className="text-2xl sm:text-3xl text-[#131b2e] font-extrabold mt-1">
            Browse by Semester
          </h2>
        </div>
        <p className="text-sm text-[#434655] max-w-md mt-2 md:mt-0">
          Direct pathways aligned with the latest RGPV grading system scheme and syllabus updates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {semesters.map((sem) => (
          <div
            key={sem.id}
            onClick={() => onSelectSemester(sem.id)}
            className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#dbe1ff] text-[#00174b] text-[11px] font-bold">
                  {sem.tag}
                </span>
                <span className="text-xs text-[#737686]">
                  {sem.totalNotes} Notes
                </span>
              </div>
              <h3 className="text-base text-[#131b2e] font-bold group-hover:text-[#004ac6] transition-colors">
                {sem.title}
              </h3>
              <p className="text-xs text-[#434655] mt-2 line-clamp-2 leading-relaxed">
                {sem.description}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#004ac6] font-semibold mt-4 pt-3 border-t border-slate-50">
              <span>Explore Semester</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
