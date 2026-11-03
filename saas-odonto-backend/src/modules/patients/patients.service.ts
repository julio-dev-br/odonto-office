import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: { name: string; cpf?: string; whatsapp?: string }) {
    return this.prisma.tenantClient.patient.create({
      data: {
        name: data.name,
        cpf: data.cpf,
        whatsapp: data.whatsapp,
      } as any,
    });
  }

  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.patient || client.Patient;

    return model.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findPaginated(query: { page?: number; limit?: number; search?: string; sort?: 'asc' | 'desc' }) {
    const client = this.prisma.tenantClient as any;
    const model = client.patient || client.Patient;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 8;
    const skip = (page - 1) * limit;
    const sortOrder = query.sort === 'desc' ? 'desc' : 'asc';

    const whereCondition = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { cpf: { contains: query.search } },
          ],
        }
      : {};

    const [items, totalItems] = await Promise.all([
      model.findMany({
        where: whereCondition,
        orderBy: { name: sortOrder },
        skip,
        take: limit,
      }),
      model.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
}
