import { describe, it, expect } from 'vitest';
import { ensureBidsTable } from './routes/bids';

describe('Bids Engine', () => {
  it('runs ensureBidsTable migration without errors', async () => {
    const executedStatements: string[] = [];
    const mockDb: any = {
      prepare: (sql: string) => ({
        run: async () => {
          executedStatements.push(sql);
          return { meta: { changes: 1 } };
        }
      })
    };

    await expect(ensureBidsTable(mockDb)).resolves.not.toThrow();
    expect(executedStatements.length).toBeGreaterThan(0);
    expect(executedStatements[0]).toContain('CREATE TABLE IF NOT EXISTS bids');
  });
});
