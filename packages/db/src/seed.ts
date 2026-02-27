import { db, schema } from "@repo/db";
import todosData from "@repo/db/mock-data/todos.json";
import usersData from "@repo/db/mock-data/users.json";
import { hashPassword } from "better-auth/crypto";

async function seed() {
  console.log("Starting database seeding process...");

  console.log("Cleaning up existing data...");
  await db.delete(schema.todos);
  await db.delete(schema.account);
  await db.delete(schema.session);
  await db.delete(schema.user);

  console.log(`Inserting ${usersData.length} mock users...`);

  for (const userData of usersData) {
    const { password, ...user } = userData;

    await db.insert(schema.user).values({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    });

    const hashedPassword = await hashPassword(password);
    await db.insert(schema.account).values({
      id: crypto.randomUUID(),
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: hashedPassword,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    });
  }

  console.log("Users and accounts successfully seeded.");

  console.log(`Inserting ${todosData.length} mock todos...`);
  const todosToInsert = todosData.map((todo) => ({
    ...todo,
    createdAt: new Date(todo.createdAt),
  }));

  await db.insert(schema.todos).values(todosToInsert);
  console.log("Todos successfully seeded.");

  console.log("Database seeding finalized completely.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
