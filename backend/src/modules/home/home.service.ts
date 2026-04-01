import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { ErrorCode } from '@/utils/response';

export class HomeService {
  async get(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        nickname: true,
        defaultRoleId: true,
      },
    });

    if (!user?.defaultRoleId) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    const [role, roleState] = await Promise.all([
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
    ]);

    if (!role || !roleState) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    return {
      greeting: this.buildGreeting(user.nickname, role.name),
      role: {
        id: role.id,
        name: role.name,
      },
      quickActions: ['chat', 'breathing', 'journal'],
      relationshipSummary: {
        stage: roleState.relationshipStage,
        lastTopic: roleState.lastTopic,
      },
    };
  }

  private buildGreeting(nickname: string | null, roleName: string) {
    if (nickname) {
      return `${nickname}，${roleName} 在这里，想先轻轻说一点什么吗？`;
    }

    return `${roleName} 在这里，想先轻轻说一点什么吗？`;
  }
}
