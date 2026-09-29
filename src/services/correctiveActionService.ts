import { MOCK_CORRECTIVE_ACTIONS } from '../mock/mockData';
import { CorrectiveAction } from '../types';

export const correctiveActionService = {
  async getCorrectiveActions(): Promise<CorrectiveAction[]> {
    return [...MOCK_CORRECTIVE_ACTIONS];
  },

  async updateActionStatus(id: string, status: CorrectiveAction['status'], evidence?: string): Promise<CorrectiveAction | null> {
    const item = MOCK_CORRECTIVE_ACTIONS.find((a) => a.id === id);
    if (item) {
      item.status = status;
      if (evidence) item.evidencePlaceholder = evidence;
      return { ...item };
    }
    return null;
  },
};
