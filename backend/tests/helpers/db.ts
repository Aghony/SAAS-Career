import { prisma } from "../../src/config/prisma.js";

export async function resetDatabase() {
  await prisma.application.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
