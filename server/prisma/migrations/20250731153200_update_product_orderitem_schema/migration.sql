/*
  Warnings:

  - You are about to drop the column `image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `items_per_pack` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."order_items" ADD COLUMN     "items_per_pack" TEXT,
ADD COLUMN     "special_instructions" TEXT;

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "image",
DROP COLUMN "items_per_pack";
