import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useApp } from './context/AppContext';
import { Colors } from './theme/colors';
import { Header } from './components/Header';
import { RoleTabBar } from './components/RoleTabBar';
import { Toast } from './components/Toast';

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
  const { activeScreen } = useApp();

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
        <View style={styles.phoneFrame}>
          <View style={styles.phoneNotch} />
          <View style={styles.phoneInner}>{content}</View>
          <View style={styles.phoneHomeIndicator} />
        </View>
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  outerWebContainer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'web' ? 20 : 0,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 420,
    height: '100%',
    maxHeight: 880,
    backgroundColor: Colors.background,
    borderRadius: Platform.OS === 'web' ? 36 : 0,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'web' ? 8 : 0,
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    position: 'relative',
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
