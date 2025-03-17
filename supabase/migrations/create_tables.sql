-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  release_date DATE,
  cover_image_url TEXT,
  release_year INTEGER,
  is_taylors_version BOOLEAN DEFAULT FALSE,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
  track_number INTEGER,
  duration INTEGER, -- Duration in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorite_songs junction table
CREATE TABLE IF NOT EXISTS user_favorite_songs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- Create user_favorite_albums junction table
CREATE TABLE IF NOT EXISTS user_favorite_albums (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, album_id)
);

-- Create a user selections view to track the 3 album, 3 songs per album limitation
CREATE OR REPLACE VIEW user_selections_summary AS
SELECT 
  user_id,
  COUNT(DISTINCT ufa.album_id) as album_count,
  ufa.album_id,
  COUNT(DISTINCT ufs.song_id) as song_count
FROM 
  user_favorite_albums ufa
LEFT JOIN 
  user_favorite_songs ufs ON ufa.user_id = ufs.user_id AND ufs.song_id IN (SELECT id FROM songs WHERE album_id = ufa.album_id)
GROUP BY 
  user_id, ufa.album_id;

-- Create Row-Level Security (RLS) policies
-- Albums are public to all users
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Albums are viewable by everyone" ON albums
  FOR SELECT USING (true);

-- Songs are public to all users
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Songs are viewable by everyone" ON songs
  FOR SELECT USING (true);

-- User favorite songs can only be viewed/modified by the respective user
ALTER TABLE user_favorite_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own favorite songs" ON user_favorite_songs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorite songs" ON user_favorite_songs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorite songs" ON user_favorite_songs
  FOR DELETE USING (auth.uid() = user_id);

-- User favorite albums can only be viewed/modified by the respective user
ALTER TABLE user_favorite_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own favorite albums" ON user_favorite_albums
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorite albums" ON user_favorite_albums
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorite albums" ON user_favorite_albums
  FOR DELETE USING (auth.uid() = user_id);
