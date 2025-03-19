import { db } from "./db.js";
import { users } from "./userSchema.js";
import bcrypt from "bcryptjs"; // Hash passwords

async function seed() {
  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("securepass", 10);
  const hashedPassword3 = await bcrypt.hash("letmein", 10);

  await db.insert(users).values([
    { name: "Alice Johnson", email: "alice@example.com", password: hashedPassword1 },
    { name: "Bob Smith", email: "bob@example.com", password: hashedPassword2 },
    { name: "Charlie Davis", email: "charlie@example.com", password: hashedPassword3 },
  ]);

  console.log("✅ Mock users with passwords inserted!");
}

seed().catch(console.error);