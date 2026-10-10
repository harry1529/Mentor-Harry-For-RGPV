import React from 'react';
import { Subject } from '../types';

interface PopularSubjectsProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onViewAll: () => void;
}

export const PopularSubjects: React.FC<PopularSubjectsProps> = ({
  subjects,
  onSelectSubject,
  onViewAll,
}) => {
  return (
    <section className="w-full bg-[#f2f3ff]/60 py-16 mb-16 border-y border-slate-200/50">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs text-[#004ac6] uppercase font-bold tracking-wider">
              High Frequency Revision
            </span>
            <h2 className="text-2xl sm:text-3xl text-[#131b2e] font-extrabold mt-1">
              Popular Engineering Subjects
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-[#004ac6] hover:underline flex items-center gap-1 mt-2 md:mt-0 cursor-pointer"
          >
            <span>View all 54 subjects</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.slice(0, 4).map((subj) => (
            <div
              key={subj.id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#004ac6] text-[11px] font-bold">
                    {subj.groupTag}
                  </span>
                  <span className="font-mono text-xs text-[#737686] font-semibold">
                    {subj.code}
                  </span>
                </div>
                <h3 className="text-base text-[#131b2e] font-bold mb-2">
                  {subj.name}
                </h3>
                <p className="text-xs text-[#434655] leading-relaxed line-clamp-2">
                  {subj.description}
                </p>

                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[#434655] text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
                      folder
                    </span>
                    <span>{subj.unitsCount} Full Units</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#434655] text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#005b7c]">
                      schedule
                    </span>
                    <span>Updated {subj.updatedAt}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectSubject(subj)}
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#e2e7ff] hover:bg-[#004ac6] hover:text-white text-[#131b2e] text-xs font-bold text-center transition-all cursor-pointer shadow-sm"
              >
                View Subject Notes
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
