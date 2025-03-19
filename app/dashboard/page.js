import { db } from "@/lib/db";
import { users } from "@/lib/userSchema";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
	const allUsers = await db
		.select({ id: users.id, name: users.name, email: users.email })
		.from(users);

	return (
		<main style={{ padding: "20px" }}>
			<h1>Dashboard</h1>
			<h2>Users</h2>
			<ul>
				{allUsers.map((user) => (
					<li key={user.id}>
						<strong>{user.name}</strong> - {user.email}
					</li>
				))}
			</ul>
			<Button>Click me</Button>
		</main>
	);
}
