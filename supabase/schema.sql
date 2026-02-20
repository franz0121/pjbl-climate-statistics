-- Supabase / Postgres schema for PJBL_new
-- Run this in Supabase SQL editor or psql

-- Enable UUID helper (pgcrypto provides gen_random_uuid)
create extension if not exists "pgcrypto";

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  role text not null check (role in ('admin','teacher','student')),
  hashed_password text,
  created_at timestamptz default now()
);

-- Classes
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid references users(id) on delete set null,
  created_at timestamptz default now()
);

-- Join table for class membership
create table if not exists class_students (
  class_id uuid references classes(id) on delete cascade,
  student_id uuid references users(id) on delete cascade,
  primary key (class_id, student_id)
);

-- Lessons metadata
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  meta jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_lessons_slug on lessons (slug);

-- Student progress per lesson / phase / activity
create table if not exists student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  phase integer not null,
  activity integer not null,
  status text not null check (status in ('not_started','in_progress','completed')),
  score numeric,
  updated_at timestamptz default now()
);

create index if not exists idx_progress_student on student_progress (student_id);

-- Responses / answers for analytics
create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id) on delete cascade,
  question_id text not null,
  choice text,
  is_correct boolean,
  created_at timestamptz default now()
);

create index if not exists idx_responses_student on responses (student_id);

-- Per-student per-lesson full state storage (JSON)
create table if not exists student_state (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id) on delete cascade,
  lesson_slug text not null,
  state jsonb,
  updated_at timestamptz default now(),
  unique (student_id, lesson_slug)
);
