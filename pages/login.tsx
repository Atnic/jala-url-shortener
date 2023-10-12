import React, { useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { Page } from "@/components/layouts/Page";
import { PageContent } from "@/components/layouts/PageContent";
import { Container } from "@/components/layouts/Container";
import { GoogleLogo } from "@/components/icons/JalaLogo";
import { LoadingLogo } from "@/components/icons/JalaLogo";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
// import { LoginNIKDisclosure } from "@/components/login/LoginNIKDisclosure";

export default function Login({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  // const error = router.query?.error;

  // toaster.error(error);
  useEffect(() => {
    if (session && status == "authenticated") {
      router.push("/");
    }
  }, [session, status]);

  // console.log(router);

  // console.log(session, status, router.query);

  if (status != "authenticated") {
    return (
      <>
        <Head>
          <title>Login | Warga JALA</title>
        </Head>
        <Page>
          <PageContent>
            <Container className="space-y-5 bg-[url('https://strapi.jala.tech/uploads/jala_main_gio_338f5fc7a8.jpeg')] bg-center bg-cover max-h-screen">
              <div className="flex flex-col h-screen backdrop-brightness-50 backdrop-saturate-125">
                <div className="h-1/2"></div>
                <div className="flex items-center justify-center flex-1 flex-col space-y-6 px-4 text-white">
                  <div className="text-2xl font-bold mt-6">Udan.gg 🍤</div>
                  <div className="text-md text-center">
                    Shorten your link. Only for Warga Jala.
                  </div>
                  <div className="rounded-3xl shadow-lg px-8 py-3 bg-white text-jala-insight font-medium flex">
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/" })}
                      className="flex justify-center space-x-2 items-center"
                    >
                      <GoogleLogo width={25} height={20} className="mr-2" />
                      Continue with JALA Email
                    </button>
                  </div>
                  {/* <div className="text-jala-white font-medium flex justify-center text-center">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="text-white font-medium"></div>
                      <LoginNIKDisclosure token={csrfToken} />
                    </div>
                  </div> */}
                </div>
              </div>
            </Container>
          </PageContent>
        </Page>
      </>
    );
  }
  return <LoadingLogo />;
}

// export const getStaticProps: GetStaticProps<{
//   seo: NextSeoProps;
//   context: GetServerSidePropsContext
// }> = async () => {
//   return {
//     props: {
//       seo: {
//         title: `Login | Warga JALA`,
//       },
//       csrfToken: await getCsrfToken(context),
//     },
//   };
// };

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
