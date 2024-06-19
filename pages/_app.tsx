import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { UseUmami } from "@/utils/useUmami";

export default function App({
  Component,
  pageProps: { session, seo, ...pageProps },
}: AppProps) {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    UseUmami(
      "https://cloud.umami.is/script.js",
      "f479d332-9df1-4719-abc1-ded2eddc020e"
    );
  }, []);
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
