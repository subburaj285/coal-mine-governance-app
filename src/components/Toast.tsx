import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';

export const Toast: React.FC = () => {
  const { toastMessage, toastType, hideToast } = useApp();

  if (!toastMessage) return null;

  const getTheme = () => {
    switch (toastType) {
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.95)', icon: 'checkmark-circle' };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.95)', icon: 'alert-circle' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.95)', icon: 'warning' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.95)', icon: 'information-circle' };
    }
  };

  const theme = getTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.toastContent, { backgroundColor: theme.bg }]}>
        <Ionicons name={theme.icon as any} size={20} color="#FFF" />
        <Text style={styles.text}>{toastMessage}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeBtn}>
          <Ionicons name="close" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
    gap: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    padding: 2,
  },
});
