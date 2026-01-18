/*
  Warnings:

  - You are about to rename the column `cloudinaryPublicId` to `imagePath` on the `ProductImage` table.

*/
-- AlterTable
ALTER TABLE "ProductImage" RENAME COLUMN "cloudinaryPublicId" TO "imagePath";
