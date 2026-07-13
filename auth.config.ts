import type { NextAuthConfig } from "next-auth";

const isProduction = process.env.NODE_ENV === "production";
const sessionMaxAge = 60 * 60 * 24 * 30;
const sessionUpdateAge = 60 * 60 * 24;
const ephemeralCookieMaxAge = 60 * 15;

export const authConfig: NextAuthConfig = {
  providers: [],

  secret: process.env.AUTH_SECRET,
  trustHost: !isProduction || Boolean(process.env.AUTH_URL),

  session: {
    strategy: "jwt",
    maxAge: sessionMaxAge,
    updateAge: sessionUpdateAge,
  },

  jwt: {
    maxAge: sessionMaxAge,
  },

  pages: {
    signIn: "/login",
  },

  cookies: {
    sessionToken: {
      name: "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
    callbackUrl: {
      name: "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
    csrfToken: {
      name: "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
    pkceCodeVerifier: {
      name: "authjs.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: ephemeralCookieMaxAge,
      },
    },
    state: {
      name: "authjs.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: ephemeralCookieMaxAge,
      },
    },
    nonce: {
      name: "authjs.nonce",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: ephemeralCookieMaxAge,
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
};