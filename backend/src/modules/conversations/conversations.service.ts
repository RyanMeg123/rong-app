import {
  ConversationStatus,
  Prisma,
  RiskLevel,
  RoleStatus,
  SafetyDecision,
  SenderType,
} from '@prisma/client';

import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { parsePagination } from '@/utils/pagination';
import { ErrorCode } from '@/utils/response';

const MESSAGE_RETENTION_DAYS = 30;

type ConversationSwitchInput = {
  roleId: string;
  conversationId: string | null;
};

type ConversationQueryInput = {
  page?: number;
  pageSize?: number;
};

type ConversationMessageInput = {
  content: string;
};

export class ConversationsService {
  async createOrSwitch(userId: string, input: ConversationSwitchInput) {
    await this.ensureActiveRole(input.roleId);

    if (input.conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: input.conversationId,
          userId,
        },
      });

      if (!conversation) {
        throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
      }

      if (conversation.roleId !== input.roleId) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, '会话与角色不匹配', 400);
      }

      const updated = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          status: ConversationStatus.active,
          updatedAt: new Date(),
        },
      });

      return {
        conversationId: updated.id,
        status: updated.status,
      };
    }

    const created = await prisma.conversation.create({
      data: {
        userId,
        roleId: input.roleId,
        status: ConversationStatus.active,
        startedAt: new Date(),
      },
    });

    return {
      conversationId: created.id,
      status: created.status,
    };
  }

  async getCurrent(userId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        userId,
        status: ConversationStatus.active,
      },
      orderBy: [
        { lastMessageAt: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    if (!conversation) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    return {
      conversationId: conversation.id,
      roleId: conversation.roleId,
      status: conversation.status,
      messageCount: conversation.messageCount,
    };
  }

  async listMessages(userId: string, conversationId: string, query: ConversationQueryInput) {
    const conversation = await this.ensureConversationOwner(userId, conversationId);
    const { page, pageSize, skip } = parsePagination(query);

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize + 1,
      select: {
        id: true,
        senderType: true,
        content: true,
        createdAt: true,
      },
    });

    const hasMore = messages.length > pageSize;
    const items = (hasMore ? messages.slice(0, pageSize) : messages).reverse();

    return {
      items: items.map((message) => ({
        id: message.id,
        senderType: message.senderType,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      })),
      hasMore,
    };
  }

  async sendMessage(userId: string, conversationId: string, input: ConversationMessageInput) {
    const conversation = await this.ensureConversationOwner(userId, conversationId);
    const roleState = await this.getConversationRoleState(userId, conversation.roleId);
    const riskDecision = this.analyzeRisk(input.content);

    if (riskDecision.decision === 'block') {
      await prisma.safetyEvent.create({
        data: {
          userId,
          conversationId: conversation.id,
          riskType: riskDecision.riskType,
          riskLevel: riskDecision.riskLevel,
          decision: SafetyDecision.block,
          handlerVersion: 'v1',
        },
      });

      throw new AppError(ErrorCode.FORBIDDEN, '当前内容无法处理，请换一种说法', 403);
    }

    const startedAt = Date.now();
    const assistantPlan = this.buildAssistantReply({
      content: input.content,
      roleName: roleState.roleName,
      riskDecision,
      lastTopic: roleState.lastTopic,
    });

    const persisted = await prisma.$transaction(async (tx) => {
      const userMessage = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderType: SenderType.user,
          content: input.content,
          contentSummary: input.content.slice(0, 100),
          riskLevel: riskDecision.riskLevel,
          expiresAt: this.messageExpiryDate(),
        },
      });

      const assistantMessage = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderType: SenderType.assistant,
          content: assistantPlan.content,
          contentSummary: assistantPlan.content.slice(0, 100),
          riskLevel: riskDecision.riskLevel,
          modelLatencyMs: Date.now() - startedAt,
          expiresAt: this.messageExpiryDate(),
        },
      });

      const updatedConversation = await tx.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          status: ConversationStatus.active,
          messageCount: {
            increment: 2,
          },
          lastMessageAt: new Date(),
        },
      });

      let memoryWritten = false;
      const memoryDraft = this.buildMemoryDraft(input.content, conversation.id, conversation.roleId);
      if (memoryDraft) {
        await tx.memoryCard.upsert({
          where: {
            userId_roleId_memoryKey: {
              userId,
              roleId: conversation.roleId,
              memoryKey: memoryDraft.memoryKey,
            },
          },
          update: {
            memoryValue: memoryDraft.memoryValue,
            memoryType: memoryDraft.memoryType,
            consentScope: memoryDraft.consentScope,
            sourceConversationId: conversation.id,
            isActive: true,
            expiredAt: null,
          },
          create: {
            userId,
            roleId: conversation.roleId,
            memoryType: memoryDraft.memoryType,
            memoryKey: memoryDraft.memoryKey,
            memoryValue: memoryDraft.memoryValue,
            sourceConversationId: conversation.id,
            consentScope: memoryDraft.consentScope,
          },
        });
        memoryWritten = true;
      }

      await tx.userRoleState.updateMany({
        where: {
          userId,
          roleId: conversation.roleId,
        },
        data: {
          lastTopic: assistantPlan.topic,
          lastComfortStyle: assistantPlan.soothingSuggestion.type ?? undefined,
          lastInteractedAt: new Date(),
          affinityScore: {
            increment: 1,
          },
          relationshipStage: roleState.relationshipStage === 'new' ? 'warming' : roleState.relationshipStage,
        },
      });

      if (riskDecision.decision !== 'allow') {
        await tx.safetyEvent.create({
          data: {
            userId,
            conversationId: conversation.id,
            messageId: userMessage.id,
            riskType: riskDecision.riskType,
            riskLevel: riskDecision.riskLevel,
            decision:
              riskDecision.decision === 'support_prompt'
                ? SafetyDecision.support_prompt
                : SafetyDecision.rewrite,
            handlerVersion: 'v1',
          },
        });
      }

      return {
        userMessage,
        assistantMessage,
        memoryWritten,
        responseMode: assistantPlan.responseMode,
        soothingSuggestion: assistantPlan.soothingSuggestion,
        updatedConversation,
      };
    });

    return {
      userMessage: {
        id: persisted.userMessage.id,
        content: persisted.userMessage.content,
      },
      assistantMessage: {
        id: persisted.assistantMessage.id,
        content: persisted.assistantMessage.content,
      },
      soothingSuggestion: persisted.soothingSuggestion,
      memoryWritten: persisted.memoryWritten,
      responseMode: persisted.responseMode,
    };
  }

  private async ensureActiveRole(roleId: string) {
    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        status: RoleStatus.active,
      },
      select: {
        id: true,
      },
    });

    if (!role) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    return role;
  }

  private async ensureConversationOwner(userId: string, conversationId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    return conversation;
  }

  private async getConversationRoleState(userId: string, roleId: string) {
    const [role, state] = await Promise.all([
      prisma.role.findUnique({
        where: { id: roleId },
        select: { name: true },
      }),
      prisma.userRoleState.findFirst({
        where: {
          userId,
          roleId,
        },
        select: {
          relationshipStage: true,
          lastTopic: true,
        },
      }),
    ]);

    if (!role) {
      throw new AppError(ErrorCode.NOT_FOUND, '资源不存在', 404);
    }

    return {
      roleName: role.name,
      relationshipStage: state?.relationshipStage ?? 'new',
      lastTopic: state?.lastTopic ?? null,
    };
  }

  private analyzeRisk(content: string) {
    const normalized = content.toLowerCase();
    const directBlockPatterns = ['教我自杀', '怎么自杀', 'how to kill myself', 'how to self harm'];
    const supportPatterns = ['不想活', '想死', '自残', '活不下去', 'kill myself', 'self harm'];
    const guardedPatterns = ['没用', '讨厌自己', '睡不着', '焦虑', '压力'];

    if (directBlockPatterns.some((pattern) => normalized.includes(pattern))) {
      return {
        decision: 'block' as const,
        riskLevel: RiskLevel.critical,
        riskType: 'self_harm_instruction',
      };
    }

    if (supportPatterns.some((pattern) => normalized.includes(pattern))) {
      return {
        decision: 'support_prompt' as const,
        riskLevel: RiskLevel.high,
        riskType: 'self_harm_expression',
      };
    }

    if (guardedPatterns.some((pattern) => normalized.includes(pattern))) {
      return {
        decision: 'rewrite' as const,
        riskLevel: RiskLevel.medium,
        riskType: 'emotional_distress',
      };
    }

    return {
      decision: 'allow' as const,
      riskLevel: RiskLevel.low,
      riskType: 'normal',
    };
  }

  private buildAssistantReply(input: {
    content: string;
    roleName: string;
    riskDecision: {
      decision: 'allow' | 'rewrite' | 'support_prompt' | 'block';
      riskLevel: RiskLevel;
      riskType: string;
    };
    lastTopic: string | null;
  }) {
    const topic = this.detectTopic(input.content, input.lastTopic);

    if (input.riskDecision.decision === 'support_prompt') {
      return {
        content: `${input.roleName} 先在这里陪着你。你现在不需要一个人扛着，如果你已经很难撑住，请先去找身边可信任的大人、朋友，或当地紧急支持资源。要是你愿意，我们先一起做三次慢呼吸，好吗？`,
        responseMode: 'safe_support' as const,
        soothingSuggestion: {
          triggered: true,
          type: 'breathing',
        },
        topic,
      };
    }

    if (input.riskDecision.decision === 'rewrite') {
      return {
        content: `${input.roleName} 听见你现在很累，也不急着马上把一切说清。我们先把最压着你的那一小块放下来，好吗？你也可以先试试一个短短的呼吸安抚。`,
        responseMode: 'guarded' as const,
        soothingSuggestion: {
          triggered: true,
          type: 'breathing',
        },
        topic,
      };
    }

    const suggestionType =
      topic === 'sleep'
        ? 'breathing'
        : topic === 'study_pressure'
          ? 'journal'
          : null;

    return {
      content: `${input.roleName} 在认真听你说。你愿意的话，可以从刚刚最戳到你的那一瞬间开始讲，我会先轻轻接住你。`,
      responseMode: 'normal' as const,
      soothingSuggestion: {
        triggered: suggestionType !== null,
        type: suggestionType,
      },
      topic,
    };
  }

  private buildMemoryDraft(content: string, conversationId: string, roleId: string) {
    const normalized = content.toLowerCase();

    if (normalized.includes('喜欢') || normalized.includes('更喜欢')) {
      return {
        memoryType: 'comfort_preference',
        memoryKey: 'preferred_comfort_style',
        memoryValue: normalized.includes('呼吸') ? 'breathing' : content.slice(0, 120),
        consentScope: 'explicit',
        sourceConversationId: conversationId,
        roleId,
      };
    }

    if (normalized.includes('最近总是') || normalized.includes('一直')) {
      return {
        memoryType: 'recurring_topic',
        memoryKey: `topic_${this.detectTopic(content, null)}`,
        memoryValue: content.slice(0, 120),
        consentScope: 'implicit',
        sourceConversationId: conversationId,
        roleId,
      };
    }

    return null;
  }

  private detectTopic(content: string, fallback: string | null) {
    if (content.includes('睡') || content.toLowerCase().includes('sleep')) {
      return 'sleep';
    }

    if (content.includes('学习') || content.includes('作业') || content.includes('考试')) {
      return 'study_pressure';
    }

    if (content.includes('家') || content.includes('父母')) {
      return 'family';
    }

    return fallback ?? 'general';
  }

  private messageExpiryDate() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + MESSAGE_RETENTION_DAYS);
    return expiresAt;
  }
}
