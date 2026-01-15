import { getDb } from '$lib/server/db';
import { MailRepo } from '$lib/server/mailRepo';

export async function load({ platform }) {
  const mails = await new MailRepo(getDb(platform)).listEmails(50);
  return { mails };
}