import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://texecfinpziblywwupcp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleGVjZmlucHppYmx5d3d1cGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTQzMjgsImV4cCI6MjA0OTU3MDMyOH0.ZksmTVh2NtXBVojhCUqn-ebXsGHAXaGfeK3elq9m8MM"
);
// import Umami from "./utils/useUmami";
// import { redis, getUrl } from "./lib/redis";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname.split("/")[1];
  if (["favicon.ico", "api", "", "login", "404"].includes(path)) {
    return;
  }

  const link404 = req.nextUrl;

  link404.pathname = `/404`;

  // const trackEvent = Umami("/");

  // const url = await getUrl(path);

  // const url = await fetch(
  //   `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links?filterByFormula=shortname='${path}'`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
  //     },
  //   }
  // ).then((res) => {
  //   return res.json();
  // });

  const { data: url } = await supabase
    .from("url_shortener")
    .select("url,visit_count,shortname")
    .eq("shortname", path)
    .single();

  // console.log(url);

  // console.log(
  //   "url response",
  //   url[0]?.url,
  //   url[0]?.shortname,
  //   url[0]?.visit_count
  // );

  if (url?.url) {
    // const airtableBody = {
    //   records: [
    //     {
    //       id: url.records[0].id,
    //       fields: {
    //         visit_count: url.records[0].fields.visit_count + 1,
    //       },
    //     },
    //   ],
    // };

    const shortname = url?.shortname;
    const link = url?.url;
    const visit_count = url?.visit_count + 1;

    // console.log("visit", visit_count);

    //   const trackingScript = `
    // <script async defer data-website-id="f479d332-9df1-4719-abc1-ded2eddc020e" src="https://cloud.umami.is/script.js"></script>
    // <script>
    //   if (window.umami) {
    //     window.umami.trackEvent('shortlink visit', {url: '${shortname}'});
    //   }
    //     window.location.href = '${link}';
    // </script>`;

    const redirectHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0;url=${link}">
        <script async defer data-website-id="f479d332-9df1-4719-abc1-ded2eddc020e" src="https://cloud.umami.is/script.js"></script>
        <script>
          window.onload = function() {
            if (window.umami) {
              window.umami.trackEvent('shortlink visit', {url: '${shortname}'});
            }
          };
        </script>
      </head>
      <body>
      </body>
      </html>
    `;

    const { data } = await supabase
      .from("url_shortener")
      .update({ visit_count: visit_count })
      .eq("shortname", shortname)
      .select();

    // const response = await fetch(
    //   `https://texecfinpziblywwupcp.supabase.co/rest/v1/url_shortener?shortname=eq.${shortname}`,
    //   {
    //     method: "PATCH",
    //     headers: {
    //       apiKey: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleGVjZmlucHppYmx5d3d1cGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTQzMjgsImV4cCI6MjA0OTU3MDMyOH0.ZksmTVh2NtXBVojhCUqn-ebXsGHAXaGfeK3elq9m8MM`,
    //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleGVjZmlucHppYmx5d3d1cGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTQzMjgsImV4cCI6MjA0OTU3MDMyOH0.ZksmTVh2NtXBVojhCUqn-ebXsGHAXaGfeK3elq9m8MM`,
    //       "Content-Type": "application/json",
    //       // Prefer: "return=minimal",
    //     },
    //     body: JSON.stringify({ visit_count: visit_count }),
    //   }
    // );

    // console.log(data, error);

    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links`,
    //   {
    //     method: "PATCH",
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(airtableBody),
    //   }
    // );

    if (data) {
      return new NextResponse(redirectHtml, {
        headers: { "content-type": "text/html" },
      });
    }
  } else {
    // return NextResponse.redirect(link404);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|$).*)",
  ],
  // matcher: "/:shortUrl",
};
