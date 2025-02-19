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
  const { url, owner, email } = req.body;

  // console.log(req.body, req.method);

  if (!url || url.length <= 0) {
    res.status(400).json({ status: "Error: url is not set" });
    return;
  }

  const shortUrl = ShortenUrl(5);

  // let result = await redis.set(`short/${shortUrl}`, url);
  // const airtableBody = {
  //   records: [
  //     {
  //       fields: {
  //         shortname: shortUrl,
  //         url: url,
  //         owner: [owner],
  //         visit_count: 0,
  //       },
  //     },
  //   ],
  // };

  if (req.method === "POST") {
    // const { user } = req?.query;
    const { data, error } = await supabase.from("url_shortener").insert({
      shortname: shortUrl,
      url: url,
      owner: owner,
      visit_count: 0,
      email: email,
    });

    // console.log(user, data);
    // console.log(res);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // const link = await fetch(`${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(airtableBody),
  // });

  //   console.log(result);

  // // console.log(peserta.size);
  // const response = await events.json();
  // res.status(200).json({ status: "berhasil", result: link });
}

const ShortenUrl = (length: number) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
