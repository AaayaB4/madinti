-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CITIZEN', 'FIELD_WORKER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ROAD', 'LIGHTING', 'WASTE', 'WATER', 'SANITATION', 'PUBLIC_SPACE', 'SIGNAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED', 'DUPLICATE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "cin_number" TEXT,
    "cin_hash" TEXT,
    "phone_number" TEXT NOT NULL,
    "phone_hash" TEXT NOT NULL,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "password" TEXT,
    "otp_code" TEXT,
    "otp_expires_at" TIMESTAMP(3),
    "otp_attempts" INTEGER NOT NULL DEFAULT 0,
    "full_name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CITIZEN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "subcategory" TEXT,
    "description" TEXT,
    "location_lat" DOUBLE PRECISION NOT NULL,
    "location_lng" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "commune_id" TEXT,
    "province_id" TEXT,
    "region_id" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'NEW',
    "priority" INTEGER NOT NULL DEFAULT 2,
    "ai_confidence" DOUBLE PRECISION,
    "ai_suggested_category" TEXT,
    "photo_urls" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "assigned_to_id" TEXT,
    "department" TEXT,
    "upvote_count" INTEGER NOT NULL DEFAULT 0,
    "is_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "duplicate_of_id" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_updates" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "old_status" "ReportStatus",
    "new_status" "ReportStatus",
    "comment" TEXT,
    "photo_urls" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_upvotes" (
    "report_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_upvotes_pkey" PRIMARY KEY ("report_id","user_id")
);

-- CreateTable
CREATE TABLE "sms_reports" (
    "id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "sms_body" TEXT NOT NULL,
    "parsed_category" TEXT,
    "parsed_description" TEXT,
    "parsed_location" TEXT,
    "report_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sms_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cin_number_key" ON "users"("cin_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_cin_hash_key" ON "users"("cin_hash");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_hash_key" ON "users"("phone_hash");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_cin_hash_idx" ON "users"("cin_hash");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at");

-- CreateIndex
CREATE INDEX "reports_location_lat_location_lng_idx" ON "reports"("location_lat", "location_lng");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_duplicate_of_id_fkey" FOREIGN KEY ("duplicate_of_id") REFERENCES "reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_updates" ADD CONSTRAINT "report_updates_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_updates" ADD CONSTRAINT "report_updates_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_upvotes" ADD CONSTRAINT "report_upvotes_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_upvotes" ADD CONSTRAINT "report_upvotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
