-- CreateEnum
CREATE TYPE "RoleCode" AS ENUM ('ADMIN', 'STAFF', 'VET', 'OWNER');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "species_code" AS ENUM ('DOG', 'CAT');

-- CreateEnum
CREATE TYPE "appointment_type" AS ENUM ('VACCINATION', 'MICROCHIP', 'HEALTH_CERTIFICATE');

-- CreateEnum
CREATE TYPE "service_type" AS ENUM ('CLINIC', 'AT_HOME');

-- CreateEnum
CREATE TYPE "employment_type" AS ENUM ('FULL_TIME', 'PART_TIME');

-- CreateEnum
CREATE TYPE "employment_status" AS ENUM ('WORKING', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "appointment_status" AS ENUM ('PENDING', 'RECEIVED', 'CHECKED_IN', 'SERVICE_DONE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "vaccination_status" AS ENUM ('GIVEN', 'NOT_GIVEN');

-- CreateEnum
CREATE TYPE "vaccine_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "lot_status" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'EXPIRED');

-- CreateEnum
CREATE TYPE "plan_status" AS ENUM ('PLANNED', 'DUE_SOON', 'OVERDUE', 'DONE', 'SKIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "invoice_status" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'VOID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "invoice_item_type" AS ENUM ('VACCINATION', 'MICROCHIP', 'HEALTH_CERTIFICATE');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('CASH', 'BANK_TRANSFER', 'PAYOS');

-- CreateEnum
CREATE TYPE "voucher_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "discount_type" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "owner_voucher_status" AS ENUM ('AVAILABLE', 'USED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "weekday" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateEnum
CREATE TYPE "block_type" AS ENUM ('BREAK_TIME', 'TIME_OFF', 'HAVE_APPOINTMENT');

-- CreateEnum
CREATE TYPE "microchip_status" AS ENUM ('AVAILABLE', 'USED', 'LOST');

-- CreateEnum
CREATE TYPE "microchip_source_type" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('APPOINTMENT_REMINDER', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'INVOICE_ISSUED', 'PAYMENT_CONFIRMED', 'VACCINE_DUE', 'VACCINE_OVERDUE', 'WELCOME', 'GENERAL');

-- CreateEnum
CREATE TYPE "channel" AS ENUM ('EMAIL', 'PUSH');

-- CreateEnum
CREATE TYPE "loyalty_type" AS ENUM ('EARN', 'REDEEM', 'EXPIRE', 'ADJUST');

-- CreateEnum
CREATE TYPE "service_price_type" AS ENUM ('VACCINE', 'MICROCHIP', 'HEALTH_CERTIFICATE');

-- CreateTable
CREATE TABLE "user" (
    "_id" UUID NOT NULL,
    "role" "RoleCode" NOT NULL DEFAULT 'OWNER',
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "avatar_url" VARCHAR(255),
    "dob" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "last_used_at" TIMESTAMPTZ(6),
    "replaced_by_token_id" UUID,
    "user_agent" VARCHAR(500),
    "ip_address" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "verify_token" (
    "_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "redirect_url" VARCHAR(500),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "last_sent_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "verify_token_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "staff" (
    "_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "staff_code" VARCHAR(30) NOT NULL,
    "job_title" VARCHAR(100),
    "department" VARCHAR(100),
    "employment_type" "employment_type" NOT NULL,
    "employment_status" "employment_status" NOT NULL,
    "join_date" DATE NOT NULL,
    "end_date" DATE,
    "address" VARCHAR(255) NOT NULL,
    "citizen_id" VARCHAR(30) NOT NULL,
    "notes" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "vet" (
    "_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "bio" VARCHAR(255) NOT NULL,
    "license_no" VARCHAR(50) NOT NULL,
    "license_issue_by" VARCHAR(255) NOT NULL,
    "license_valid_from" DATE NOT NULL,
    "license_valid_to" DATE NOT NULL,
    "join_date" DATE NOT NULL,
    "end_date" DATE,
    "address" VARCHAR(255) NOT NULL,
    "citizen_id" VARCHAR(30) NOT NULL,
    "employment_status" "employment_status" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vet_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "owner" (
    "_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "address" VARCHAR(255),
    "location_lat" DOUBLE PRECISION,
    "location_lng" DOUBLE PRECISION,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "owner_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "species" (
    "_id" UUID NOT NULL,
    "code" "species_code" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "default_vaccine_plan" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "species_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "pet" (
    "_id" UUID NOT NULL,
    "species_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sex" "gender" NOT NULL,
    "dob" DATE NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "color" VARCHAR(200) NOT NULL,
    "breed" VARCHAR(200) NOT NULL,
    "note" VARCHAR(255),
    "is_sterilized" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "pet_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "_id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "appointment_type" "appointment_type" NOT NULL,
    "service_type" "service_type" NOT NULL,
    "slot_id" UUID,
    "staff_id" UUID,
    "vet_id" UUID,
    "owner_id" UUID NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6) NOT NULL,
    "distance" DOUBLE PRECISION,
    "appointment_status" "appointment_status" NOT NULL,
    "cancel_reason" VARCHAR(500),
    "notes" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "cancelled_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "vaccine" (
    "_id" UUID NOT NULL,
    "species_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(255) NOT NULL,
    "img_url" VARCHAR(255),
    "description" VARCHAR(255),
    "dose_value" DOUBLE PRECISION NOT NULL,
    "dose_unit" VARCHAR(20) NOT NULL,
    "status" "vaccine_status" NOT NULL DEFAULT 'ACTIVE',
    "default_total_doses" INTEGER NOT NULL,
    "default_next_due_days" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "vaccine_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "vaccine_lot" (
    "_id" UUID NOT NULL,
    "vaccine_id" UUID NOT NULL,
    "lot_no" VARCHAR(80) NOT NULL,
    "mfg_date" DATE NOT NULL,
    "exp_date" DATE NOT NULL,
    "initial_quantity" INTEGER NOT NULL,
    "quantity_on_hand" INTEGER NOT NULL,
    "storage_temp_min" DOUBLE PRECISION NOT NULL,
    "storage_temp_max" DOUBLE PRECISION NOT NULL,
    "status" "lot_status" NOT NULL DEFAULT 'AVAILABLE',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "vaccine_lot_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "vaccination_record" (
    "_id" UUID NOT NULL,
    "appointment_id" UUID,
    "pet_id" UUID NOT NULL,
    "vaccine_lot_id" UUID NOT NULL,
    "dose_no" INTEGER NOT NULL,
    "administered_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "vaccination_status" NOT NULL,
    "next_due_date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vaccination_record_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "vaccine_plan" (
    "_id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "vaccine_id" UUID NOT NULL,
    "dose_no" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "due_from" DATE,
    "due_to" DATE,
    "status" "plan_status" NOT NULL,
    "vaccination_record_id" UUID,
    "completed_at" TIMESTAMPTZ(6),
    "remind_at" TIMESTAMPTZ(6),
    "last_reminded_at" TIMESTAMPTZ(6),
    "note" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "vaccine_plan_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "microchip_batch" (
    "_id" UUID NOT NULL,
    "batch_no" VARCHAR(80) NOT NULL,
    "vendor_name" VARCHAR(150) NOT NULL,
    "manufacturer" VARCHAR(150) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "import_date" DATE NOT NULL,
    "total_quantity" INTEGER NOT NULL DEFAULT 0,
    "notes" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "microchip_batch_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "microchip" (
    "_id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "microchip_code" VARCHAR(50) NOT NULL,
    "status" "microchip_status" NOT NULL DEFAULT 'AVAILABLE',
    "pet_id" UUID,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "microchip_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "microchip_record" (
    "_id" UUID NOT NULL,
    "appointment_id" UUID,
    "vet_id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "microchip_item_id" UUID,
    "microchip_code" VARCHAR(50) NOT NULL,
    "source_type" "microchip_source_type" NOT NULL DEFAULT 'INTERNAL',
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "implant_site" VARCHAR(100),
    "implanted_at" TIMESTAMPTZ(6),
    "scanned_at" TIMESTAMPTZ(6),
    "notes" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "microchip_record_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "health_cer_record" (
    "_id" UUID NOT NULL,
    "appointment_id" UUID,
    "pet_id" UUID NOT NULL,
    "vet_id" UUID NOT NULL,
    "certificate_no" VARCHAR(50) NOT NULL,
    "issued_at" DATE NOT NULL,
    "valid_from" DATE NOT NULL,
    "valid_to" DATE NOT NULL,
    "exam_summary" VARCHAR(255),
    "findings" VARCHAR(255),
    "diagnosis" VARCHAR(255),
    "recommendations" VARCHAR(255),
    "restrictions" VARCHAR(255),
    "temperature" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "pdf_url" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "health_cer_record_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "_id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "invoice_code" VARCHAR(50) NOT NULL,
    "invoice_no" VARCHAR(50) NOT NULL,
    "issued_at" TIMESTAMPTZ(6),
    "due_at" TIMESTAMPTZ(6),
    "status" "invoice_status" NOT NULL DEFAULT 'DRAFT',
    "currency" VARCHAR(10) NOT NULL DEFAULT 'VND',
    "sub_total" DECIMAL(12,2) NOT NULL,
    "discount_total" DECIMAL(12,2) NOT NULL,
    "tax_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paid_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balance_due" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "invoice_item" (
    "_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "item_type" "invoice_item_type" NOT NULL,
    "vaccination_record_id" UUID,
    "microchip_record_id" UUID,
    "health_cer_record_id" UUID,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "discount_amount" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "notes" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "invoice_item_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" "payment_method" NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMPTZ(6),
    "transaction_ref" VARCHAR(100),
    "provider" VARCHAR(100),
    "payos_order_id" VARCHAR(100),
    "checkout_url" VARCHAR(500),
    "notes" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "voucher" (
    "_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "discount_type" "discount_type" NOT NULL,
    "discount_value" DECIMAL(12,2) NOT NULL,
    "max_discount" DECIMAL(12,2),
    "min_order_amount" DECIMAL(12,2),
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6) NOT NULL,
    "usage_limit_total" INTEGER,
    "usage_limit_per_own" INTEGER,
    "status" "voucher_status" NOT NULL DEFAULT 'ACTIVE',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "voucher_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "owner_voucher" (
    "_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "voucher_id" UUID NOT NULL,
    "status" "owner_voucher_status" NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "invoice_id" UUID,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "notes" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "owner_voucher_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "invoice_voucher" (
    "_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "voucher_id" UUID NOT NULL,
    "owner_voucher_id" UUID,
    "discount_type" "discount_type" NOT NULL,
    "discount_value" DECIMAL(12,2) NOT NULL,
    "discount_amount" DECIMAL(12,2) NOT NULL,
    "applied_at" TIMESTAMPTZ(6) NOT NULL,
    "notes" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "invoice_voucher_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "loyalty_point" (
    "_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "invoice_id" UUID,
    "type" "loyalty_type" NOT NULL,
    "points" INTEGER NOT NULL,
    "points_balance" INTEGER NOT NULL,
    "reason" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "loyalty_point_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "notification_type" NOT NULL,
    "channel" "channel" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" VARCHAR(1000) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ(6),
    "scheduled_at" TIMESTAMPTZ(6),
    "sent_at" TIMESTAMPTZ(6),
    "reference_id" UUID,
    "reference_type" VARCHAR(50),
    "metadata" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "working_shift" (
    "_id" UUID NOT NULL,
    "vet_id" UUID NOT NULL,
    "day_of_week" "weekday" NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "slot_duration" INTEGER NOT NULL DEFAULT 30,
    "max_appointments" INTEGER NOT NULL DEFAULT 1,
    "notes" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "working_shift_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "appointment_slot" (
    "_id" UUID NOT NULL,
    "shift_id" UUID NOT NULL,
    "slot_date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "booked_count" INTEGER NOT NULL DEFAULT 0,
    "max_appointments" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "appointment_slot_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "block_time" (
    "_id" UUID NOT NULL,
    "vet_id" UUID NOT NULL,
    "type" "block_type" NOT NULL DEFAULT 'TIME_OFF',
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6) NOT NULL,
    "reason" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "block_time_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "service_price" (
    "_id" UUID NOT NULL,
    "type" "service_price_type" NOT NULL,
    "reference_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'VND',
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "service_price_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "img_gallery" (
    "_id" UUID NOT NULL,
    "img_url" VARCHAR(255) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "img_gallery_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "user_is_deleted_idx" ON "user"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_hash_key" ON "refresh_token"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_replaced_by_token_id_key" ON "refresh_token"("replaced_by_token_id");

-- CreateIndex
CREATE INDEX "refresh_token_user_id_idx" ON "refresh_token"("user_id");

-- CreateIndex
CREATE INDEX "refresh_token_expires_at_idx" ON "refresh_token"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "verify_token_token_hash_key" ON "verify_token"("token_hash");

-- CreateIndex
CREATE INDEX "verify_token_user_id_idx" ON "verify_token"("user_id");

-- CreateIndex
CREATE INDEX "verify_token_expires_at_idx" ON "verify_token"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_key" ON "staff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_staff_code_key" ON "staff"("staff_code");

-- CreateIndex
CREATE UNIQUE INDEX "staff_citizen_id_key" ON "staff"("citizen_id");

-- CreateIndex
CREATE INDEX "staff_employment_status_idx" ON "staff"("employment_status");

-- CreateIndex
CREATE INDEX "staff_employment_type_idx" ON "staff"("employment_type");

-- CreateIndex
CREATE INDEX "staff_join_date_idx" ON "staff"("join_date");

-- CreateIndex
CREATE UNIQUE INDEX "vet_user_id_key" ON "vet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vet_license_no_key" ON "vet"("license_no");

-- CreateIndex
CREATE UNIQUE INDEX "vet_citizen_id_key" ON "vet"("citizen_id");

-- CreateIndex
CREATE INDEX "vet_join_date_idx" ON "vet"("join_date");

-- CreateIndex
CREATE INDEX "vet_employment_status_idx" ON "vet"("employment_status");

-- CreateIndex
CREATE UNIQUE INDEX "owner_user_id_key" ON "owner"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "species_code_key" ON "species"("code");

-- CreateIndex
CREATE UNIQUE INDEX "species_name_key" ON "species"("name");

-- CreateIndex
CREATE INDEX "pet_species_id_idx" ON "pet"("species_id");

-- CreateIndex
CREATE INDEX "pet_owner_id_idx" ON "pet"("owner_id");

-- CreateIndex
CREATE INDEX "pet_is_deleted_idx" ON "pet"("is_deleted");

-- CreateIndex
CREATE INDEX "appointment_pet_id_idx" ON "appointment"("pet_id");

-- CreateIndex
CREATE INDEX "appointment_appointment_type_idx" ON "appointment"("appointment_type");

-- CreateIndex
CREATE INDEX "appointment_appointment_status_idx" ON "appointment"("appointment_status");

-- CreateIndex
CREATE INDEX "appointment_service_type_idx" ON "appointment"("service_type");

-- CreateIndex
CREATE INDEX "appointment_slot_id_idx" ON "appointment"("slot_id");

-- CreateIndex
CREATE INDEX "appointment_staff_id_idx" ON "appointment"("staff_id");

-- CreateIndex
CREATE INDEX "appointment_vet_id_idx" ON "appointment"("vet_id");

-- CreateIndex
CREATE UNIQUE INDEX "vaccine_code_key" ON "vaccine"("code");

-- CreateIndex
CREATE UNIQUE INDEX "vaccine_name_key" ON "vaccine"("name");

-- CreateIndex
CREATE INDEX "vaccine_species_id_idx" ON "vaccine"("species_id");

-- CreateIndex
CREATE INDEX "vaccine_name_idx" ON "vaccine"("name");

-- CreateIndex
CREATE INDEX "vaccine_brand_idx" ON "vaccine"("brand");

-- CreateIndex
CREATE INDEX "vaccine_status_idx" ON "vaccine"("status");

-- CreateIndex
CREATE INDEX "vaccine_is_deleted_idx" ON "vaccine"("is_deleted");

-- CreateIndex
CREATE INDEX "vaccine_lot_vaccine_id_idx" ON "vaccine_lot"("vaccine_id");

-- CreateIndex
CREATE INDEX "vaccine_lot_status_idx" ON "vaccine_lot"("status");

-- CreateIndex
CREATE INDEX "vaccine_lot_is_deleted_idx" ON "vaccine_lot"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "vaccine_plan_vaccination_record_id_key" ON "vaccine_plan"("vaccination_record_id");

-- CreateIndex
CREATE INDEX "vaccine_plan_pet_id_vaccine_id_dose_no_idx" ON "vaccine_plan"("pet_id", "vaccine_id", "dose_no");

-- CreateIndex
CREATE INDEX "vaccine_plan_pet_id_idx" ON "vaccine_plan"("pet_id");

-- CreateIndex
CREATE INDEX "vaccine_plan_status_idx" ON "vaccine_plan"("status");

-- CreateIndex
CREATE INDEX "vaccine_plan_due_date_idx" ON "vaccine_plan"("due_date");

-- CreateIndex
CREATE INDEX "vaccine_plan_is_deleted_idx" ON "vaccine_plan"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "microchip_batch_batch_no_key" ON "microchip_batch"("batch_no");

-- CreateIndex
CREATE UNIQUE INDEX "microchip_microchip_code_key" ON "microchip"("microchip_code");

-- CreateIndex
CREATE INDEX "microchip_batch_id_idx" ON "microchip"("batch_id");

-- CreateIndex
CREATE INDEX "microchip_status_idx" ON "microchip"("status");

-- CreateIndex
CREATE INDEX "microchip_pet_id_idx" ON "microchip"("pet_id");

-- CreateIndex
CREATE INDEX "microchip_is_deleted_idx" ON "microchip"("is_deleted");

-- CreateIndex
CREATE INDEX "microchip_record_appointment_id_idx" ON "microchip_record"("appointment_id");

-- CreateIndex
CREATE INDEX "microchip_record_vet_id_idx" ON "microchip_record"("vet_id");

-- CreateIndex
CREATE INDEX "microchip_record_pet_id_idx" ON "microchip_record"("pet_id");

-- CreateIndex
CREATE INDEX "microchip_record_microchip_item_id_idx" ON "microchip_record"("microchip_item_id");

-- CreateIndex
CREATE INDEX "microchip_record_microchip_code_idx" ON "microchip_record"("microchip_code");

-- CreateIndex
CREATE INDEX "microchip_record_source_type_idx" ON "microchip_record"("source_type");

-- CreateIndex
CREATE UNIQUE INDEX "health_cer_record_certificate_no_key" ON "health_cer_record"("certificate_no");

-- CreateIndex
CREATE INDEX "health_cer_record_appointment_id_idx" ON "health_cer_record"("appointment_id");

-- CreateIndex
CREATE INDEX "health_cer_record_issued_at_idx" ON "health_cer_record"("issued_at");

-- CreateIndex
CREATE INDEX "health_cer_record_valid_to_idx" ON "health_cer_record"("valid_to");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoice_code_key" ON "invoice"("invoice_code");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoice_no_key" ON "invoice"("invoice_no");

-- CreateIndex
CREATE INDEX "invoice_appointment_id_idx" ON "invoice"("appointment_id");

-- CreateIndex
CREATE INDEX "invoice_owner_id_idx" ON "invoice"("owner_id");

-- CreateIndex
CREATE INDEX "invoice_status_idx" ON "invoice"("status");

-- CreateIndex
CREATE INDEX "invoice_issued_at_idx" ON "invoice"("issued_at");

-- CreateIndex
CREATE INDEX "invoice_is_deleted_idx" ON "invoice"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_item_vaccination_record_id_key" ON "invoice_item"("vaccination_record_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_item_microchip_record_id_key" ON "invoice_item"("microchip_record_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_item_health_cer_record_id_key" ON "invoice_item"("health_cer_record_id");

-- CreateIndex
CREATE INDEX "invoice_item_invoice_id_idx" ON "invoice_item"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_item_item_type_idx" ON "invoice_item"("item_type");

-- CreateIndex
CREATE INDEX "invoice_item_is_deleted_idx" ON "invoice_item"("is_deleted");

-- CreateIndex
CREATE INDEX "payment_invoice_id_idx" ON "payment"("invoice_id");

-- CreateIndex
CREATE INDEX "payment_owner_id_idx" ON "payment"("owner_id");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE INDEX "payment_paid_at_idx" ON "payment"("paid_at");

-- CreateIndex
CREATE INDEX "payment_is_deleted_idx" ON "payment"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_code_key" ON "voucher"("code");

-- CreateIndex
CREATE INDEX "voucher_code_idx" ON "voucher"("code");

-- CreateIndex
CREATE INDEX "voucher_status_idx" ON "voucher"("status");

-- CreateIndex
CREATE INDEX "voucher_start_at_idx" ON "voucher"("start_at");

-- CreateIndex
CREATE INDEX "voucher_end_at_idx" ON "voucher"("end_at");

-- CreateIndex
CREATE INDEX "voucher_is_deleted_idx" ON "voucher"("is_deleted");

-- CreateIndex
CREATE INDEX "owner_voucher_owner_id_idx" ON "owner_voucher"("owner_id");

-- CreateIndex
CREATE INDEX "owner_voucher_voucher_id_idx" ON "owner_voucher"("voucher_id");

-- CreateIndex
CREATE INDEX "owner_voucher_status_idx" ON "owner_voucher"("status");

-- CreateIndex
CREATE INDEX "owner_voucher_assigned_at_idx" ON "owner_voucher"("assigned_at");

-- CreateIndex
CREATE INDEX "owner_voucher_invoice_id_idx" ON "owner_voucher"("invoice_id");

-- CreateIndex
CREATE INDEX "owner_voucher_is_deleted_idx" ON "owner_voucher"("is_deleted");

-- CreateIndex
CREATE INDEX "invoice_voucher_invoice_id_idx" ON "invoice_voucher"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_voucher_voucher_id_idx" ON "invoice_voucher"("voucher_id");

-- CreateIndex
CREATE INDEX "invoice_voucher_owner_voucher_id_idx" ON "invoice_voucher"("owner_voucher_id");

-- CreateIndex
CREATE INDEX "invoice_voucher_applied_at_idx" ON "invoice_voucher"("applied_at");

-- CreateIndex
CREATE INDEX "invoice_voucher_is_deleted_idx" ON "invoice_voucher"("is_deleted");

-- CreateIndex
CREATE INDEX "loyalty_point_owner_id_idx" ON "loyalty_point"("owner_id");

-- CreateIndex
CREATE INDEX "loyalty_point_invoice_id_idx" ON "loyalty_point"("invoice_id");

-- CreateIndex
CREATE INDEX "notification_user_id_idx" ON "notification"("user_id");

-- CreateIndex
CREATE INDEX "notification_type_idx" ON "notification"("type");

-- CreateIndex
CREATE INDEX "notification_is_read_idx" ON "notification"("is_read");

-- CreateIndex
CREATE INDEX "notification_scheduled_at_idx" ON "notification"("scheduled_at");

-- CreateIndex
CREATE INDEX "notification_sent_at_idx" ON "notification"("sent_at");

-- CreateIndex
CREATE INDEX "working_shift_vet_id_idx" ON "working_shift"("vet_id");

-- CreateIndex
CREATE INDEX "working_shift_vet_id_day_of_week_idx" ON "working_shift"("vet_id", "day_of_week");

-- CreateIndex
CREATE INDEX "working_shift_is_deleted_idx" ON "working_shift"("is_deleted");

-- CreateIndex
CREATE INDEX "appointment_slot_slot_date_idx" ON "appointment_slot"("slot_date");

-- CreateIndex
CREATE INDEX "appointment_slot_is_deleted_idx" ON "appointment_slot"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_slot_shift_id_slot_date_start_time_key" ON "appointment_slot"("shift_id", "slot_date", "start_time");

-- CreateIndex
CREATE INDEX "block_time_vet_id_idx" ON "block_time"("vet_id");

-- CreateIndex
CREATE INDEX "block_time_start_at_idx" ON "block_time"("start_at");

-- CreateIndex
CREATE INDEX "block_time_end_at_idx" ON "block_time"("end_at");

-- CreateIndex
CREATE INDEX "block_time_is_deleted_idx" ON "block_time"("is_deleted");

-- CreateIndex
CREATE INDEX "service_price_type_idx" ON "service_price"("type");

-- CreateIndex
CREATE INDEX "service_price_reference_id_idx" ON "service_price"("reference_id");

-- CreateIndex
CREATE INDEX "service_price_is_active_idx" ON "service_price"("is_active");

-- CreateIndex
CREATE INDEX "service_price_effective_from_idx" ON "service_price"("effective_from");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_replaced_by_token_id_fkey" FOREIGN KEY ("replaced_by_token_id") REFERENCES "refresh_token"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verify_token" ADD CONSTRAINT "verify_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vet" ADD CONSTRAINT "vet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner" ADD CONSTRAINT "owner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "appointment_slot"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vet"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine" ADD CONSTRAINT "vaccine_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine_lot" ADD CONSTRAINT "vaccine_lot_vaccine_id_fkey" FOREIGN KEY ("vaccine_id") REFERENCES "vaccine"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccination_record" ADD CONSTRAINT "vaccination_record_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccination_record" ADD CONSTRAINT "vaccination_record_vaccine_lot_id_fkey" FOREIGN KEY ("vaccine_lot_id") REFERENCES "vaccine_lot"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccination_record" ADD CONSTRAINT "vaccination_record_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine_plan" ADD CONSTRAINT "vaccine_plan_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine_plan" ADD CONSTRAINT "vaccine_plan_vaccine_id_fkey" FOREIGN KEY ("vaccine_id") REFERENCES "vaccine"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine_plan" ADD CONSTRAINT "vaccine_plan_vaccination_record_id_fkey" FOREIGN KEY ("vaccination_record_id") REFERENCES "vaccination_record"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "microchip" ADD CONSTRAINT "microchip_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "microchip_batch"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "microchip" ADD CONSTRAINT "microchip_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pet"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "microchip_record" ADD CONSTRAINT "microchip_record_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "microchip_record" ADD CONSTRAINT "microchip_record_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "microchip_record" ADD CONSTRAINT "microchip_record_microchip_item_id_fkey" FOREIGN KEY ("microchip_item_id") REFERENCES "microchip"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "microchip_record" ADD CONSTRAINT "microchip_record_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_cer_record" ADD CONSTRAINT "health_cer_record_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_cer_record" ADD CONSTRAINT "health_cer_record_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_cer_record" ADD CONSTRAINT "health_cer_record_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_vaccination_record_id_fkey" FOREIGN KEY ("vaccination_record_id") REFERENCES "vaccination_record"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_microchip_record_id_fkey" FOREIGN KEY ("microchip_record_id") REFERENCES "microchip_record"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_health_cer_record_id_fkey" FOREIGN KEY ("health_cer_record_id") REFERENCES "health_cer_record"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_voucher" ADD CONSTRAINT "owner_voucher_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_voucher" ADD CONSTRAINT "owner_voucher_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_voucher" ADD CONSTRAINT "owner_voucher_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_voucher" ADD CONSTRAINT "invoice_voucher_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_voucher" ADD CONSTRAINT "invoice_voucher_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_voucher" ADD CONSTRAINT "invoice_voucher_owner_voucher_id_fkey" FOREIGN KEY ("owner_voucher_id") REFERENCES "owner_voucher"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_point" ADD CONSTRAINT "loyalty_point_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_point" ADD CONSTRAINT "loyalty_point_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_shift" ADD CONSTRAINT "working_shift_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_slot" ADD CONSTRAINT "appointment_slot_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "working_shift"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_time" ADD CONSTRAINT "block_time_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vet"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
