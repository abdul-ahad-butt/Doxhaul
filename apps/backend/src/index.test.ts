import { expect, test } from 'vitest';
import app from './index';

test('Health endpoint returns ok', async () => {
  const req = new Request('http://localhost/api/health');
  const res = await app.fetch(req);
  expect(res.status).toBe(200);
  const data = await res.json() as { success: boolean, status?: string, data?: { status: string } };
  expect(data.success).toBe(true);
});
