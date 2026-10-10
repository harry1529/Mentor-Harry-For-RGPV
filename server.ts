import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { ensureInitialPdfsExist } from './src/server/pdfGenerator';
import {
  hashPassword,
  generateToken,
  verifyToken,
  requireAdmin,
  AuthenticatedRequest,
} from './src/server/auth';

const PORT = 3000;
const UPLOAD_DIR = path.resolve(process.cwd(), 'data', 'uploads');

// Ensure upload directory and initial valid PDFs exist
ensureInitialPdfsExist(UPLOAD_DIR);

// Configure Multer for PDF storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Clean filename and ensure .pdf extension
    const cleanOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(cleanOriginal).toLowerCase() === '.pdf' ? '' : '.pdf';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${path.parse(cleanOriginal).name}-${uniqueSuffix}${ext || path.extname(cleanOriginal)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents (.pdf) are allowed for upload'));
    }
  },
});

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // -------------------------------------------------------------
  // AUTHENTICATION ROUTES
  // -------------------------------------------------------------
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const admin = db.getAdminByEmail(email);
    if (!admin) {
      res.status(401).json({ error: 'Invalid administrator email or password' });
      return;
    }

    const testHash = hashPassword(password, admin.salt);
    if (testHash !== admin.passwordHash) {
      res.status(401).json({ error: 'Invalid administrator email or password' });
      return;
    }

    const token = generateToken({ id: admin.id, email: admin.email, role: 'admin' });
    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    res.json({ user });
  });

  app.get('/api/admin/initial-info', (_req: Request, res: Response) => {
    res.json({
      defaultAdminEmail: 'admin@mentorharry.rgpv',
      defaultAdminPasswordHint: 'MentorHarry@2025',
      note: 'Initial admin account provisioned securely. Public admin registration is prohibited.',
    });
  });

  // -------------------------------------------------------------
  // STATS & METRICS
  // -------------------------------------------------------------
  app.get('/api/stats', (_req: Request, res: Response) => {
    const stats = db.getAdminStats();
    res.json(stats);
  });

  // -------------------------------------------------------------
  // BRANCHES
  // -------------------------------------------------------------
  app.get('/api/branches', (_req: Request, res: Response) => {
    res.json(db.getBranches());
  });

  app.post('/api/branches', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { code, name, shortName, description, icon, color } = req.body;
    if (!code || !name) {
      res.status(400).json({ error: 'Branch code and name are required' });
      return;
    }
    const branch = db.createBranch({
      code,
      name,
      shortName: shortName || code.toUpperCase(),
      description: description || '',
      icon: icon || 'school',
      color: color || '#004ac6',
    });
    res.status(201).json(branch);
  });

  app.put('/api/branches/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateBranch(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Branch not found' });
      return;
    }
    res.json(updated);
  });

  app.delete('/api/branches/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const ok = db.deleteBranch(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Branch not found' });
      return;
    }
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // SEMESTERS
  // -------------------------------------------------------------
  app.get('/api/semesters', (_req: Request, res: Response) => {
    res.json(db.getSemesters());
  });

  // -------------------------------------------------------------
  // SUBJECTS
  // -------------------------------------------------------------
  app.get('/api/subjects', (req: Request, res: Response) => {
    const branchId = req.query.branchId as string;
    const semesterId = req.query.semesterId as string;
    res.json(db.getSubjects(branchId, semesterId));
  });

  app.get('/api/subjects/:id', (req: Request, res: Response) => {
    const subject = db.getSubjectById(req.params.id);
    if (!subject) {
      res.status(404).json({ error: 'Subject not found' });
      return;
    }
    res.json(subject);
  });

  app.post('/api/subjects', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { code, name, branchId, semesterId, semNumber, groupTag, credits, gradeScheme, description, unitsCount } = req.body;
    if (!code || !name || !branchId || !semesterId) {
      res.status(400).json({ error: 'Subject code, name, branch, and semester are required' });
      return;
    }
    const subject = db.createSubject({
      code,
      name,
      branchId,
      semesterId,
      semNumber: semNumber || 1,
      groupTag: groupTag || 'Core Dept',
      credits: credits || 4,
      gradeScheme: gradeScheme || '70 Theory + 30 Sessional',
      description: description || '',
      unitsCount: unitsCount || 5,
    });
    res.status(201).json(subject);
  });

  app.put('/api/subjects/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateSubject(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Subject not found' });
      return;
    }
    res.json(updated);
  });

  app.delete('/api/subjects/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const ok = db.deleteSubject(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Subject not found' });
      return;
    }
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // CHAPTERS
  // -------------------------------------------------------------
  app.get('/api/chapters', (req: Request, res: Response) => {
    const subjectId = req.query.subjectId as string;
    res.json(db.getChapters(subjectId));
  });

  app.post('/api/chapters', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { unitNumber, subjectId, title, subtitle, summary, examWeightage, isHighYield } = req.body;
    if (!unitNumber || !subjectId || !title) {
      res.status(400).json({ error: 'Unit number, subject, and chapter title are required' });
      return;
    }
    const chapter = db.createChapter({
      unitNumber: Number(unitNumber),
      subjectId,
      title,
      subtitle: subtitle || title,
      summary: summary || '',
      examWeightage: examWeightage || '~18 Marks',
      isHighYield: Boolean(isHighYield),
    });
    res.status(201).json(chapter);
  });

  app.put('/api/chapters/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateChapter(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }
    res.json(updated);
  });

  app.delete('/api/chapters/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const ok = db.deleteChapter(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // RESOURCES (PDFs / NOTES)
  // -------------------------------------------------------------
  // Public list: only published notes unless admin token provided
  app.get('/api/resources', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const user = verifyToken(authHeader.split(' ')[1]);
      if (user && user.role === 'admin') isAdmin = true;
    }

    const { branchId, semesterId, subjectId, chapterId, resourceType, q } = req.query;

    const resources = db.getResources({
      branchId: branchId as string,
      semesterId: semesterId as string,
      subjectId: subjectId as string,
      chapterId: chapterId as string,
      resourceType: resourceType as string,
      query: q as string,
      publishedOnly: !isAdmin, // Non-admins only get published resources
    });

    res.json(resources);
  });

  app.get('/api/resources/:id', (req: Request, res: Response) => {
    const resItem = db.getResourceById(req.params.id);
    if (!resItem) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Check if unpublished and visitor is not admin
    if (!resItem.isPublished) {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
      const user = verifyToken(token);
      if (!user || user.role !== 'admin') {
        res.status(404).json({ error: 'Resource is currently unpublished' });
        return;
      }
    }

    res.json(resItem);
  });

  // Upload PDF file endpoint (Admin only)
  app.post(
    '/api/admin/upload-pdf',
    requireAdmin,
    upload.single('pdf'),
    (req: AuthenticatedRequest, res: Response) => {
      if (!req.file) {
        res.status(400).json({ error: 'No PDF file was uploaded' });
        return;
      }

      const sizeInMb = (req.file.size / (1024 * 1024)).toFixed(1);
      res.status(200).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSizeBytes: req.file.size,
        fileSize: `${sizeInMb} MB`,
        filePath: `data/uploads/${req.file.filename}`,
      });
    }
  );

  // Create Resource metadata & publish (Admin only)
  app.post('/api/resources', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const {
      title,
      description,
      branchId,
      semesterId,
      subjectId,
      chapterId,
      resourceType,
      verifiedBadge,
      author,
      pages,
      fileSize,
      fileSizeBytes,
      fileName,
      filePath,
      isPublished,
    } = req.body;

    if (!title || !subjectId || !chapterId || !fileName) {
      res.status(400).json({ error: 'Title, Subject, Chapter, and PDF File are required' });
      return;
    }

    // Verify relations exist
    const subj = db.getSubjectById(subjectId);
    if (!subj) {
      res.status(400).json({ error: 'Referenced subject does not exist' });
      return;
    }
    const chap = db.getChapterById(chapterId);
    if (!chap) {
      res.status(400).json({ error: 'Referenced chapter does not exist' });
      return;
    }

    const newResource = db.createResource({
      title,
      description: description || '',
      branchId: branchId || subj.branchId,
      semesterId: semesterId || subj.semesterId,
      subjectId,
      chapterId,
      resourceType: resourceType || 'Handwritten',
      verifiedBadge: verifiedBadge || 'Verified by Mentor Harry',
      author: author || 'Academic Contributor',
      pages: Number(pages) || 12,
      fileSize: fileSize || '3.5 MB',
      fileSizeBytes: fileSizeBytes || 3670016,
      fileName,
      filePath: filePath || `data/uploads/${fileName}`,
      isPublished: isPublished === undefined ? true : Boolean(isPublished),
    });

    res.status(201).json(newResource);
  });

  // Update Resource metadata (Admin only)
  app.put('/api/resources/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateResource(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json(updated);
  });

  // Toggle publish status (Admin only)
  app.patch('/api/resources/:id/publish', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { isPublished } = req.body;
    const updated = db.updateResource(req.params.id, { isPublished: Boolean(isPublished) });
    if (!updated) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json(updated);
  });

  // Replace PDF file safely (Admin only)
  app.post(
    '/api/resources/:id/replace-pdf',
    requireAdmin,
    upload.single('pdf'),
    (req: AuthenticatedRequest, res: Response) => {
      const resource = db.getResourceById(req.params.id);
      if (!resource) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(404).json({ error: 'Resource not found' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'New PDF file is required for replacement' });
        return;
      }

      const oldFilePath = path.resolve(process.cwd(), resource.filePath);
      const newFileName = req.file.filename;
      const newFilePath = `data/uploads/${newFileName}`;
      const sizeInMb = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;

      // Update database reference first to prevent dangling state
      const updated = db.updateResource(req.params.id, {
        fileName: newFileName,
        filePath: newFilePath,
        fileSize: sizeInMb,
        fileSizeBytes: req.file.size,
      });

      // Safely delete old file if it exists and is not equal to new file
      try {
        if (fs.existsSync(oldFilePath) && oldFilePath !== req.file.path) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.warn('Could not remove previous PDF file:', err);
      }

      res.json(updated);
    }
  );

  // Delete Resource (Admin only)
  app.delete('/api/resources/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const deleted = db.deleteResource(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Remove PDF file from storage safely
    try {
      const filePath = path.resolve(process.cwd(), deleted.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn('Could not delete physical file:', err);
    }

    res.json({ success: true, deletedId: deleted.id });
  });

  // Download PDF increment & stream
  app.get('/api/resources/:id/download', (req: Request, res: Response) => {
    const resource = db.getResourceById(req.params.id);
    if (!resource) {
      res.status(404).send('Resource not found');
      return;
    }

    if (!resource.isPublished) {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
      const user = verifyToken(token);
      if (!user || user.role !== 'admin') {
        res.status(403).send('Resource is unpublished');
        return;
      }
    }

    // Increment download counter
    db.incrementDownload(resource.id);

    const filePath = path.resolve(process.cwd(), resource.filePath);
    if (!fs.existsSync(filePath)) {
      res.status(404).send('PDF file not found on server');
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resource.fileName}"`);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });

  // Stream PDF file (for inline viewing or direct download)
  app.get('/api/files/:filename', (req: Request, res: Response) => {
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(UPLOAD_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    if (req.query.download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });

  // -------------------------------------------------------------
  // VITE & FRONTEND INTEGRATION
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mentor Harry for RGPV server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
