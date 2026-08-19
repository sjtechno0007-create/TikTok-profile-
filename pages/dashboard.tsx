import Link from "next/link";

export default function Dashboard() {
  // This is a stub — later connect Supabase auth and profile edit UI.
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Creator Dashboard (stub)</h1>
      <p className="text-gray-300 mb-4">Sign-in and profile editing will go here.</p>
      <Link href="/">
        <a className="text-sm text-pink-400">← Back to home</a>
      </Link>
    </main>
  );
}
