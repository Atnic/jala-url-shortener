import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { linkId } = req.query;

  const link = await fetch(
    `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links/${linkId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const response = await link.json();
  res.status(200).json(response);
}
