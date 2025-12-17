import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: ts-node scripts/generateMcpApiKey.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User not found for email: ${email}`);
    process.exit(1);
  }

  const apiKey = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { email },
    data: { mcpApiKey: apiKey },
  });

  console.log(`MCP API key generated for ${email}:`);
  console.log(apiKey);
}

main()
  .catch((err) => {
    console.error("Error generating MCP API key:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


