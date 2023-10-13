import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { EditLinkModal } from "./EditLinkModal";
import { fetcher } from "@/utils/fetcher";

export function LinkItem({ linkId }: any) {
  //   console.log(linkId);
  const {
    data: link,
    error: linkDataError,
    isLoading: linkDataLoading,
  } = useSWR(
    linkId ? `api/link?linkId=${linkId}` : null,
    (url) => fetcher(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const shortlink = link?.fields?.shortname;
  const url = link?.fields?.url;

  const [linkData, setLinkData] = useState({
    id: linkId || "",
    shortname: shortlink || "",
    url: url || "",
  });

  useEffect(() => {
    setLinkData({
      id: linkId,
      shortname: shortlink,
      url: url,
    });
  }, []);

  if (linkDataLoading) return <div>Loading...</div>;

  // console.log(link, linkData, url, shortlink);
  return (
    <div className="flex flex-row justify-between px-4 py-3 rounded-md shadow-md">
      <div className="flex flex-col gap-1 ">
        <div className="flex flex-row gap-2 items-center">
          <div className="text-jala-insight font-semibold">
            <a
              href={`${process.env.NEXT_PUBLIC_HOSTNAME}/${shortlink}`}
              target="_blank"
            >
              {`${process.env.NEXT_PUBLIC_HOSTNAME}/${shortlink}`}
            </a>
          </div>
          <div className="rounded-full p-3 bg-slate-200"></div>
        </div>

        <div className="text-sm hover:underline text-slate-500 hover:text-slate-800">
          <a href={url} target="_blank">
            {url}
          </a>
        </div>
      </div>
      <EditLinkModal link={link} />
    </div>
  );
}
