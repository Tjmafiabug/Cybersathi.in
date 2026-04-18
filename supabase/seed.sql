-- Seed data for CyberSathi.in — run after `pnpm db:push` and `policies.sql`.
-- Idempotent: safe to re-run.

insert into public.categories (slug, name, description, icon, sort_order) values
  ('phishing',         'Phishing',          'Email, SMS, and voice-based deception attacks.',       'fish',          10),
  ('ransomware',       'Ransomware',        'Encryption-based extortion and recovery.',             'lock',          20),
  ('upi-fraud',        'UPI Fraud',         'Scams targeting UPI and Indian payments rails.',       'credit-card',   30),
  ('identity-theft',   'Identity Theft',    'Aadhaar, PAN, and KYC data misuse.',                   'user-x',        40),
  ('data-breaches',    'Data Breaches',     'Corporate and government data-exposure incidents.',    'database',      50),
  ('dark-web',         'Dark Web',          'Underground markets, leaks, and investigations.',      'eye-off',       60),
  ('social-engineering','Social Engineering','Human-focused manipulation and pretexting.',          'users',         70),
  ('malware',          'Malware',           'Trojans, spyware, stalkerware, and RATs.',             'bug',           80),
  ('cryptocurrency',   'Crypto Scams',      'Rug pulls, fake exchanges, giveaway scams.',           'coins',         90),
  ('investment-fraud', 'Investment Fraud',  'Ponzi, pump-and-dump, Telegram-tip scams.',            'trending-down', 100),
  ('children-safety',  'Children Safety',   'Grooming, exploitation, and CSAM reporting.',          'shield',        110),
  ('cyber-law',        'Cyber Law (India)', 'IT Act, BNS, and enforcement in India.',               'scale',         120)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order;

insert into public.news_sources (name, type, url, active) values
  ('The Hacker News RSS',     'rss', 'https://feeds.feedburner.com/TheHackersNews',        true),
  ('Bleeping Computer RSS',   'rss', 'https://www.bleepingcomputer.com/feed/',             true),
  ('Krebs on Security RSS',   'rss', 'https://krebsonsecurity.com/feed/',                  true),
  ('CERT-In Advisories RSS',  'rss', 'https://www.cert-in.org.in/rss/latest-advisories.xml', true),
  ('Google News: India Cyber','rss', 'https://news.google.com/rss/search?q=india+cyber+crime&hl=en-IN&gl=IN&ceid=IN:en', true)
on conflict do nothing;

insert into public.topic_queue (keyword, priority, active) values
  ('UPI fraud India',              100, true),
  ('phishing attack prevention',    90, true),
  ('Aadhaar data breach',           90, true),
  ('ransomware India',              85, true),
  ('crypto scam India',             80, true),
  ('online banking fraud',          80, true),
  ('social engineering techniques', 70, true),
  ('deepfake scam',                 70, true),
  ('WhatsApp scam India',           75, true),
  ('cyber crime reporting India',   95, true)
on conflict (keyword) do nothing;
