CREATE TABLE IF NOT EXISTS school_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  time TEXT,
  location TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE school_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to school_events"
  ON school_events FOR SELECT
  USING (true);

-- Allow authenticated users (admin) to manage events
CREATE POLICY "Allow authenticated full access to school_events"
  ON school_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
