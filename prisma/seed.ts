import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'password',
      email: 'admin@localhost.com',
      role: 'admin',
      active: true
    }
  })
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
