-- Seed data for Taylor Swift albums and songs
-- This will insert sample data into your Supabase database

-- Insert albums with the new color and is_taylors_version fields
INSERT INTO albums (title, release_date, cover_image_url, release_year, is_taylors_version, color) VALUES
('Fearless (Taylor''s Version)', '2021-04-09', 'https://upload.wikimedia.org/wikipedia/en/5/5b/Fearless_%28Taylor%27s_Version%29_%282021_album_cover%29_by_Taylor_Swift.png', 2021, TRUE, '#F4E5B2'),
('Red (Taylor''s Version)', '2021-11-12', 'https://upload.wikimedia.org/wikipedia/en/4/47/Taylor_Swift_-_Red_%28Taylor%27s_Version%29.png', 2021, TRUE, '#8B0000'),
('1989 (Taylor''s Version)', '2023-10-27', 'https://upload.wikimedia.org/wikipedia/en/1/1f/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png', 2023, TRUE, '#ADD8E6'),
('The Tortured Poets Department', '2024-04-19', 'https://upload.wikimedia.org/wikipedia/en/0/07/Taylor_Swift_-_The_Tortured_Poets_Department.png', 2024, FALSE, '#000000'),
('Midnights', '2022-10-21', 'https://upload.wikimedia.org/wikipedia/en/9/9f/Midnights_-_Taylor_Swift.png', 2022, FALSE, '#0047AB'),
('Lover', '2019-08-23', 'https://upload.wikimedia.org/wikipedia/en/5/5f/Taylor_Swift_-_Lover.png', 2019, FALSE, '#FFB6C1'),
('folklore', '2020-07-24', 'https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png', 2020, FALSE, '#808080'),
('evermore', '2020-12-11', 'https://upload.wikimedia.org/wikipedia/en/0/0a/Taylor_Swift_-_Evermore.png', 2020, FALSE, '#654321'),
('Speak Now (Taylor''s Version)', '2023-07-07', 'https://upload.wikimedia.org/wikipedia/en/e/e6/Taylor_Swift_-_Speak_Now_%28Taylor%27s_Version%29.png', 2023, TRUE, '#800080');

-- Sample songs from Fearless (Taylor's Version)
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('Fearless (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Fearless (Taylor''s Version)'), 1, 241),
('Fifteen (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Fearless (Taylor''s Version)'), 2, 294),
('Love Story (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Fearless (Taylor''s Version)'), 3, 235),
('You Belong With Me (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Fearless (Taylor''s Version)'), 5, 231),
('Mr. Perfectly Fine (From The Vault)', (SELECT id FROM albums WHERE title = 'Fearless (Taylor''s Version)'), 22, 277);

-- Sample songs from Red (Taylor's Version)
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('State Of Grace (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Red (Taylor''s Version)'), 1, 295),
('Red (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Red (Taylor''s Version)'), 2, 223),
('All Too Well (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Red (Taylor''s Version)'), 5, 329),
('We Are Never Ever Getting Back Together (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Red (Taylor''s Version)'), 6, 193),
('All Too Well (10 Minute Version) (Taylor''s Version) (From The Vault)', (SELECT id FROM albums WHERE title = 'Red (Taylor''s Version)'), 30, 613);

-- Sample songs from 1989 (Taylor's Version)
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('Welcome To New York (Taylor''s Version)', (SELECT id FROM albums WHERE title = '1989 (Taylor''s Version)'), 1, 212),
('Blank Space (Taylor''s Version)', (SELECT id FROM albums WHERE title = '1989 (Taylor''s Version)'), 2, 231),
('Style (Taylor''s Version)', (SELECT id FROM albums WHERE title = '1989 (Taylor''s Version)'), 3, 231),
('Shake It Off (Taylor''s Version)', (SELECT id FROM albums WHERE title = '1989 (Taylor''s Version)'), 6, 219),
('Is It Over Now? (Taylor''s Version) (From The Vault)', (SELECT id FROM albums WHERE title = '1989 (Taylor''s Version)'), 21, 215);

-- Sample songs from The Tortured Poets Department
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('Fortnight (feat. Post Malone)', (SELECT id FROM albums WHERE title = 'The Tortured Poets Department'), 1, 223),
('The Tortured Poets Department', (SELECT id FROM albums WHERE title = 'The Tortured Poets Department'), 2, 205),
('Down Bad', (SELECT id FROM albums WHERE title = 'The Tortured Poets Department'), 3, 196),
('So Long, London', (SELECT id FROM albums WHERE title = 'The Tortured Poets Department'), 4, 271),
('I Can Do It With a Broken Heart', (SELECT id FROM albums WHERE title = 'The Tortured Poets Department'), 16, 194);

-- Sample songs from Midnights
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('Lavender Haze', (SELECT id FROM albums WHERE title = 'Midnights'), 1, 202),
('Anti-Hero', (SELECT id FROM albums WHERE title = 'Midnights'), 3, 200),
('You''re On Your Own, Kid', (SELECT id FROM albums WHERE title = 'Midnights'), 5, 194),
('Bejeweled', (SELECT id FROM albums WHERE title = 'Midnights'), 9, 194),
('Karma', (SELECT id FROM albums WHERE title = 'Midnights'), 11, 205);

-- Sample songs from Lover
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('Cruel Summer', (SELECT id FROM albums WHERE title = 'Lover'), 2, 178),
('Lover', (SELECT id FROM albums WHERE title = 'Lover'), 3, 221),
('The Man', (SELECT id FROM albums WHERE title = 'Lover'), 4, 190),
('You Need To Calm Down', (SELECT id FROM albums WHERE title = 'Lover'), 14, 171),
('ME! (feat. Brendon Urie of Panic! At The Disco)', (SELECT id FROM albums WHERE title = 'Lover'), 16, 193);

-- Sample songs from folklore
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('the 1', (SELECT id FROM albums WHERE title = 'folklore'), 1, 210),
('cardigan', (SELECT id FROM albums WHERE title = 'folklore'), 2, 239),
('exile (feat. Bon Iver)', (SELECT id FROM albums WHERE title = 'folklore'), 4, 285),
('betty', (SELECT id FROM albums WHERE title = 'folklore'), 14, 294),
('the lakes', (SELECT id FROM albums WHERE title = 'folklore'), 17, 211);

-- Sample songs from evermore
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('willow', (SELECT id FROM albums WHERE title = 'evermore'), 1, 214),
('champagne problems', (SELECT id FROM albums WHERE title = 'evermore'), 2, 244),
('gold rush', (SELECT id FROM albums WHERE title = 'evermore'), 3, 185),
('no body, no crime (feat. HAIM)', (SELECT id FROM albums WHERE title = 'evermore'), 6, 215),
('evermore (feat. Bon Iver)', (SELECT id FROM albums WHERE title = 'evermore'), 15, 304);

-- Sample songs from Speak Now (Taylor's Version)
INSERT INTO songs (title, album_id, track_number, duration) VALUES
('Mine (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Speak Now (Taylor''s Version)'), 1, 231),
('Sparks Fly (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Speak Now (Taylor''s Version)'), 2, 260),
('Back To December (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Speak Now (Taylor''s Version)'), 3, 293),
('Enchanted (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Speak Now (Taylor''s Version)'), 9, 352),
('Long Live (Taylor''s Version)', (SELECT id FROM albums WHERE title = 'Speak Now (Taylor''s Version)'), 14, 317);
