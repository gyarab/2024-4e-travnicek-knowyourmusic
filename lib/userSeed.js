import { db } from "./db.js";
import { users } from "./userSchema.js";

async function seed() {
  try {
    await db.insert(users).values([
      { name: "Alice Johnson", email: "alice@example.com" },
      { name: "Bob Smith", email: "bob@example.com" },
      { name: "Charlie Davis", email: "charlie@example.com" },
    ]);
    console.log("✅ Mock users inserted!");
  } catch (error) {
    console.error("❌ Error inserting users:", error);
  }
}

seed();