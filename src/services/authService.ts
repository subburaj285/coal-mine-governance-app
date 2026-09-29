import { MOCK_USERS } from '../mock/mockData';
import { User, UserRole } from '../types';

export const authService = {
  async login(employeeId: string, password: string, selectedRole: UserRole): Promise<User> {
    // Simulated mock network latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    const matchedUser = MOCK_USERS.find((u) => u.role === selectedRole);
    if (matchedUser) {
      return { ...matchedUser, employeeId: employeeId || matchedUser.employeeId };
    }
    return MOCK_USERS[0];
  },

  async getCurrentUser(role: UserRole): Promise<User> {
    const user = MOCK_USERS.find((u) => u.role === role);
    return user || MOCK_USERS[0];
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};
