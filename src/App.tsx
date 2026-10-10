/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Branch, Semester, Subject, Chapter, Resource, AdminStats, User } from './types';
import { api } from './api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsRibbon } from './components/StatsRibbon';
import { SemesterGrid } from './components/SemesterGrid';
import { PopularSubjects } from './components/PopularSubjects';
import { RecentNotes } from './components/RecentNotes';
import { HowItWorks } from './components/HowItWorks';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { SubjectDetailView } from './components/SubjectDetailView';
import { BrowseView } from './components/BrowseView';
import { PdfViewerModal } from './components/PdfViewerModal';
import { SearchModal } from './components/SearchModal';
import { AdminPortal } from './components/AdminPortal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Curriculum data
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Modals & Navigation state
  const [activePdfResource, setActivePdfResource] = useState<Resource | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [browseFilters, setBrowseFilters] = useState<{
    branchId?: string;
    semesterId?: string;
    type?: string;
    q?: string;
  }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load initial data
  const loadData = async () => {
    try {
      const [bList, semList, subjList, chapList, resList, st] = await Promise.all([
        api.getBranches(),
        api.getSemesters(),
        api.getSubjects(),
        api.getChapters(),
        api.getResources(),
        api.getStats(),
      ]);

      setBranches(bList);
      setSemesters(semList);
      setSubjects(subjList);
      setChapters(chapList);
      setResources(resList);
      setStats(st);

      // Default subject for direct navigation
      if (!selectedSubject && subjList.length > 0) {
        const defaultSubj = subjList.find((s) => s.code === 'BT-102') || subjList[0];
        setSelectedSubject(defaultSubj);
      }
    } catch (err) {
      console.error('Failed to load application curriculum data:', err);
    }
  };

  useEffect(() => {
    loadData();
    // Check if admin is currently authenticated
    api.getMe().then((res) => {
      if (res?.user) setCurrentUser(res.user);
    });
  }, []);

  const handleOpenPdf = (resource: Resource) => {
    setActivePdfResource(resource);
  };

  const handleDownloadPdf = (resource: Resource) => {
    showToast(`Downloading ${resource.fileName} (Direct High-Speed)...`);
    // Create direct anchor download pointing to backend stream endpoint
    const downloadUrl = api.getDownloadUrl(resource.id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resource.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Refresh stats downloads count
    setTimeout(() => {
      api.getStats().then((st) => setStats(st)).catch(() => {});
    }, 1000);
  };

  const handleSelectSubject = (subj: Subject) => {
    setSelectedSubject(subj);
    setCurrentView('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string, payload?: any) => {
    if (view === 'branches') {
      if (typeof payload === 'string') {
        const branchMatch = branches.find((b) => b.code === payload || b.id === payload);
        setBrowseFilters({ branchId: branchMatch?.id || 'all' });
      } else {
        setBrowseFilters({});
      }
      setCurrentView('browse');
    } else if (view === 'semesters') {
      if (payload) {
        setBrowseFilters({ semesterId: payload });
      } else {
        setBrowseFilters({});
      }
      setCurrentView('browse');
    } else if (view === 'browse') {
      if (payload?.type) {
        setBrowseFilters({ type: payload.type });
      } else {
        setBrowseFilters({});
      }
      setCurrentView('browse');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (query: string, branch: string) => {
    setBrowseFilters({ q: query, branchId: branch });
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] selection:bg-[#dbe1ff] selection:text-[#00174b]">
      {/* Toast Notification */}
      <Toast message={toastMessage} />

      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isAdminLoggedIn={Boolean(currentUser)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full pt-16 flex-1">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <div className="flex flex-col w-full">
            {/* Hero Section */}
            <HeroSection
              onSearch={handleHeroSearch}
              onExploreNotes={() => {
                const el = document.getElementById('recent-notes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('browse');
              }}
              onBrowseSemester={() => {
                const el = document.getElementById('semesters-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Stats Ribbon */}
            <StatsRibbon stats={stats} />

            {/* Browse by Semester Grid (1 to 8) */}
            <SemesterGrid
              semesters={semesters}
              onSelectSemester={(semesterId) => {
                setBrowseFilters({ semesterId });
                setCurrentView('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Popular Subjects */}
            <PopularSubjects
              subjects={subjects}
              onSelectSubject={handleSelectSubject}
              onViewAll={() => {
                setCurrentView('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Recently Added Notes */}
            <RecentNotes
              resources={resources}
              onOpenPdf={handleOpenPdf}
              onDownloadPdf={handleDownloadPdf}
            />

            {/* How It Works: 3 Simple Steps */}
            <HowItWorks />

            {/* Motivational Banner / CTA */}
            <CtaBanner
              onGetStarted={() => {
                if (subjects.length > 0) handleSelectSubject(subjects[0]);
                else setCurrentView('browse');
              }}
              onContribute={() => {
                showToast('Welcome to the contributor board! Opening admin & submission portal...');
                setCurrentView('admin');
              }}
            />
          </div>
        )}

        {/* VIEW 2: SUBJECT DETAIL (Matches user's Image 3.png) */}
        {currentView === 'subject' && selectedSubject && (
          <SubjectDetailView
            subject={selectedSubject}
            chapters={chapters.filter((c) => c.subjectId === selectedSubject.id)}
            resources={resources.filter((r) => r.subjectId === selectedSubject.id)}
            allSubjects={subjects}
            onSelectSubject={handleSelectSubject}
            onOpenPdf={handleOpenPdf}
            onDownloadPdf={handleDownloadPdf}
            onShowToast={showToast}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 3: BROWSE NOTES HIERARCHY */}
        {currentView === 'browse' && (
          <BrowseView
            branches={branches}
            semesters={semesters}
            subjects={subjects}
            chapters={chapters}
            resources={resources}
            initialFilters={browseFilters}
            onSelectSubject={handleSelectSubject}
            onOpenPdf={handleOpenPdf}
            onDownloadPdf={handleDownloadPdf}
          />
        )}

        {/* VIEW 4: ADMIN PORTAL */}
        {currentView === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            onLoginSuccess={(u) => setCurrentUser(u)}
            onLogout={() => {
              api.logout();
              setCurrentUser(null);
              showToast('You have signed out from Administrator Portal');
              setCurrentView('home');
            }}
            stats={stats}
            branches={branches}
            semesters={semesters}
            subjects={subjects}
            chapters={chapters}
            resources={resources}
            onRefreshData={loadData}
            onOpenPdf={handleOpenPdf}
            onShowToast={showToast}
          />
        )}

        {/* VIEW 5: ABOUT */}
        {currentView === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-black text-[#131b2e] mb-4">About Mentor Harry for RGPV</h1>
            <p className="text-sm text-[#434655] leading-relaxed mb-6">
              Mentor Harry for RGPV is an independent, high-yield academic study portal engineered specifically for undergraduate students of Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-white rounded-2xl border border-slate-200">
                <span className="material-symbols-outlined text-[32px] text-[#004ac6] mb-2 block">
                  menu_book
                </span>
                <h3 className="font-bold text-[#131b2e] mb-1">Curated Handwritten Notes</h3>
                <p className="text-xs text-[#434655] leading-relaxed">
                  Lectures, theorems, and derivations synthesized by university department toppers and faculty to give you exact marking answers.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200">
                <span className="material-symbols-outlined text-[32px] text-[#4b41e1] mb-2 block">
                  auto_stories
                </span>
                <h3 className="font-bold text-[#131b2e] mb-1">Shivani &amp; Guidebook Summaries</h3>
                <p className="text-xs text-[#434655] leading-relaxed">
                  Clean chapter-wise problem sets and question banks indexed directly for 7-mark and 14-mark university exam questions.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="px-5 py-2.5 bg-[#004ac6] text-white rounded-xl text-xs font-bold"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* VIEW 6: CONTACT */}
        {currentView === 'contact' && (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-black text-[#131b2e] mb-2">Student Support &amp; Feedback</h1>
            <p className="text-xs text-[#434655] mb-6">
              Have solved exam papers, corrections, or requests for upcoming semester modules? Get in touch with our student review board.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Thank you! Your feedback has been forwarded to Mentor Harry review team.');
                setCurrentView('home');
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">College / Institute</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UIT RGPV, LNCT, Oriental, TIT"
                  className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">Message or Resource Request</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your subject request or correction..."
                  className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#004ac6] text-white font-bold rounded-xl"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        )}

        {/* VIEW 7: GUIDELINES & DISCLAIMER */}
        {(currentView === 'guidelines' || currentView === 'disclaimer' || currentView === 'privacy') && (
          <div className="max-w-3xl mx-auto px-4 py-12 text-xs">
            <h1 className="text-2xl font-black text-[#131b2e] mb-3 capitalize">
              {currentView} Statement
            </h1>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 leading-relaxed text-[#434655]">
              <p>
                <strong>Academic Fair Use:</strong> Mentor Harry for RGPV is an educational platform crafted to foster academic peer-learning among engineering undergraduates. Materials published on this repository comprise verified lecture summaries, mathematical derivations, and open student contributions.
              </p>
              <p>
                <strong>Affiliation Disclaimer:</strong> Mentor Harry is an independent student academic resource platform and is not officially affiliated with, endorsed by, or sponsored by Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal. All trademarks, curriculum codes (e.g. BT-102, BT-205), and syllabus structures remain the intellectual property of their respective university authorities.
              </p>
              <p>
                <strong>Data Protection:</strong> All uploaded resources and administrator operations are safeguarded with token authentication, server validation, and persistent file encryption.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-6 px-5 py-2.5 bg-[#004ac6] text-white rounded-xl font-bold cursor-pointer"
            >
              Return to Notes
            </button>
          </div>
        )}
      </main>

      {/* Global Online PDF Viewer Modal */}
      <PdfViewerModal
        resource={activePdfResource}
        onClose={() => setActivePdfResource(null)}
        onDownload={handleDownloadPdf}
        onBackToChapter={() => {
          if (activePdfResource) {
            const subj = subjects.find((s) => s.id === activePdfResource.subjectId);
            if (subj) handleSelectSubject(subj);
          }
        }}
      />

      {/* Global Quick Search Modal (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        subjects={subjects}
        resources={resources}
        onSelectSubject={handleSelectSubject}
        onOpenPdf={handleOpenPdf}
      />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
