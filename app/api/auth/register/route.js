import { db } from "@/lib/db";
import { users } from "@/lib/userSchema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const { name, email, password } = await req.json();

		// Check if user already exists
		const existingUser = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email),
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 },
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert user into the database
		const newUser = await db.insert(users).values({
			name,
			email,
			password: hashedPassword,
		});

		return NextResponse.json({
			message: "User registered successfully",
			newUser,
		});
	} catch (error) {
		console.error("🔥 Server Error:", error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 },
		);
	}
}
