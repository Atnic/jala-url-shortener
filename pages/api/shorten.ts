import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.body;

  console.log(url);

  if (!url || url.length <= 0) {
    res.status(400).json({ status: "Error: url is not set" });
    return;
  }

  const shortUrl = ShortenUrl(5);

  let result = await redis.hset("links", { [shortUrl]: url });
  // const events = await fetch(
  //   `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/events?sort%5B0%5D%5Bfield%5D=date`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
  //       "Content-Type": "application/json",
  //     },
  //     //   body: JSON.stringify(req.body),
  //   }
  // );

  console.log(result);

  // // console.log(peserta.size);
  // const response = await events.json();
  res.status(200).json({ status: "berhasil", result: result });
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
