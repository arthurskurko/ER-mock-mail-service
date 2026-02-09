import type { D1Database } from '@cloudflare/workers-types';

export type EmailRow = {
  id: string;
  created_at: string;
  subject: string | null;
  body_content: string | null;
  body_content_type: string | null;
  to_name: string | null;
  to_json: string;
  cc_json: string | null;
  bcc_json: string | null;
  save_to_sent: number;
  client_message_id: string | null;
  raw_request_json: string;
};

export class MailRepo {
  constructor(private db: D1Database) {}

  async insertEmail(row: EmailRow) {
    await this.db.prepare(
      `INSERT INTO emails (
        id, created_at, subject, body_content, body_content_type,
        to_name,
        to_json, cc_json, bcc_json, save_to_sent, client_message_id, raw_request_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      row.id, row.created_at, row.subject, row.body_content, row.body_content_type,
      row.to_name,
      row.to_json, row.cc_json, row.bcc_json, row.save_to_sent, row.client_message_id, row.raw_request_json
    ).run();
  }

  async listEmails(limit = 50) {
    const res = await this.db.prepare(
      `SELECT id, created_at, subject, body_content, body_content_type, to_name, to_json
       FROM emails ORDER BY created_at DESC LIMIT ?`
    ).bind(limit).all<any>();
    return res.results ?? [];
  }

  async getEmail(id: string) {
    const row = await this.db.prepare(`SELECT * FROM emails WHERE id = ?`).bind(id).first<any>();
    return row ?? null;
  }
}
