import { MOCK_NOTIFICATIONS } from '../mock/mockData';
import { NotificationItem } from '../types';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    return [...MOCK_NOTIFICATIONS];
  },

  async markAsRead(id: string): Promise<NotificationItem[]> {
    const item = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
    }
    return [...MOCK_NOTIFICATIONS];
  },

  async markAllAsRead(): Promise<NotificationItem[]> {
    MOCK_NOTIFICATIONS.forEach((n) => (n.isRead = true));
    return [...MOCK_NOTIFICATIONS];
  },
};
