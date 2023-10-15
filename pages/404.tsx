import React from "react";
import Head from "next/head";
import { Page } from "@/components/layouts/Page";
import { PageContent } from "@/components/layouts/PageContent";
import { Container } from "@/components/layouts/Container";
import Link from "next/link";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function ErrorPage404() {
  return (
    <>
      <Head>
        <title>Error 404 | Jala.cc Url Shortener </title>
        <meta name="description" content="Jala.cc Url Shortener" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <PageContent>
          <Container>
            <div className="flex flex-1 text-slate-700 px-4 space-y-4 items-center justify-center h-screen  ">
              <div className="flex flex-col gap-4  space-y-3 px-5">
                <div className="text-lg font-semibold">
                  Sorry, We cannot find your page
                </div>
                <div className="text-sm font-light">
                  Please recheck your shortlink. Or contact our support team for
                  details.
                </div>
                <Link
                  href={"/"}
                  className="flex flex-1 w-fit items-center px-3 py-2 shadow-sm rounded-xl bg-amber-100"
                >
                  <ArrowUturnLeftIcon className="h-6 w-6 text-slate-600 mr-2" />
                  Back to home
                </Link>
                <div className="h-[50vh] bg-[url('https://strapi.jala.tech/uploads/Aldy_bersedih_6810094336.png?updated_at=2023-10-15T05:19:14.889Z')] bg-center bg-cover max-h-screen"></div>
              </div>
            </div>
          </Container>
        </PageContent>
      </Page>
    </>
  );
}
