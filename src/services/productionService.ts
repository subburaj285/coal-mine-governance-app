import { MOCK_PRODUCTION_SUMMARY, MOCK_TRUCK_DISPATCHES } from '../mock/mockData';
import { ProductionSummary, TruckDispatch } from '../types';

export const productionService = {
  async getProductionSummary(): Promise<ProductionSummary> {
    return { ...MOCK_PRODUCTION_SUMMARY };
  },

  async getDispatches(): Promise<TruckDispatch[]> {
    return [...MOCK_TRUCK_DISPATCHES];
  },
};
