CREATE TABLE IF NOT EXISTS professors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  designation_short TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  joined INTEGER,
  initials TEXT,
  color TEXT,
  research TEXT[],
  subjects TEXT[],
  lab TEXT,
  profile_url TEXT
);

ALTER TABLE professors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON professors FOR SELECT USING (true);