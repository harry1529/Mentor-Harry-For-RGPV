import fs from 'fs';
import path from 'path';
import { Branch, Semester, Subject, Chapter, Resource } from '../types';
import { AdminUser, createSalt, hashPassword } from './auth';

export interface DatabaseSchema {
  branches: Branch[];
  semesters: Semester[];
  subjects: Subject[];
  chapters: Chapter[];
  resources: Resource[];
  adminUsers: AdminUser[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function getInitialData(): DatabaseSchema {
  const branches: Branch[] = [
    {
      id: 'branch-cse',
      code: 'cse',
      name: 'Computer Science & Engineering',
      shortName: 'CSE',
      description: 'Algorithms, Data Structures, Machine Learning, Operating Systems, Computer Networks.',
      icon: 'terminal',
      color: '#004ac6',
      totalNotes: 320,
    },
    {
      id: 'branch-it',
      code: 'it',
      name: 'Information Technology',
      shortName: 'IT',
      description: 'Web Architecture, Cloud Computing, Database Systems, Cyber Security, Software Eng.',
      icon: 'lan',
      color: '#4b41e1',
      totalNotes: 285,
    },
    {
      id: 'branch-ece',
      code: 'ece',
      name: 'Electronics & Communication',
      shortName: 'ECE',
      description: 'Digital Electronics, Signal Processing, Microcontrollers, VLSI, Wireless Communication.',
      icon: 'memory',
      color: '#005b7c',
      totalNotes: 240,
    },
    {
      id: 'branch-me',
      code: 'me',
      name: 'Mechanical Engineering',
      shortName: 'ME',
      description: 'Thermodynamics, Fluid Mechanics, Kinematics of Machines, Manufacturing Processes.',
      icon: 'precision_manufacturing',
      color: '#c2410c',
      totalNotes: 215,
    },
    {
      id: 'branch-ce',
      code: 'ce',
      name: 'Civil Engineering',
      shortName: 'CE',
      description: 'Structural Analysis, Geotechnical, Surveying, Concrete Technology, Fluid Mechanics.',
      icon: 'apartment',
      color: '#047857',
      totalNotes: 195,
    },
  ];

  const semesters: Semester[] = [
    {
      id: 'sem-1',
      semNumber: 1,
      title: 'First Year Basic Sciences',
      tag: 'SEM 01',
      description: 'Calculus, Basic Electrical, Eng Physics, Eng Graphics & Manufacturing Basics.',
      totalNotes: 142,
      subjectsCount: 5,
      scheme: 'Grading System (CBGS / AICTE)',
    },
    {
      id: 'sem-2',
      semNumber: 2,
      title: 'Basic Engineering Group',
      tag: 'SEM 02',
      description: 'Eng Chemistry, Basic Computer Eng, Basic Mech Eng, Mathematics II.',
      totalNotes: 158,
      subjectsCount: 5,
      scheme: 'Grading System (CBGS / AICTE)',
    },
    {
      id: 'sem-3',
      semNumber: 3,
      title: 'Core Dept Foundations',
      tag: 'SEM 03',
      description: 'Data Structures, Digital Electronics, Thermodynamics, Discrete Mathematics.',
      totalNotes: 175,
      subjectsCount: 6,
      scheme: 'Grading System (CBGS / AICTE)',
    },
    {
      id: 'sem-4',
      semNumber: 4,
      title: 'Intermediate Principles',
      tag: 'SEM 04',
      description: 'Operating Systems, Analysis of Algorithms, Fluid Dynamics, Signals & Systems.',
      totalNotes: 164,
      subjectsCount: 6,
      scheme: 'Grading System (CBGS / AICTE)',
    },
    {
      id: 'sem-5',
      semNumber: 5,
      title: 'Advanced Core Engineering',
      tag: 'SEM 05',
      description: 'Database Management (DBMS), Theory of Computation, Heat Transfer, Structural Analysis.',
      totalNotes: 149,
      subjectsCount: 5,
      scheme: 'Grading System (CBGS / AICTE)',
    },
    {
      id: 'sem-6',
      semNumber: 6,
      title: 'Specialized Applications',
      tag: 'SEM 06',
      description: 'Computer Networks, Compiler Design, Machine Design, Geotechnical Engineering.',
      totalNotes: 138,
      subjectsCount: 5,
      scheme: 'Grading System (CBGS / AICTE)',
    },
    {
      id: 'sem-7',
      semNumber: 7,
      title: 'Advanced Electives & Major',
      tag: 'SEM 07',
      description: 'Cloud Computing, Artificial Intelligence, Automobile Systems, Project Prep.',
      totalNotes: 112,
      subjectsCount: 4,
      scheme: 'Grading System (CBGS / AICTE)',
    },
    {
      id: 'sem-8',
      semNumber: 8,
      title: 'Final Electives & Viva',
      tag: 'SEM 08',
      description: 'Cyber Security, IoT, Major Project Reports & Previous Year Viva Question banks.',
      totalNotes: 96,
      subjectsCount: 4,
      scheme: 'Grading System (CBGS / AICTE)',
    },
  ];

  const subjects: Subject[] = [
    {
      id: 'subj-bt102',
      code: 'BT-102',
      name: 'Engineering Mathematics I',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      semNumber: 1,
      groupTag: 'Common First Year',
      credits: 4,
      gradeScheme: '70 Theory + 30 Sessional',
      description: 'Foundational engineering mathematics focusing on differential calculus, Maclaurin’s & Taylor’s series, partial differentiation, curvature, tracing of curves, and definite integrals as per RGPV revised 2024–25 syllabus scheme.',
      unitsCount: 5,
      totalDocs: 18,
      solvedPyqs: 6,
      rating: 4.9,
      ratingCount: 2420,
      updatedAt: '2 days ago',
    },
    {
      id: 'subj-bt205',
      code: 'BT-205',
      name: 'Basic Computer Engineering',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      semNumber: 1,
      groupTag: 'CSE / IT',
      credits: 3,
      gradeScheme: '70 Theory + 30 Sessional',
      description: 'Computer anatomy, operating systems basics, OOP concepts in C++, and internet protocols.',
      unitsCount: 5,
      totalDocs: 14,
      solvedPyqs: 5,
      rating: 4.8,
      ratingCount: 1890,
      updatedAt: '4 days ago',
    },
    {
      id: 'subj-bt104',
      code: 'BT-104',
      name: 'Basic Electrical & Electronics (BEEE)',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      semNumber: 1,
      groupTag: 'Common First Year',
      credits: 4,
      gradeScheme: '70 Theory + 30 Sessional',
      description: 'DC Network analysis, single-phase AC circuits, transformers, and diode characteristics.',
      unitsCount: 5,
      totalDocs: 19,
      solvedPyqs: 7,
      rating: 4.7,
      ratingCount: 2100,
      updatedAt: '1 week ago',
    },
    {
      id: 'subj-bt201',
      code: 'BT-201',
      name: 'Engineering Physics',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      semNumber: 1,
      groupTag: 'Common First Year',
      credits: 4,
      gradeScheme: '70 Theory + 30 Sessional',
      description: 'Wave optics, quantum mechanics fundamentals, fiber optics, laser principles, and superconductors.',
      unitsCount: 5,
      totalDocs: 15,
      solvedPyqs: 4,
      rating: 4.6,
      ratingCount: 1650,
      updatedAt: '5 days ago',
    },
    {
      id: 'subj-bt101',
      code: 'BT-101',
      name: 'Engineering Chemistry',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      semNumber: 1,
      groupTag: 'Common First Year',
      credits: 4,
      gradeScheme: '70 Theory + 30 Sessional',
      description: 'Water treatment and softening, lubricants, polymers, fuels, and combustion stoichiometry.',
      unitsCount: 5,
      totalDocs: 16,
      solvedPyqs: 5,
      rating: 4.7,
      ratingCount: 1420,
      updatedAt: '3 days ago',
    },
    {
      id: 'subj-cs301',
      code: 'CS-301',
      name: 'Data Structures',
      branchId: 'branch-cse',
      semesterId: 'sem-3',
      semNumber: 3,
      groupTag: 'CSE Core',
      credits: 4,
      gradeScheme: '70 Theory + 30 Sessional',
      description: 'Arrays, Stacks, Queues, Linked Lists, Binary Trees, AVL Trees, Graphs, Sorting and Hashing algorithms.',
      unitsCount: 5,
      totalDocs: 22,
      solvedPyqs: 8,
      rating: 4.9,
      ratingCount: 3100,
      updatedAt: '1 day ago',
    },
  ];

  const chapters: Chapter[] = [
    {
      id: 'chap-bt102-u1',
      unitNumber: 1,
      subjectId: 'subj-bt102',
      title: 'Unit 1: Calculus Part 1 — Differential Calculus & Expansions',
      subtitle: 'Differential Calculus & Expansions',
      summary: 'Core concepts include Rolle’s Theorem, Cauchy’s & Lagrange’s Mean Value Theorems, Maclaurin’s & Taylor’s expansion for single variables, and evaluation of indeterminate forms using L’Hôpital’s Rule.',
      examWeightage: '~22 Marks',
      isHighYield: true,
      totalNotes: 6,
    },
    {
      id: 'chap-bt102-u2',
      unitNumber: 2,
      subjectId: 'subj-bt102',
      title: 'Unit 2: Calculus Part 2 — Curvature, Radius of Curvature & Curve Tracing',
      subtitle: 'Curvature & Curve Tracing',
      summary: 'Curvature in Cartesian and Polar Coordinates, Radius of curvature, Center of curvature, Asymptotes in Cartesian coordinates, and Tracing of Cartesian and polar curves.',
      examWeightage: '~18 Marks',
      isHighYield: false,
      totalNotes: 4,
    },
    {
      id: 'chap-bt102-u3',
      unitNumber: 3,
      subjectId: 'subj-bt102',
      title: 'Unit 3: Partial Differentiation, Euler’s Theorem & Jacobians',
      subtitle: 'Partial Diff & Euler',
      summary: 'Focus on Partial derivatives of first and higher orders, Homogeneous functions and Euler\'s theorem, Total differentiation, Taylor\'s theorem for two variables, and Maxima/Minima.',
      examWeightage: '~14 Marks',
      isHighYield: false,
      totalNotes: 3,
    },
    {
      id: 'chap-bt102-u4',
      unitNumber: 4,
      subjectId: 'subj-bt102',
      title: 'Unit 4: Definite Integrals, Beta & Gamma Functions, Volume of Revolution',
      subtitle: 'Beta-Gamma & Integrals',
      summary: 'Definite integrals as limits of sum, Beta and Gamma functions with properties and relations, Rectification of curves, Areas, and Volumes of solids of revolution.',
      examWeightage: '~16 Marks',
      isHighYield: false,
      totalNotes: 3,
    },
    {
      id: 'chap-bt102-u5',
      unitNumber: 5,
      subjectId: 'subj-bt102',
      title: 'Unit 5: Matrices, System of Linear Equations, Cayley-Hamilton Theorem',
      subtitle: 'Matrices & Eigenvalues',
      summary: 'Rank of matrix, Echelon form, System of linear equations, Eigenvalues and Eigenvectors, Cayley-Hamilton Theorem and its application in finding inverse and matrix powers.',
      examWeightage: '~20 Marks',
      isHighYield: true,
      totalNotes: 4,
    },
    {
      id: 'chap-bt104-u2',
      unitNumber: 2,
      subjectId: 'subj-bt104',
      title: 'Unit 2: AC Circuits & Resonance',
      subtitle: 'Phasor diagrams & RLC Circuits',
      summary: 'Phasor representation of AC quantities, series and parallel resonance, bandwidth, quality factor, and power factor correction.',
      examWeightage: '~18 Marks',
      isHighYield: true,
      totalNotes: 2,
    },
  ];

  const resources: Resource[] = [
    {
      id: 'res-calc1-handwritten',
      title: 'Calculus Part 1 — Comprehensive Handwritten Notes',
      description: 'Complete lecture notes covering Rolle\'s theorem, Cauchy\'s mean value theorem, Taylor series expansions with 25+ solved RGPV numericals and step-by-step proofs.',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      subjectId: 'subj-bt102',
      chapterId: 'chap-bt102-u1',
      resourceType: 'Handwritten',
      verifiedBadge: 'Topper Verified',
      author: 'Harry Sir (Dept Topper batch \'23)',
      pages: 48,
      fileSize: '4.8 MB',
      fileSizeBytes: 5033164,
      fileName: 'Calculus_Part1_Comprehensive_Handwritten.pdf',
      filePath: 'data/uploads/Calculus_Part1_Comprehensive_Handwritten.pdf',
      isPublished: true,
      downloadCount: 3840,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'res-calc1-shivani',
      title: 'Calculus Part 1 — Shivani Publication Guidebook Notes',
      description: 'Chapter-wise question bank summary, 7-year past exam question trends, marking blueprint, and concise formulas cheat sheet directly indexed for semester grading.',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      subjectId: 'subj-bt102',
      chapterId: 'chap-bt102-u1',
      resourceType: 'Guidebook',
      verifiedBadge: 'Publisher Scanned',
      author: 'Shivani Series (Official Reprint)',
      pages: 32,
      fileSize: '8.2 MB',
      fileSizeBytes: 8598323,
      fileName: 'Calculus_Part1_Shivani_Guidebook.pdf',
      filePath: 'data/uploads/Calculus_Part1_Shivani_Guidebook.pdf',
      isPublished: true,
      downloadCount: 4210,
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'res-calc1-pyq',
      title: 'Calculus Part 1 — High-Yield Important Questions & PYQs (2018–2024)',
      description: 'Curated list of 15 frequently asked 7-mark and 14-mark university exam questions with step-by-step model answer blueprints and marking criteria pointers.',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      subjectId: 'subj-bt102',
      chapterId: 'chap-bt102-u1',
      resourceType: 'Exam Prep',
      verifiedBadge: 'High Frequency ★',
      author: 'Verified RGPV Papers',
      pages: 18,
      fileSize: '2.1 MB',
      fileSizeBytes: 2202009,
      fileName: 'Calculus_Part1_HighYield_PYQs.pdf',
      filePath: 'data/uploads/Calculus_Part1_HighYield_PYQs.pdf',
      isPublished: true,
      downloadCount: 5120,
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'res-calc1-capsule',
      title: 'Formula Sheet & Theorem Proofs — Quick Revision Capsule',
      description: 'High-density 4-page cheat sheet for quick exam hall revision of indeterminate limits expansions, standard theorems statements, and derivation summaries.',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      subjectId: 'subj-bt102',
      chapterId: 'chap-bt102-u1',
      resourceType: 'Class Notes',
      verifiedBadge: 'Must Revise',
      author: 'Academic Core Team',
      pages: 4,
      fileSize: '1.2 MB',
      fileSizeBytes: 1258291,
      fileName: 'Calculus_Part1_FormulaSheet_Capsule.pdf',
      filePath: 'data/uploads/Calculus_Part1_FormulaSheet_Capsule.pdf',
      isPublished: true,
      downloadCount: 2950,
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'res-calc2-bundle',
      title: 'Calculus Part 2 — Curvature & Curve Tracing Study Pack',
      description: 'Curvature in Cartesian & Polar Coordinates, Radius of curvature, Center of curvature, and Asymptotes with 18+ solved examples.',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      subjectId: 'subj-bt102',
      chapterId: 'chap-bt102-u2',
      resourceType: 'Handwritten',
      verifiedBadge: 'Topper Verified',
      author: 'Prof. V. Sharma',
      pages: 38,
      fileSize: '11.4 MB',
      fileSizeBytes: 11953766,
      fileName: 'Calculus_Part2_Curvature_Bundle.pdf',
      filePath: 'data/uploads/Calculus_Part2_Curvature_Bundle.pdf',
      isPublished: true,
      downloadCount: 1680,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'res-ac-circuits',
      title: 'AC Circuits & Resonance — Class Notes',
      description: 'Basic Electrical (BT-104) • Phasor diagrams, series & parallel RLC circuits, power factor correction, and resonance curves.',
      branchId: 'branch-cse',
      semesterId: 'sem-1',
      subjectId: 'subj-bt104',
      chapterId: 'chap-bt104-u2',
      resourceType: 'Class Notes',
      verifiedBadge: 'UIT RGPV Class Notes',
      author: 'UIT RGPV Class Notes',
      pages: 28,
      fileSize: '5.4 MB',
      fileSizeBytes: 5662310,
      fileName: 'AC_Circuits_Resonance_Class_Notes.pdf',
      filePath: 'data/uploads/AC_Circuits_Resonance_Class_Notes.pdf',
      isPublished: true,
      downloadCount: 2110,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  // Default administrator account:
  // Email: admin@mentorharry.rgpv
  // Password: MentorHarry@2025
  const salt = createSalt();
  const passwordHash = hashPassword('MentorHarry@2025', salt);
  const adminUsers: AdminUser[] = [
    {
      id: 'admin-primary',
      email: 'admin@mentorharry.rgpv',
      name: 'Mentor Harry Administrator',
      role: 'admin',
      salt,
      passwordHash,
    },
  ];

  return {
    branches,
    semesters,
    subjects,
    chapters,
    resources,
    adminUsers,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, reinitializing default data:', err);
      }
    }

    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    const data = dataToSave || this.data;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Branches
  getBranches(): Branch[] {
    return this.data.branches;
  }

  getBranchById(id: string): Branch | undefined {
    return this.data.branches.find((b) => b.id === id || b.code === id);
  }

  createBranch(branch: Omit<Branch, 'id' | 'totalNotes'>): Branch {
    const newBranch: Branch = {
      ...branch,
      id: `branch-${Date.now()}`,
      totalNotes: 0,
    };
    this.data.branches.push(newBranch);
    this.saveData();
    return newBranch;
  }

  updateBranch(id: string, updates: Partial<Branch>): Branch | null {
    const idx = this.data.branches.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.data.branches[idx] = { ...this.data.branches[idx], ...updates };
    this.saveData();
    return this.data.branches[idx];
  }

  deleteBranch(id: string): boolean {
    const idx = this.data.branches.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.data.branches.splice(idx, 1);
    this.saveData();
    return true;
  }

  // Semesters
  getSemesters(): Semester[] {
    return this.data.semesters;
  }

  getSemesterById(id: string): Semester | undefined {
    return this.data.semesters.find((s) => s.id === id || s.semNumber === Number(id));
  }

  // Subjects
  getSubjects(branchId?: string, semesterId?: string): Subject[] {
    return this.data.subjects.filter((s) => {
      if (branchId && s.branchId !== branchId) return false;
      if (semesterId && s.semesterId !== semesterId && String(s.semNumber) !== semesterId) return false;
      return true;
    });
  }

  getSubjectById(id: string): Subject | undefined {
    return this.data.subjects.find((s) => s.id === id || s.code.toLowerCase() === id.toLowerCase());
  }

  createSubject(
    subject: Omit<Subject, 'id' | 'totalDocs' | 'solvedPyqs' | 'rating' | 'ratingCount' | 'updatedAt'> & {
      solvedPyqs?: number;
    }
  ): Subject {
    const newSubject: Subject = {
      ...subject,
      id: `subj-${Date.now()}`,
      totalDocs: 0,
      solvedPyqs: subject.solvedPyqs ?? 0,
      rating: 5.0,
      ratingCount: 1,
      updatedAt: 'Just now',
    };
    this.data.subjects.push(newSubject);
    this.saveData();
    return newSubject;
  }

  updateSubject(id: string, updates: Partial<Subject>): Subject | null {
    const idx = this.data.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.subjects[idx] = { ...this.data.subjects[idx], ...updates, updatedAt: 'Updated just now' };
    this.saveData();
    return this.data.subjects[idx];
  }

  deleteSubject(id: string): boolean {
    const idx = this.data.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.data.subjects.splice(idx, 1);
    this.saveData();
    return true;
  }

  // Chapters
  getChapters(subjectId?: string): Chapter[] {
    return this.data.chapters.filter((c) => {
      if (subjectId && c.subjectId !== subjectId) return false;
      return true;
    });
  }

  getChapterById(id: string): Chapter | undefined {
    return this.data.chapters.find((c) => c.id === id);
  }

  createChapter(chapter: Omit<Chapter, 'id' | 'totalNotes'>): Chapter {
    const newChap: Chapter = {
      ...chapter,
      id: `chap-${Date.now()}`,
      totalNotes: 0,
    };
    this.data.chapters.push(newChap);
    this.saveData();
    return newChap;
  }

  updateChapter(id: string, updates: Partial<Chapter>): Chapter | null {
    const idx = this.data.chapters.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.chapters[idx] = { ...this.data.chapters[idx], ...updates };
    this.saveData();
    return this.data.chapters[idx];
  }

  deleteChapter(id: string): boolean {
    const idx = this.data.chapters.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.chapters.splice(idx, 1);
    this.saveData();
    return true;
  }

  // Resources
  getResources(options?: {
    branchId?: string;
    semesterId?: string;
    subjectId?: string;
    chapterId?: string;
    resourceType?: string;
    query?: string;
    publishedOnly?: boolean;
  }): Resource[] {
    let list = this.data.resources;

    if (options?.publishedOnly) {
      list = list.filter((r) => r.isPublished);
    }
    if (options?.branchId && options.branchId !== 'all') {
      list = list.filter((r) => r.branchId === options.branchId);
    }
    if (options?.semesterId && options.semesterId !== 'all') {
      list = list.filter((r) => r.semesterId === options.semesterId);
    }
    if (options?.subjectId && options.subjectId !== 'all') {
      list = list.filter((r) => r.subjectId === options.subjectId);
    }
    if (options?.chapterId && options.chapterId !== 'all') {
      list = list.filter((r) => r.chapterId === options.chapterId);
    }
    if (options?.resourceType && options.resourceType !== 'all') {
      list = list.filter((r) => r.resourceType.toLowerCase() === options.resourceType!.toLowerCase());
    }
    if (options?.query) {
      const q = options.query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q)
      );
    }

    return list;
  }

  getResourceById(id: string): Resource | undefined {
    return this.data.resources.find((r) => r.id === id);
  }

  createResource(resource: Omit<Resource, 'id' | 'downloadCount' | 'createdAt' | 'updatedAt'>): Resource {
    const newRes: Resource = {
      ...resource,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.resources.push(newRes);

    // Update subject and chapter counts
    const chap = this.data.chapters.find((c) => c.id === newRes.chapterId);
    if (chap) chap.totalNotes = (chap.totalNotes || 0) + 1;

    const subj = this.data.subjects.find((s) => s.id === newRes.subjectId);
    if (subj) subj.totalDocs = (subj.totalDocs || 0) + 1;

    this.saveData();
    return newRes;
  }

  updateResource(id: string, updates: Partial<Resource>): Resource | null {
    const idx = this.data.resources.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.resources[idx] = {
      ...this.data.resources[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.resources[idx];
  }

  incrementDownload(id: string): number {
    const res = this.data.resources.find((r) => r.id === id);
    if (res) {
      res.downloadCount = (res.downloadCount || 0) + 1;
      this.saveData();
      return res.downloadCount;
    }
    return 0;
  }

  deleteResource(id: string): Resource | null {
    const idx = this.data.resources.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const deleted = this.data.resources.splice(idx, 1)[0];

    // Decrement counts
    const chap = this.data.chapters.find((c) => c.id === deleted.chapterId);
    if (chap && chap.totalNotes > 0) chap.totalNotes--;

    const subj = this.data.subjects.find((s) => s.id === deleted.subjectId);
    if (subj && subj.totalDocs > 0) subj.totalDocs--;

    this.saveData();
    return deleted;
  }

  // Admin authentication
  getAdminByEmail(email: string): AdminUser | undefined {
    return this.data.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getAdminStats() {
    const totalBranches = this.data.branches.length;
    const totalSemesters = this.data.semesters.length;
    const totalSubjects = this.data.subjects.length;
    const totalChapters = this.data.chapters.length;
    const totalResources = this.data.resources.length;
    const publishedResources = this.data.resources.filter((r) => r.isPublished).length;
    const unpublishedResources = totalResources - publishedResources;
    const totalDownloads = this.data.resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0);

    return {
      totalBranches,
      totalSemesters,
      totalSubjects,
      totalChapters,
      totalResources,
      publishedResources,
      unpublishedResources,
      totalDownloads,
    };
  }
}

export const db = new Database();
