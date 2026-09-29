import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, setActiveScreen } = useApp();
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'Unread') return !n.isRead;
    return true;
  });

  const getBorderColor = (type: string) => {
    if (type === 'critical') return Colors.critical;
    if (type === 'warning') return Colors.warning;
    if (type === 'info') return Colors.info;
    return Colors.success;
  };

  return (
    <View style={styles.container}>
      {/* Filter Row */}
      <View style={styles.topFilter}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'All' && styles.filterBtnActive]}
          onPress={() => setFilter('All')}
        >
          <Text style={[styles.filterText, filter === 'All' && styles.filterTextActive]}>
            All Notifications ({notifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === 'Unread' && styles.filterBtnActive]}
          onPress={() => setFilter('Unread')}
        >
          <Text style={[styles.filterText, filter === 'Unread' && styles.filterTextActive]}>
            Unread ({notifications.filter((n) => !n.isRead).length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredNotifs.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="notifications-off-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>All field alerts have been read.</Text>
          </View>
        ) : (
          filteredNotifs.map((item) => {
            const borderColor = getBorderColor(item.type);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  { borderLeftColor: borderColor },
                  !item.isRead && styles.cardUnread,
                ]}
                onPress={() => {
                  markNotificationRead(item.id);
                  if (item.targetScreen) setActiveScreen(item.targetScreen);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.timeText}>{item.timestamp}</Text>
                </View>

                <Text style={styles.cardMessage}>{item.message}</Text>

                <View style={styles.cardFooter}>
                  {!item.isRead ? (
                    <Text style={styles.unreadTag}>TAP TO MARK AS READ</Text>
                  ) : (
                    <Text style={styles.readTag}>Read</Text>
                  )}
                  {item.targetScreen && (
                    <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topFilter: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  filterText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderLeftWidth: 4,
  },
  cardUnread: {
    backgroundColor: 'rgba(22, 31, 46, 0.95)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  cardMessage: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 6,
  },
  unreadTag: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  readTag: {
    color: Colors.textMuted,
    fontSize: 10,
  },
});
