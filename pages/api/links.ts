import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
// import { useSession } from "next-auth/react";
// import { redis } from "@/lib/redis";

const supabase = createClient(
  "https://texecfinpziblywwupcp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleGVjZmlucHppYmx5d3d1cGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTQzMjgsImV4cCI6MjA0OTU3MDMyOH0.ZksmTVh2NtXBVojhCUqn-ebXsGHAXaGfeK3elq9m8MM"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shortname, id, url } = req?.query;

  if (req.method === "PATCH" && id) {
    const { data, error } = await supabase
      .from("url_shortener")
      .update({ shortname: shortname, url: url })
      .eq("id", id)
      .select()
      .single();

    // console.log(shortname, id, data);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "GET" && shortname) {
    const { data, error } = await supabase
      .from("url_shortener")
      .select("id")
      .eq("shortname", shortname);

    // console.log(shortname, data);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "GET") {
    const { user } = req?.query;
    const { data, error } = await supabase
      .from("url_shortener")
      .select("id")
      .eq("email", user)
      .order("created_at", { ascending: false });

    // console.log(user, data);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
}
