CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  subject TEXT,
  body_content TEXT,
  body_content_type TEXT,
  to_json TEXT NOT NULL,
  cc_json TEXT,
  bcc_json TEXT,
  save_to_sent INTEGER NOT NULL DEFAULT 1,
  client_message_id TEXT,
  raw_request_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at);
