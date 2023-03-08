import NextAuth, { Session } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../../lib/spotify";

const refreshAccessToken = async (token: any) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken?.access_token,
      expires_in: Date.now() + (refreshedToken?.expires_in ?? 0) * 1000,
      refreshToken: refreshedToken?.refresh_token ?? token?.refreshToken,
    };
  } catch (err) {
    console.error("err", err);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial login
      if (account && user) {
        return {
          ...token,
          accessToken: account?.access_token,
          refreshToken: account?.refresh_token,
          username: account?.providerAccountId,
          expires_in: (account.expires_at ?? 0) * 1000,
        };
      }

      // Return previous token if the access token hasn't expired
      if (Date.now() < (token.expires_in ?? 0)) {
        return token;
      }

      // If access token's expired, refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token?.accessToken || "",
          refreshToken: token?.refreshToken || "",
          username: token?.username,
        },
      };
    },
  },
});
