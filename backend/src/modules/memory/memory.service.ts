import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { ErrorCode } from '@/utils/response';

type MemoryUpsertInput = {
  memoryType: string;
  memoryKey: string;
  memoryValue: string;
  consentScope: string;
};

export class MemoryService {
  async list(userId: string) {
    const items = await prisma.memoryCard.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        memoryType: true,
        memoryValue: true,
        updatedAt: true,
      },
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        type: item.memoryType,
        value: item.memoryValue,
        updatedAt: item.updatedAt.toISOString(),
      })),
    };
  }

  async upsert(userId: string, input: MemoryUpsertInput) {
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

    const trimmedValue = input.memoryValue.trim();
    if (trimmedValue.length > 200) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, '记忆内容过长', 400);
    }

    const memoryCard = await prisma.memoryCard.upsert({
      where: {
        userId_roleId_memoryKey: {
          userId,
          roleId: user.defaultRoleId,
          memoryKey: input.memoryKey,
        },
      },
      update: {
        memoryType: input.memoryType,
        memoryValue: trimmedValue,
        consentScope: input.consentScope,
        isActive: true,
        expiredAt: null,
      },
      create: {
        userId,
        roleId: user.defaultRoleId,
        memoryType: input.memoryType,
        memoryKey: input.memoryKey,
        memoryValue: trimmedValue,
        consentScope: input.consentScope,
      },
      select: {
        id: true,
        memoryType: true,
        memoryValue: true,
        updatedAt: true,
      },
    });

    return {
      id: memoryCard.id,
      type: memoryCard.memoryType,
      value: memoryCard.memoryValue,
      updatedAt: memoryCard.updatedAt.toISOString(),
    };
  }

  async remove(userId: string, memoryCardId: string) {
    const memoryCard = await prisma.memoryCard.findFirst({
      where: {
        id: memoryCardId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!memoryCard) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    await prisma.memoryCard.update({
      where: {
        id: memoryCard.id,
      },
      data: {
        isActive: false,
        expiredAt: new Date(),
      },
    });

    return {
      success: true,
    };
  }
}
