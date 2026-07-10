import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "BuildTrustBG Admin";

  if (!email || !password) {
    throw new Error(
      "Missing required environment variables: ADMIN_EMAIL and ADMIN_PASSWORD"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("ADMIN seed completed successfully.");
  console.log("Admin email:", admin.email);
  console.log("Admin role:", admin.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
