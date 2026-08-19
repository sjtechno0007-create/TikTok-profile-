import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProfileEditor from "../components/ProfileEditor";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get current session user (if any)
    let mounted = true;
    (async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(session?.user ?? null);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Magic link sent — check your email to sign in.");
      }
    } catch (err: any) {
      setMessage(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>

      {!user && (
        <section className="bg-white/4 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sign in</h2>
          <p className="text-sm text-gray-300 mb-4">We use Supabase magic links — enter your email and check your inbox.</p>

          <form onSubmit={handleSendLink} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-3 py-2 rounded bg-white/6 outline-none"
              required
            />
            <button disabled={loading} className="bg-pink-500 px-4 py-2 rounded text-white">
              {loading ? "Sending…" : "Send magic link"}
            </button>
          </form>

          {message && <p className="mt-3 text-sm text-gray-200">{message}</p>}
        </section>
      )}

      {user && (
        <section className="mt-6 bg-white/4 p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Welcome, {user.email}</h2>
              <p className="text-sm text-gray-300">You are signed in. Edit your public profile below.</p>
            </div>
            <div>
              <button onClick={handleSignOut} className="text-sm text-pink-400">Sign out</button>
            </div>
          </div>

          <div className="mt-6">
            <ProfileEditor user={user} />
          </div>
        </section>
      )}
    </main>
  );
}
