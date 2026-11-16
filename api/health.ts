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
    cloudFirestore,
  ] = await Promise.all([
    import('firebase-admin/app'),
    import('firebase-admin/firestore'),
    import('firebase-admin/auth'),
    // Firebase Admin loads this from a separate runtime package.
    // Importing it explicitly ensures Vercel includes it in the function bundle.
    import('@google-cloud/firestore'),
  ]);
  if (!('Firestore' in cloudFirestore) && !('default' in cloudFirestore)) {
    throw new Error('Cloud Firestore runtime SDK could not be loaded.');
  }
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




/**
 * Classify expected infrastructure errors without exposing underlying messages,
 * service-account data, Firestore document contents, or token material.
 */
function connectionReason(error: unknown): string {
  if (error instanceof SyntaxError) return 'firebase-service-account-json-invalid';
  const info: { code?: unknown; message?: unknown } =
    error && typeof error === 'object' ? error as { code?: unknown; message?: unknown } : {};
  const rawCode = info.code;
  const code = typeof rawCode === 'number' ? rawCode : String(rawCode ?? '').toLowerCase();
  const message = typeof info.message === 'string' ? info.message.toLowerCase() : '';

  if (message.includes('credentials do not match this website project')) {
    return 'firebase-service-account-project-mismatch';
  }
  if (/invalid pem|invalid private key|private key|failed to parse.*key|error:1e08010c/i.test(message)) {
    return 'firebase-service-account-key-invalid';
  }
  if (code === 5 || code === '5' || code === 'not_found' ||
      /database.*not found|database.*does not exist|5 not_found/.test(message)) {
    return 'firestore-database-not-found';
  }
  if (code === 7 || code === '7' || code === 'permission_denied' ||
      /permission.denied|missing or insufficient permissions|7 permission_denied/.test(message)) {
    return 'firestore-permission-denied';
  }
  if (code === 16 || code === '16' || code === 'unauthenticated' ||
      /invalid_grant|invalid jwt|unauthenticated/.test(message)) {
    return 'firebase-service-account-authentication-failed';
  }
  if (code === 14 || code === '14' || code === 'unavailable') {
    return 'firestore-network-unavailable';
  }
  return 'firebase-connection-failed';
}

/**
 * Public readiness probe: no patient data, credentials, database IDs, or
 * stack traces are returned. Its status codes identify which setup stage
 * requires attention without pretending that appointment saves work.
 */
export default {
  async fetch(request: Request) {
    const headers = { 'Cache-Control': 'no-store' };
    if (request.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
    }
    const service = 'Dr. Samik Sharma website API';
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      return Response.json({ service, status: 'configuration-required', reason: 'firebase-credentials-missing' }, { status: 503, headers });
    }
    if (!process.env.ENQUIRY_RATE_LIMIT_SECRET ||
        process.env.ENQUIRY_RATE_LIMIT_SECRET.length < 32) {
      return Response.json({ service, status: 'configuration-required', reason: 'rate-limit-secret-missing' }, { status: 503, headers });
    }
    let stage: 'firebase-initialization' | 'firestore-read' = 'firebase-initialization';
    try {
      const { db } = await getClinicAdmin();
      stage = 'firestore-read';
      await db.collection('settings').doc('current').get();
      return Response.json({ service, status: 'ready' }, { headers });
    } catch (error) {
      const reason = connectionReason(error);
      // Do not expose raw error messages: credentials and tokens may be sensitive.
      console.error('Clinic API health check failed:', { reason, stage });
      return Response.json({ service, status: 'configuration-required', reason, stage }, {
        status: 503, headers,
      });
    }
  },
};
