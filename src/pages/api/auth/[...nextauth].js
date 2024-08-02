import {z} from "zod";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/db"; // Import the global prisma object from the file

const loginUserSchema = z.object({
    username: z.string().regex(/^[a-z0-9_-]{3,15}$/g, "Invalid username"),
    password: z.string().min(5, "Password should be minimum 5 characters"),
});

const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                username: {type: "text", placeholder: "Username"},
                password: {type: "password", placeholder: "Password"},
            },
            async authorize(credentials) {
                const {username, password} = loginUserSchema.parse(credentials);
                const user = await prisma.user.findUnique({
                    where: {username},
                });
                if (!user) return null;

                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordValid) return null;

                return user;
            },
        }),
    ],
    callbacks: {
        session({session, token}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                    username: token.username,
                },
            };
        },
        jwt({token, account, user}) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = user.id;
                token.name = user.name;
                token.username = user.username;
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
