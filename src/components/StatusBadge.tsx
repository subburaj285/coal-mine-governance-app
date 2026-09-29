import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface StatusBadgeProps {
  label: string;
  type?: 'severity' | 'status' | 'role';
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, type = 'status', size = 'medium' }) => {
  const getColors = () => {
    const l = label.toLowerCase();

    // Severity colors
    if (l === 'critical') return { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', border: '#EF4444' };
    if (l === 'high') return { bg: 'rgba(249, 115, 22, 0.2)', text: '#F97316', border: '#F97316' };
    if (l === 'medium') return { bg: 'rgba(234, 179, 8, 0.2)', text: '#EAB308', border: '#EAB308' };
    if (l === 'low') return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10B981', border: '#10B981' };

    // Status colors
    if (l === 'open' || l === 'absent') return { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', border: '#EF4444' };
    if (l === 'assigned' || l === 'delayed') return { bg: 'rgba(249, 115, 22, 0.2)', text: '#F97316', border: '#F97316' };
    if (l === 'in progress' || l === 'loading' || l === 'weighed' || l === 'in transit')
      return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6', border: '#3B82F6' };
    if (l === 'completed' || l === 'present' || l === 'verified' || l === 'dispatched' || l === 'normal' || l === 'on target')
      return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10B981', border: '#10B981' };
    if (l === 'reopened') return { bg: 'rgba(220, 38, 38, 0.25)', text: '#DC2626', border: '#DC2626' };
    if (l === 'closed' || l === 'draft') return { bg: 'rgba(107, 114, 128, 0.2)', text: '#9CA3AF', border: '#4B5563' };

    // Role colors
    if (l.includes('supervisor')) return { bg: 'rgba(245, 158, 11, 0.2)', text: Colors.supervisor, border: Colors.supervisor };
    if (l.includes('safety')) return { bg: 'rgba(239, 68, 68, 0.2)', text: Colors.safety, border: Colors.safety };
    if (l.includes('environment')) return { bg: 'rgba(16, 185, 129, 0.2)', text: Colors.environment, border: Colors.environment };
    if (l.includes('production')) return { bg: 'rgba(59, 130, 246, 0.2)', text: Colors.production, border: Colors.production };
    if (l.includes('maintenance')) return { bg: 'rgba(139, 92, 246, 0.2)', text: Colors.maintenance, border: Colors.maintenance };

    return { bg: 'rgba(107, 114, 128, 0.2)', text: '#D1D5DB', border: '#4B5563' };
  };

  const styleColors = getColors();

  const getPadding = () => {
    if (size === 'small') return { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 };
    if (size === 'large') return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 };
    return { paddingHorizontal: 8, paddingVertical: 3, fontSize: 11 };
  };

  const paddingStyle = getPadding();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: styleColors.bg,
          borderColor: styleColors.border,
          paddingHorizontal: paddingStyle.paddingHorizontal,
          paddingVertical: paddingStyle.paddingVertical,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: styleColors.text }]} />
      <Text style={[styles.badgeText, { color: styleColors.text, fontSize: paddingStyle.fontSize }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
