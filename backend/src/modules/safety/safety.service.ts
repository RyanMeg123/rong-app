export class SafetyService {
  async boundary() {
    return {
      positioning: 'not_therapy',
      minorProtection: 'strict_mode',
      highRiskPolicy: 'support_prompt_first',
    };
  }
}
