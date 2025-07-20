import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log('authorize called', credentials);
                if (!credentials?.email || !credentials?.password) {
                    console.log('Missing credentials');
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    console.log('User not found');
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    console.log('Invalid password');
                    return null;
                }

                console.log('Authorized user:', user);
                return {
                    id: user.id,
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log("JWT callback", { token, user });
            if (user?.id) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("SESSION callback", { session, token });
            if (session?.user && token?.id) {
                session.user.id = token.id;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };