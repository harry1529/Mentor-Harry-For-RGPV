import { Branch, Semester, Subject, Chapter, Resource, AdminStats, User } from './types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('mentorharry_admin_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Failed to authenticate');
    }
    const data = await res.json();
    localStorage.setItem('mentorharry_admin_token', data.token);
    return data;
  },

  async getMe(): Promise<{ user: User } | null> {
    const token = localStorage.getItem('mentorharry_admin_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        localStorage.removeItem('mentorharry_admin_token');
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('mentorharry_admin_token');
  },

  async getInitialAdminInfo(): Promise<{ defaultAdminEmail: string; defaultAdminPasswordHint: string; note: string }> {
    const res = await fetch(`${API_BASE}/admin/initial-info`);
    return await res.json();
  },

  // Stats
  async getStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return await res.json();
  },

  // Branches
  async getBranches(): Promise<Branch[]> {
    const res = await fetch(`${API_BASE}/branches`);
    if (!res.ok) throw new Error('Failed to fetch branches');
    return await res.json();
  },

  async createBranch(data: Partial<Branch>): Promise<Branch> {
    const res = await fetch(`${API_BASE}/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create branch');
    return await res.json();
  },

  async updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update branch');
    return await res.json();
  },

  async deleteBranch(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete branch');
  },

  // Semesters
  async getSemesters(): Promise<Semester[]> {
    const res = await fetch(`${API_BASE}/semesters`);
    if (!res.ok) throw new Error('Failed to fetch semesters');
    return await res.json();
  },

  // Subjects
  async getSubjects(branchId?: string, semesterId?: string): Promise<Subject[]> {
    const params = new URLSearchParams();
    if (branchId && branchId !== 'all') params.append('branchId', branchId);
    if (semesterId && semesterId !== 'all') params.append('semesterId', semesterId);
    const res = await fetch(`${API_BASE}/subjects?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch subjects');
    return await res.json();
  },

  async getSubject(id: string): Promise<Subject> {
    const res = await fetch(`${API_BASE}/subjects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch subject');
    return await res.json();
  },

  async createSubject(data: Partial<Subject>): Promise<Subject> {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create subject');
    return await res.json();
  },

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update subject');
    return await res.json();
  },

  async deleteSubject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete subject');
  },

  // Chapters
  async getChapters(subjectId?: string): Promise<Chapter[]> {
    const params = new URLSearchParams();
    if (subjectId) params.append('subjectId', subjectId);
    const res = await fetch(`${API_BASE}/chapters?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch chapters');
    return await res.json();
  },

  async createChapter(data: Partial<Chapter>): Promise<Chapter> {
    const res = await fetch(`${API_BASE}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create chapter');
    return await res.json();
  },

  async updateChapter(id: string, data: Partial<Chapter>): Promise<Chapter> {
    const res = await fetch(`${API_BASE}/chapters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update chapter');
    return await res.json();
  },

  async deleteChapter(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/chapters/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete chapter');
  },

  // Resources
  async getResources(filters?: {
    branchId?: string;
    semesterId?: string;
    subjectId?: string;
    chapterId?: string;
    resourceType?: string;
    q?: string;
  }): Promise<Resource[]> {
    const params = new URLSearchParams();
    if (filters?.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
    if (filters?.semesterId && filters.semesterId !== 'all') params.append('semesterId', filters.semesterId);
    if (filters?.subjectId && filters.subjectId !== 'all') params.append('subjectId', filters.subjectId);
    if (filters?.chapterId && filters.chapterId !== 'all') params.append('chapterId', filters.chapterId);
    if (filters?.resourceType && filters.resourceType !== 'all') params.append('resourceType', filters.resourceType);
    if (filters?.q) params.append('q', filters.q);

    const res = await fetch(`${API_BASE}/resources?${params.toString()}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch resources');
    return await res.json();
  },

  async getResource(id: string): Promise<Resource> {
    const res = await fetch(`${API_BASE}/resources/${id}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch resource');
    return await res.json();
  },

  async uploadPdfFile(file: File): Promise<{ fileName: string; fileSize: string; fileSizeBytes: number; filePath: string }> {
    const formData = new FormData();
    formData.append('pdf', file);
    const res = await fetch(`${API_BASE}/admin/upload-pdf`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Failed to upload PDF');
    }
    return await res.json();
  },

  async createResource(data: Partial<Resource>): Promise<Resource> {
    const res = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create resource' }));
      throw new Error(err.error || 'Failed to create resource');
    }
    return await res.json();
  },

  async updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
    const res = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update resource');
    return await res.json();
  },

  async togglePublishResource(id: string, isPublished: boolean): Promise<Resource> {
    const res = await fetch(`${API_BASE}/resources/${id}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ isPublished }),
    });
    if (!res.ok) throw new Error('Failed to update publication status');
    return await res.json();
  },

  async replacePdf(id: string, file: File): Promise<Resource> {
    const formData = new FormData();
    formData.append('pdf', file);
    const res = await fetch(`${API_BASE}/resources/${id}/replace-pdf`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'PDF replacement failed' }));
      throw new Error(err.error || 'Failed to replace PDF file');
    }
    return await res.json();
  },

  async deleteResource(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete resource');
  },

  getDownloadUrl(id: string): string {
    return `${API_BASE}/resources/${id}/download`;
  },

  getFileUrl(fileName: string): string {
    return `${API_BASE}/files/${fileName}`;
  },
};
