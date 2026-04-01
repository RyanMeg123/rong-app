import { RoleStatus } from '@prisma/client';

import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { ErrorCode } from '@/utils/response';

type RoleSelectionInput = {
  roleId: string;
};

type UpdateCurrentInput = {
  nickname: string | null;
  avatarUrl: string | null;
};

export class MeService {
  async getCurrent(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nickname: true,
        avatarUrl: true,
        isGuest: true,
        defaultRoleId: true,
        authIdentities: {
          where: {
            provider: {
              in: ['apple', 'email'],
            },
          },
          select: {
            provider: true,
          },
          distinct: ['provider'],
        },
      },
    });

    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    const [defaultRole, relationshipSummary] = user.defaultRoleId
      ? await Promise.all([
          prisma.role.findUnique({
            where: {
              id: user.defaultRoleId,
            },
            select: {
              id: true,
              name: true,
            },
          }),
          prisma.userRoleState.findFirst({
            where: {
              userId,
              roleId: user.defaultRoleId,
            },
            select: {
              relationshipStage: true,
              lastTopic: true,
            },
          }),
        ])
      : [null, null];

    return {
      id: user.id,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      isGuest: user.isGuest,
      bindings: user.authIdentities.map((identity) => identity.provider),
      defaultRole: defaultRole
        ? {
            id: defaultRole.id,
            name: defaultRole.name,
          }
        : null,
      relationshipSummary: relationshipSummary
        ? {
            stage: relationshipSummary.relationshipStage,
            lastTopic: relationshipSummary.lastTopic,
          }
        : null,
    };
  }

  async updateCurrent(userId: string, input: UpdateCurrentInput) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname: input.nickname,
        avatarUrl: input.avatarUrl,
        lastActiveAt: new Date(),
      },
    });

    return this.getCurrent(userId);
  }

  async deleteCurrent(userId: string) {
    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      await tx.memoryCard.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
          expiredAt: new Date(),
        },
      });

      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          status: 'deleted',
          deletedAt: new Date(),
        },
      });
    });

    return {
      success: true,
      cleanupStatus: 'scheduled',
    };
  }

  async selectRole(userId: string, input: RoleSelectionInput) {
    const role = await prisma.role.findFirst({
      where: {
        id: input.roleId,
        status: RoleStatus.active,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!role) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    const roleState = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          defaultRoleId: role.id,
          lastActiveAt: new Date(),
        },
      });

      const existingState = await tx.userRoleState.findFirst({
        where: {
          userId,
          roleId: role.id,
        },
      });

      if (existingState) {
        return tx.userRoleState.update({
          where: {
            id: existingState.id,
          },
          data: {
            lastInteractedAt: existingState.lastInteractedAt ?? new Date(),
          },
        });
      }

      return tx.userRoleState.create({
        data: {
          userId,
          roleId: role.id,
          relationshipStage: 'new',
          affinityScore: 0,
          lastInteractedAt: new Date(),
          memoryVersion: 1,
        },
      });
    });

    return {
      role: {
        id: role.id,
        name: role.name,
      },
      relationshipState: {
        stage: roleState.relationshipStage,
        affinityScore: roleState.affinityScore,
      },
    };
  }

  async getRoleState(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        defaultRoleId: true,
      },
    });

    if (!user?.defaultRoleId) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    const roleState = await prisma.userRoleState.findFirst({
      where: {
        userId,
        roleId: user.defaultRoleId,
      },
      select: {
        roleId: true,
        relationshipStage: true,
        affinityScore: true,
        lastTopic: true,
        lastComfortStyle: true,
      },
    });

    if (!roleState) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    return {
      roleId: roleState.roleId,
      relationshipStage: roleState.relationshipStage,
      affinityScore: roleState.affinityScore,
      lastTopic: roleState.lastTopic,
      lastComfortStyle: roleState.lastComfortStyle,
    };
  }
}
