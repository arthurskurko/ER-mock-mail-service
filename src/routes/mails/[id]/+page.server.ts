import { error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { MailRepo } from '$lib/server/mailRepo';

export async function load({ params, platform }) {
  const mail = await new MailRepo(getDb(platform)).getEmail(params.id);
  if (!mail) throw error(404, 'Not found');
  return { mail };
}