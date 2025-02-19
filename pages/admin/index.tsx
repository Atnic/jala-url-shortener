import React, { useEffect, useState } from "react";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import { Page } from "@/components/layouts/Page";
import { PageContent } from "@/components/layouts/PageContent";
import { Container } from "@/components/layouts/Container";
import { supabase } from "@/lib/supabaseClient";
import { PageTypes, LinkTypes } from "@/utils/types";
import { useSession, signOut, signIn } from "next-auth/react";
import clsx from "clsx";
import { fetcher } from "@/utils/fetcher";
import useSWR, { useSWRConfig } from "swr";

export default function Admin() {
  const [page, setPage] = useState<PageTypes>();
  const [links, setLinks] = useState<LinkTypes[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status == "unauthenticated") {
      signIn();
    } else {
      fetchPage(session?.user?.email);
    }
  }, [session]);

  const handleInputChange = (event: any) => {
    // if (event.target.id == "title") {
    //   setPage({ ...page, profile_title: event.target.value });
    // } else if (event.target.id == "bio") {
    //   setPage({ ...page, profile_bio: event.target.value });
    // }
  };

  // const {
  //   data: user,
  //   error: userDataError,
  //   isLoading: userDataLoading,
  //   // mutate,
  // } = useSWR(
  //   session ? `api/user?filterByFormula=email='${session?.user?.email}'` : null,
  //   (url) => fetcher(url),
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false,
  //   }
  // );

  async function fetchPage(email: string | null | undefined) {
    const { data, error, status, statusText } = await supabase
      .from("pages")
      .select("*")
      .eq("email", email);

    if (error) console.log("Error fetching page:", error);
    else setPage(data[0]);
  }

  async function fetchLinks(id: string) {
    const { data, error, status, statusText } = await supabase
      .from("links")
      .select("*")
      .eq("owner", id)
      .eq("hide", false);

    if (error) console.log("Error fetching links:", error);
    else setLinks(data);
  }

  useEffect(() => {
    if (page?.id) {
      fetchLinks(page?.id);
    }
  }, [page?.id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setIsSubmitting(true);
    // let shorten;

    // const loadingToast = toast.loading("Shorten Your link");

    // if (value.includes("https://")) {
    //   shorten = await fetch("/api/shorten", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ url: value, owner: user?.records[0]?.id }),
    //   });
    // } else {
    //   shorten = await fetch("/api/shorten", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       url: `https://${value}`,
    //       owner: user?.records[0]?.id,
    //     }),
    //   });
    // }
  };

  console.log(page, links);
  return (
    <>
      <Head>
        <title>Jala.cc Admin</title>
        <meta name="description" content="Jala.cc Admin" />

        <meta property="og:url" content={`https://jala.cc/admin`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Jala.cc Admin" />
        <meta property="og:description" content="Jala.cc Admin" />
        <meta
          property="og:image"
          content="https://strapi.jala.tech/uploads/jalacc_og_image_8fcefe928e.jpg"
        />
      </Head>
      <Page>
        <PageContent>
          <Container>
            <div className="flex flex-col gap-5 text-slate-700 relative py-12 items-center h-screen text-center">
              <div className="w-full">
                <div className="px-4">
                  <form
                    className="form flex flex-col gap-3 relative"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex flex-col w-full gap-1">
                      <div className="text-slate-800 text-sm font-medium text-left">
                        Profile Title
                      </div>
                      <input
                        id="title"
                        value={page?.profile_title}
                        placeholder="Your profile title"
                        className="placeholder:text-slate-400  py-2 mt-1 block w-full rounded-md text-slate-600 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <div className="text-slate-800 text-sm font-medium text-left">
                        Bio
                      </div>
                      <textarea
                        rows={3}
                        id="bio"
                        value={page?.profile_bio}
                        placeholder="Description about your profile"
                        className="placeholder:text-slate-400  py-2 mt-1 block w-full rounded-md text-slate-600 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      className={clsx(
                        isSubmitting ? "bg-slate-300 " : "bg-white",
                        "absolute right-1.5 bottom-1.5 px-4 py-1 rounded-md border text-sm font-semibold border-slate-200 disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed "
                      )}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Shorten! 🍤
                    </button>
                  </form>
                </div>
              </div>
              <div>Links</div>
            </div>
          </Container>
        </PageContent>
      </Page>
    </>
  );
}
