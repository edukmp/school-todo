-- Create the tasks table
create table public.todosTb_tasks (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  title text not null,
  date text null,
  time text null,
  note text null,
  category text null,
  completed boolean null default false,
  status text null,
  constraint todosTb_tasks_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.todosTb_tasks enable row level security;

-- Create a policy that allows anyone to read/write (for development)
-- WARNING: In production, you should restrict this to authenticated users
create policy "Enable all access for all users" on public.todosTb_tasks
  as permissive for all
  to public
  using (true)
  with check (true);
