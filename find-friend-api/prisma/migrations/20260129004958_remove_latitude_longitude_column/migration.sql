/*
  Warnings:

  - You are about to drop the column `latitude` on the `Org` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Org` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Org" DROP COLUMN "latitude",
DROP COLUMN "longitude";
