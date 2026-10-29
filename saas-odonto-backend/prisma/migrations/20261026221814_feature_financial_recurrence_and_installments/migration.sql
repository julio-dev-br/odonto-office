-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "financial_transactions" ADD COLUMN     "category" VARCHAR(50) NOT NULL DEFAULT 'outros',
ADD COLUMN     "installment" INTEGER DEFAULT 1,
ADD COLUMN     "recurrence_id" BIGINT,
ADD COLUMN     "total_installments" INTEGER DEFAULT 1,
ADD COLUMN     "treatment_id" BIGINT;

-- CreateTable
CREATE TABLE "financial_recurrences" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "frequency" VARCHAR(30) NOT NULL DEFAULT 'monthly',
    "day_of_month" INTEGER NOT NULL DEFAULT 5,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_recurrences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_recurrence_id_fkey" FOREIGN KEY ("recurrence_id") REFERENCES "financial_recurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_recurrences" ADD CONSTRAINT "financial_recurrences_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
