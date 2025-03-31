import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUserSurveyStatus } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		// Get the user session
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if the user has completed the survey
		const hasCompletedSurvey = await checkUserSurveyStatus(session.user.id);

		return NextResponse.json({ hasCompletedSurvey });
	} catch (error) {
		console.error("Error checking survey status:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
