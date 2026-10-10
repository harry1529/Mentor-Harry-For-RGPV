import React, { useState, useEffect } from 'react';
import { Branch, Semester, Subject, Chapter, Resource } from '../types';
import { api } from '../api';

interface AdminResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  branches: Branch[];
  semesters: Semester[];
  subjects: Subject[];
  chapters: Chapter[];
  editingResource?: Resource | null;
  replacingPdfResource?: Resource | null;
  onShowToast: (message: string) => void;
}

export const AdminResourceModal: React.FC<AdminResourceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  branches,
  semesters,
  subjects,
  chapters,
  editingResource,
  replacingPdfResource,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [branchId, setBranchId] = useState('branch-cse');
  const [semesterId, setSemesterId] = useState('sem-1');
  const [subjectId, setSubjectId] = useState('subj-bt102');
  const [chapterId, setChapterId] = useState('chap-bt102-u1');
  const [resourceType, setResourceType] = useState<'Handwritten' | 'Guidebook' | 'Exam Prep' | 'Class Notes'>('Handwritten');
  const [verifiedBadge, setVerifiedBadge] = useState('Topper Verified');
  const [author, setAuthor] = useState('Harry Sir (Dept Topper batch \'23)');
  const [pages, setPages] = useState<number>(32);
  const [isPublished, setIsPublished] = useState(true);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isReplacing = Boolean(replacingPdfResource);
  const isEditing = Boolean(editingResource) && !isReplacing;

  // Initialize form state
  useEffect(() => {
    if (editingResource) {
      setTitle(editingResource.title);
      setDescription(editingResource.description);
      setBranchId(editingResource.branchId);
      setSemesterId(editingResource.semesterId);
      setSubjectId(editingResource.subjectId);
      setChapterId(editingResource.chapterId);
      setResourceType(editingResource.resourceType);
      setVerifiedBadge(editingResource.verifiedBadge);
      setAuthor(editingResource.author);
      setPages(editingResource.pages);
      setIsPublished(editingResource.isPublished);
    } else {
      setTitle('');
      setDescription('');
      setBranchId(branches[0]?.id || 'branch-cse');
      setSemesterId(semesters[0]?.id || 'sem-1');
      setSubjectId(subjects[0]?.id || 'subj-bt102');
      setChapterId(chapters[0]?.id || 'chap-bt102-u1');
      setResourceType('Handwritten');
      setVerifiedBadge('Topper Verified');
      setAuthor('Harry Sir (Dept Topper batch \'23)');
      setPages(24);
      setIsPublished(true);
    }
    setSelectedFile(null);
    setUploadProgress(0);
    setErrorMessage('');
  }, [editingResource, replacingPdfResource, isOpen, branches, semesters, subjects, chapters]);

  if (!isOpen) return null;

  // Filter subjects based on branch and semester
  const filteredSubjects = subjects.filter((s) => {
    if (branchId && s.branchId !== branchId) return false;
    if (semesterId && s.semesterId !== semesterId && String(s.semNumber) !== semesterId) return false;
    return true;
  });

  // Filter chapters based on subject
  const filteredChapters = chapters.filter((c) => c.subjectId === subjectId);

  const handleFileChange = (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Invalid file format. Only PDF files (.pdf) are permitted.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 50 MB maximum limit.');
      return;
    }
    setSelectedFile(file);
    setErrorMessage('');
    // Auto-generate title if empty
    if (!title && !isEditing) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(baseName);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isReplacing) {
      if (!selectedFile) {
        setErrorMessage('Please select a replacement PDF file.');
        return;
      }
      setIsSubmitting(true);
      setUploadProgress(40);
      try {
        await api.replacePdf(replacingPdfResource!.id, selectedFile);
        setUploadProgress(100);
        onShowToast(`Successfully replaced PDF for "${replacingPdfResource!.title}"`);
        onSuccess();
        onClose();
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to replace PDF file');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (isEditing) {
      if (!title.trim()) {
        setErrorMessage('Resource title is required.');
        return;
      }
      setIsSubmitting(true);
      try {
        await api.updateResource(editingResource!.id, {
          title,
          description,
          branchId,
          semesterId,
          subjectId,
          chapterId,
          resourceType,
          verifiedBadge,
          author,
          pages: Number(pages) || 12,
          isPublished,
        });
        onShowToast('Resource metadata updated successfully');
        onSuccess();
        onClose();
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to update resource metadata');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Creating new resource
    if (!title.trim()) {
      setErrorMessage('Resource title is required.');
      return;
    }
    if (!selectedFile) {
      setErrorMessage('A PDF file is required to upload a new resource.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(30);

    try {
      // 1. Upload PDF file
      const uploadedFile = await api.uploadPdfFile(selectedFile);
      setUploadProgress(70);

      // 2. Create resource entry
      await api.createResource({
        title,
        description,
        branchId,
        semesterId,
        subjectId,
        chapterId,
        resourceType,
        verifiedBadge,
        author,
        pages: Number(pages) || 12,
        fileSize: uploadedFile.fileSize,
        fileSizeBytes: uploadedFile.fileSizeBytes,
        fileName: uploadedFile.fileName,
        filePath: uploadedFile.filePath,
        isPublished,
      });

      setUploadProgress(100);
      onShowToast(`Resource "${title}" successfully published to curriculum!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload and create resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#f2f3ff] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#004ac6] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">
                {isReplacing ? 'published_with_changes' : isEditing ? 'edit_note' : 'upload_file'}
              </span>
            </span>
            <h3 className="text-base font-bold text-[#131b2e]">
              {isReplacing
                ? `Replace PDF File: ${replacingPdfResource?.title}`
                : isEditing
                ? 'Edit Resource Metadata'
                : 'Upload & Publish New PDF Resource'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-[#434655]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Replacement Mode Only Shows File Picker */}
          {isReplacing ? (
            <div className="space-y-4">
              <p className="text-[#434655]">
                Upload a verified replacement PDF for <strong className="text-[#131b2e]">{replacingPdfResource?.title}</strong>. The previous file will only be replaced after the new file is successfully uploaded and verified.
              </p>

              {/* Drag and drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  isDragging ? 'border-[#004ac6] bg-blue-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <span className="material-symbols-outlined text-[42px] text-[#004ac6] mb-2 block">
                  cloud_upload
                </span>
                <p className="font-bold text-[#131b2e] mb-1">
                  Drag &amp; drop new replacement PDF here, or
                </p>
                <label className="inline-block mt-2 px-4 py-2 bg-[#004ac6] text-white rounded-xl font-bold cursor-pointer hover:bg-[#003ea8]">
                  Browse Computer
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  />
                </label>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-500 text-[20px]">
                        picture_as_pdf
                      </span>
                      <div>
                        <span className="font-bold text-[#131b2e] block truncate max-w-[280px]">
                          {selectedFile.name}
                        </span>
                        <span className="text-[11px] text-[#737686]">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-bold">Ready</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Title & Description */}
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Calculus Part 1 — Comprehensive Handwritten Notes"
                  className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#131b2e] block mb-1">
                  Description / Topic Coverage
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of theorems, proofs, question banks, or solutions contained..."
                  className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />
              </div>

              {/* Hierarchy: Branch & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#131b2e] block mb-1">
                    Branch *
                  </label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.shortName} ({b.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#131b2e] block mb-1">
                    Semester *
                  </label>
                  <select
                    value={semesterId}
                    onChange={(e) => setSemesterId(e.target.value)}
                    className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  >
                    {semesters.map((s) => (
                      <option key={s.id} value={s.id}>
                        Semester {s.semNumber} ({s.tag})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hierarchy: Subject & Chapter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#131b2e] block mb-1">
                    Subject *
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => {
                      setSubjectId(e.target.value);
                      const ch = chapters.find((c) => c.subjectId === e.target.value);
                      if (ch) setChapterId(ch.id);
                    }}
                    className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  >
                    {filteredSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code}: {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#131b2e] block mb-1">
                    Chapter / Unit *
                  </label>
                  <select
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  >
                    {filteredChapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Metadata details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#131b2e] block mb-1">
                    Resource Type
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as any)}
                    className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Handwritten">Handwritten Notes</option>
                    <option value="Guidebook">Shivani / Guidebook</option>
                    <option value="Exam Prep">Important Questions / PYQ</option>
                    <option value="Class Notes">Class Notes / Capsule</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#131b2e] block mb-1">
                    Verified Badge
                  </label>
                  <input
                    type="text"
                    value={verifiedBadge}
                    onChange={(e) => setVerifiedBadge(e.target.value)}
                    placeholder="e.g. Topper Verified"
                    className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#131b2e] block mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#131b2e] block mb-1">
                  Author / Contributor
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Harry Sir (Dept Topper batch '23)"
                  className="w-full p-2.5 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              {/* PDF Picker (only when creating new) */}
              {!isEditing && (
                <div>
                  <label className="font-bold text-[#131b2e] block mb-1">
                    PDF Document (.pdf) *
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                      isDragging ? 'border-[#004ac6] bg-blue-50/40' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[32px] text-[#004ac6] mb-1 block">
                      upload_file
                    </span>
                    <span className="font-semibold text-[#131b2e] block">
                      Drag &amp; drop PDF file here, or
                    </span>
                    <label className="inline-block mt-2 px-3 py-1.5 bg-[#004ac6] text-white rounded-lg font-bold cursor-pointer hover:bg-[#003ea8]">
                      Choose PDF File
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      />
                    </label>
                    {selectedFile && (
                      <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-left">
                        <span className="font-semibold truncate max-w-[240px] text-[#131b2e]">
                          {selectedFile.name}
                        </span>
                        <span className="text-[#737686]">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Publication toggle */}
              <div className="flex items-center gap-3 p-3 bg-[#f2f3ff] rounded-xl">
                <input
                  type="checkbox"
                  id="publishToggle"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-[#004ac6] rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="publishToggle" className="cursor-pointer">
                  <span className="font-bold text-[#131b2e] block">Publish Immediately</span>
                  <span className="text-[11px] text-[#737686]">
                    Published notes are visible instantly to public students in search and chapters.
                  </span>
                </label>
              </div>
            </>
          )}

          {/* Progress indicator */}
          {uploadProgress > 0 && (
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#004ac6] h-2 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-[#434655] hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-bold shadow-md shadow-[#004ac6]/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                  <span>Saving...</span>
                </>
              ) : (
                <span>
                  {isReplacing ? 'Replace PDF' : isEditing ? 'Save Changes' : 'Upload & Publish'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
