# TikProfile — Next.js + Tailwind + Supabase starter (ZIP)

This is a small starter scaffold for a TikTok creator profile site:
- Next.js (pages router)
- Tailwind CSS
- Supabase (Postgres) for profiles, links, page views
- CSS 3D tilt hero component for a 3D look (lightweight)

Quick setup

1. Install
   - Node 18+ recommended
   - npm install

2. Create a Supabase project
   - Create a project at https://app.supabase.com
   - In the SQL editor, run `supabase/migrations/001_init.sql` to create tables.
   - Get your project URL and anon key (Project Settings → API).
   - Also get a Service Role key (for server-side inserts). Keep it secret.

3. Create a .env.local file in project root:
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

4. Run locally
   npm run dev
   Open http://localhost:3000

5. Add test data
   - Use Supabase dashboard → Table Editor → insert a profile into `profiles` table with username `alice` (or another).
   - Visit http://localhost:3000/alice

How to create a ZIP (macOS / Linux)
- From the project root:
  npm install
  zip -r tiktok-profile-site.zip . -x node_modules/*

Notes & next steps
- This scaffold uses client-side fetching for the profile to keep the starter simple.
- For production, convert profile page to SSG/ISR (getStaticProps) or implement server-side auth.
- You can upgrade 3D to react-three-fiber later if you want interactive models; this scaffold uses CSS 3D tilt for performance.
- I can also scaffold a GitHub repo and push these files if you prefer.

If you want, I can now:
- produce a downloadable ZIP and provide it here, or
- push these files to a GitHub repo/branch if you give owner/repo and permission, or
- add auth (Supabase magic link) and a profile editor UI next.
