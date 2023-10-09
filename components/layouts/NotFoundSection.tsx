import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

export function NotFoundSection({ title, subtitle, cta, url }: any) {
  const { query } = useRouter();
  return (
    <div className="flex flex-1 text-slate-700 px-4 space-y-4 h-screen items-center justify-center">
      <div className="flex flex-col space-y-3 px-5">
        <Image
          src={
            "https://strapi.jala.tech/uploads/404_illustration_a33f8c028b.png"
          }
          width={300}
          height={200}
          alt="404 illustration"
        />
        <div className="text-lg font-semibold">
          {title || "Maaf kami tidak dapat menemukan halaman Anda"}
        </div>
        <div className="text-sm font-light">
          {subtitle ||
            "Jika ada masalah dengan aplikasi, mohon hubungi tim JALA."}
        </div>
        <Link
          href={{
            pathname: url || "/",
            query: { cache_key: query.cache_key },
          }}
          className="flex flex-1 w-fit items-center px-3 py-2 shadow-sm rounded-xl bg-sky-100"
        >
          <ArrowUturnLeftIcon className="h-6 w-6 text-slate-600 mr-2" />
          {cta || "Kembali ke Beranda"}
        </Link>
      </div>
    </div>
  );
}
