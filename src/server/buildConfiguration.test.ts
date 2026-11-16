import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Vercel and admin build configuration', () => {
  test('serverless TypeScript cannot require browser-only Vite global types', () => {
    const config = JSON.parse(read('tsconfig.json')) as {
      compilerOptions: { types?: string[] };
    };
    expect(config.compilerOptions.types || []).not.toContain('vite/client');
  });

  test('the pending-enquiry indicator supports an unavailable count', () => {
    const layout = read('src/components/admin/AdminLayout.tsx');
    expect(layout).toContain('pendingEnquiriesCount !== null && pendingEnquiriesCount > 0');
  });
});
