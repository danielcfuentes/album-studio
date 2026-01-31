-- Storage: policies for bucket "uploads" (album covers, logo, about photo).
-- Create the bucket in Dashboard first: Storage → New bucket → name "uploads", set Public.
-- Then run this migration to add policies.

-- Policies: public read, authenticated upload/update/delete
create policy "Public read uploads"
  on storage.objects for select
  using (bucket_id = 'uploads');

create policy "Authenticated upload"
  on storage.objects for insert
  with check (bucket_id = 'uploads' and auth.role() = 'authenticated');

create policy "Authenticated update uploads"
  on storage.objects for update
  using (bucket_id = 'uploads' and auth.role() = 'authenticated');

create policy "Authenticated delete uploads"
  on storage.objects for delete
  using (bucket_id = 'uploads' and auth.role() = 'authenticated');
