import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { PhotoPlaceholderPicker } from '../components/PhotoPlaceholderPicker';
import { GPSBadge } from '../components/GPSBadge';
import { StatusBadge } from '../components/StatusBadge';
import { InspectionCheckitem } from '../types';

export const EnvironmentInspectionScreen: React.FC = () => {
  const { submitInspection, setActiveScreen, inspections } = useApp();

  const [category, setCategory] = useState('Dust & Air Quality');
  const [mineArea, setMineArea] = useState('Effluent Treatment & Discharge Pond B');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [observation, setObservation] = useState('');
  const [photo, setPhoto] = useState('');

  const [checklists, setChecklists] = useState<InspectionCheckitem[]>([
    { id: 'ec-1', label: 'Dust Suppression Sprinkler Cannon Cycle Active', passed: true },
    { id: 'ec-2', label: 'Settling Pond Water Discharge pH Balance (Target 6.5 - 7.5)', passed: true },
    { id: 'ec-3', label: 'Pollution Filter Sludge Accumulation Level', passed: false, comment: 'Sediment buildup exceeds 70%' },
    { id: 'ec-4', label: 'Hazardous Waste Oil Trap & Chemical Containment', passed: true },
    { id: 'ec-5', label: 'Ambient Air PM10 Particulate Level Monitor', passed: true },
  ]);

  const toggleCheck = (id: string) => {
    setChecklists(
      checklists.map((item) => (item.id === id ? { ...item, passed: !item.passed } : item))
    );
  };

  const handleSubmit = async () => {
    await submitInspection({
      title: `ENV AUDIT: ${category} - ${mineArea}`,
      type: 'Environmental',
      mineArea,
      status: 'Completed',
      severity,
      checklists,
      observation: observation || 'Environmental parameters recorded within statutory thresholds.',
      photoPlaceholder: photo || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
      gpsPlaceholder: '23.8090° N, 86.4390° E (Surface Area)',
      inspectorName: 'Dr. Sunita Rao (Env Officer)',
    });
    setActiveScreen('Violations');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="leaf" size={24} color={Colors.environment} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>ENVIRONMENTAL AUDIT & MONITORING</Text>
            <Text style={styles.cardSubtitle}>Air, Water & Waste Clearance Audit</Text>
          </View>
        </View>

        <GPSBadge location="23.8090° N, 86.4390° E (Discharge Pond B)" />

        {/* Audit Category */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Environmental Category</Text>
          <View style={styles.chipGrid}>
            {['Dust & Air Quality', 'Water Runoff', 'Pollution & Sludge', 'Waste Management'].map((c) => {
              const active = category === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Mine Area / Effluent Point</Text>
          <TextInput
            style={styles.textInput}
            value={mineArea}
            onChangeText={setMineArea}
            placeholder="e.g. Settling Pond #2 Discharge"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Checklists */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Environmental Compliance Checklist</Text>
          {checklists.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.checkItem, item.passed ? styles.checkItemPassed : styles.checkItemFailed]}
              onPress={() => toggleCheck(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={item.passed ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={item.passed ? Colors.success : Colors.high}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.checkLabel}>{item.label}</Text>
                {item.comment && <Text style={styles.checkComment}>{item.comment}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Severity */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Environmental Concern Level</Text>
          <View style={styles.sevRow}>
            {(['Low', 'Medium', 'High', 'Critical'] as const).map((s) => (
              <TouchableOpacity key={s} onPress={() => setSeverity(s)} style={{ flex: 1 }}>
                <StatusBadge label={s} type="severity" size="small" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Observation text */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Audit Observations & Action Notes</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={observation}
            onChangeText={setObservation}
            multiline
            numberOfLines={3}
            placeholder="Describe dust levels, pH meter reading, slurry accumulation, or chemical leaks..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Photo Evidence Picker */}
        <PhotoPlaceholderPicker
          label="Environmental Evidence Photo Placeholder"
          initialPhoto={photo}
          onPhotoSelected={setPhoto}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Ionicons name="cloud-upload" size={20} color={Colors.textDark} />
          <Text style={styles.submitBtnText}>SUBMIT ENVIRONMENTAL AUDIT</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  fieldGroup: {
    marginVertical: 10,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  chipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: Colors.environment,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.environment,
    fontWeight: '800',
  },
  textInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
    gap: 10,
  },
  checkItemPassed: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  checkItemFailed: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.4)',
  },
  checkLabel: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  checkComment: {
    color: Colors.high,
    fontSize: 10,
    marginTop: 2,
  },
  sevRow: {
    flexDirection: 'row',
    gap: 8,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.environment,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 14,
    gap: 8,
  },
  submitBtnText: {
    color: Colors.textDark,
    fontSize: 13,
    fontWeight: '900',
  },
});
