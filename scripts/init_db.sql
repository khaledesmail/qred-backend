-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  company VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  image VARCHAR(255),
  activated BOOLEAN,
  spend_limit INTEGER
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  data VARCHAR(255),
  points VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  amount INTEGER
);

-- Seed data
INSERT INTO users (name, company) VALUES ('Khaled', 'Qred') ON CONFLICT DO NOTHING;
INSERT INTO cards (user_id, image, activated, spend_limit) VALUES (1, 'https://via.placeholder.com/150', false, 10000) ON CONFLICT DO NOTHING;
INSERT INTO transactions (user_id, data, points, amount) VALUES (1, 'Transaction data', 'Data points', 2000);
INSERT INTO transactions (user_id, data, points, amount) VALUES (1, 'Transaction data', 'Data points', 1800);
INSERT INTO transactions (user_id, data, points, amount) VALUES (1, 'Transaction data', 'Data points', 1600); 