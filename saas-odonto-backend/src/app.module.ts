import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

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
import { ContactModule } from './modules/contact/contact.module';
import { AdminModule } from './modules/admin/admin.module';
import { SchedulesModule } from './modules/schedules/schedules.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
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
    UsersModule,
    ContactModule,
    AdminModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
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
        'auth/tenant-register',
        'tenants/register',
        'clinic-sites/public/(.*)',
        'contact',
        'admin/(.*)',
        'api/docs',
      )
      .forRoutes('*');
  }
}
