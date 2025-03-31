import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const user = await db.query.users.findFirst({
					where: (users, { eq }) => eq(users.email, credentials.email),
				});

				if (!user) throw new Error("User not found");

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password,
				);
				if (!isValid) throw new Error("Invalid password");

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					hasCompletedSurvey: user.hasCompletedSurvey,
				};
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.hasCompletedSurvey = user.hasCompletedSurvey;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.hasCompletedSurvey = token.hasCompletedSurvey;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
