CREATE TABLE companies (
  handle TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  num_employees INTEGER,
  description TEXT,
  logo_url TEXT
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT NOT NULL,
    equity FLOAT NOT NULL CHECK (equity <= 1 AND equity >=0),
    company_handle TEXT REFERENCES companies (handle) ON DELETE CASCADE ON UPDATE CASCADE,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    photo_url TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT false
)
