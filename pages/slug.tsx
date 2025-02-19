/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { PageTypes, LinkType } from "@/utils/types";
import { supabase } from "@/lib/supabaseClient";
import { PageContent } from "@/components/layouts/PageContent";
import { Page } from "@/components/layouts/Page";
import { Container } from "@/components/layouts/Container";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { fetcher } from "@/utils/supabase-fetcher";
import useSWR from "swr";

export default function Pages() {
  const [page, setPage] = useState<PageTypes>();
  const [links, setLinks] = useState<LinkType[]>([]);
  const router = useRouter();

  async function fetchPage(slug: string | string[] | undefined) {
    const { data, error, status, statusText } = await supabase
      .from("pages")
      .select("*")
      .eq("link_url", slug);

    if (error) console.log("Error fetching links:", error);
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
    if (router?.query?.slug) fetchPage(router.query.slug);
  }, [router]);

  useEffect(() => {
    if (page?.id) {
      fetchLinks(page?.id);
    }
  }, [page?.id]);

  // console.log(router.query.slug, page, links);

  //   const { data, error } = useSWR('my_table', fetcher)

  return (
    <>
      <Head>
        <title>{page?.profile_title} | Jala.cc</title>
        <meta name="description" content={page?.profile_bio} />

        <meta property="og:url" content={`https://jala.cc/${page?.link_url}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${page?.profile_title} | Jala.cc`}
        />
        <meta property="og:description" content={page?.profile_bio} />
        <meta
          property="og:image"
          content="https://strapi.jala.tech/uploads/jalacc_og_image_8fcefe928e.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="jala.cc" />
        <meta
          property="twitter:url"
          content={`https://jala.cc/${page?.link_url}`}
        />
        <meta
          name="twitter:title"
          content={`${page?.profile_title} | Jala.cc`}
        />
        <meta name="twitter:description" content={page?.profile_bio} />
        <meta
          name="twitter:image"
          content="https://strapi.jala.tech/uploads/jalacc_og_image_8fcefe928e.jpg"
        />
      </Head>
      <Page>
        <PageContent>
          <Container>
            <div className="flex flex-col gap-5 text-slate-700 relative py-12 items-center h-screen text-center">
              <img
                src={
                  page?.profile_image
                    ? page?.profile_image
                    : `https://ui-avatars.com/api/?name=${page?.user}&background=random&size=100`
                }
                alt={page?.profile_title}
                className="rounded-full w-24 h-24"
              />
              <div className="flex flex-col gap-2 items-center text-[#233f9e]">
                <div className="font-semibold text-xl">
                  {page?.profile_title}
                </div>
                <div className="">{page?.profile_bio}</div>
              </div>
              <div className="w-full text-center flex flex-col gap-3">
                {links ? (
                  links?.map((link) => (
                    <div
                      className="group rounded-full px-6 py-4 border-2 border-slate-200 font-medium hover:border-jala-insight hover:cursor-pointer"
                      key={link.title}
                    >
                      <a
                        href={link?.url}
                        target="_blank"
                        rel="noreferrer"
                        className="relative flex flex-row items-center justify-between"
                      >
                        <div></div>
                        <div className="group-hover:text-jala-insight group-hover:cursor-pointer">
                          {link?.title}
                        </div>
                        <div></div>
                        <Menu>
                          <MenuButton className="absolute right-0 p-1 rounded-lg hover:bg-slate-100 z-10">
                            <EllipsisVerticalIcon className="w-5 h-5" />
                          </MenuButton>
                          <MenuItems
                            anchor="bottom end"
                            className="w-32 bg-white p-3 z-10 rounded-xl shadow-sm border border-slate-100"
                          >
                            <MenuItem>
                              <Link
                                className="block data-[focus]:bg-slate-200 p-2 rounded-xl"
                                href="/settings"
                              >
                                Copy link
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className="block data-[focus]:bg-slate-200 p-2 rounded-xl"
                                href="/support"
                              >
                                Support
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                className="block data-[focus]:bg-slate-200 p-2 rounded-xl"
                                href="/license"
                              >
                                License
                              </Link>
                            </MenuItem>
                          </MenuItems>
                        </Menu>
                      </a>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
              {/* <div>Jala.cc</div> */}
            </div>
          </Container>
        </PageContent>
      </Page>
    </>
  );
}
