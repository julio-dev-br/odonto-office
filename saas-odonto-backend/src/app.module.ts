import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importações do ecossistema Multi-Tenant
import { TenantMiddleware } from './common/tenant/tenant.middleware';
import { PrismaService } from './core/database/prisma.service';
import { PatientsModule } from './modules/patients/patients.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { FinancialTransactionsModule } from './modules/financial-transactions/financial-transactions.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ClinicSitesModule } from './modules/clinic-sites/clinic-sites.module';
import { DentalProceduresModule } from './modules/dental-procedures/dental-procedures.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { AnamneseModule } from './modules/anamnese/anamnese.module';
import { UsersModule } from './modules/users/users.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Mantém o monitoramento do NestJS Observe intacto
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'saas-odonto-backend',
    }),
    PatientsModule,
    AuthModule,
    AppointmentsModule,
    FinancialTransactionsModule,
    MedicalRecordsModule,
    TenantsModule,
    ClinicSitesModule,
    DentalProceduresModule,
    ProfessionalsModule,
    AnamneseModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService, 
  ],
})
export class AppModule implements NestModule {
  // Configura a esteira que intercepta as requisições para extrair a clínica (Tenant)
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        'auth/login',
        'auth/register',
        'tenants/register', 
        'clinic-sites/public/(.*)',
        'api/docs'         
      )
      .forRoutes('*'); 
  }
}
