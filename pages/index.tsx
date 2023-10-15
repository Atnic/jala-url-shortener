import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import { useSession, signOut, signIn } from "next-auth/react";
import { Page } from "@/components/layouts/Page";
import { PageContent } from "@/components/layouts/PageContent";
import { Container } from "@/components/layouts/Container";
import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { LoadingLogo } from "@/components/icons/JalaLogo";
import { LinkItem } from "@/components/homepage/LinkItem";
import { fetcher } from "@/utils/fetcher";
import clsx from "clsx";

export default function Home() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [links, setLinks] = useState({});

  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status == "unauthenticated") {
      signIn();
    }
  }, [session]);

  // console.log(session);

  const handleInputChange = (event: any) => {
    // console.log(event);
    setValue(event.target.value);
    // const { name, value } = event.target;
    // setProfileData((prevSettings) => ({
    //   ...prevSettings,
    //   [name]: value,
    // }));
  };

  const {
    data: user,
    error: userDataError,
    isLoading: userDataLoading,
    // mutate,
  } = useSWR(
    session ? `api/user?filterByFormula=email='${session?.user?.email}'` : null,
    (url) => fetcher(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const {
    data: links,
    error: linksDataError,
    isLoading: linksDataLoading,
    mutate,
  } = useSWR(
    user?.records
      ? `api/links?filterByFormula=SEARCH('${session?.user?.email}', ARRAYJOIN(email, ";"))`
      : null,
    (url) => fetcher(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // console.log(user, links);

  // console.log(session);

  // const links = user?.records[0]?.fields?.links;
  // const owner = user?.records[0]?.id;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading("Shorten Your link");

    const shorten = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: value, owner: user?.records[0]?.id }),
    });

    if (shorten.status == 200) {
      setValue("");
      mutate(
        `api/links?filterByFormula=SEARCH('${session?.user?.email}', ARRAYJOIN(email, ";"))`
      );
      toast.success("Link shorted!", { id: loadingToast });
      setIsSubmitting(false);
    } else if (shorten.status == 400) {
      setError(true);
      setIsSubmitting(false);
      toast.error("Cannot shorten Your link", { id: loadingToast });
    }
    // console.log(shorten);
  };

  if (userDataLoading || linksDataLoading) {
    <Page>
      <PageContent>
        <Container>
          <LoadingLogo />
        </Container>
      </PageContent>
    </Page>;
  }

  // console.log(links, user);
  if (user) {
    return (
      <>
        <Head>
          <title>Jala.cc Url Shortener</title>
          <meta name="description" content="Jala.cc Url Shortener" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Page>
          <PageContent>
            <Container>
              <div className="flex flex-col gap-4 text-slate-700 space-y-2 relative py-16">
                <div className="flex px-4 justify-between items-center">
                  <div className="text-2xl font-bold ">
                    Hi {session?.user?.name} 👋
                  </div>
                  <div className="text-amber-500 font-medium ">
                    <button
                      onClick={() => signOut()}
                      className="flex hover:-translate-y-1 hover:text-amber-400 delay-100 ease-in-out"
                    >
                      <ArrowRightOnRectangleIcon className="h-6 w-6 mr-1" />
                      Sign out
                    </button>
                  </div>
                </div>
                <div className="px-4 text-sm text-slate-400">
                  Copy and paste your long link on the form below and click
                  shorten!
                </div>
                <div className="px-4">
                  <form
                    className="form flex flex-row gap-2 relative"
                    onSubmit={handleSubmit}
                  >
                    <input
                      value={value}
                      placeholder="Shorten your url here!"
                      className="placeholder:text-slate-400  py-2 mt-1 block w-full rounded-md text-slate-600 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      onChange={handleInputChange}
                    />
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
                <div className="flex flex-col gap-4 px-4">
                  {links?.records ? (
                    links?.records.map((link: any, i: number) => (
                      <LinkItem key={link.id} linkId={link.id} link={link} />
                    ))
                  ) : (
                    <></>
                  )}
                  {links?.records == 0 ? (
                    <div className="px-2 text-slate-600 text-sm text-center">
                      No shortlink. Create your first shortlink by pasting your
                      url on the form above.
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <Toaster />
            </Container>
          </PageContent>
        </Page>
      </>
    );
  }
}
