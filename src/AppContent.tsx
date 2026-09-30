import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from './context/AppContext';
import { Colors } from './theme/colors';
import { Header } from './components/Header';
import { RoleTabBar } from './components/RoleTabBar';
import { Toast } from './components/Toast';
import { UserRole } from './types';

// Screens
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AttendanceScreen } from './screens/AttendanceScreen';
import { SafetyInspectionScreen } from './screens/SafetyInspectionScreen';
import { EnvironmentInspectionScreen } from './screens/EnvironmentInspectionScreen';
import { ViolationsScreen } from './screens/ViolationsScreen';
import { CorrectiveActionScreen } from './screens/CorrectiveActionScreen';
import { ReInspectionScreen } from './screens/ReInspectionScreen';
import { ProductionScreen } from './screens/ProductionScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';
import { DocumentOCRScreen } from './screens/DocumentOCRScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const AppContent: React.FC = () => {
  const { activeScreen, activeRole, switchRole } = useApp();
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Login':
        return <LoginScreen />;
      case 'Home':
        return <HomeScreen />;
      case 'Attendance':
      case 'Workers':
        return <AttendanceScreen />;
      case 'SafetyInspection':
      case 'Inspection':
        return <SafetyInspectionScreen />;
      case 'EnvironmentInspection':
      case 'EnvInspection':
        return <EnvironmentInspectionScreen />;
      case 'Violations':
      case 'Issues':
        return <ViolationsScreen />;
      case 'Actions':
        return <CorrectiveActionScreen />;
      case 'ReInspection':
        return <ReInspectionScreen />;
      case 'Production':
      case 'Dispatch':
      case 'PlanVsActual':
        return <ProductionScreen />;
      case 'Machinery':
      case 'Repairs':
        return <MaintenanceScreen />;
      case 'Documents':
        return <DocumentOCRScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isWeb = Platform.OS === 'web';

  const roles: UserRole[] = [
    'Supervisor',
    'Safety Officer',
    'Environment Officer',
    'Production Officer',
    'Maintenance Engineer',
  ];

  const content = activeScreen === 'Login' ? (
    <SafeAreaView style={styles.loginSafeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Toast />
      <LoginScreen />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBg} />
      <Toast />
      <Header />
      <View style={styles.body}>{renderScreen()}</View>
      <RoleTabBar />
    </SafeAreaView>
  );

  if (isWeb) {
    return (
      <View style={styles.outerWebContainer}>
        {/* Top Control Bar for Web Evaluator */}
        <View style={styles.topControlBar}>
          <View style={styles.brandTitleRow}>
            <Ionicons name="hardware-chip" size={18} color={Colors.primary} />
            <Text style={styles.controlBrandText}>MINE SHIELD AI - FIELD DEMO PORTAL</Text>
          </View>

          <View style={styles.topRoleControls}>
            <Text style={styles.controlLabel}>SWITCH DEMO ROLE:</Text>
            {roles.map((r) => {
              const active = r === activeRole;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.webRoleBtn, active && styles.webRoleBtnActive]}
                  onPress={() => switchRole(r)}
                >
                  <Text style={[styles.webRoleBtnText, active && styles.webRoleBtnTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.toggleFrameBtn}
            onPress={() => setIsPhoneFrame(!isPhoneFrame)}
          >
            <Ionicons name={isPhoneFrame ? 'expand-outline' : 'phone-portrait-outline'} size={16} color="#0F172A" />
            <Text style={styles.toggleFrameText}>
              {isPhoneFrame ? 'FULL SCREEN' : 'PHONE FRAME'}
            </Text>
          </TouchableOpacity>
        </View>

        {isPhoneFrame ? (
          <View style={styles.phoneFrame}>
            <View style={styles.phoneNotch} />
            <View style={styles.phoneInner}>{content}</View>
            <View style={styles.phoneHomeIndicator} />
          </View>
        ) : (
          <View style={styles.fullScreenWrapper}>{content}</View>
        )}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  outerWebContainer: {
    flex: 1,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: Platform.OS === 'web' ? 10 : 0,
  },
  topControlBar: {
    width: '100%',
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
    flexWrap: 'wrap',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlBrandText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  topRoleControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  controlLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    marginRight: 4,
  },
  webRoleBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  webRoleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  webRoleBtnText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  webRoleBtnTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  toggleFrameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  toggleFrameText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 380,
    height: '100%',
    maxHeight: 920,
    backgroundColor: Colors.background,
    borderRadius: Platform.OS === 'web' ? 42 : 0,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'web' ? 10 : 0,
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    position: 'relative',
    flex: 1,
  },
  fullScreenWrapper: {
    width: '100%',
    maxWidth: 600,
    height: '100%',
    backgroundColor: Colors.background,
    flex: 1,
  },
  phoneNotch: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 140,
    height: 24,
    backgroundColor: '#0F172A',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 9999,
  },
  phoneHomeIndicator: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    width: 120,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    zIndex: 9999,
  },
  phoneInner: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loginSafeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
  },
});
