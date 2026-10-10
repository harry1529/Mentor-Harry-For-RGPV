import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'mentor-harry-rgpv-super-secure-key-2025';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  passwordHash: string;
  salt: string;
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function createSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateToken(payload: { id: string; email: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;

    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Administrator privileges required' });
    return;
  }

  req.user = payload;
  next();
}
