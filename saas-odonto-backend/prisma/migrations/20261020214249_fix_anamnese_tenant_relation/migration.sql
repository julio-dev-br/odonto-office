-- AddForeignKey
ALTER TABLE "anamnese" ADD CONSTRAINT "anamnese_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
