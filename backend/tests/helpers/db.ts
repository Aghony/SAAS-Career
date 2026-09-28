import { prisma } from "../../src/config/prisma.js";

export async function resetDatabase() {
  await prisma.application.deleteMany();
  await prisma.user.deleteMany();
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}