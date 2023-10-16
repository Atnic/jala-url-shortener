import React from "react";
import useSWR from "swr";
import { EditLinkModal } from "./EditLinkModal";
import toast, { Toaster } from "react-hot-toast";
import { fetcher } from "@/utils/fetcher";
import { QRLinkModal } from "./QRLinkModal";
import {
  DocumentDuplicateIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

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
  const visit_count = link?.fields?.visit_count;

  const copyToClipboard = async (e: any) => {
    e.preventDefault();
    // console.log(e);
    let text = document.getElementById(`shortlink-${shortlink}`)?.innerHTML;

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

  if (linkDataError) {
    return (
      <div className="flex flex-col gap-4 justify-center">
        <div className="w-full rounded">
          Cannot get the link details. Please refresh the page.
        </div>
      </div>
    );
  }

  if (link) {
    return (
      <div className="flex flex-row justify-between px-4 py-3 rounded-md shadow-md w-full">
        <div className="flex flex-col gap-1 w-3/4">
          <div className="flex flex-row gap-2 items-center">
            <div className="text-jala-insight font-semibold">
              <a
                href={`/${shortlink}`}
                target="_blank"
                id={`shortlink-${shortlink}`}
              >
                {`${process.env.NEXT_PUBLIC_HOSTNAME}/${shortlink}`}
              </a>
            </div>
            <div className="md:flex flex-row gap-2 items-center hidden">
              <button
                className="rounded-full p-2 bg-slate-100 hover:bg-sky-100"
                onClick={copyToClipboard}
              >
                <DocumentDuplicateIcon className="w-4 h-4 text-jala-insight" />
              </button>
              <QRLinkModal link={link} />
              <div className="flex w-fit gap-1 px-2 py-1 bg-slate-100 text-xs rounded">
                <ChartBarIcon className="w-4 h-4 text-slate-700" />
                {visit_count}
                <span>click{visit_count > 1 ? `s` : ""}</span>
              </div>
            </div>

            {/* <DeleteLinkModal link={link} /> */}
          </div>

          <div className="text-sm hover:underline text-slate-500 hover:text-slate-800 truncate  ">
            <a href={url} target="_blank" className="">
              {url}
            </a>
          </div>
          <div className="flex flex-row gap-2 py-1 md:hidden items-center">
            <button
              className="rounded-full p-2 bg-slate-100 hover:bg-sky-100"
              onClick={copyToClipboard}
            >
              <DocumentDuplicateIcon className="w-4 h-4 text-jala-insight" />
            </button>
            <QRLinkModal link={link} />
            <div className="flex w-fit gap-1 px-2 py-1 bg-slate-100 text-xs rounded">
              <ChartBarIcon className="w-4 h-4 text-slate-700" />
              {visit_count}
              <span>click{visit_count > 1 ? `s` : ""}</span>
            </div>
          </div>
        </div>
        <EditLinkModal link={link} />
        {/* <Toaster /> */}
      </div>
    );
  }
}
