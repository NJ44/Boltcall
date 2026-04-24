-- Tracks anonymous visitors who spent 2+ minutes on the pricing page without converting.
-- Used to trigger warm cold outreach sequences via n8n.
create table if not exists pricing_visitors (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  fingerprint  text not null,
  ip           text,
  org          text,          -- from ipinfo.io e.g. "AS12345 Acme Plumbing LLC"
  city         text,
  country      text,
  session_duration integer,  -- seconds spent on pricing page
  referrer     text
);

create index if not exists pricing_visitors_fingerprint_created
  on pricing_visitors (fingerprint, created_at);

-- Service role only — no public access
alter table pricing_visitors enable row level security;
