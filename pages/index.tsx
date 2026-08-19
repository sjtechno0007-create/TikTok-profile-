import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">TikProfile — fast profile pages for TikTok creators</h1>
      <p className="text-gray-300 mb-6">
        Create a lightweight profile page with your TikToks, links, and contact. This starter includes Next.js + Tailwind + Supabase.
      </p>

      <div className="space-x-3">
        <Link href="/dashboard">
          <a className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded">Dashboard (stub)</a>
        </Link>
        <a className="inline-block text-sm text-gray-300" href="https://supabase.com" target="_blank" rel="noreferrer">Supabase</a>
      </div>

      <section className="mt-10 text-gray-300">
        <h2 className="text-2xl font-semibold mb-2">Quick start</h2>
        <ol className="list-decimal list-inside">
          <li>Set your Supabase project and env vars (see README).</li>
          <li>Run npm install && npm run dev.</li>
          <li>Open http://localhost:3000 and visit /someusername after you add data in Supabase.</li>
        </ol>
      </section>
    </main>
  );
}
