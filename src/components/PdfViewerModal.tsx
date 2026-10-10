import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { api } from '../api';

interface PdfViewerModalProps {
  resource: Resource | null;
  onClose: () => void;
  onDownload: (resource: Resource) => void;
  onBackToChapter?: (chapterId: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  resource,
  onClose,
  onDownload,
  onBackToChapter,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewerMode, setViewerMode] = useState<'reader' | 'native'>('reader');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const totalPages = resource?.pages || 4;

  useEffect(() => {
    if (resource) {
      setCurrentPage(1);
      setZoomLevel(100);
      setHasError(false);
      setIsLoading(false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [resource]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentPage < totalPages) setCurrentPage((p) => p + 1);
      if (e.key === 'ArrowLeft' && currentPage > 1) setCurrentPage((p) => p - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onClose]);

  if (!resource) return null;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 25, 60));
  const handleFitScreen = () => setZoomLevel(100);

  const fileUrl = api.getFileUrl(resource.fileName);

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80">
        {/* Top Header Bar */}
        <div className="bg-[#f2f3ff] px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </span>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base text-[#131b2e] font-bold truncate">
                {resource.title}
              </h4>
              <p className="text-xs text-[#434655] truncate">
                {resource.resourceType} • {resource.verifiedBadge || 'Verified'} • {resource.fileSize}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Viewer Mode Switch */}
            <div className="hidden sm:flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setViewerMode('reader')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewerMode === 'reader'
                    ? 'bg-white text-[#004ac6] shadow-sm'
                    : 'text-[#434655] hover:text-[#131b2e]'
                }`}
              >
                High-Yield Reader
              </button>
              <button
                onClick={() => setViewerMode('native')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewerMode === 'native'
                    ? 'bg-white text-[#004ac6] shadow-sm'
                    : 'text-[#434655] hover:text-[#131b2e]'
                }`}
              >
                Native PDF
              </button>
            </div>

            {/* Back to Chapter */}
            {onBackToChapter && (
              <button
                onClick={() => {
                  onClose();
                  onBackToChapter(resource.chapterId);
                }}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-[#131b2e] hover:bg-slate-100 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                title="Return to Chapter"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back to Chapter</span>
              </button>
            )}

            {/* Download Button */}
            <button
              onClick={() => onDownload(resource)}
              className="px-3.5 py-1.5 rounded-lg bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-200/70 flex items-center justify-center text-[#434655] transition-colors cursor-pointer"
              title="Close Viewer (Esc)"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Toolbar (Zoom & Navigation) */}
        {viewerMode === 'reader' && (
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-[#434655] shrink-0">
            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                title="Previous Page"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="font-semibold text-[#131b2e] tabular-nums">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                title="Next Page"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-1 rounded hover:bg-slate-200 text-[#131b2e] cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <span className="font-mono text-[11px] text-[#737686] tabular-nums w-12 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 rounded hover:bg-slate-200 text-[#131b2e] cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
              <button
                onClick={handleFitScreen}
                className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-[#131b2e] border border-slate-200 text-[11px] font-medium cursor-pointer"
                title="Fit to Screen"
              >
                Fit Screen
              </button>
            </div>
          </div>
        )}

        {/* Viewer Body */}
        <div className="flex-1 bg-[#283044] p-4 sm:p-6 overflow-y-auto flex items-start justify-center relative">
          {hasError ? (
            <div className="bg-white p-8 rounded-xl max-w-md text-center shadow-lg my-auto">
              <span className="material-symbols-outlined text-rose-500 text-[48px] mb-2">
                error_outline
              </span>
              <h3 className="text-lg font-bold text-[#131b2e]">Unable to Load Document</h3>
              <p className="text-xs text-slate-500 mt-2 mb-4">
                The requested PDF file could not be displayed. You can download the original file directly to view on your device.
              </p>
              <button
                onClick={() => onDownload(resource)}
                className="px-4 py-2 bg-[#004ac6] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
              >
                Download Original PDF
              </button>
            </div>
          ) : viewerMode === 'native' ? (
            <div className="w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
              <iframe
                src={fileUrl}
                title={resource.title}
                className="w-full h-full border-0"
                onError={() => setHasError(true)}
              />
            </div>
          ) : (
            /* High-Yield Reader Sheet */
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="bg-white w-full max-w-3xl min-h-[750px] rounded-lg shadow-2xl p-8 sm:p-12 flex flex-col justify-between text-[#131b2e] transition-transform duration-150 my-2 select-text"
            >
              <div>
                {/* Document Header */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#004ac6] uppercase tracking-wider">
                      RGPV B.Tech Exam Engine • Unit 1
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      Verified
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#737686]">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                {/* Page Content depending on currentPage */}
                {currentPage === 1 && (
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black mb-3 text-[#131b2e]">
                      {resource.title}
                    </h1>
                    <p className="text-xs text-[#737686] mb-6">
                      Curated by {resource.author} • Updated for 2024–25 RGPV Curriculum
                    </p>

                    <div className="mb-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                      <h4 className="text-xs font-bold text-[#004ac6] uppercase tracking-wider mb-1">
                        Unit Scope &amp; Target Concepts
                      </h4>
                      <p className="text-xs text-[#434655] leading-relaxed">
                        {resource.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-[#131b2e] mb-1">
                          1. Rolle's Theorem (Fundamental Statement)
                        </h3>
                        <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                          <strong>Theorem:</strong> Let f: [a, b] → ℝ be a continuous function on the closed interval [a, b], and differentiable on the open interval (a, b). If f(a) = f(b), then there exists at least one point c in (a, b) such that f'(c) = 0.
                        </p>
                      </div>

                      <div className="p-4 bg-[#f2f3ff] rounded-xl border border-blue-100">
                        <p className="font-mono text-xs text-[#004ac6] font-bold">
                          Important RGPV Exam Tip (Frequently repeated 2019, 2021, 2023):
                        </p>
                        <p className="text-xs text-[#131b2e] mt-1 leading-relaxed">
                          Always state geometric interpretation alongside mathematical verification: the tangent to the curve at point c is parallel to the x-axis to score full 7 marks.
                        </p>
                      </div>

                      <div className="h-28 w-full bg-[#faf8ff] border border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-[#434655] text-xs">
                        <span className="material-symbols-outlined text-[28px] text-[#004ac6] mb-1">
                          show_chart
                        </span>
                        <span>[ Mathematical Graph Representation: Tangent parallel to x-axis at x = c ]</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentPage === 2 && (
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e] mb-3">
                      2. Lagrange's Mean Value Theorem (LMVT)
                    </h2>
                    <p className="text-xs sm:text-sm text-[#434655] leading-relaxed mb-4">
                      If f(x) is continuous in [a, b] and differentiable in (a, b), then there exists at least one real number c ∈ (a, b) such that:
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-sm font-bold text-[#004ac6] mb-4">
                      f'(c) = [f(b) - f(a)] / (b - a)
                    </div>
                    <p className="text-xs text-[#434655] leading-relaxed mb-4">
                      <strong>Geometric Meaning:</strong> The slope of the tangent at point c equals the slope of the chord connecting points (a, f(a)) and (b, f(b)).
                    </p>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="font-bold text-xs text-amber-800">
                        Exam Warning:
                      </p>
                      <p className="text-xs text-amber-900 mt-1">
                        Check differentiability at boundary endpoints carefully before applying LMVT to rational functions with poles.
                      </p>
                    </div>
                  </div>
                )}

                {currentPage === 3 && (
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e] mb-3">
                      3. Cauchy's Mean Value Theorem &amp; Indeterminate Forms
                    </h2>
                    <p className="text-xs sm:text-sm text-[#434655] leading-relaxed mb-4">
                      If f(x) and g(x) are continuous in [a, b], differentiable in (a, b), and g'(x) ≠ 0 for all x ∈ (a, b), then:
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-sm font-bold text-[#4b41e1] mb-4">
                      [f(b) - f(a)] / [g(b) - g(a)] = f'(c) / g'(c)
                    </div>
                    <p className="text-xs text-[#434655] leading-relaxed mb-4">
                      This directly powers the formal mathematical derivation of <strong>L'Hôpital's Rule</strong> for indeterminate limits of form 0/0 and ∞/∞.
                    </p>
                  </div>
                )}

                {currentPage >= 4 && (
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e] mb-3">
                      4. Taylor's &amp; Maclaurin's Expansion Series
                    </h2>
                    <p className="text-xs sm:text-sm text-[#434655] leading-relaxed mb-4">
                      Expansion of f(x) about x = 0 (Maclaurin's Theorem):
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-[#004ac6] mb-4 leading-relaxed">
                      f(x) = f(0) + x·f'(0) + (x²/2!)·f''(0) + (x³/3!)·f'''(0) + ...
                    </div>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                      <p className="font-bold text-xs text-emerald-800">Standard Formula Memory Check:</p>
                      <p className="text-xs text-emerald-900 mt-1">
                        sin(x) = x - x³/3! + x⁵/5! - ...<br />
                        cos(x) = 1 - x²/2! + x⁴/4! - ...<br />
                        eˣ = 1 + x + x²/2! + x³/3! + ...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Footer */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#737686] gap-2">
                <span>Verified study material curated by Mentor Harry Student Community.</span>
                <span className="font-semibold text-[#004ac6]">Protected Digital Edition · RGPV 2025</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
