/*
  Warnings:

  - You are about to drop the column `customerName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Order` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stallid` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "customerName",
DROP COLUMN "productName",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "stallid" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FoodStall" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodStall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stallid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FoodStall_email_key" ON "public"."FoodStall"("email");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_stallid_fkey" FOREIGN KEY ("stallid") REFERENCES "public"."FoodStall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_stallid_fkey" FOREIGN KEY ("stallid") REFERENCES "public"."FoodStall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
