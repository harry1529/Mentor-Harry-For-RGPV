import React from 'react';

interface FooterProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 w-full bg-[#f2f3ff] border-t border-slate-200/80 pt-16 pb-12">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <img
                alt="Mentor Harry for RGPV Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1X5uIozDZgByiOG6uRZj1Pm6A4FLrNT9ocEVXS_U75Mj5MQH4Nyhg4MQeJcV9iyWGozUjUAU2fYwJ6qIfirSzx_-_7eVOjfqQXxEjB09bOkb28TN-fQrIjzoastzTscLe-Wc4k0JorYvpdq6ATQagbOKwdY7MHddywVbZwKDYB8QdQ_VejF2TlA5y6A4lZTiZUnSbjx1hWdRkf7ins_xXNmLdC_rnEA0MJbi1YJQmoHRpR-ssChxh0B4Q"
              />
              <span className="text-lg text-[#131b2e] font-extrabold tracking-tight">
                Mentor Harry
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#434655] max-w-md leading-relaxed">
              Dedicated resource hub for Rajiv Gandhi Proudyogiki Vishwavidyalaya engineering curriculum. Curated handwritten notes, verified semester PYQs, and high-impact unit blueprints built for exam mastery.
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="material-symbols-outlined text-[#004ac6] text-[18px]">
                verified
              </span>
              <span className="text-xs text-[#131b2e] font-semibold">
                Independent Academic Student Community
              </span>
            </div>
          </div>

          {/* Branches */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
              Engineering Branches
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[#434655]">
              <li>
                <button
                  onClick={() => onNavigate('branches', 'cse')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Computer Science &amp; Eng (CSE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('branches', 'it')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Information Technology (IT)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('branches', 'ece')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Electronics &amp; Comm. (ECE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('branches', 'me')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Mechanical Eng (ME)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('branches', 'ce')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Civil Engineering (CE)
                </button>
              </li>
            </ul>
          </div>

          {/* Curriculum Hub */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
              Curriculum Hub
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[#434655]">
              <li>
                <button
                  onClick={() => onNavigate('semesters')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Semester Directory (1 to 8)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guidelines')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  RGPV Exam Study Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', { type: 'Exam Prep' })}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Previous Year Solved Papers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', { type: 'Guidebook' })}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Shivani Question Banks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', { type: 'Class Notes' })}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Lab Manuals &amp; Practical Code
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
              Institutional
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[#434655]">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  About Mentor Harry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Student Support &amp; Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#004ac6] font-semibold text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Contributor &amp; Admin Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Fair Use &amp; Disclaimers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-[#004ac6] transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#737686] text-center md:text-left">
            © 2025 Mentor Harry for RGPV. Crafted for engineers. Not officially affiliated with Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#434655]">
            <button
              onClick={() => onNavigate('disclaimer')}
              className="hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              Academic Disclaimer
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>

      {/* Back to top floating button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white text-[#004ac6] shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-[#e2e7ff] hover:text-[#131b2e] flex items-center justify-center transition-all cursor-pointer border border-slate-100"
        aria-label="Back to top"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
      </button>
    </footer>
  );
};
