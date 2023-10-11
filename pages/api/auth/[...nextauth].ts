import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      profile: (profile, tokens) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image:
            profile.picture ||
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkkAQAAB8AG7jymN8AAAAASUVORK5CYII=",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ account, profile, credentials }: any) {
      // console.log(account.provider, credentials);
      if (account.provider === "google") {
        return profile.email_verified && profile.email.endsWith("@jala.tech");
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
