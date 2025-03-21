"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (res.error) {
			setError(res.error);
		} else {
			router.push("/dashboard"); // Redirect on success
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<Card className="w-full max-w-md shadow-md">
				<CardHeader>
					<CardTitle className="text-center text-xl font-bold">
						Welcome! Please log in to your account
					</CardTitle>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<form onSubmit={handleLogin}>
						<div className="mb-4">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="mb-6">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<Button type="submit" className="w-full">
							Sign In
						</Button>
					</form>

					<Alert className="mt-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-3">
						<AlertTitle className="font-semibold">
							Forgot your password?
						</AlertTitle>
						<AlertDescription>
							Please contact{" "}
							<a
								href="mailto:admin@rop.cz"
								className="underline font-medium text-blue-600 hover:text-blue-800"
							>
								admin@rop.cz
							</a>{" "}
							for password recovery.
						</AlertDescription>
					</Alert>

					<p className="text-center text-sm text-gray-600 mt-4">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="text-indigo-500 font-medium hover:underline"
						>
							Register here
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
