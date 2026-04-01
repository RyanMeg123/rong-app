import { RoleStatus } from '@prisma/client';

import { prisma } from '@/config/database';

export class RolesService {
  async list(_userId: string) {
    const roles = await prisma.role.findMany({
      where: {
        status: RoleStatus.active,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      select: {
        id: true,
        code: true,
        name: true,
        subtitle: true,
        personaSummary: true,
      },
    });

    return roles.map((role) => ({
      id: role.id,
      code: role.code,
      name: role.name,
      subtitle: role.subtitle,
      personaSummary: role.personaSummary,
    }));
  }
}
