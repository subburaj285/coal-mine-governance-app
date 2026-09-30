import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { StatusBadge } from './StatusBadge';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const { currentUser, activeRole, switchRole, notifications, activeScreen, setActiveScreen } = useApp();
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roles: { role: UserRole; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { role: 'Supervisor', icon: 'people', label: 'Supervisor' },
    { role: 'Safety Officer', icon: 'shield-checkmark', label: 'Safety' },
    { role: 'Environment Officer', icon: 'leaf', label: 'Environment' },
    { role: 'Production Officer', icon: 'bar-chart', label: 'Production' },
    { role: 'Maintenance Engineer', icon: 'construct', label: 'Maintenance' },
  ];

  if (!currentUser || activeScreen === 'Login') return null;

  // Time-based friendly greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      {/* User Header Row */}
      <View style={styles.topRow}>
        <View style={styles.userSection}>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => setActiveScreen('Profile')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle" size={40} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.greetingText}>{getGreeting()}, 👋</Text>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <StatusBadge label={activeRole} type="role" size="small" />
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setActiveScreen('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 1-Tap Quick Role Switcher Scroll Bar */}
      <View style={styles.roleBarWrapper}>
        <Text style={styles.roleBarTitle}>QUICK ROLE SWITCH:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roleScroll}
        >
          {roles.map((r) => {
            const isSelected = r.role === activeRole;
            return (
              <TouchableOpacity
                key={r.role}
                style={[styles.quickRoleChip, isSelected && styles.quickRoleChipSelected]}
                onPress={() => switchRole(r.role)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={r.icon}
                  size={14}
                  color={isSelected ? '#FFF' : Colors.textSecondary}
                />
                <Text style={[styles.quickRoleText, isSelected && styles.quickRoleTextSelected]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* AI Governance Live Banner */}
      <View style={styles.aiBanner}>
        <View style={styles.aiPulseDot} />
        <Text style={styles.aiBannerText} numberOfLines={1}>
          AI GOVERNANCE ENGINE: <Text style={{ color: Colors.primary }}>Active DGMS Compliance System</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    paddingTop: 32,
    paddingHorizontal: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
  },
  greetingText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 1,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.critical,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.cardBg,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  roleBarWrapper: {
    marginVertical: 4,
  },
  roleBarTitle: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  roleScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  quickRoleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 5,
  },
  quickRoleChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickRoleText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  quickRoleTextSelected: {
    color: '#FFF',
    fontWeight: '800',
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
  aiPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  aiBannerText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
