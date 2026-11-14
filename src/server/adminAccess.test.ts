import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

describe('clinic admin access regression guards', () => {
  test('staff authorization requires an actual Firebase UID record', () => {
    const authContext = source('src/context/AuthContext.tsx');
    const verifyApi = source('api/auth/verify-admin.ts');
    expect(authContext).toContain("doc(db, 'admins', currentUser.uid)");
    expect(authContext).not.toContain('decoded.admin === true');
    expect(verifyApi).toContain("db.collection('admins').doc(decoded.uid)");
    expect(verifyApi).not.toContain('decoded.admin === true');
  });

  test('role changes use the verified owner and account email, not a generated UID', () => {
    const settings = source('src/pages/admin/SettingsPage.tsx');
    const api = source('api/admin/set-role.ts');
    expect(settings).toContain("fetch('/api/admin/set-role'");
    expect(settings).not.toContain('uidKey');
    expect(api).toContain('auth.verifyIdToken(token, true)');
    expect(api).toContain('auth.getUserByEmail(email)');
    expect(api).toContain("action !== 'grant' && action !== 'revoke'");
    expect(api).toContain('auth.revokeRefreshTokens(targetUid)');
  });

  test('staff access cannot persist solely through cached admin claims', () => {
    const rules = source('firestore.rules');
    expect(rules).toContain('exists(/databases/$(database)/documents/admins/$(request.auth.uid))');
    expect(rules).not.toContain('request.auth.token.admin == true');
  });

  test('unavailable admin metrics are never displayed as empty clinics', () => {
    const panel = source('src/pages/admin/AdminDashboardPage.tsx');
    expect(panel).toContain('const metricsUnavailable = loading || Boolean(loadError)');
    expect(panel).toContain('Enquiry records are unavailable');
    const service = source('src/lib/firestoreService.ts');
    const getAdmins = service.slice(service.indexOf('export async function getAdminUsers'), service.indexOf('export async function addAdminUser'));
    expect(getAdmins).toContain('throw err');
    expect(getAdmins).not.toContain('return []');
  });
});
