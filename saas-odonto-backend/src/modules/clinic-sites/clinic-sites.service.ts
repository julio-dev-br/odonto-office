import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { UpdateClinicSiteDto } from './dto/update-clinic-site.dto';

@Injectable()
export class ClinicSitesService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // ROTAS PARA O DASHBOARD (Requer Tenant Logado)
  // ==========================================

  // 1. Busca os dados do site da clínica logada (Para preencher a tela)
  async getMySite() {
    const client = this.prisma.tenantClient as any;
    const model = client.clinicSite || client.ClinicSite;

    const currentSite = await model.findFirst();
    if (!currentSite) {
      throw new NotFoundException('Configurações do site não encontradas.');
    }

    return {
      ...currentSite,
      id: currentSite.id.toString(),
      tenantId: currentSite.tenantId.toString(),
    };
  }

  // 2. Atualiza as configurações do site
  async updateSettings(body: UpdateClinicSiteDto) {
    const client = this.prisma.tenantClient as any;
    const model = client.clinicSite || client.ClinicSite;

    const currentSite = await model.findFirst();
    if (!currentSite) {
      throw new NotFoundException('Configurações do site não encontradas.');
    }

    const updated = await model.update({
      where: { id: currentSite.id },
      data: body,
    });

    return {
      ...updated,
      id: updated.id.toString(),
      tenantId: updated.tenantId.toString(),
    };
  }

  // 3. Publica ou Despublica o site
  async togglePublish(isPublished: boolean) {
    const client = this.prisma.tenantClient as any;
    const model = client.clinicSite || client.ClinicSite;

    const currentSite = await model.findFirst();
    if (!currentSite) {
      throw new NotFoundException('Configurações do site não encontradas.');
    }

    const updated = await model.update({
      where: { id: currentSite.id },
      data: {
        isPublished: isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return {
      message: isPublished ? 'Site publicado com sucesso!' : 'Site desativado com sucesso!',
      isPublished: updated.isPublished,
      publishedAt: updated.publishedAt,
    };
  }

  // ==========================================
  // ROTA PÚBLICA (Para o subdomínio no futuro)
  // ==========================================

  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        clinicSites: true, 
      },
    });

    if (!tenant || !tenant.clinicSites || (tenant.clinicSites as any).length === 0) {
      throw new NotFoundException(`Clínica com o slug '${slug}' ou sua página não foi encontrada.`);
    }

    const site = Array.isArray(tenant.clinicSites) ? tenant.clinicSites[0] : (tenant.clinicSites as any);

    // 🚀 AQUI ESTÁ A NOVA REGRA: Se não estiver publicado, não deixa ver!
    if (!site.isPublished) {
      // Você pode retornar um erro específico ou um objeto indicando que está em manutenção
      throw new NotFoundException('Este site está em manutenção ou ainda não foi publicado.');
    }

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
          primaryColor: site.primaryColor,
          accentColor: site.accentColor,
          backgroundColor: site.backgroundColor,
          theme: site.theme,
        },
      },
    };
  }
}