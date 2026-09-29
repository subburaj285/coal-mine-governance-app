import { MOCK_ATTENDANCE_SUMMARY, MOCK_WORKERS } from '../mock/mockData';
import { AttendanceSummary, Worker } from '../types';

export const attendanceService = {
  async getAttendanceSummary(): Promise<AttendanceSummary> {
    return { ...MOCK_ATTENDANCE_SUMMARY };
  },

  async getWorkers(): Promise<Worker[]> {
    return [...MOCK_WORKERS];
  },

  async updateWorkerStatus(workerId: string, status: 'Present' | 'Absent'): Promise<Worker[]> {
    const updated = MOCK_WORKERS.map((w) => {
      if (w.id === workerId) {
        return {
          ...w,
          status,
          entryTime: status === 'Present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--',
        };
      }
      return w;
    });
    return updated;
  },
};
