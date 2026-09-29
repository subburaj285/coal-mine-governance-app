import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { StatusBadge } from '../components/StatusBadge';
import { UserRole } from '../types';

export const ProfileScreen: React.FC = () => {
  const { currentUser, activeRole, logout, switchRole, showToast } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [empId, setEmpId] = useState(currentUser?.employeeId || '');

  if (!currentUser) return null;

  const handleSaveProfile = () => {
    setIsEditModalOpen(false);
    showToast('Profile updated locally', 'success');
  };

  const roles: UserRole[] = [
    'Supervisor',
    'Safety Officer',
    'Environment Officer',
    'Production Officer',
    'Maintenance Engineer',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={44} color={Colors.textDark} />
        </View>

        <Text style={styles.userName}>{currentUser.name}</Text>
        <Text style={styles.userEmpId}>{currentUser.employeeId}</Text>
        <View style={{ marginTop: 6 }}>
          <StatusBadge label={activeRole} type="role" size="medium" />
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Department:</Text>
            <Text style={styles.detailValue}>{currentUser.department}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mine Complex:</Text>
            <Text style={styles.detailValue}>{currentUser.mineName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Shift:</Text>
            <Text style={styles.detailValue}>{currentUser.shift}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Field Access Level:</Text>
            <Text style={[styles.detailValue, { color: Colors.primary }]}>Level 4 (Chief Field Authority)</Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setIsEditModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={16} color={Colors.textPrimary} />
          <Text style={styles.editBtnText}>Edit Field Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Switch Demo Role Card */}
      <View style={styles.switchRoleCard}>
        <Text style={styles.sectionTitle}>SWITCH FRONTEND DEMO ROLE</Text>
        <Text style={styles.sectionSub}>Test features for other mine officers immediately:</Text>

        <View style={styles.roleGrid}>
          {roles.map((r) => {
            const isSelected = r === activeRole;
            return (
              <TouchableOpacity
                key={r}
                style={[styles.roleChip, isSelected && styles.roleChipActive]}
                onPress={() => switchRole(r)}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleChipText, isSelected && styles.roleChipTextActive]}>
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={20} color={Colors.critical} />
        <Text style={styles.logoutText}>LOG OUT OF FIELD SESSION</Text>
      </TouchableOpacity>

      <Text style={styles.footerInfo}>
        Mine Shield AI Portal v2.4 • DGMS Circular 2024 Compliant
      </Text>

      {/* Edit Modal */}
      <Modal visible={isEditModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile Information</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Employee Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Employee ID Tag</Text>
              <TextInput
                style={styles.input}
                value={empId}
                onChangeText={setEmpId}
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  userEmpId: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  detailGrid: {
    width: '100%',
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  detailLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  detailValue: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 14,
    gap: 6,
  },
  editBtnText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  switchRoleCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
  roleGrid: {
    gap: 6,
  },
  roleChip: {
    backgroundColor: Colors.inputBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    alignItems: 'center',
  },
  roleChipActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: Colors.primary,
  },
  roleChipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.critical,
    gap: 8,
    marginBottom: 16,
  },
  logoutText: {
    color: Colors.critical,
    fontSize: 13,
    fontWeight: '900',
  },
  footerInfo: {
    color: Colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: Colors.textDark,
    fontSize: 13,
    fontWeight: '900',
  },
});
