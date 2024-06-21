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

  // if(url){
  //   console.log
  // }
  // if (url?.records[0]?.fields?.url) {
  //   console.log("count", url?.records[0]?.fields?.visit_count + 1);
  // }

  // console.log(url);

  // console.log(url?.records[0]?.fields?.url);

  if (url?.records[0]?.fields?.url) {
    const airtableBody = {
      records: [
        {
          id: url.records[0].id,
          fields: {
            // shortname: url.records[0].fields.shortname,
            // url: url.records[0].fields.url,
            visit_count: url.records[0].fields.visit_count + 1,
          },
        },
      ],
    };

    const trackingScript = `
  <script async defer data-website-id="f479d332-9df1-4719-abc1-ded2eddc020e" src="https://cloud.umami.is/script.js"></script>
  <script>
    if (window.umami) {
      window.umami.trackEvent('${url?.records[0]?.fields?.shortname}', 'visit');
    }
    window.location.href = '${url?.records[0]?.fields?.url}';
  </script>`;

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
    return new NextResponse(trackingScript, {
      headers: { "content-type": "text/html" },
    });
    if (response.ok) {
      // console.log(response.status);
      // trackEvent(`${url?.records[0]?.fields?.shortname}`, "visit");
      // return NextResponse.redirect(url?.records[0]?.fields?.url);
    }
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
