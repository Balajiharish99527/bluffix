import "dotenv/config";
import { db } from "./index";
import { categories } from "./schema";
import { CATEGORIES_DATA } from "../lib/words";

async function seed() {
  console.log("Seeding categories...");
  for (const cat of CATEGORIES_DATA) {
    await db
      .insert(categories)
      .values({
        id: cat.id,
        name: cat.name,
        nameTa: cat.nameTa,
        nameHi: cat.nameHi,
        description: cat.description,
        icon: cat.icon,
      })
      .onConflictDoNothing();
  }
  console.log("Categories seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
