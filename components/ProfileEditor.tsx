import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Props = {
  user: any;
};

export default function ProfileEditor({ user }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    username: "",
    display_name: "",
    bio: "",
    profile_image_url: "",
    featured_video_url: ""
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!mounted) return;
      if (error) {
        console.error(error);
      }
      if (data) setProfile(data);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        user_id: user.id,
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        profile_image_url: profile.profile_image_url,
        featured_video_url: profile.featured_video_url,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from("profiles").upsert(payload, { returning: "representation" });
      if (error) {
        setMessage(error.message);
      } else {
        setProfile(data[0]);
        setMessage("Profile saved.");
      }
    } catch (err: any) {
      setMessage(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading profile…</div>;

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300">Username (public)</label>
        <input
          value={profile.username || ""}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          required
          className="w-full px-3 py-2 rounded bg-white/6"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Display name</label>
        <input
          value={profile.display_name || ""}
          onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
          className="w-full px-3 py-2 rounded bg-white/6"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Bio</label>
        <textarea
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="w-full px-3 py-2 rounded bg-white/6"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Profile image URL</label>
        <input
          value={profile.profile_image_url || ""}
          onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
          className="w-full px-3 py-2 rounded bg-white/6"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Featured TikTok URL</label>
        <input
          value={profile.featured_video_url || ""}
          onChange={(e) => setProfile({ ...profile, featured_video_url: e.target.value })}
          className="w-full px-3 py-2 rounded bg-white/6"
        />
      </div>

      <div className="flex items-center gap-3">
        <button disabled={saving} className="bg-pink-500 px-4 py-2 rounded text-white">
          {saving ? "Saving…" : "Save profile"}
        </button>
        {message && <p className="text-sm text-gray-200">{message}</p>}
      </div>
    </form>
  );
}
