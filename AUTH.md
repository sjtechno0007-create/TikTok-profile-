## Auth notes

This scaffold now includes a simple Supabase magic-link sign-in flow on /dashboard and a profile editor that writes to the `profiles` table.

How it works
- On /dashboard, enter your email and Supabase will send a magic link to sign in.
- After signing, the dashboard shows a profile editor that upserts into `profiles` using the `user_id` column.

Make sure to set the environment variables in .env.local before running:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

The Service Role key is not required for client-side auth but is needed for server-side operations (keep it secret).
