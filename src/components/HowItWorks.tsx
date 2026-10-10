import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="w-full bg-[#f2f3ff]/60 py-16 mb-16 border-y border-slate-200/50">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs text-[#004ac6] uppercase font-bold tracking-wider">
            Fast &amp; Frictionless
          </span>
          <h2 className="text-2xl sm:text-3xl text-[#131b2e] font-extrabold mt-1">
            Study in 3 Simple Steps
          </h2>
          <p className="text-sm text-[#434655] mt-2">
            Designed specifically to help engineering students bypass fragmented groups and get straight to verified academic material.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#004ac6] text-white flex items-center justify-center text-xl font-black mb-5 shadow-md shadow-[#004ac6]/20">
              01
            </div>
            <h3 className="text-base text-[#131b2e] font-bold mb-2">
              Select Branch &amp; Semester
            </h3>
            <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
              Choose your core engineering branch and current semester to see the exact grading system scheme and updated syllabus subjects.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#4b41e1] text-white flex items-center justify-center text-xl font-black mb-5 shadow-md shadow-[#4b41e1]/20">
              02
            </div>
            <h3 className="text-base text-[#131b2e] font-bold mb-2">
              Choose Subject &amp; Unit
            </h3>
            <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
              Navigate through chapter-wise handwritten summaries, Shivani question banks, and high-frequency PYQ solutions per unit.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#005b7c] text-white flex items-center justify-center text-xl font-black mb-5 shadow-md shadow-[#005b7c]/20">
              03
            </div>
            <h3 className="text-base text-[#131b2e] font-bold mb-2">
              Read Online or Download
            </h3>
            <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
              Use our built-in distraction-free PDF viewer or grab high-speed, direct offline downloads without ads, timers, or paywalls.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
