import { MOCK_INSPECTIONS } from '../mock/mockData';
import { Inspection } from '../types';

export const inspectionService = {
  async getInspections(): Promise<Inspection[]> {
    return [...MOCK_INSPECTIONS];
  },

  async submitInspection(inspection: Omit<Inspection, 'id' | 'timestamp'>): Promise<Inspection> {
    const newInspection: Inspection = {
      ...inspection,
      id: `insp-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
    };
    MOCK_INSPECTIONS.unshift(newInspection);
    return newInspection;
  },
};
