import { MOCK_MACHINERY_ISSUES } from '../mock/mockData';
import { MachineryIssue } from '../types';

export const machineryService = {
  async getMachineryIssues(): Promise<MachineryIssue[]> {
    return [...MOCK_MACHINERY_ISSUES];
  },

  async updateRepairStatus(id: string, status: MachineryIssue['status'], evidence?: string): Promise<MachineryIssue | null> {
    const item = MOCK_MACHINERY_ISSUES.find((m) => m.id === id);
    if (item) {
      item.status = status;
      if (evidence) item.evidencePlaceholder = evidence;
      return { ...item };
    }
    return null;
  },
};
