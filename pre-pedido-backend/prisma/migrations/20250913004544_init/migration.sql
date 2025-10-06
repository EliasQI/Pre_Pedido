-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
