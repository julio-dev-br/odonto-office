import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  // 🛡️ VACINA SUPREMA: Ensina o JSON global do JavaScript a converter BigInt para texto!
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  // 🚀 Passa o ObserveInstrument para o NestFactory
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Ativa o CORS com passe livre total para o seu projeto React!
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos que não estão no DTO
    forbidNonWhitelisted: true, // Dá erro se enviarem campos a mais
    transform: true, // Transforma os tipos automaticamente (ex: string para number)
  }));


  // Configuração do Swagger Premium
  const config = new DocumentBuilder()
    .setTitle('OdontoOffice API — Enterprise SaaS Core')
    .setDescription('Multi-Tenant Dentistry Architecture with Relational Core and Automated Financial Triggers.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 Backend OdontoOffice de pé na porta 3000');
  console.log('📄 Documentação Swagger ativa em: http://localhost:3000/api/docs');
}
bootstrap();

