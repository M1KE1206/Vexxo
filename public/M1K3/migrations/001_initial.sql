-- ── Tables ────────────────────────────────────────────────────

CREATE TABLE user_settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  seeded_at  timestamptz NOT NULL
);

CREATE TABLE boodschappen_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cat        text NOT NULL,
  label      text NOT NULL,
  price      numeric(6,2),
  sort_order int DEFAULT 0
);

CREATE TABLE exercises (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type       text NOT NULL CHECK (type IN ('push','pull','legs')),
  name       text NOT NULL,
  sets_count int,
  reps_label text,
  sort_order int DEFAULT 0
);

CREATE TABLE checklist_state (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id    uuid REFERENCES boodschappen_items(id) ON DELETE CASCADE NOT NULL,
  week_year  int NOT NULL,
  UNIQUE (user_id, item_id, week_year)
);

CREATE TABLE fitness_day_state (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_year    int NOT NULL,
  day_id       text NOT NULL,
  session_done bool DEFAULT false,
  sets_data    jsonb DEFAULT '{}',
  UNIQUE (user_id, day_id, week_year)
);

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE user_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE boodschappen_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises            ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_state      ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_day_state    ENABLE ROW LEVEL SECURITY;

-- user_settings
CREATE POLICY "us_sel" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "us_ins" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "us_upd" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "us_del" ON user_settings FOR DELETE USING (auth.uid() = user_id);

-- boodschappen_items
CREATE POLICY "bi_sel" ON boodschappen_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bi_ins" ON boodschappen_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bi_upd" ON boodschappen_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bi_del" ON boodschappen_items FOR DELETE USING (auth.uid() = user_id);

-- exercises
CREATE POLICY "ex_sel" ON exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ex_ins" ON exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ex_upd" ON exercises FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ex_del" ON exercises FOR DELETE USING (auth.uid() = user_id);

-- checklist_state
CREATE POLICY "cs_sel" ON checklist_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cs_ins" ON checklist_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cs_del" ON checklist_state FOR DELETE USING (auth.uid() = user_id);

-- fitness_day_state
CREATE POLICY "fd_sel" ON fitness_day_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fd_ins" ON fitness_day_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fd_upd" ON fitness_day_state FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "fd_del" ON fitness_day_state FOR DELETE USING (auth.uid() = user_id);

-- ── Realtime — needed for DELETE event filtering ──────────────
ALTER TABLE checklist_state    REPLICA IDENTITY FULL;
ALTER TABLE fitness_day_state  REPLICA IDENTITY FULL;
