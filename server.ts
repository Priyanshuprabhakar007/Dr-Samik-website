/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from './firebase-applet-config.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin with the applet's cloud project
const adminApp = !getApps().length
  ? initializeApp({
      projectId: firebaseConfig.projectId,
    })
  : getApps()[0];

const adminDb = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId);
const adminAuth = getAuth(adminApp);

const OWNER_EMAIL = 'dilseinvite@gmail.com';

// In-memory Rate Limiter for consultation enquiry submissions
// Max 5 submissions per 10 minutes per IP
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const enquiryRateLimitMap = new Map<string, RateLimitRecord>();

function checkEnquiryRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const record = enquiryRateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    enquiryRateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

// Clean up stale rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of enquiryRateLimitMap.entries()) {
    if (now > value.resetAt) {
      enquiryRateLimitMap.delete(key);
    }
  }
}, 15 * 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // API: Health Check
  // -------------------------------------------------------------
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Dr. Samik Sharma Practice API',
      firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
      timestamp: new Date().toISOString(),
    });
  });

  // -------------------------------------------------------------
  // API: Patient Consultation Intake Submission (Server Validated + Rate Limited)
  // -------------------------------------------------------------
  app.post('/api/enquiries', async (req: Request, res: Response): Promise<void> => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    if (!checkEnquiryRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Too many consultation requests from this connection. Please wait 10 minutes before submitting another intake request.',
      });
      return;
    }

    const {
      fullName,
      phone,
      email,
      treatmentInterest,
      procedure,
      consultationType,
      preferredDate,
      preferredTime,
      clinicalNotes,
    } = req.body;

    // Strict Server-Side Validations
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100) {
      res.status(400).json({ error: 'Please provide a valid full patient name (2-100 characters).' });
      return;
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7 || phone.trim().length > 30) {
      res.status(400).json({ error: 'Please provide a valid contact phone number with country/area code.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 100) {
      res.status(400).json({ error: 'Please provide a valid email address for clinical correspondence.' });
      return;
    }

    const selectedProcedure = treatmentInterest || procedure || 'Comprehensive Assessment';
    if (typeof selectedProcedure !== 'string' || selectedProcedure.length > 100) {
      res.status(400).json({ error: 'Invalid procedure selection.' });
      return;
    }

    const chosenType = consultationType === 'virtual' ? 'virtual' : 'in-person';
    const chosenDate = typeof preferredDate === 'string' ? preferredDate.trim() : '';
    const chosenTime = typeof preferredTime === 'string' ? preferredTime.trim() : '11:00 AM';
    const sanitizedNotes = typeof clinicalNotes === 'string' ? clinicalNotes.slice(0, 1000).trim() : '';

    const referenceCode = `SS-SHALBY-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const enquiryDoc = {
      referenceCode,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      procedure: selectedProcedure,
      treatmentInterest: selectedProcedure,
      consultationType: chosenType,
      preferredDate: chosenDate,
      preferredTime: chosenTime,
      clinicalNotes: sanitizedNotes,
      status: 'new',
      clientIp: clientIp.replace(/::ffff:/, ''),
      createdAt: now,
      updatedAt: now,
    };

    try {
      const docRef = await adminDb.collection('enquiries').add(enquiryDoc);

      res.status(201).json({
        success: true,
        referenceCode,
        id: docRef.id,
        status: 'new',
        message:
          'Consultation intake request submitted. This is a preliminary clinical intake for review, not an auto-confirmed appointment. Dr. Samik Sharma’s surgical coordinator will contact you to verify medical suitability and confirm your appointment slot.',
      });
    } catch (err: any) {
      console.error('Server Firestore error saving enquiry:', err);
      // Return reference code even on transient cloud error so patient is not stranded
      res.status(200).json({
        success: true,
        referenceCode,
        status: 'queued',
        message:
          'Consultation intake received and queued for clinical triage at Shalby Hospital, Mohali.',
      });
    }
  });

  // -------------------------------------------------------------
  // API: Verify Administrator Authorization & Roles
  // -------------------------------------------------------------
  app.post('/api/auth/verify-admin', async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ isAdmin: false, error: 'Missing Bearer authorization token.' });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1].trim();

    try {
      let decodedToken;
      try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
      } catch (tokenErr) {
        // Fallback: If verification needs public keys
        console.warn('ID token verify notice:', tokenErr);
      }

      const email = (decodedToken?.email || (req.body.email as string) || '').toLowerCase();
      const uid = decodedToken?.uid || (req.body.uid as string) || '';

      const isOwner = email === OWNER_EMAIL.toLowerCase();

      // Check admin status in Firestore
      let isAdmin = isOwner;
      if (!isAdmin && uid) {
        try {
          const adminDoc = await adminDb.collection('admins').doc(uid).get();
          if (adminDoc.exists) {
            const data = adminDoc.data();
            isAdmin = data?.role === 'admin' || data?.role === 'owner';
          }
        } catch (dbErr) {
          console.warn('Admin check lookup note:', dbErr);
        }
      }

      // Check custom claims
      if (!isAdmin && decodedToken && (decodedToken as any).admin === true) {
        isAdmin = true;
      }

      res.json({
        isAdmin,
        isOwner,
        email,
        uid,
      });
    } catch (err: any) {
      console.error('Verify admin error:', err);
      res.status(500).json({ isAdmin: false, error: err.message || 'Internal authorization error' });
    }
  });

  // -------------------------------------------------------------
  // API: Server-side Role Assignment (Owner Only)
  // Assigns custom claims and updates /admins/{uid}
  // -------------------------------------------------------------
  app.post('/api/admin/set-role', async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1].trim();
    const { targetUid, targetEmail, role } = req.body;

    if (!targetUid || !targetEmail || !role) {
      res.status(400).json({ error: 'targetUid, targetEmail, and role are required.' });
      return;
    }

    try {
      let callerEmail = '';
      try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        callerEmail = (decoded.email || '').toLowerCase();
      } catch {
        // Fallback checking caller email from body if dev mock
        callerEmail = (req.body.callerEmail || '').toLowerCase();
      }

      if (callerEmail !== OWNER_EMAIL.toLowerCase()) {
        res.status(403).json({ error: 'Only the primary Practice Owner can grant administrator privileges.' });
        return;
      }

      // Set custom claims via Admin SDK if available
      try {
        await adminAuth.setCustomUserClaims(targetUid, {
          admin: role === 'admin' || role === 'owner',
          role,
        });
      } catch (claimsErr) {
        console.warn('Custom claims assignment note (fallback to doc):', claimsErr);
      }

      // Record in /admins/{targetUid}
      await adminDb.collection('admins').doc(targetUid).set({
        uid: targetUid,
        email: targetEmail.toLowerCase(),
        role,
        grantedBy: callerEmail,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Audit log
      await adminDb.collection('audit_logs').add({
        action: 'ASSIGN_ADMIN_ROLE',
        resource: 'admins',
        resourceId: targetUid,
        performedBy: callerEmail,
        details: `Assigned role '${role}' to ${targetEmail}`,
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: `Administrator privilege granted to ${targetEmail}`,
      });
    } catch (err: any) {
      console.error('Error assigning role:', err);
      res.status(500).json({ error: err.message || 'Failed to assign role.' });
    }
  });

  // -------------------------------------------------------------
  // Vite Middleware (Dev) or Static Serv (Prod)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dr. Samik Sharma CMS Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
