import useUmami from "@/lib/useUmami";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Redirect = ({ originalUrl, shortUrl }) => {
  const router = useRouter();

  useUmami(
    shortUrl,
    "https://cloud.umami.is/script.js",
    "f479d332-9df1-4719-abc1-ded2eddc020e"
  );

  useEffect(() => {
    if (originalUrl) {
      window.location.href = originalUrl;
    }
  }, [originalUrl]);

  return <div></div>;
};

export async function getServerSideProps({ query }) {
  const { shortUrl } = query;
  // const url = await Url.findOne({ shortUrl });

  const url = await fetch(
    `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links?filterByFormula=shortname='${shortUrl}'`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
      },
    }
  ).then((res) => {
    return res.json();
  });

  console.log(shortUrl, url);

  if (!url) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      originalUrl: url?.records[0]?.fields?.url,
      shortUrl,
    },
  };
}

export default Redirect;
