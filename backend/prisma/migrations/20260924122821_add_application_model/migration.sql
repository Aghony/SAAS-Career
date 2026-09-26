-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('wishlist', 'applied', 'assessment', 'interview', 'technical_test', 'offer', 'rejected', 'withdrawn');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'freelance');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "jobUrl" TEXT,
    "location" TEXT,
    "employmentType" "EmploymentType",
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "appliedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'wishlist',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_userId_status_idx" ON "Application"("userId", "status");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
