import jwt from 'jsonwebtoken';
import { Prisma, UserStatus } from '@prisma/client';

import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import {
  compareValue,
  sha256,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/utils/crypto';
import { ErrorCode } from '@/utils/response';

const ACCESS_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;
const REFRESH_EXPIRES_IN_MS = 1000 * 60 * 60 * 24 * 30;
const EMAIL_CODE_TTL_MS = 1000 * 60 * 10;
const EMAIL_COOLDOWN_SECONDS = 60;

type GuestInput = {
  deviceId: string;
  installSource: 'appstore' | 'testflight' | 'unknown';
};

type AppleInput = {
  identityToken: string;
  authorizationCode: string;
  guestAccessToken: string | null;
};

type EmailRequestInput = {
  email: string;
};

type EmailVerifyInput = {
  email: string;
  code: string;
  guestAccessToken: string | null;
};

type RefreshInput = {
  refreshToken: string;
};

type LogoutInput = {
  refreshToken: string;
};

type EmailCodeRecord = {
  code: string;
  expiresAt: number;
  cooldownUntil: number;
};

const emailCodeStore = new Map<string, EmailCodeRecord>();

export class AuthService {
  async guest(input: GuestInput) {
    const existingIdentity = await prisma.authIdentity.findFirst({
      where: {
        provider: 'guest',
        providerUid: input.deviceId,
      },
      include: {
        user: true,
      },
    });

    const user =
      existingIdentity?.user ??
      (await prisma.user.create({
        data: {
          status: UserStatus.active,
          isGuest: true,
          authIdentities: {
            create: {
              provider: 'guest',
              providerUid: input.deviceId,
              isPrimary: true,
            },
          },
        },
      }));

    const tokens = await this.issueTokens(user.id, true, input.deviceId);

    return {
      user: this.formatUserPayload(user.id, true, user.nickname),
      tokens,
      isNewUser: existingIdentity === null,
    };
  }

  async apple(input: AppleInput) {
    const providerUid = this.parseAppleProviderUid(input.identityToken, input.authorizationCode);
    const guestUser = input.guestAccessToken
      ? await this.getGuestUserFromAccessToken(input.guestAccessToken)
      : null;

    const existingIdentity = await prisma.authIdentity.findFirst({
      where: {
        provider: 'apple',
        providerUid,
      },
      include: {
        user: true,
      },
    });

    if (existingIdentity) {
      let targetUser = existingIdentity.user;

      if (guestUser && guestUser.id !== targetUser.id) {
        targetUser = await prisma.$transaction((tx) =>
          this.mergeGuestIntoFormalUser(tx, guestUser.id, targetUser.id),
        );
      }

      const tokens = await this.issueTokens(targetUser.id, false, guestUser ? undefined : null);

      return {
        user: this.formatUserPayload(targetUser.id, false, targetUser.nickname),
        tokens,
        bindingResult: guestUser ? 'linked_guest' : 'logged_in',
      };
    }

    if (guestUser) {
      const updatedUser = await prisma.$transaction(async (tx) => {
        await tx.authIdentity.create({
          data: {
            userId: guestUser.id,
            provider: 'apple',
            providerUid,
            isPrimary: true,
            verifiedAt: new Date(),
          },
        });

        await tx.authIdentity.updateMany({
          where: {
            userId: guestUser.id,
            provider: 'guest',
          },
          data: {
            isPrimary: false,
          },
        });

        return tx.user.update({
          where: { id: guestUser.id },
          data: {
            isGuest: false,
            status: UserStatus.active,
            lastActiveAt: new Date(),
          },
        });
      });

      const tokens = await this.issueTokens(updatedUser.id, false, null);

      return {
        user: this.formatUserPayload(updatedUser.id, false, updatedUser.nickname),
        tokens,
        bindingResult: 'linked_guest',
      };
    }

    const createdUser = await prisma.user.create({
      data: {
        status: UserStatus.active,
        isGuest: false,
        lastActiveAt: new Date(),
        authIdentities: {
          create: {
            provider: 'apple',
            providerUid,
            isPrimary: true,
            verifiedAt: new Date(),
          },
        },
      },
    });

    const tokens = await this.issueTokens(createdUser.id, false, null);

    return {
      user: this.formatUserPayload(createdUser.id, false, createdUser.nickname),
      tokens,
      bindingResult: 'created_new',
    };
  }

  async requestEmailCode(input: EmailRequestInput) {
    const email = input.email.trim().toLowerCase();
    const now = Date.now();
    const existing = emailCodeStore.get(email);

    if (existing && existing.cooldownUntil > now) {
      return {
        cooldownSeconds: Math.ceil((existing.cooldownUntil - now) / 1000),
        sent: true,
      };
    }

    // [待联调] 第一版先生成并缓存验证码，后续接真实邮件服务。
    const code = this.generateEmailCode();
    emailCodeStore.set(email, {
      code,
      expiresAt: now + EMAIL_CODE_TTL_MS,
      cooldownUntil: now + EMAIL_COOLDOWN_SECONDS * 1000,
    });

    return {
      cooldownSeconds: EMAIL_COOLDOWN_SECONDS,
      sent: true,
    };
  }

  async verifyEmailCode(input: EmailVerifyInput) {
    const email = input.email.trim().toLowerCase();
    const stored = emailCodeStore.get(email);

    if (!stored || stored.expiresAt < Date.now() || stored.code !== input.code) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, '验证码无效或已过期', 400);
    }

    emailCodeStore.delete(email);

    const guestUser = input.guestAccessToken
      ? await this.getGuestUserFromAccessToken(input.guestAccessToken)
      : null;

    const existingIdentity = await prisma.authIdentity.findFirst({
      where: {
        provider: 'email',
        providerUid: email,
      },
      include: {
        user: true,
      },
    });

    if (existingIdentity) {
      let targetUser = existingIdentity.user;

      if (guestUser && guestUser.id !== targetUser.id) {
        targetUser = await prisma.$transaction((tx) =>
          this.mergeGuestIntoFormalUser(tx, guestUser.id, targetUser.id),
        );
      }

      const tokens = await this.issueTokens(targetUser.id, false, null);

      return {
        user: this.formatUserPayload(targetUser.id, false, targetUser.nickname),
        tokens,
        bindingResult: guestUser ? 'linked_guest' : 'logged_in',
      };
    }

    if (guestUser) {
      const updatedUser = await prisma.$transaction(async (tx) => {
        await tx.authIdentity.create({
          data: {
            userId: guestUser.id,
            provider: 'email',
            providerUid: email,
            email,
            isPrimary: true,
            verifiedAt: new Date(),
          },
        });

        await tx.authIdentity.updateMany({
          where: {
            userId: guestUser.id,
            provider: 'guest',
          },
          data: {
            isPrimary: false,
          },
        });

        return tx.user.update({
          where: { id: guestUser.id },
          data: {
            isGuest: false,
            status: UserStatus.active,
            lastActiveAt: new Date(),
          },
        });
      });

      const tokens = await this.issueTokens(updatedUser.id, false, null);

      return {
        user: this.formatUserPayload(updatedUser.id, false, updatedUser.nickname),
        tokens,
        bindingResult: 'linked_guest',
      };
    }

    const createdUser = await prisma.user.create({
      data: {
        status: UserStatus.active,
        isGuest: false,
        lastActiveAt: new Date(),
        authIdentities: {
          create: {
            provider: 'email',
            providerUid: email,
            email,
            isPrimary: true,
            verifiedAt: new Date(),
          },
        },
      },
    });

    const tokens = await this.issueTokens(createdUser.id, false, null);

    return {
      user: this.formatUserPayload(createdUser.id, false, createdUser.nickname),
      tokens,
      bindingResult: 'created_new',
    };
  }

  async refresh(input: RefreshInput) {
    const payload = this.verifyRefresh(input.refreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        tokenHash: sha256(input.refreshToken),
      },
      include: {
        user: true,
      },
    });

    if (
      !storedToken ||
      storedToken.userId !== payload.sub ||
      storedToken.revokedAt !== null ||
      storedToken.expiresAt <= new Date()
    ) {
      throw new AppError(ErrorCode.TOKEN_EXPIRED, '登录已过期', 401);
    }

    if (storedToken.user.status !== UserStatus.active) {
      throw new AppError(ErrorCode.UNAUTHORIZED, '未登录或票据无效', 401);
    }

    return {
      accessToken: signAccessToken({
        sub: storedToken.userId,
        isGuest: storedToken.user.isGuest,
      }),
      expiresIn: ACCESS_EXPIRES_IN_SECONDS,
    };
  }

  async logout(userId: string, input: LogoutInput) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        tokenHash: sha256(input.refreshToken),
      },
    });

    if (!storedToken || storedToken.userId !== userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, '未登录或票据无效', 401);
    }

    await prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  }

  private async issueTokens(userId: string, isGuest: boolean, deviceId: string | null | undefined) {
    const accessToken = signAccessToken({
      sub: userId,
      isGuest,
    });

    const refreshToken = signRefreshToken(userId);

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: sha256(refreshToken),
        deviceId: deviceId ?? null,
        expiresAt: new Date(Date.now() + REFRESH_EXPIRES_IN_MS),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_EXPIRES_IN_SECONDS,
    };
  }

  private verifyRefresh(refreshToken: string) {
    try {
      return verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(ErrorCode.TOKEN_EXPIRED, '登录已过期', 401);
    }
  }

  private async getGuestUserFromAccessToken(guestAccessToken: string) {
    try {
      const payload = verifyAccessToken(guestAccessToken);

      if (!payload.isGuest) {
        throw new AppError(ErrorCode.BINDING_CONFLICT, '绑定冲突', 409);
      }

      const guestUser = await prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!guestUser || !guestUser.isGuest || guestUser.status !== UserStatus.active) {
        throw new AppError(ErrorCode.UNAUTHORIZED, '未登录或票据无效', 401);
      }

      return guestUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(ErrorCode.TOKEN_EXPIRED, '登录已过期', 401);
    }
  }

  private parseAppleProviderUid(identityToken: string, authorizationCode: string) {
    const decoded = jwt.decode(identityToken);

    if (decoded && typeof decoded === 'object' && typeof decoded.sub === 'string') {
      return decoded.sub;
    }

    if (identityToken.trim().length >= 16) {
      return `apple_${sha256(identityToken)}`;
    }

    if (authorizationCode.trim().length < 8) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Apple 凭证无效', 401);
    }

    return `apple_${sha256(authorizationCode)}`;
  }

  private async mergeGuestIntoFormalUser(
    tx: Prisma.TransactionClient,
    guestUserId: string,
    targetUserId: string,
  ) {
    const [guestUser, targetUser, guestRoleStates, guestMemoryCards] = await Promise.all([
      tx.user.findUnique({
        where: { id: guestUserId },
      }),
      tx.user.findUnique({
        where: { id: targetUserId },
      }),
      tx.userRoleState.findMany({
        where: {
          userId: guestUserId,
        },
      }),
      tx.memoryCard.findMany({
        where: {
          userId: guestUserId,
        },
      }),
    ]);

    if (!guestUser || !targetUser) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    for (const state of guestRoleStates) {
      const existingState = await tx.userRoleState.findFirst({
        where: {
          userId: targetUserId,
          roleId: state.roleId,
        },
      });

      if (!existingState) {
        await tx.userRoleState.create({
          data: {
            userId: targetUserId,
            roleId: state.roleId,
            relationshipStage: state.relationshipStage,
            affinityScore: state.affinityScore,
            lastTopic: state.lastTopic,
            lastComfortStyle: state.lastComfortStyle,
            lastInteractedAt: state.lastInteractedAt,
            memoryVersion: state.memoryVersion,
          },
        });
      }
    }

    for (const memoryCard of guestMemoryCards) {
      const existingCard = await tx.memoryCard.findFirst({
        where: {
          userId: targetUserId,
          roleId: memoryCard.roleId,
          memoryKey: memoryCard.memoryKey,
        },
      });

      if (!existingCard) {
        await tx.memoryCard.create({
          data: {
            userId: targetUserId,
            roleId: memoryCard.roleId,
            memoryType: memoryCard.memoryType,
            memoryKey: memoryCard.memoryKey,
            memoryValue: memoryCard.memoryValue,
            sourceConversationId: memoryCard.sourceConversationId,
            consentScope: memoryCard.consentScope,
            confidenceScore: memoryCard.confidenceScore,
            isActive: memoryCard.isActive,
            expiredAt: memoryCard.expiredAt,
          },
        });
      }
    }

    await Promise.all([
      tx.conversation.updateMany({
        where: {
          userId: guestUserId,
        },
        data: {
          userId: targetUserId,
        },
      }),
      tx.safetyEvent.updateMany({
        where: {
          userId: guestUserId,
        },
        data: {
          userId: targetUserId,
        },
      }),
      tx.authIdentity.updateMany({
        where: {
          userId: guestUserId,
          provider: 'guest',
        },
        data: {
          userId: targetUserId,
          isPrimary: false,
        },
      }),
      tx.refreshToken.updateMany({
        where: {
          userId: guestUserId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
      tx.userRoleState.deleteMany({
        where: {
          userId: guestUserId,
        },
      }),
      tx.memoryCard.deleteMany({
        where: {
          userId: guestUserId,
        },
      }),
    ]);

    await tx.user.update({
      where: {
        id: guestUserId,
      },
      data: {
        status: UserStatus.deleted,
        deletedAt: new Date(),
      },
    });

    return tx.user.update({
      where: {
        id: targetUserId,
      },
      data: {
        lastActiveAt: new Date(),
        defaultRoleId: targetUser.defaultRoleId ?? guestUser.defaultRoleId,
      },
    });
  }

  private formatUserPayload(id: string, isGuest: boolean, nickname: string | null) {
    return {
      id,
      isGuest,
      nickname,
    };
  }

  private generateEmailCode() {
    return `${Math.floor(100000 + Math.random() * 900000)}`;
  }
}
