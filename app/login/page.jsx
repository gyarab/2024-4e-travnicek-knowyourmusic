"use client";

import { useState } from "react";
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
	const [success, setSuccess] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await res.json();
		if (!res.ok) {
			setError(data.error);
		} else {
			setSuccess("Login successful!");
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
					{success && (
						<Alert className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
							<AlertTitle>Success</AlertTitle>
							<AlertDescription>{success}</AlertDescription>
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

					<p className="text-center text-sm text-gray-600 mt-4">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="text-indigo-500 font-medium hover:underline"
						>
							Register here
						</Link>
					</p>

					{/* Password Recovery Alert */}
					<Alert className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3">
						<AlertTitle className="font-semibold">
							Forgot your password?
						</AlertTitle>
						<AlertDescription>
							Please contact{" "}
							<a href="mailto:admin@rop.cz" className="underline font-medium">
								admin@rop.cz
							</a>{" "}
							for password recovery.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		</div>
	);
}
