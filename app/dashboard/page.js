import { db } from "@/lib/db.js";
import { users } from "@/lib/userSchema.js";

export default async function Dashboard() {
  // Fetch users from the database
  const allUsers = await db.select().from(users);

  return (
    <main style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <h2>Users</h2>
      {allUsers.length > 0 ? (
        <ul>
          {allUsers.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </main>
  );
}
