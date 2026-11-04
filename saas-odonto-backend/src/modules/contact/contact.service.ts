import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateContactDto, ipAddress: string) {
    // 🛡️ CAMADA 2 DE SEGURANÇA (Honeypot)
    // Se o bot preencheu o campo invisível 'website', nós fingimos que deu certo
    // mas não salvamos nada no banco. Assim o bot não percebe que foi bloqueado.
    if (data.website) {
      return { message: 'Mensagem enviada com sucesso!' };
    }

    try {
      // Salva a mensagem no banco de dados global
      await this.prisma.contactMessage.create({
        data: {
          name: data.name,
          email: data.email,
          message: data.message,
          ipAddress: ipAddress, // Salvamos o IP para auditoria
        },
      });

      return { message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' };
    } catch (error) {
      console.error('Erro ao salvar mensagem de contato:', error);
      throw new InternalServerErrorException('Erro ao processar o envio da mensagem.');
    }
  }
}