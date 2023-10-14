import React from "react";
import useSWR from "swr";
import { EditLinkModal } from "./EditLinkModal";
import toast, { Toaster } from "react-hot-toast";
import { fetcher } from "@/utils/fetcher";
import { DeleteLinkModal } from "./DeleteLinkModal";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

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

  const copyToClipboard = async (e: any) => {
    e.preventDefault();
    // console.log(e);
    let text = document.getElementById("shortlink")?.innerHTML;

    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(text ? text : "");
        toast.success(`${text} copied`);
        // console.log("shortlink copied to clipboard");
      } catch (err) {
        toast.success(`Failed to copy ${err}`);
        console.error("Failed to copy: ", err);
      }
    };

    copyContent();
  };

  if (linkDataLoading)
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="bg-slate-300 h-20 w-full rounded"></div>
      </div>
    );

  // console.log(link, linkData, url, shortlink);
  return (
    <div className="flex flex-row justify-between px-4 py-3 rounded-md shadow-md">
      <div className="flex flex-col gap-1 ">
        <div className="flex flex-row gap-2 items-center">
          <div className="text-jala-insight font-semibold">
            <a
              href={`${process.env.NEXT_PUBLIC_HOSTNAME}/${shortlink}`}
              target="_blank"
              id="shortlink"
            >
              {`${process.env.NEXT_PUBLIC_HOSTNAME}/${shortlink}`}
            </a>
          </div>
          <button
            className="rounded-full p-2 bg-slate-100 hover:bg-sky-100"
            onClick={copyToClipboard}
          >
            <DocumentDuplicateIcon className="w-4 h-4 text-jala-insight" />
          </button>
          <DeleteLinkModal link={link} />
        </div>

        <div className="text-sm hover:underline text-slate-500 hover:text-slate-800">
          <a href={url} target="_blank">
            {url}
          </a>
        </div>
      </div>
      <EditLinkModal link={link} />
      <Toaster />
    </div>
  );
}
