import { v4 as uuidv4 } from 'uuid';
import { SendMailSchema } from './schema';
import { MailRepo } from './mailRepo';

export type SendMailOk = { status: 202; id: string; createdAt: string; location: string };
export type SendMailErr = { status: 400 | 500; error: string; issues?: unknown };

export class MailService {
  constructor(private repo: MailRepo) {}

  async sendMail(input: unknown): Promise<SendMailOk | SendMailErr> {
    const parsed = SendMailSchema.safeParse(input);
    if (!parsed.success) {
      return { status: 400, error: 'Invalid request body', issues: parsed.error.issues };
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const msg = parsed.data.message;

    const to = msg.toRecipients.map((r) => r.emailAddress);
    const cc = msg.ccRecipients?.map((r) => r.emailAddress) ?? null;
    const bcc = msg.bccRecipients?.map((r) => r.emailAddress) ?? null;

    await this.repo.insertEmail({
      id,
      created_at: createdAt,
      subject: msg.subject ?? '',
      body_content: msg.body?.content ?? null,
      body_content_type: msg.body?.contentType ?? null,
      to_json: JSON.stringify(to),
      cc_json: cc ? JSON.stringify(cc) : null,
      bcc_json: bcc ? JSON.stringify(bcc) : null,
      save_to_sent: parsed.data.saveToSentItems ? 1 : 0,
      client_message_id: msg.clientMessageId ?? null,
      raw_request_json: JSON.stringify(parsed.data)
    });

    const location = `/mails/${id}`;
    return { status: 202, id, createdAt, location };
  }
}
