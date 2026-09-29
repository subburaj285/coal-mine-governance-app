import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface PhotoPickerProps {
  label?: string;
  initialPhoto?: string;
  onPhotoSelected?: (photoUrl: string) => void;
}

const SAMPLE_MINE_PHOTOS = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
  'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500',
];

export const PhotoPlaceholderPicker: React.FC<PhotoPickerProps> = ({
  label = 'Field Photo Evidence / Placeholder',
  initialPhoto,
  onPhotoSelected,
}) => {
  const [photo, setPhoto] = useState<string | null>(initialPhoto || null);

  const handleCapture = () => {
    // Pick next sample field image to simulate photo capture
    const randomImg = SAMPLE_MINE_PHOTOS[Math.floor(Math.random() * SAMPLE_MINE_PHOTOS.length)];
    setPhoto(randomImg);
    if (onPhotoSelected) onPhotoSelected(randomImg);
  };

  const handleRemove = () => {
    setPhoto(null);
    if (onPhotoSelected) onPhotoSelected('');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {photo ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
            <Ionicons name="close-circle" size={24} color={Colors.critical} />
          </TouchableOpacity>
          <View style={styles.capturedTag}>
            <Ionicons name="checkmark-circle" size={12} color="#FFF" />
            <Text style={styles.capturedTagText}>Evidence Captured</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.pickerBox} onPress={handleCapture} activeOpacity={0.8}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.pickerTitle}>Tap to Capture / Attach Photo Evidence</Text>
          <Text style={styles.pickerSubtext}>Field GPS & Timestamp watermarked automatically</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  pickerBox: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickerTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  pickerSubtext: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  imagePreview: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
  },
  capturedTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capturedTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
