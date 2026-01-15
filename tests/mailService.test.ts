import { describe, it, expect } from 'vitest';
import { MailService } from '../src/lib/server/mailService';

class FakeRepo {
  rows: any[] = [];
  async insertEmail(row: any) { this.rows.push(row); }
}

describe('MailService', () => {
  it('returns 400 on invalid payload', async () => {
    const svc = new MailService(new FakeRepo() as any);
    const res = await svc.sendMail({ nope: true });
    expect(res.status).toBe(400);
  });

  it('stores email and returns 202 for valid payload', async () => {
    const repo = new FakeRepo();
    const svc = new MailService(repo as any);

    const res = await svc.sendMail({
      message: {
        subject: 'Hello',
        body: { contentType: 'Text', content: 'Hi' },
        toRecipients: [{ emailAddress: { address: 'a@b.com' } }]
      },
      saveToSentItems: true
    });

    expect(res.status).toBe(202);
    expect(repo.rows.length).toBe(1);
  });
});
