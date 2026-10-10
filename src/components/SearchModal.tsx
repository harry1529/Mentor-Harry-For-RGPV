import React, { useState, useEffect, useRef } from 'react';
import { Subject, Resource } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  resources: Resource[];
  onSelectSubject: (subject: Subject) => void;
  onOpenPdf: (resource: Resource) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  subjects,
  resources,
  onSelectSubject,
  onOpenPdf,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedSubjects = trimmed
    ? subjects.filter(
        (s) =>
          s.name.toLowerCase().includes(trimmed) ||
          s.code.toLowerCase().includes(trimmed) ||
          s.description.toLowerCase().includes(trimmed)
      )
    : [];

  const matchedResources = trimmed
    ? resources.filter(
        (r) =>
          r.title.toLowerCase().includes(trimmed) ||
          r.description.toLowerCase().includes(trimmed) ||
          r.author.toLowerCase().includes(trimmed)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3 bg-[#f2f3ff]/50">
          <span className="material-symbols-outlined text-[#004ac6] text-[22px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type subject, chapter, or topic (e.g. Calculus, BT-102)..."
            className="w-full bg-transparent text-sm text-[#131b2e] placeholder:text-[#737686] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md bg-white border border-slate-200 text-xs text-[#737686] hover:bg-slate-100 cursor-pointer font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 flex flex-col gap-4">
          {!trimmed && (
            <div className="py-8 text-center text-xs text-[#737686]">
              <span className="material-symbols-outlined text-[36px] text-[#c3c6d7] mb-2 block">
                search_check
              </span>
              <span>Search across 54+ RGPV engineering subjects and verified PDF notes.</span>
            </div>
          )}

          {trimmed && matchedSubjects.length === 0 && matchedResources.length === 0 && (
            <div className="py-8 text-center text-xs text-[#737686]">
              <p>No results found for "{query}". Try checking the subject code (e.g., BT-102).</p>
            </div>
          )}

          {/* Subjects Section */}
          {matchedSubjects.length > 0 && (
            <div>
              <h5 className="text-[11px] font-bold text-[#737686] uppercase tracking-wider mb-2">
                Subjects ({matchedSubjects.length})
              </h5>
              <div className="flex flex-col gap-1.5">
                {matchedSubjects.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectSubject(s);
                      onClose();
                    }}
                    className="p-3 rounded-xl hover:bg-[#eaedff] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#dae2fd] text-[#004ac6] font-mono text-[11px] font-bold">
                          {s.code}
                        </span>
                        <span className="text-xs font-bold text-[#131b2e]">{s.name}</span>
                      </div>
                      <p className="text-[11px] text-[#737686] mt-0.5">{s.groupTag} • Semester {s.semNumber}</p>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-[#c3c6d7]">
                      arrow_forward
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Section */}
          {matchedResources.length > 0 && (
            <div>
              <h5 className="text-[11px] font-bold text-[#737686] uppercase tracking-wider mb-2">
                PDF Resources ({matchedResources.length})
              </h5>
              <div className="flex flex-col gap-1.5">
                {matchedResources.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onOpenPdf(r);
                      onClose();
                    }}
                    className="p-3 rounded-xl hover:bg-[#eaedff] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#f2f3ff] text-[#004ac6] text-[10px] font-semibold">
                          {r.resourceType}
                        </span>
                        <span className="text-xs font-bold text-[#131b2e]">{r.title}</span>
                      </div>
                      <p className="text-[11px] text-[#737686] mt-0.5">
                        {r.author} • {r.fileSize}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-[#004ac6]">
                      visibility
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
