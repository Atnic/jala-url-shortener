import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://texecfinpziblywwupcp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleGVjZmlucHppYmx5d3d1cGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTQzMjgsImV4cCI6MjA0OTU3MDMyOH0.ZksmTVh2NtXBVojhCUqn-ebXsGHAXaGfeK3elq9m8MM"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { linkId } = req.query;

  // const link = await fetch(
  //   `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links/${linkId}`,
  //   {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  const { data, error } = await supabase
    .from("url_shortener")
    .delete()
    .eq("id", linkId)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}
