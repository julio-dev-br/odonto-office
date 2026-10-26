import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { UpdateClinicSiteDto } from './dto/update-clinic-site.dto';

@Injectable()
export class ClinicSitesService {
  constructor(private readonly prisma: PrismaService) {}


  async update(body: UpdateClinicSiteDto) {
    const client = this.prisma.tenantClient as any;
    const model = client.clinicSite || client.ClinicSite;

   
    const currentSite = await model.findFirst();
    if (!currentSite) {
      throw new NotFoundException('Clinic site settings not found for this tenant.');
    }

    return model.update({
      where: { id: currentSite.id },
      data: body,
    });
  }


  async getPublicLandingPage(slug: string) {

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        clinicSites: true, 
      },
    });

    if (!tenant || tenant.status !== 'active') {
      throw new NotFoundException('The requested clinic site does not exist or is inactive.');
    }

    const siteSettings = tenant.clinicSites[0];
    if (!siteSettings) {
      throw new NotFoundException('Branding configurations not deployed for this clinic.');
    }

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

    const model = client.clinicSite || client.ClinicSite;

    const site = await model.findFirst();

    if (!site) {
      throw new NotFoundException('Clinic site settings not found for this tenant.');
    }

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
    
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        clinicSites: true, 
      },
    });

    if (!tenant || !tenant.clinicSites || (tenant.clinicSites as any).length === 0) {
      throw new NotFoundException(`Clinic with slug '${slug}' or its landing page was not found.`);
    }

    const site = Array.isArray(tenant.clinicSites) ? tenant.clinicSites[0] : (tenant.clinicSites as any);

    if (!site) {
      throw new NotFoundException(`Landing page config for slug '${slug}' is missing.`);
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
          primaryColor: site.primaryColor,       // #0F172A (Deep Obsidian)
          accentColor: site.accentColor,         // #10B981 (Mint Clean)
          backgroundColor: site.backgroundColor, // #F8FAFC (Soft Platinum)
          theme: site.theme,                     // light ou dark
        },
      },
    };
  }
}
