import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface GPSBadgeProps {
  location?: string;
  timestamp?: string;
}

export const GPSBadge: React.FC<GPSBadgeProps> = ({
  location = '23.8103° N, 86.4412° E (Jharia Pit #4B)',
  timestamp,
}) => {
  const timeStr = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Ionicons name="location" size={12} color={Colors.primary} />
        <Text style={styles.locText} numberOfLines={1}>
          GPS: {location}
        </Text>
      </View>
      <View style={styles.pill}>
        <Ionicons name="time" size={12} color={Colors.textSecondary} />
        <Text style={styles.timeText}>{timeStr}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 4,
  },
  locText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  timeText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
});
