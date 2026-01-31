-- CreateEnum
CREATE TYPE "GarmentType" AS ENUM ('TOP', 'BOTTOM', 'DRESS', 'OUTERWEAR', 'SHOES', 'ACCESSORY');

-- CreateEnum
CREATE TYPE "GarmentSeason" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON');

-- CreateEnum
CREATE TYPE "GarmentStatus" AS ENUM ('AVAILABLE', 'IN_LAUNDRY', 'UNAVAILABLE');

-- CreateTable
CREATE TABLE "garments" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "type" "GarmentType" NOT NULL,
    "color" TEXT NOT NULL,
    "season" "GarmentSeason"[],
    "occasion" TEXT[],
    "status" "GarmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "description" TEXT,
    "brand" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfits" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ai_suggestion" BOOLEAN NOT NULL DEFAULT false,
    "prompt" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_garments" (
    "id" TEXT NOT NULL,
    "outfit_id" TEXT NOT NULL,
    "garment_id" TEXT NOT NULL,

    CONSTRAINT "outfit_garments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laundry_queue" (
    "id" TEXT NOT NULL,
    "garment_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimated_available_at" TIMESTAMP(3),

    CONSTRAINT "laundry_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "outfit_garments_outfit_id_garment_id_key" ON "outfit_garments"("outfit_id", "garment_id");

-- CreateIndex
CREATE UNIQUE INDEX "laundry_queue_garment_id_key" ON "laundry_queue"("garment_id");

-- AddForeignKey
ALTER TABLE "outfit_garments" ADD CONSTRAINT "outfit_garments_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_garments" ADD CONSTRAINT "outfit_garments_garment_id_fkey" FOREIGN KEY ("garment_id") REFERENCES "garments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laundry_queue" ADD CONSTRAINT "laundry_queue_garment_id_fkey" FOREIGN KEY ("garment_id") REFERENCES "garments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
