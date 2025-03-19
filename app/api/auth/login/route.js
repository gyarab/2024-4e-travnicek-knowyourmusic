import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const { email, password } = await req.json();

		const user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email),
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Verify password
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return NextResponse.json({ error: "Invalid password" }, { status: 401 });
		}

		return NextResponse.json({ message: "Login successful", user });
	} catch (error) {
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 },
		);
	}
}
