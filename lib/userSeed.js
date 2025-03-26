import { db } from "./db.js";
import { users, userFavoriteArtists } from "./userSchema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"; // Hash passwords

async function seed() {
  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("securepass", 10);
  const hashedPassword3 = await bcrypt.hash("letmein", 10);

  await db.insert(users).values([
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: hashedPassword1,
    },
    { name: "Bob Smith", email: "bob@example.com", password: hashedPassword2 },
    {
      name: "Charlie Davis",
      email: "charlie@example.com",
      password: hashedPassword3,
    },
  ]);

  console.log("✅ Mock users with passwords inserted!");
}

async function addFavoriteArtistsToUser(userEmail, artistIds) {
  try {
    // Step 1: Fetch the User's ID
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, userEmail))
      .get();

    if (!user) {
      console.error(`User with email ${userEmail} not found.`);
      return;
    }

    const favoriteEntries = artistIds.map((artistId) => ({
      userId: user.id,
      artistId: artistId,
    }));

    await db.insert(userFavoriteArtists).values(favoriteEntries).run();

    console.log(
      `Added artists ${artistIds.join(", ")} to user ${userEmail}'s favorites.`
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Example usage
const artistIds = [
  "1kmpkcYbuaZ8tnFejLzkj2", // Artist ID 1
  "1vCWHaC5f2uS3yhpwWbIA6", // Artist ID 2
];

addFavoriteArtistsToUser("test1@rop.cz", artistIds);

// seed().catch(console.error);
