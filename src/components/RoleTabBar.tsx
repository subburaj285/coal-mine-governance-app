import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';

interface TabItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const RoleTabBar: React.FC = () => {
  const { activeRole, activeScreen, setActiveScreen } = useApp();

  if (activeScreen === 'Login') return null;

  const getTabsForRole = (): TabItem[] => {
    switch (activeRole) {
      case 'Supervisor':
        return [
          { id: 'Home', label: 'Home', icon: 'grid-outline' },
          { id: 'Attendance', label: 'Attendance', icon: 'clipboard-outline' },
          { id: 'Workers', label: 'Workers', icon: 'people-outline' },
          { id: 'Violations', label: 'Field Issues', icon: 'warning-outline' },
          { id: 'Actions', label: 'Actions', icon: 'checkbox-outline' },
          { id: 'Notifications', label: 'Alerts', icon: 'notifications-outline' },
          { id: 'Profile', label: 'Profile', icon: 'person-outline' },
        ];

      case 'Safety Officer':
        return [
          { id: 'Home', label: 'Home', icon: 'grid-outline' },
          { id: 'SafetyInspection', label: 'Inspection', icon: 'shield-checkmark-outline' },
          { id: 'Violations', label: 'Violations', icon: 'alert-circle-outline' },
          { id: 'Actions', label: 'Actions', icon: 'checkbox-outline' },
          { id: 'ReInspection', label: 'Re-Inspect', icon: 'git-compare-outline' },
          { id: 'Documents', label: 'Documents', icon: 'document-text-outline' },
          { id: 'Notifications', label: 'Alerts', icon: 'notifications-outline' },
          { id: 'Profile', label: 'Profile', icon: 'person-outline' },
        ];

      case 'Environment Officer':
        return [
          { id: 'Home', label: 'Home', icon: 'grid-outline' },
          { id: 'EnvironmentInspection', label: 'Env Audit', icon: 'leaf-outline' },
          { id: 'Violations', label: 'Env Issues', icon: 'warning-outline' },
          { id: 'Actions', label: 'Actions', icon: 'checkbox-outline' },
          { id: 'ReInspection', label: 'Re-Inspect', icon: 'git-compare-outline' },
          { id: 'Documents', label: 'Documents', icon: 'document-text-outline' },
          { id: 'Notifications', label: 'Alerts', icon: 'notifications-outline' },
          { id: 'Profile', label: 'Profile', icon: 'person-outline' },
        ];

      case 'Production Officer':
        return [
          { id: 'Home', label: 'Home', icon: 'grid-outline' },
          { id: 'Production', label: 'Production', icon: 'bar-chart-outline' },
          { id: 'Dispatch', label: 'Dispatch', icon: 'bus-outline' },
          { id: 'PlanVsActual', label: 'Plan vs Act', icon: 'analytics-outline' },
          { id: 'Violations', label: 'Issues', icon: 'warning-outline' },
          { id: 'Notifications', label: 'Alerts', icon: 'notifications-outline' },
          { id: 'Profile', label: 'Profile', icon: 'person-outline' },
        ];

      case 'Maintenance Engineer':
        return [
          { id: 'Home', label: 'Home', icon: 'grid-outline' },
          { id: 'Machinery', label: 'Machinery', icon: 'construct-outline' },
          { id: 'Repairs', label: 'Repairs', icon: 'build-outline' },
          { id: 'Actions', label: 'Evidence', icon: 'camera-outline' },
          { id: 'Notifications', label: 'Alerts', icon: 'notifications-outline' },
          { id: 'Profile', label: 'Profile', icon: 'person-outline' },
        ];

      default:
        return [
          { id: 'Home', label: 'Home', icon: 'grid-outline' },
          { id: 'Notifications', label: 'Alerts', icon: 'notifications-outline' },
          { id: 'Profile', label: 'Profile', icon: 'person-outline' },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive =
            activeScreen === tab.id ||
            (tab.id === 'Workers' && activeScreen === 'Attendance') ||
            (tab.id === 'PlanVsActual' && activeScreen === 'Production') ||
            (tab.id === 'Repairs' && activeScreen === 'Machinery');

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveScreen(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={isActive ? Colors.primary : Colors.textMuted}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingVertical: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 64,
    position: 'relative',
  },
  tabButtonActive: {
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  tabLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
