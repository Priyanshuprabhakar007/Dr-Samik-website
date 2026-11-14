/**
 * Self-contained Firebase Admin bootstrap: Vercel's TypeScript function build
 * must not load sibling project source files through unresolved ESM imports.
 * Project/database identifiers are public Firebase configuration, not secrets.
 */
// Lazy SDK imports let the API return a safe diagnostic response if Firebase fails to load.

const FIREBASE_PROJECT_ID = "gen-lang-client-0746984388";
const FIRESTORE_DATABASE_ID = "ai-studio-drsamiksharmapla-23e071f8-1aa1-4fe5-9fd3-47be90b3af23";

async function getClinicAdmin() {
  const [
    { cert, getApp, getApps, initializeApp },
    { getFirestore },
    { getAuth },
  ] = await Promise.all([
    import('firebase-admin/app'),
    import('firebase-admin/firestore'),
    import('firebase-admin/auth'),
  ]);
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Firebase Admin credentials are not configured.');
  const credentials = JSON.parse(raw) as {
    project_id?: string;
    client_email?: string;
    private_key?: string;
  };
  if (
    credentials.project_id !== FIREBASE_PROJECT_ID ||
    !credentials.client_email ||
    !credentials.private_key
  ) {
    throw new Error('Firebase Admin credentials do not match this website project.');
  }
  const appName = 'dr-samik-vercel-api';
  const app = getApps().some(app => app.name === appName)
    ? getApp(appName)
    : initializeApp({
        credential: cert({
          projectId: credentials.project_id,
          clientEmail: credentials.client_email,
          privateKey: credentials.private_key.replace(/\\n/g, '\n'),
        }),
        projectId: FIREBASE_PROJECT_ID,
      }, appName);

  return {
    db: getFirestore(app, FIRESTORE_DATABASE_ID),
    auth: getAuth(app),
  };
}


const OWNER_EMAIL = 'dilseinvite@gmail.com';
function getBearerToken(request: Request): string | null {
  return request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1] || null;
}



export default {
  async fetch(request: Request) {
    const headers = { 'Cache-Control': 'no-store' };
    const respond = (data: object, status = 200) => Response.json(data, { status, headers });

    if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405);
    const token = getBearerToken(request);
    if (!token) return respond({ error: 'Sign in with the practice owner account.' }, 401);

    try {
      const { db, auth } = await getClinicAdmin();
      const caller = await auth.verifyIdToken(token, true);
      const callerEmail = (caller.email || '').trim().toLowerCase();
      if (caller.email_verified !== true || callerEmail !== OWNER_EMAIL) {
        return respond({ error: 'Only the verified practice owner can manage administrator access.' }, 403);
      }

      let payload: unknown;
      try { payload = await request.json(); }
      catch { return respond({ error: 'Invalid form data.' }, 400); }
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return respond({ error: 'Invalid form data.' }, 400);
      }
      const { action, targetEmail } = payload as Record<string, unknown>;
      const email = typeof targetEmail === 'string' ? targetEmail.trim().toLowerCase() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
        return respond({ error: 'Enter a valid administrator email address.' }, 400);
      }
      if (action !== 'grant' && action !== 'revoke') {
        return respond({ error: 'Invalid administrator access action.' }, 400);
      }
      if (email === OWNER_EMAIL) return respond({ error: 'The practice owner cannot be edited here.' }, 400);

      let target;
      try {
        // Firebase Auth UIDs are authoritative. Do not generate IDs from email strings.
        target = await auth.getUserByEmail(email);
      } catch (error) {
        if ((error as { code?: string })?.code === 'auth/user-not-found') {
          return respond({ error: 'This Google account has not signed in to the website yet. Ask the user to sign in once, then retry.' }, 404);
        }
        throw error;
      }
      if (!target.emailVerified) {
        return respond({ error: 'This account must verify its email before receiving admin access.' }, 400);
      }
      const targetUid = target.uid;
      const adminDoc = db.collection('admins').doc(targetUid);
      if (action === 'grant') {
        // The actual UID record is the source of truth for staff access.
        await adminDoc.set({
          uid: targetUid,
          email,
          displayName: target.displayName || 'Clinical Administrator',
          role: 'admin',
          updatedAt: new Date().toISOString(),
          grantedBy: callerEmail,
        }, { merge: true });
        try {
          await auth.setCustomUserClaims(targetUid, { ...target.customClaims, admin: true, role: 'admin' });
        } catch (claimError) {
          // Don't leave an approved UID record after the corresponding claim update fails.
          await adminDoc.delete();
          throw claimError;
        }
      } else {
        // Revoke the authoritative document before touching potentially cached claims.
        await adminDoc.delete();
        const claims = { ...(target.customClaims || {}) };
        delete claims.admin;
        delete claims.role;
        await auth.setCustomUserClaims(targetUid, claims);
        await auth.revokeRefreshTokens(targetUid);
      }
      await db.collection('audit_logs').add({
        action: action === 'grant' ? 'ASSIGN_ADMIN_ROLE' : 'REVOKE_ADMIN_ROLE',
        resource: 'admins',
        resourceId: targetUid,
        performedBy: callerEmail,
        details: action === 'grant' ? 'Administrator authorized' : 'Administrator access revoked',
        timestamp: new Date().toISOString(),
      });
      return respond({
        success: true,
        action,
        uid: targetUid,
        message: action === 'grant' ? 'Administrator access granted.' : 'Administrator access revoked.',
      });
    } catch (error) {
      console.error('Admin access API failed:', error instanceof Error ? error.name : 'Unknown error');
      return respond({ error: 'Unable to update administrator access. Check Vercel runtime logs and Firebase configuration.' }, 503);
    }
  },
};
