import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module';
// Importa o interceptor que resolve o problema de serialização de números gigantes do banco
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Ativa o transformador global. Toda rota que retornar BigInt agora entregará String ao front-end
  app.useGlobalInterceptors(new BigIntInterceptor());

  // Configuração da Documentação Oficial do seu SaaS Odontológico
  const config = new DocumentBuilder()
    .setTitle('SaaS Odonto API')
    .setDescription('Esqueleto Core e Endpoints do Ecossistema Multi-Tenant')
    .setVersion('1.0.0')
    .addBearerAuth() // Prepara o Swagger para aceitar Tokens JWT (Bearer)
    .addGlobalParameters({
      name: 'X-Tenant-ID',
      in: 'header',
      required: false,
      description: 'ID da clínica para isolamento Multi-Tenant nas rotas sem login',
      schema: { type: 'string' },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
