import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
        }
    },
    
});