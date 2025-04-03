/*
  Warnings:

  - Added the required column `longDescription` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "availablePlaces" INTEGER,
ADD COLUMN     "documentsRequired" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "locationDescription" TEXT,
ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLng" DOUBLE PRECISION,
ADD COLUMN     "longDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "notIncluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "scheduleData" JSONB;
