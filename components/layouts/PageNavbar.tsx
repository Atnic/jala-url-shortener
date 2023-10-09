import React from "react";
import { useRouter } from "next/router";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

export function PageNavbar({ title }: any) {
  const router = useRouter();
  return (
    <div
      className="sticky w-full sm:max-w-lg top-0 px-4 py-3 grid grid-cols-4 content-center mx-auto inset-x-0 bg-white z-10"
      id="navbar"
    >
      <button onClick={() => router.back()} className="flex items-center">
        <ArrowUturnLeftIcon className="h-6 w-6  stroke-slate-600" />
      </button>
      <div className="font-bold text-center col-span-2">{title}</div>
    </div>
  );
}
