/*
  Warnings:

  - You are about to alter the column `price` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `difficulty` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `coverImage` to the `Gallery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "includes" TEXT[],
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'upcoming',
ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "coverImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSecret" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSecret_pkey" PRIMARY KEY ("id")
);
