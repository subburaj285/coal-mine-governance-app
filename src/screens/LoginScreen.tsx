import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { UserRole } from '../types';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [employeeId, setEmployeeId] = useState('EMP-7809');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Supervisor');
  const [isLoading, setIsLoading] = useState(false);

  const roles: { role: UserRole; icon: keyof typeof Ionicons.glyphMap; empId: string }[] = [
    { role: 'Supervisor', icon: 'people', empId: 'EMP-7809' },
    { role: 'Safety Officer', icon: 'shield', empId: 'EMP-3204' },
    { role: 'Environment Officer', icon: 'leaf', empId: 'EMP-4421' },
    { role: 'Production Officer', icon: 'construct', empId: 'EMP-9912' },
    { role: 'Maintenance Engineer', icon: 'cog', empId: 'EMP-6150' },
  ];

  const handleLogin = async () => {
    setIsLoading(true);
    await login(employeeId, password, selectedRole);
    setIsLoading(false);
  };

  const handleRoleSelect = (role: UserRole, defaultEmpId: string) => {
    setSelectedRole(role);
    setEmployeeId(defaultEmpId);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Hero */}
        <View style={styles.heroSection}>
          <View style={styles.badgeRow}>
            <View style={styles.aiTag}>
              <Ionicons name="hardware-chip" size={14} color={Colors.primary} />
              <Text style={styles.aiTagText}>AI GOVERNANCE & COMPLIANCE</Text>
            </View>
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="bonfire" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.appTitle}>MINE SHIELD AI</Text>
          <Text style={styles.appSubtitle}>Coal Mine Governance & Operations Compliance Platform</Text>
        </View>

        {/* Card Form */}
        <View style={styles.formCard}>
          <Text style={styles.formHeading}>Sign In to Field Portal</Text>

          {/* Employee ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Employee ID</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                value={employeeId}
                onChangeText={setEmployeeId}
                placeholder="e.g. EMP-7809"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter password"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          {/* Demo Role Selector */}
          <View style={styles.inputGroup}>
            <View style={styles.roleHeaderRow}>
              <Text style={styles.inputLabel}>Select Demo Role</Text>
              <Text style={styles.roleHelpTag}>FRONTEND TESTER</Text>
            </View>
            <View style={styles.roleGrid}>
              {roles.map((r) => {
                const isSelected = r.role === selectedRole;
                return (
                  <TouchableOpacity
                    key={r.role}
                    style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                    onPress={() => handleRoleSelect(r.role, r.empId)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={r.icon}
                      size={16}
                      color={isSelected ? Colors.primary : Colors.textMuted}
                    />
                    <Text
                      style={[styles.roleChipText, isSelected && styles.roleChipTextSelected]}
                      numberOfLines={1}
                    >
                      {r.role}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Ionicons name="log-in-outline" size={20} color={Colors.textDark} />
            <Text style={styles.loginBtnText}>
              {isLoading ? 'AUTHENTICATING...' : `LOGIN AS ${selectedRole.toUpperCase()}`}
            </Text>
          </TouchableOpacity>

          <View style={styles.disclaimerBox}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.disclaimerText}>
              Mock Frontend Mode: Local state active. Clean service interfaces configured for API integration.
            </Text>
          </View>
        </View>

        {/* Footer info */}
        <Text style={styles.footerText}>
          Jharia Coalfield Mine Operations • DGMS Compliant System v2.4
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeRow: {
    marginBottom: 12,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    gap: 6,
  },
  aiTagText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  appTitle: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  appSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  formHeading: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  roleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleHelpTag: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    gap: 6,
    width: '48%',
  },
  roleChipSelected: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderColor: Colors.primary,
  },
  roleChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  roleChipTextSelected: {
    color: Colors.primary,
    fontWeight: '800',
  },
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 6,
  },
  disclaimerText: {
    color: Colors.textMuted,
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
  },
});
