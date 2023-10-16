import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let peserta;
  if (req?.body) {
    peserta = await fetch(`${process.env.NEXT_PUBLIC_AIRTABLE_URI}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: req?.body,
    });
  }

  const registered = await peserta?.json();
  //   console.log(registered);

  res.status(200).json(registered);
}
