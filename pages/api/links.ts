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
  // const { filterByFormula } = req.query;
  // console.log(filterByFormula);
  // console.log(linkId);
  // let links = (await redis.get("links")) || [];

  // const link = await fetch(
  //   `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links?filterByFormula=${filterByFormula}&view=link-view&fields%5B%5D=shortname`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

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

  // const response = await link.json();

  // console.log(response);
  // const response = await events.json();
  // res.status(200).json(response);
}
