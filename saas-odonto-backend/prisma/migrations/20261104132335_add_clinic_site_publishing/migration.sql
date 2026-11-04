/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id]` on the table `clinic_sites` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "clinic_sites" ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "published_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "clinic_sites_tenant_id_key" ON "clinic_sites"("tenant_id");
