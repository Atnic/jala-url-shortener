import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.body;
  let links = (await redis.get("links")) || [];

  // // console.log(peserta.size);
  // const response = await events.json();
  res.status(200).json({ links });
}
