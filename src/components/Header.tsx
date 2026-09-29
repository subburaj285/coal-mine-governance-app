import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { StatusBadge } from './StatusBadge';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const { currentUser, activeRole, switchRole, notifications, activeScreen, setActiveScreen } = useApp();
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roles: UserRole[] = [
    'Supervisor',
    'Safety Officer',
    'Environment Officer',
    'Production Officer',
    'Maintenance Engineer',
  ];

  if (!currentUser || activeScreen === 'Login') return null;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.userSection}>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => setRoleModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle" size={38} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <StatusBadge label={activeRole} type="role" size="small" />
            </View>
            <Text style={styles.mineText} numberOfLines={1}>
              {currentUser.mineName} • <Text style={styles.shiftText}>{currentUser.shift}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.demoSwitchBtn}
            onPress={() => setRoleModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-horizontal" size={16} color={Colors.primary} />
            <Text style={styles.demoSwitchText}>Role</Text>
          </TouchableOpacity>

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

      {/* AI Governance Live Banner */}
      <View style={styles.aiBanner}>
        <View style={styles.aiPulseDot} />
        <Text style={styles.aiBannerText} numberOfLines={1}>
          AI GOVERNANCE ENGINE: <Text style={{ color: Colors.primary }}>Active Risk & DGMS Monitoring</Text>
        </Text>
      </View>

      {/* Role Switcher Modal */}
      <Modal visible={roleModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRoleModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.primary} />
              <Text style={styles.modalTitle}>Select Demo Role</Text>
              <TouchableOpacity onPress={() => setRoleModalVisible(false)}>
                <Ionicons name="close" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtext}>
              Switch module views instantly for frontend demonstration:
            </Text>

            {roles.map((r) => {
              const isSelected = r === activeRole;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleOption, isSelected && styles.roleOptionSelected]}
                  onPress={() => {
                    switchRole(r);
                    setRoleModalVisible(false);
                  }}
                >
                  <Ionicons
                    name={
                      r === 'Supervisor'
                        ? 'people'
                        : r === 'Safety Officer'
                        ? 'shield'
                        : r === 'Environment Officer'
                        ? 'leaf'
                        : r === 'Production Officer'
                        ? 'construct'
                        : 'cog'
                    }
                    size={20}
                    color={isSelected ? Colors.primary : Colors.textSecondary}
                  />
                  <Text style={[styles.roleOptionText, isSelected && styles.roleOptionTextSelected]}>
                    {r}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    paddingTop: 36,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  mineText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  shiftText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
    gap: 4,
  },
  demoSwitchText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
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
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
  aiPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  aiBannerText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    marginLeft: 8,
  },
  modalSubtext: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 14,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    marginBottom: 8,
    gap: 12,
  },
  roleOptionSelected: {
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  roleOptionText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  roleOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
