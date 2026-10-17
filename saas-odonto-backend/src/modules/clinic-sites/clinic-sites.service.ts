import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { UpdateClinicSiteDto } from './dto/update-clinic-site.dto';

@Injectable()
export class ClinicSitesService {
  constructor(private readonly prisma: PrismaService) {}

  // PRIVADO: Atualiza as configurações visuais da clínica logada (via Token)
  async update(body: UpdateClinicSiteDto) {
    const client = this.prisma.tenantClient as any;
    const model = client.clinicSite || client.ClinicSite;

    // Busca o primeiro registro do site (toda clínica tem apenas 1 esqueleto criado no Self-Register)
    const currentSite = await model.findFirst();
    if (!currentSite) {
      throw new NotFoundException('Clinic site settings not found for this tenant.');
    }

    return model.update({
      where: { id: currentSite.id },
      data: body,
    });
  }

  // Puxa o conteúdo e o branding do site usando apenas o SLUG da URL (Sem Token!)
  async getPublicLandingPage(slug: string) {
    // Como é público e não tem token na requisição, usamos o prisma bruto sem o tenantClient
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        clinicSites: true, // Traz as cores e os textos do site
      },
    });

    if (!tenant || tenant.status !== 'active') {
      throw new NotFoundException('The requested clinic site does not exist or is inactive.');
    }

    const siteSettings = tenant.clinicSites[0];
    if (!siteSettings) {
      throw new NotFoundException('Branding configurations not deployed for this clinic.');
    }

    // Retorna a estrutura limpa para o front-end injetar o rascunho visual na tela
    return {
      clinicId: tenant.id.toString(),
      clinicName: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan,
      site: {
        id: siteSettings.id.toString(),
        title: siteSettings.title,
        description: siteSettings.description,
        logo: siteSettings.logo,
        phone: siteSettings.phone,
        whatsapp: siteSettings.whatsapp,
        primaryColor: siteSettings.primaryColor,
        accentColor: siteSettings.accentColor,
        backgroundColor: siteSettings.backgroundColor,
        theme: siteSettings.theme,
      },
    };
  }

    async updateSettings(body: any) {
    const client = this.prisma.tenantClient as any;
    
    // Resolve o nome do modelo estendido dinamicamente (Prisma 7)
    const model = client.clinicSite || client.ClinicSite;

    // Como o tenantClient já isola a query por clínica, trazemos as configurações dela
    const site = await model.findFirst();

    if (!site) {
      throw new NotFoundException('Clinic site settings not found for this tenant.');
    }

    // Faz a atualização atômica das propriedades visuais e dados de contato
    return model.update({
      where: { id: site.id },
      data: {
        title: body.title,
        description: body.description,
        logo: body.logo,
        phone: body.phone,
        whatsapp: body.whatsapp,
        primaryColor: body.primaryColor,
        accentColor: body.accentColor,
        backgroundColor: body.backgroundColor,
        theme: body.theme,
      },
    });
  }

    async findBySlug(slug: string) {
    // Usamos o 'this.prisma' bruto (sem o tenantClient) porque visitantes não possuem token JWT de login
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        clinicSites: true, // Inclui as configurações de landing page atreladas à clínica
      },
    });

    // Se a clínica não existir ou não tiver um site configurado, barra na hora
    if (!tenant || !tenant.clinicSites || (tenant.clinicSites as any).length === 0) {
      throw new NotFoundException(`Clinic with slug '${slug}' or its landing page was not found.`);
    }

    // Como o relacionamento devolve um array ou objeto dependendo do mapeamento, pegamos o primeiro item
    const site = Array.isArray(tenant.clinicSites) ? tenant.clinicSites[0] : (tenant.clinicSites as any);

    if (!site) {
      throw new NotFoundException(`Landing page config for slug '${slug}' is missing.`);
    }

    // Devolvemos o payload estruturado impecável com a nossa paleta premium para o front-end desenhar a tela!
    return {
      clinicName: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan,
      settings: {
        id: site.id.toString(),
        title: site.title,
        description: site.description,
        logo: site.logo,
        phone: site.phone,
        whatsapp: site.whatsapp,
        branding: {
          primaryColor: site.primaryColor,       // #0F172A (Deep Obsidian)
          accentColor: site.accentColor,         // #10B981 (Mint Clean)
          backgroundColor: site.backgroundColor, // #F8FAFC (Soft Platinum)
          theme: site.theme,                     // light ou dark
        },
      },
    };
  }
}
