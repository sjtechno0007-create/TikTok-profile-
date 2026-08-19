import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ThreeDTiltCard from "../components/ThreeDTiltCard";

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  featured_video_url: string | null;
};

export default function ProfilePage({ params }: any) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const username = (typeof window === "undefined") ? "" : (location.pathname.replace("/", "") || params?.username);

  useEffect(() => {
    async function load() {
      try {
        // Fetch profile by username
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", params?.username || username)
          .maybeSingle();

        if (error) {
          console.error(error);
        }
        if (data) {
          setProfile(data as Profile);
          // Ping serverless API to track page view (optional)
          await fetch("/api/view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile_id: data.id })
          });
        }
      } finally {
        setLoading(false);
      }
    }

    if (params?.username) load();
  }, [params, username]);

  if (loading) return <div className="p-8">Loading…</div>;
  if (!profile) return <div className="p-8">Profile not found</div>;

  return (
    <main className="max-w-xl mx-auto p-6">
      <ThreeDTiltCard>
        <div className="flex items-center gap-4">
          {profile.profile_image_url ? (
            <img src={profile.profile_image_url} className="w-20 h-20 rounded-full object-cover" alt="avatar" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-lg">@</div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{profile.display_name || profile.username}</h1>
            <p className="text-sm text-gray-300">@{profile.username}</p>
          </div>
        </div>

        <p className="mt-4 text-gray-200">{profile.bio}</p>

        {profile.featured_video_url && (
          <div className="mt-6">
            <blockquote
              className="tiktok-embed"
              cite={profile.featured_video_url}
              style={{ maxWidth: 605, minWidth: 325 }}
            >
              <section>Loading TikTok…</section>
            </blockquote>
            <script async src="https://www.tiktok.com/embed.js"></script>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <a className="block bg-pink-500 text-white font-semibold py-3 px-4 rounded text-center" href="#">
            Visit my latest TikTok
          </a>
        </div>
      </ThreeDTiltCard>
    </main>
  );
}

// Next.js pages router fallback to provide params typing; export getServerSideProps only to provide params in dev environment
export async function getServerSideProps({ params }: any) {
  return { props: { params } };
}
