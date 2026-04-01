export class PrivacyService {
  async summary() {
    return {
      store: ['账号信息', '角色关系', '授权保存的关键记忆'],
      notStore: ['默认长期保存全部聊天原文'],
      messageRetentionDays: 30,
      deleteMethod: 'account_or_memory_delete',
    };
  }
}
