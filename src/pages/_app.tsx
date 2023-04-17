import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Script from "next/script";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      {" "}
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Script
        src="https://kit.fontawesome.com/8e5bc578dd.js"
        crossOrigin="anonymous"
      ></Script>
    </>
  );
};

export default api.withTRPC(MyApp);
