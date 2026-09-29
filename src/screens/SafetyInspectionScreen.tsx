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

export const SafetyInspectionScreen: React.FC = () => {
  const { submitInspection, setActiveScreen, inspections } = useApp();

  const [inspectionType, setInspectionType] = useState('Routine Pre-Shift Audit');
  const [mineArea, setMineArea] = useState('Shaft 3 Pit Bottom');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [observation, setObservation] = useState('');
  const [photo, setPhoto] = useState('');

  const [checklists, setChecklists] = useState<InspectionCheckitem[]>([
    { id: 'c1', label: 'PPE Compliance (Helmets, Safety Boots, Reflective Jackets)', passed: true },
    { id: 'c2', label: 'Machinery Guarding & Drive Belt Shields Intact', passed: false, comment: 'Guard mesh loose near belt intake' },
    { id: 'c3', label: 'Electrical Switchgear Insulation & Earthing Systems', passed: true },
    { id: 'c4', label: 'Emergency Evacuation Siren & Fire Extinguisher Pressure', passed: true },
    { id: 'c5', label: 'Work Area Atmosphere (Methane < 0.5%, CO < 5 ppm)', passed: true },
  ]);

  const toggleCheck = (id: string) => {
    setChecklists(
      checklists.map((item) => (item.id === id ? { ...item, passed: !item.passed } : item))
    );
  };

  const handleSubmit = async () => {
    await submitInspection({
      title: `${inspectionType} - ${mineArea}`,
      type: 'Safety',
      mineArea,
      status: 'Completed',
      severity,
      checklists,
      observation: observation || 'Audit completed with field findings logged.',
      photoPlaceholder: photo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
      gpsPlaceholder: '23.8115° N, 86.4428° E (Elevation -180m)',
      inspectorName: 'Anil Deshmukh (Safety Officer)',
    });
    setActiveScreen('Violations');
  };

  const handleSaveDraft = async () => {
    await submitInspection({
      title: `DRAFT: ${inspectionType} - ${mineArea}`,
      type: 'Safety',
      mineArea,
      status: 'Draft',
      severity,
      checklists,
      observation,
      photoPlaceholder: photo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
      gpsPlaceholder: '23.8115° N, 86.4428° E',
      inspectorName: 'Anil Deshmukh (Safety Officer)',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.safety} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>SAFETY & DGMS AUDIT FORM</Text>
            <Text style={styles.cardSubtitle}>Field Safety Compliance Inspection</Text>
          </View>
        </View>

        <GPSBadge location="23.8115° N, 86.4428° E (Shaft 3 Bottom)" />

        {/* Form Fields */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Inspection Type</Text>
          <View style={styles.typeRow}>
            {['Routine Pre-Shift Audit', 'High-Risk Pit Audit', 'Electrical Audit'].map((t) => {
              const selected = inspectionType === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, selected && styles.typeChipSelected]}
                  onPress={() => setInspectionType(t)}
                >
                  <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Mine Area / Location Tag</Text>
          <TextInput
            style={styles.textInput}
            value={mineArea}
            onChangeText={setMineArea}
            placeholder="e.g. Shaft 3 Pit Bottom"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Checklist */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Safety Audit Checklist</Text>
          {checklists.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.checkItem, item.passed ? styles.checkItemPassed : styles.checkItemFailed]}
              onPress={() => toggleCheck(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={item.passed ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={item.passed ? Colors.success : Colors.critical}
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
          <Text style={styles.fieldLabel}>Hazard Severity Rating</Text>
          <View style={styles.severityRow}>
            {(['Low', 'Medium', 'High', 'Critical'] as const).map((s) => {
              const active = severity === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.sevBtn, active && styles.sevBtnActive]}
                  onPress={() => setSeverity(s)}
                >
                  <StatusBadge label={s} type="severity" size="small" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Observation text */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Field Observations & Notes</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={observation}
            onChangeText={setObservation}
            multiline
            numberOfLines={4}
            placeholder="Record detailed hazards, machinery defects, or non-compliance comments..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Photo Evidence Picker */}
        <PhotoPlaceholderPicker
          label="Field Photo Evidence Placeholder"
          initialPhoto={photo}
          onPhotoSelected={setPhoto}
        />

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft} activeOpacity={0.8}>
            <Ionicons name="bookmark-outline" size={18} color={Colors.textPrimary} />
            <Text style={styles.draftBtnText}>SAVE DRAFT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Ionicons name="checkmark-done" size={20} color={Colors.textDark} />
            <Text style={styles.submitBtnText}>SUBMIT AUDIT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Audits List */}
      <Text style={styles.historyTitle}>SUBMITTED SAFETY AUDITS ({inspections.length})</Text>
      {inspections.map((insp) => (
        <View key={insp.id} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyItemTitle}>{insp.title}</Text>
            <StatusBadge label={insp.status} type="status" size="small" />
          </View>
          <Text style={styles.historyObs}>{insp.observation}</Text>
          <Text style={styles.historyMeta}>
            {insp.timestamp} • By {insp.inspectorName}
          </Text>
        </View>
      ))}
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
    marginBottom: 20,
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
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeChip: {
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  typeChipSelected: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: Colors.safety,
  },
  typeChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  typeChipTextSelected: {
    color: Colors.safety,
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
    height: 90,
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
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  checkLabel: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  checkComment: {
    color: Colors.critical,
    fontSize: 10,
    marginTop: 2,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sevBtn: {
    flex: 1,
    alignItems: 'center',
  },
  sevBtnActive: {
    transform: [{ scale: 1.05 }],
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  draftBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  draftBtnText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  submitBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  submitBtnText: {
    color: Colors.textDark,
    fontSize: 13,
    fontWeight: '900',
  },
  historyTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyItemTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  historyObs: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 6,
  },
  historyMeta: {
    color: Colors.textMuted,
    fontSize: 10,
  },
});
