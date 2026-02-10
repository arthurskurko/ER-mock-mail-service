-- Check if column exists before adding it
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- So we ignore errors if column already exists
ALTER TABLE emails ADD COLUMN to_name TEXT;
