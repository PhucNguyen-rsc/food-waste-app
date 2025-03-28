import NextAuth, { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@food-waste/types"
const { getAuthConfig } = require('@food-waste/config');

// Initialize auth config with JWT secret from environment
const AUTH_CONFIG = getAuthConfig(process.env.JWT_SECRET || '', {
  isProduction: process.env.NODE_ENV === 'production'
});

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
    maxAge: AUTH_CONFIG.JWT_EXPIRY,
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: AUTH_CONFIG.SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req: any): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
      
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
      
        if (!user || !user.password) {
          return null;
        }
      
        const isPasswordValid = await compare(credentials.password, user.password);
      
        if (!isPasswordValid) {
          return null;
        }

        // Create JWT token at sign-in time
        const { SignJWT } = await import('jose');
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const accessToken = await new SignJWT({
          sub: user.id,
          email: user.email,
          role: user.role,
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('24h')
          .sign(secret);
      
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as unknown as UserRole,
          accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }: { token: JWT; session: Session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.role = token.role as UserRole;
        session.token = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      // If we have a user (signing in) and an access token, use it
      if (user?.accessToken) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken: user.accessToken,
        };
      }

      // For subsequent requests, find the user and refresh the token if needed
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        return token;
      }

      // Create a new token with the required payload
      const { SignJWT } = await import('jose');
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const accessToken = await new SignJWT({
        sub: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      return {
        ...token,
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        accessToken,
      };
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);