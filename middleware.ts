import { NextRequest, NextResponse } from "next/server";
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

  if (url?.records[0]?.fields?.url) {
    const airtableBody = {
      records: [
        {
          id: url.records[0].id,
          fields: {
            visit_count: url.records[0].fields.visit_count + 1,
          },
        },
      ],
    };

    const trackingScript = `
  <script async defer data-website-id="f479d332-9df1-4719-abc1-ded2eddc020e" src="https://cloud.umami.is/script.js"></script>
  <script>
    if (window.umami) {
      window.umami.trackEvent('shortlink visit', {url: '${url?.records[0]?.fields?.shortname}'});
    }
      window.location.href = '${url?.records[0]?.fields?.url}';
  </script>`;

    const redirectHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0;url=${url?.records[0]?.fields?.url}">
        <script async defer data-website-id="f479d332-9df1-4719-abc1-ded2eddc020e" src="https://cloud.umami.is/script.js"></script>
        <script>
          window.onload = function() {
            if (window.umami) {
              window.umami.trackEvent('shortlink visit', {url: '${url?.records[0]?.fields?.shortname}'});
            }
          };
        </script>
      </head>
      <body>
      </body>
      </html>
    `;

    // console.log(airtableBody);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airtableBody),
      }
    );

    // console.log(response);

    if (response.ok) {
      const redirectUrl = new URL("/redirect", req.url);
      redirectUrl.searchParams.set(
        "shortUrl",
        url?.records[0]?.fields?.shortname
      );
      redirectUrl.searchParams.set(
        "originalUrl",
        encodeURIComponent(url?.records[0]?.fields?.url)
      );
      return NextResponse.redirect(redirectUrl);

      return new NextResponse(redirectHtml, {
        headers: { "content-type": "text/html" },
      });
      // console.log(response.status);
      // trackEvent(`${url?.records[0]?.fields?.shortname}`, "visit");
      // return NextResponse.redirect(url?.records[0]?.fields?.url);
    }
  } else {
    return NextResponse.redirect(link404);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|$).*)",
  ],
};
