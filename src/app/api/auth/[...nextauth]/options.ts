import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                if (!profile || !profile.sub) {
                    throw new Error("Google profile 'sub' (id) missing");
                }
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
            allowDangerousEmailAccountLinking: true
        })
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user?.id) return false;
            await prisma.user.upsert({
                where: { id: user.id },
                update: {
                    name: user.name,
                    email: user.email,
                    image: user.image
                },
                create: {
                    id: user.id,
                    name: user.name ?? "",
                    email: user.email,
                    image: user.image
                }
            });
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id?.toString();
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
};