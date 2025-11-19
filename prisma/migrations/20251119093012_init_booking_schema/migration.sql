-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "pickupLat" DOUBLE PRECISION NOT NULL,
    "pickupLng" DOUBLE PRECISION NOT NULL,
    "pickupAddress" TEXT,
    "destinationLat" DOUBLE PRECISION NOT NULL,
    "destinationLng" DOUBLE PRECISION NOT NULL,
    "destinationAddress" TEXT,
    "tier" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "fare" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingId_key" ON "bookings"("bookingId");

-- CreateIndex
CREATE INDEX "bookings_bookingId_idx" ON "bookings"("bookingId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");
