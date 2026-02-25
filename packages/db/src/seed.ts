import { faker } from "@faker-js/faker";
import { db, schema } from "./index";

async function seed() {
  console.log("Starting database seeding process...");

  const usersToInsert = Array.from({ length: 50 }).map(() => {
    const isVerified = faker.datatype.boolean({ probability: 0.8 });
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      emailVerified: isVerified,
      image: faker.image.avatar(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
      role: faker.helpers.arrayElement(["user", "user", "user", "admin"]),
      banned: faker.datatype.boolean({ probability: 0.05 }),
    };
  });

  console.log(`Inserting ${usersToInsert.length} mock users...`);
  await db.insert(schema.user).values(usersToInsert);
  console.log("Users successfully seeded.");

  const todosToInsert = Array.from({ length: 200 }).map(() => {
    const user = faker.helpers.arrayElement(usersToInsert);
    return {
      id: faker.string.uuid(),
      userId: user.id,
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      completed: faker.datatype.boolean({ probability: 0.4 }),
      createdAt: faker.date.between({ from: user.createdAt, to: new Date() }),
    };
  });

  console.log(`Inserting ${todosToInsert.length} mock todos...`);
  await db.insert(schema.todos).values(todosToInsert);
  console.log("Todos successfully seeded.");

  console.log("Database seeding finalized completely.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
