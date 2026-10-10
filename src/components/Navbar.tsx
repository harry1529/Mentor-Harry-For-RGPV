import React, { useState } from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  onOpenSearch: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#faf8ff]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
        >
          <img
            alt="Mentor Harry for RGPV Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1X5uIozDZgByiOG6uRZj1Pm6A4FLrNT9ocEVXS_U75Mj5MQH4Nyhg4MQeJcV9iyWGozUjUAU2fYwJ6qIfirSzx_-_7eVOjfqQXxEjB09bOkb28TN-fQrIjzoastzTscLe-Wc4k0JorYvpdq6ATQagbOKwdY7MHddywVbZwKDYB8QdQ_VejF2TlA5y6A4lZTiZUnSbjx1hWdRkf7ins_xXNmLdC_rnEA0MJbi1YJQmoHRpR-ssChxh0B4Q"
          />
          <div className="flex flex-col">
            <span className="text-base text-[#131b2e] font-extrabold tracking-tight leading-tight">
              Mentor Harry
            </span>
            <span className="text-[10px] text-[#004ac6] tracking-wider uppercase font-semibold">
              RGPV Resource Engine
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'home'
                ? 'text-[#004ac6] font-bold bg-[#eaedff] shadow-[0_0_0_1px_rgba(37,99,235,0.15)]'
                : 'text-[#434655] hover:text-[#131b2e] hover:bg-slate-100/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('browse')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'browse'
                ? 'text-[#004ac6] font-bold bg-[#eaedff] shadow-[0_0_0_1px_rgba(37,99,235,0.15)]'
                : 'text-[#434655] hover:text-[#131b2e] hover:bg-slate-100/60'
            }`}
          >
            Browse Notes
          </button>
          <button
            onClick={() => onNavigate('branches')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'branches'
                ? 'text-[#004ac6] font-bold bg-[#eaedff] shadow-[0_0_0_1px_rgba(37,99,235,0.15)]'
                : 'text-[#434655] hover:text-[#131b2e] hover:bg-slate-100/60'
            }`}
          >
            Branches
          </button>
          <button
            onClick={() => onNavigate('semesters')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'semesters'
                ? 'text-[#004ac6] font-bold bg-[#eaedff] shadow-[0_0_0_1px_rgba(37,99,235,0.15)]'
                : 'text-[#434655] hover:text-[#131b2e] hover:bg-slate-100/60'
            }`}
          >
            Semesters
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'about'
                ? 'text-[#004ac6] font-bold bg-[#eaedff] shadow-[0_0_0_1px_rgba(37,99,235,0.15)]'
                : 'text-[#434655] hover:text-[#131b2e] hover:bg-slate-100/60'
            }`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'contact'
                ? 'text-[#004ac6] font-bold bg-[#eaedff] shadow-[0_0_0_1px_rgba(37,99,235,0.15)]'
                : 'text-[#434655] hover:text-[#131b2e] hover:bg-slate-100/60'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff] hover:text-[#131b2e] transition-all text-xs font-medium"
            type="button"
            title="Search notes (⌘K)"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white text-[#737686] text-[11px] shadow-sm font-mono">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-semibold ${
              currentView === 'admin'
                ? 'bg-[#004ac6] text-white shadow-sm'
                : 'bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd]'
            }`}
            title="Administrator Portal"
          >
            <span className={`material-symbols-outlined text-[16px] ${currentView === 'admin' ? 'text-white' : 'text-[#004ac6]'}`}>
              shield
            </span>
            <span className="hidden md:inline">
              {isAdminLoggedIn ? 'Admin Hub' : 'Admin'}
            </span>
          </button>

          <div
            onClick={() => onNavigate('browse')}
            className="w-8 h-8 rounded-full bg-[#004ac6] flex items-center justify-center shrink-0 cursor-pointer shadow-sm text-white"
            title="Student Profile"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-[#434655] hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex flex-col gap-1 shadow-lg">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold hover:bg-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('browse');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold hover:bg-slate-100"
          >
            Browse Notes
          </button>
          <button
            onClick={() => {
              onNavigate('branches');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold hover:bg-slate-100"
          >
            Branches
          </button>
          <button
            onClick={() => {
              onNavigate('semesters');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold hover:bg-slate-100"
          >
            Semesters
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold hover:bg-slate-100"
          >
            About
          </button>
          <button
            onClick={() => {
              onNavigate('contact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold hover:bg-slate-100"
          >
            Contact
          </button>
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-[#004ac6] bg-[#eaedff]"
          >
            Admin Portal
          </button>
        </div>
      )}
    </header>
  );
};
