import { Controller, Post, Body, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contato Público')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Envia uma mensagem de contato a partir da Landing Page' })
  // 🛡️ SEGURANÇA EXTRA: Limita a 3 tentativas por minuto por IP. 
  // Se um bot tentar spammar, ele recebe erro 429 (Too Many Requests).
  @Throttle({ default: { limit: 3, ttl: 60000 } }) 
  async create(
    @Body() body: CreateContactDto,
    @Ip() ip: string, // 🚀 Captura o IP real do visitante (funciona atrás de proxies se configurado no main.ts)
  ) {
    return this.contactService.create(body, ip);
  }
}