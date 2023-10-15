import { NextRequest, NextResponse } from "next/server";
// import { redis, getUrl } from "./lib/redis";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname.split("/")[1];
  if (["favicon.ico", "api", "", "login", "404"].includes(path)) {
    return;
  }

  const link404 = req.nextUrl;

  link404.pathname = `/404`;

  // const url = await getUrl(path);

  const url = await fetch(
    `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links?filterByFormula=shortname='${path}'`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
      },
    }
  ).then((res) => {
    return res.json();
  });

  // if(url){
  //   console.log
  // }

  // console.log(url);

  // console.log(url?.records[0]?.fields?.url);

  if (url?.records[0]?.fields?.url) {
    return NextResponse.redirect(url?.records[0]?.fields?.url);
  } else {
    return NextResponse.redirect(link404);
  }
  // console.log(path);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|$).*)",
  ],
};
