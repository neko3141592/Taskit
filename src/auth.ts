import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from 'next-auth/providers/google'
import Email from "next-auth/providers/email";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Email({
            // sendVerificationRequest({ identifier, url, provider }) {
                
            // },
            server: process.env.EMAIL_SERVER!,
            from: process.env.EMAIL_FROM!,
        }),
    ],
    callbacks: {
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl;
            if (pathname.startsWith('/dashboard')) {
                return !!auth;
            }
            return true;
        },
        jwt({ token, trigger, session }) {
            if (trigger === 'update') token.name = session.user.name;
            return token;
        },
        session({ session, token }) {
            if (token) {
                session.user.name = token.name;
                session.user.id = token.sub;
            }
            return session;
        }
    },
    
});