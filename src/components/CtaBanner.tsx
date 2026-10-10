import React from 'react';

interface CtaBannerProps {
  onGetStarted: () => void;
  onContribute: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  onGetStarted,
  onContribute,
}) => {
  return (
    <section className="max-w-[1280px] mx-auto w-full px-4 md:px-8 mb-16">
      <div className="relative overflow-hidden bg-[#004ac6] rounded-3xl p-8 md:p-12 text-white shadow-xl">
        {/* Background flares */}
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-2xl"></div>
        <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#4b41e1]/40 blur-2xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-3">
              Built for RGPV Engineers By Engineers
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
              Ace Your Semester Exams With Complete Confidence.
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
              Join over 45,000+ students from UIT RGPV, LNCT, Oriental, TIT, and affiliated engineering institutes saving hours of prep every single exam season.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onGetStarted}
              className="px-7 py-3.5 rounded-xl bg-white text-[#004ac6] text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Get Started Now — It's Free
            </button>
            <button
              onClick={onContribute}
              className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold transition-colors cursor-pointer border border-white/20"
            >
              Contribute Notes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
