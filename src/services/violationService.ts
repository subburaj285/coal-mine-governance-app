import { MOCK_VIOLATIONS } from '../mock/mockData';
import { Violation } from '../types';

export const violationService = {
  async getViolations(): Promise<Violation[]> {
    return [...MOCK_VIOLATIONS];
  },

  async addViolation(data: Omit<Violation, 'id' | 'date'>): Promise<Violation> {
    const newViolation: Violation = {
      ...data,
      id: `viol-${Date.now()}`,
      date: new Date().toLocaleString(),
    };
    MOCK_VIOLATIONS.unshift(newViolation);
    return newViolation;
  },

  async updateViolationStatus(id: string, status: Violation['status'], note?: string, evidence?: string): Promise<Violation | null> {
    const item = MOCK_VIOLATIONS.find((v) => v.id === id);
    if (item) {
      item.status = status;
      if (note) item.correctiveActionNote = note;
      if (evidence) item.newEvidencePlaceholder = evidence;
      return { ...item };
    }
    return null;
  },
};
