import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { MailRepo } from '$lib/server/mailRepo';
import { MailService } from '$lib/server/mailService';

export async function POST({ request, platform }) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const service = new MailService(new MailRepo(getDb(platform)));
    const res = await service.sendMail(payload);

    if (res.status === 202) {
      return new Response(null, { status: 202, headers: { Location: res.location } });
    }

    return json({ error: res.error, issues: (res as any).issues }, { status: res.status });
  } catch (e: any) {
    return json({ error: 'Server error', message: e?.message ?? String(e) }, { status: 500 });
  }
}