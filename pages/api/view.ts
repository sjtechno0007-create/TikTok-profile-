import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { profile_id } = req.body || {};
  if (!profile_id) return res.status(400).json({ error: "profile_id required" });

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    await supabaseAdmin.from("page_views").insert({
      profile_id,
      referrer: req.headers.referer || null,
      user_agent: req.headers["user-agent"] || null,
      created_at: new Date().toISOString()
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to record view" });
  }
}
