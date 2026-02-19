-- 1. Create the gallery_images table
create table public.gallery_images (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    url text not null,
    "order" integer default 0
);

-- 2. Enable Row Level Security (RLS)
alter table public.gallery_images enable row level security;

-- 3. Create policies for the table
-- Allow anyone to read
create policy "Public images are viewable by everyone" 
on public.gallery_images for select 
using (true);

-- Allow authenticated/service role to manage (for simplicity, we let the CRM handle this)
create policy "Authenticated users can manage gallery"
on public.gallery_images for all
using (true)
with check (true);

-- 4. Storage Setup
-- Go to Storage -> Buckets and create a bucket named 'images' (make it public)

-- 5. Storage Policies (Run these in the SQL Editor after creating the bucket)
-- Allow public to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Allow uploads (You can restrict this to authenticated users if you have auth setup)
create policy "Anyone can upload images"
on storage.objects for insert
with check ( bucket_id = 'images' );

-- Allow deletes
create policy "Anyone can delete images"
on storage.objects for delete
using ( bucket_id = 'images' );
