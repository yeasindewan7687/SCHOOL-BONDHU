ALTER TABLE student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all" ON student_marks FOR SELECT USING (true);
CREATE POLICY "Enable write access for all anon" ON student_marks FOR ALL USING (true);

CREATE POLICY "Enable read access for all" ON processed_results FOR SELECT USING (true);
CREATE POLICY "Enable write access for all anon" ON processed_results FOR ALL USING (true);
