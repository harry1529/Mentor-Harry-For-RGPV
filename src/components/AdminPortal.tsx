import React, { useState } from 'react';
import { Branch, Semester, Subject, Chapter, Resource, AdminStats, User } from '../types';
import { api } from '../api';
import { AdminResourceModal } from './AdminResourceModal';

interface AdminPortalProps {
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  stats: AdminStats | null;
  branches: Branch[];
  semesters: Semester[];
  subjects: Subject[];
  chapters: Chapter[];
  resources: Resource[];
  onRefreshData: () => void;
  onOpenPdf: (resource: Resource) => void;
  onShowToast: (message: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  stats,
  branches,
  semesters,
  subjects,
  chapters,
  resources,
  onRefreshData,
  onOpenPdf,
  onShowToast,
}) => {
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'resources' | 'subjects' | 'chapters' | 'branches'>('resources');

  // Resource management state
  const [resourceSearch, setResourceSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [replacingResource, setReplacingResource] = useState<Resource | null>(null);

  // Deletion confirmation state
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick subject add state
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjBranch, setNewSubjBranch] = useState('branch-cse');
  const [newSubjSem, setNewSubjSem] = useState('sem-1');

  // Quick chapter add state
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapUnit, setNewChapUnit] = useState(1);
  const [newChapSubject, setNewChapSubject] = useState(subjects[0]?.id || 'subj-bt102');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const data = await api.login(email.trim(), password);
      onLoginSuccess(data.user);
      onShowToast(`Welcome back, ${data.user.name}`);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator email or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fillDefaultCredentials = () => {
    setEmail('admin@mentorharry.rgpv');
    setPassword('MentorHarry@2025');
    setLoginError('');
  };

  const handleTogglePublish = async (resource: Resource) => {
    try {
      await api.togglePublishResource(resource.id, !resource.isPublished);
      onShowToast(
        !resource.isPublished
          ? `Published "${resource.title}" to public portal`
          : `Unpublished "${resource.title}" from public view`
      );
      onRefreshData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update publication status');
    }
  };

  const confirmDelete = async () => {
    if (!deletingResource) return;
    setIsDeleting(true);
    try {
      await api.deleteResource(deletingResource.id);
      onShowToast(`Resource "${deletingResource.title}" deleted successfully`);
      setDeletingResource(null);
      onRefreshData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete resource');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjCode || !newSubjName) return;
    try {
      await api.createSubject({
        code: newSubjCode.trim(),
        name: newSubjName.trim(),
        branchId: newSubjBranch,
        semesterId: newSubjSem,
        semNumber: Number(newSubjSem.replace('sem-', '')) || 1,
        groupTag: 'Core Engineering',
        credits: 4,
        gradeScheme: '70 Theory + 30 Sessional',
        description: `Official ${newSubjCode} syllabus curriculum for RGPV engineering students.`,
        unitsCount: 5,
      });
      onShowToast(`Subject ${newSubjCode} added successfully`);
      setNewSubjCode('');
      setNewSubjName('');
      setShowAddSubject(false);
      onRefreshData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to create subject');
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapTitle || !newChapSubject) return;
    try {
      await api.createChapter({
        unitNumber: Number(newChapUnit),
        subjectId: newChapSubject,
        title: `Unit ${newChapUnit}: ${newChapTitle.trim()}`,
        subtitle: newChapTitle.trim(),
        summary: `Syllabus units, theorems, derivations, and exam questions for ${newChapTitle.trim()}`,
        examWeightage: '~18 Marks',
        isHighYield: true,
      });
      onShowToast(`Unit ${newChapUnit} created successfully`);
      setNewChapTitle('');
      setShowAddChapter(false);
      onRefreshData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to create chapter');
    }
  };

  // If unauthenticated, show protected login screen
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 w-full">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#004ac6] text-white flex items-center justify-center shadow-md mb-3">
              <span className="material-symbols-outlined text-[26px]">shield</span>
            </div>
            <h1 className="text-xl font-black text-[#131b2e]">Administrator Portal</h1>
            <p className="text-xs text-[#434655] mt-1">
              Secure authentication for Mentor Harry curriculum managers.
            </p>
          </div>

          {/* Secure Provisioning Notice */}
          <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#004ac6] mb-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Initial Administrator Provisioning</span>
            </div>
            <p className="text-[#434655] leading-relaxed mb-3">
              Public admin registration is blocked for security. Use the provisioned administrator account credentials:
            </p>
            <div className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-blue-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-[#131b2e]">admin@mentorharry.rgpv</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <span className="font-bold text-[#131b2e]">MentorHarry@2025</span>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="mt-3 w-full py-1.5 px-3 rounded-lg bg-[#004ac6]/10 text-[#004ac6] hover:bg-[#004ac6]/20 font-bold transition-colors cursor-pointer text-center"
            >
              Fill Provisioned Credentials
            </button>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#131b2e] block mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mentorharry.rgpv"
                className="w-full p-3 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#131b2e] block mb-1">
                Administrator Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-[#f2f3ff] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#004ac6] hover:bg-[#003ea8] text-white font-bold rounded-xl shadow-md shadow-[#004ac6]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In as Administrator</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered resources for admin table
  const adminResources = resources.filter((r) => {
    if (filterBranch !== 'all' && r.branchId !== filterBranch) return false;
    if (filterSemester !== 'all' && r.semesterId !== filterSemester) return false;
    if (resourceSearch.trim()) {
      const q = resourceSearch.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 w-full">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Admin Session Active
            </span>
            <span className="text-xs text-[#737686]">{currentUser.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] mt-1">
            Curriculum Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingResource(null);
              setReplacingResource(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-bold shadow-md shadow-[#004ac6]/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Upload New Resource</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#434655] hover:text-rose-600 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] text-[#737686] uppercase font-bold block">Branches</span>
          <span className="text-xl font-black text-[#131b2e] mt-1 block">
            {stats?.totalBranches || branches.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] text-[#737686] uppercase font-bold block">Semesters</span>
          <span className="text-xl font-black text-[#131b2e] mt-1 block">
            {stats?.totalSemesters || semesters.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] text-[#737686] uppercase font-bold block">Subjects</span>
          <span className="text-xl font-black text-[#004ac6] mt-1 block">
            {stats?.totalSubjects || subjects.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] text-[#737686] uppercase font-bold block">Chapters</span>
          <span className="text-xl font-black text-[#4b41e1] mt-1 block">
            {stats?.totalChapters || chapters.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] text-[#737686] uppercase font-bold block">Total Notes</span>
          <span className="text-xl font-black text-[#131b2e] mt-1 block">
            {stats?.totalResources || resources.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] text-emerald-700 uppercase font-bold block">Published</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">
            {stats?.publishedResources || resources.filter((r) => r.isPublished).length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] text-amber-700 uppercase font-bold block">Unpublished</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">
            {stats?.unpublishedResources || resources.filter((r) => !r.isPublished).length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'resources'
              ? 'border-[#004ac6] text-[#004ac6]'
              : 'border-transparent text-[#737686] hover:text-[#131b2e]'
          }`}
        >
          Manage PDFs &amp; Notes ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'subjects'
              ? 'border-[#004ac6] text-[#004ac6]'
              : 'border-transparent text-[#737686] hover:text-[#131b2e]'
          }`}
        >
          Manage Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('chapters')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'chapters'
              ? 'border-[#004ac6] text-[#004ac6]'
              : 'border-transparent text-[#737686] hover:text-[#131b2e]'
          }`}
        >
          Manage Chapters ({chapters.length})
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'branches'
              ? 'border-[#004ac6] text-[#004ac6]'
              : 'border-transparent text-[#737686] hover:text-[#131b2e]'
          }`}
        >
          Manage Branches ({branches.length})
        </button>
      </div>

      {/* TAB 1: RESOURCES */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-[#faf8ff]">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder="Search resources..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none w-52"
                />
                <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-2 top-2">
                  search
                </span>
              </div>

              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none"
              >
                <option value="all">All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.shortName}
                  </option>
                ))}
              </select>

              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none"
              >
                <option value="all">All Semesters</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    Sem {s.semNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-[#737686]">
              Showing <strong className="text-[#131b2e]">{adminResources.length}</strong> items
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f3ff] text-[#737686] font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Title &amp; Resource Details</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminResources.map((res) => {
                  const subj = subjects.find((s) => s.id === res.subjectId);

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#131b2e] text-xs">{res.title}</div>
                        <div className="text-[11px] text-[#737686] mt-0.5 truncate max-w-sm">
                          {res.author} • {res.pages} Pages • {res.downloadCount || 0} Downloads
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#004ac6]">
                        {subj?.code || 'BT-102'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#004ac6] text-[10px] font-bold">
                          {res.resourceType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#737686] text-[11px]">
                        {res.fileSize}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(res)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            res.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle publication"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              res.isPublished ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          ></span>
                          <span>{res.isPublished ? 'Published' : 'Draft / Unpublished'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenPdf(res)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-[#434655] hover:text-[#004ac6]"
                            title="Preview PDF"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingResource(res);
                              setReplacingResource(null);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-[#434655] hover:text-[#004ac6]"
                            title="Edit Metadata"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setReplacingResource(res);
                              setEditingResource(null);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-[#434655] hover:text-[#4b41e1]"
                            title="Replace PDF File"
                          >
                            <span className="material-symbols-outlined text-[18px]">published_with_changes</span>
                          </button>
                          <button
                            onClick={() => setDeletingResource(res)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-[#737686] hover:text-rose-600"
                            title="Delete Resource"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#131b2e]">Curriculum Subjects</h3>
            <button
              onClick={() => setShowAddSubject(!showAddSubject)}
              className="px-3.5 py-1.5 rounded-lg bg-[#004ac6] text-white text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Subject</span>
            </button>
          </div>

          {showAddSubject && (
            <form onSubmit={handleCreateSubject} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BT-301"
                  value={newSubjCode}
                  onChange={(e) => setNewSubjCode(e.target.value)}
                  className="w-full p-2 bg-[#f2f3ff] rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management"
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  className="w-full p-2 bg-[#f2f3ff] rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">Branch</label>
                <select
                  value={newSubjBranch}
                  onChange={(e) => setNewSubjBranch(e.target.value)}
                  className="w-full p-2 bg-[#f2f3ff] rounded-lg border border-slate-200"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.shortName}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#004ac6] text-white rounded-lg font-bold">
                  Save Subject
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="py-2 px-3 bg-slate-100 text-[#434655] rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f3ff] text-[#737686] font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Grading Scheme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#004ac6]">{s.code}</td>
                    <td className="py-3 px-4 font-bold text-[#131b2e]">{s.name}</td>
                    <td className="py-3 px-4">Semester {s.semNumber}</td>
                    <td className="py-3 px-4">{s.unitsCount} Units</td>
                    <td className="py-3 px-4 text-[#737686]">{s.gradeScheme}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CHAPTERS */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#131b2e]">Curriculum Chapters / Units</h3>
            <button
              onClick={() => setShowAddChapter(!showAddChapter)}
              className="px-3.5 py-1.5 rounded-lg bg-[#004ac6] text-white text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Chapter</span>
            </button>
          </div>

          {showAddChapter && (
            <form onSubmit={handleCreateChapter} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">Subject</label>
                <select
                  value={newChapSubject}
                  onChange={(e) => setNewChapSubject(e.target.value)}
                  className="w-full p-2 bg-[#f2f3ff] rounded-lg border border-slate-200"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.code}: {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">Unit Number</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newChapUnit}
                  onChange={(e) => setNewChapUnit(Number(e.target.value))}
                  className="w-full p-2 bg-[#f2f3ff] rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-[#131b2e] block mb-1">Chapter Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Theory & Shortest Path"
                  value={newChapTitle}
                  onChange={(e) => setNewChapTitle(e.target.value)}
                  className="w-full p-2 bg-[#f2f3ff] rounded-lg border border-slate-200"
                />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#004ac6] text-white rounded-lg font-bold">
                  Save Chapter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="py-2 px-3 bg-slate-100 text-[#434655] rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f3ff] text-[#737686] font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Unit #</th>
                  <th className="py-3 px-4">Title &amp; Subtitle</th>
                  <th className="py-3 px-4">Exam Weightage</th>
                  <th className="py-3 px-4">High Yield</th>
                  <th className="py-3 px-4">Notes Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chapters.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-[#004ac6]">Unit {c.unitNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#131b2e]">{c.title}</div>
                      <div className="text-[11px] text-[#737686]">{c.subtitle}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">{c.examWeightage}</td>
                    <td className="py-3 px-4">
                      {c.isHighYield ? (
                        <span className="text-amber-700 font-bold">★ High Yield</span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold">{c.totalNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BRANCHES */}
      {activeTab === 'branches' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f2f3ff] text-[#737686] font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Branch Name</th>
                <th className="py-3 px-4">Overview</th>
                <th className="py-3 px-4">Total Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#004ac6]">{b.shortName}</td>
                  <td className="py-3 px-4 font-bold text-[#131b2e]">{b.name}</td>
                  <td className="py-3 px-4 text-[#434655] truncate max-w-md">{b.description}</td>
                  <td className="py-3 px-4 font-bold text-[#004ac6]">{b.totalNotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resource Add/Edit/Replace Modal */}
      <AdminResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefreshData}
        branches={branches}
        semesters={semesters}
        subjects={subjects}
        chapters={chapters}
        editingResource={editingResource}
        replacingPdfResource={replacingResource}
        onShowToast={onShowToast}
      />

      {/* Explicit Delete Confirmation Dialog */}
      {deletingResource && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <span className="material-symbols-outlined text-[28px]">warning</span>
              <h4 className="text-base font-bold text-[#131b2e]">Confirm Resource Deletion</h4>
            </div>
            <p className="text-xs text-[#434655] leading-relaxed mb-4">
              Are you sure you want to permanently delete <strong className="text-[#131b2e]">{deletingResource.title}</strong>? This will remove the document metadata and delete the physical PDF file from the server storage.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setDeletingResource(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-[#434655] hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
