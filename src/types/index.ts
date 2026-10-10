export interface Branch {
  id: string;
  code: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  totalNotes: number;
}

export interface Semester {
  id: string;
  semNumber: number;
  title: string;
  tag: string;
  description: string;
  totalNotes: number;
  subjectsCount: number;
  scheme: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  branchId: string;
  semesterId: string;
  semNumber: number;
  groupTag: string;
  credits: number;
  gradeScheme: string;
  description: string;
  unitsCount: number;
  totalDocs: number;
  solvedPyqs: number;
  rating: number;
  ratingCount: number;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  unitNumber: number;
  subjectId: string;
  title: string;
  subtitle: string;
  summary: string;
  examWeightage: string;
  isHighYield: boolean;
  totalNotes: number;
}

export type ResourceType = 'Handwritten' | 'Guidebook' | 'Exam Prep' | 'Class Notes';

export interface Resource {
  id: string;
  title: string;
  description: string;
  branchId: string;
  semesterId: string;
  subjectId: string;
  chapterId: string;
  resourceType: ResourceType;
  verifiedBadge: string;
  author: string;
  pages: number;
  fileSize: string;
  fileSizeBytes: number;
  fileName: string;
  filePath: string;
  isPublished: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
}

export interface AdminStats {
  totalBranches: number;
  totalSemesters: number;
  totalSubjects: number;
  totalChapters: number;
  totalResources: number;
  publishedResources: number;
  unpublishedResources: number;
  totalDownloads: number;
}
