-- Profiles table
create table profiles (
  wallet_address text primary key,
  username text,
  total_score bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Game Sessions table
create table game_sessions (
  id uuid default gen_random_uuid() primary key,
  wallet_address text references profiles(wallet_address) not null,
  score bigint not null,
  ended_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leaderboard view for weekly
create or replace view weekly_leaderboard as
select wallet_address, max(score) as top_score
from game_sessions
where ended_at >= date_trunc('week', now())
group by wallet_address
order by top_score desc
limit 50;

-- Leaderboard view for daily
create or replace view daily_leaderboard as
select wallet_address, max(score) as top_score
from game_sessions
where ended_at >= date_trunc('day', now())
group by wallet_address
order by top_score desc
limit 50;
