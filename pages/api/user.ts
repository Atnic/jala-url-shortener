import type { NextApiRequest, NextApiResponse } from "next";
// import { redis } from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filterByFormula } = req.query;

  //   console.log(filterByFormula);

  //   if (!url || url.length <= 0) {
  //     res.status(400).json({ status: "Error: url is not set" });
  //     return;
  //   }

  const user = await fetch(
    `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/users?filterByFormula=${filterByFormula}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  //   console.log(result);

  // // console.log(peserta.size);
  const response = await user.json();
  res.status(200).json(response);
}
