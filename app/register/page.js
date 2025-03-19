"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});

		const data = await res.json();
		if (!res.ok) {
			setError(data.error);
		} else {
			setSuccess("Registration successful! You can now log in.");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<Card className="w-full max-w-md shadow-md">
				<CardHeader>
					<CardTitle className="text-center text-xl font-bold">
						Create an Account
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
					<form onSubmit={handleRegister}>
						<div className="mb-4">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Your full name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

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
							Register
						</Button>
					</form>

					<p className="text-center text-sm text-gray-600 mt-4">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-indigo-500 font-medium hover:underline"
						>
							Login here
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
