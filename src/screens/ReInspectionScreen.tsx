import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { StatusBadge } from '../components/StatusBadge';
import { PhotoPlaceholderPicker } from '../components/PhotoPlaceholderPicker';

export const ReInspectionScreen: React.FC = () => {
  const { violations, reinspectIssue, setActiveScreen } = useApp();

  // Show violations that are in Completed, In Progress, or Reopened state
  const inspectableViolations = violations.filter(
    (v) => v.status === 'Completed' || v.status === 'In Progress' || v.status === 'Reopened'
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeViolation = inspectableViolations[selectedIndex] || inspectableViolations[0];

  const [newEvidence, setNewEvidence] = useState('');
  const [verificationNote, setVerificationNote] = useState('');

  const handleDecision = async (isSolved: boolean) => {
    if (!activeViolation) return;
    await reinspectIssue(activeViolation.id, isSolved, verificationNote);
    setVerificationNote('');
    setNewEvidence('');
    setActiveScreen('Violations');
  };

  if (!activeViolation) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-done-circle" size={56} color={Colors.success} />
        <Text style={styles.emptyTitle}>All Issues Verified</Text>
        <Text style={styles.emptySub}>
          No pending re-inspections required at this time.
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => setActiveScreen('Violations')}>
          <Text style={styles.backBtnText}>GO TO VIOLATIONS LOG</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerTitle}>FIELD RE-INSPECTION VERIFICATION</Text>
      <Text style={styles.headerSub}>Verify completed field actions for official DGMS closure</Text>

      {/* Selector Tabs if multiple */}
      {inspectableViolations.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
          {inspectableViolations.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.pickerTab, idx === selectedIndex && styles.pickerTabActive]}
              onPress={() => setSelectedIndex(idx)}
            >
              <Text style={[styles.pickerTabText, idx === selectedIndex && styles.pickerTabTextActive]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Side-by-Side Verification Card */}
      <View style={styles.mainCard}>
        <View style={styles.topStatusRow}>
          <StatusBadge label={activeViolation.severity} type="severity" />
          <StatusBadge label={activeViolation.status} type="status" />
        </View>

        <Text style={styles.issueTitle}>{activeViolation.title}</Text>
        <Text style={styles.issueLoc}>
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} /> {activeViolation.location}
        </Text>

        {/* Comparison Grid */}
        <View style={styles.compareGrid}>
          {/* Box 1: Original Issue & Original Photo */}
          <View style={styles.compareBox}>
            <Text style={styles.boxHeader}>1. ORIGINAL ISSUE & PHOTO</Text>
            <Text style={styles.boxDesc}>{activeViolation.description}</Text>
            {activeViolation.photoPlaceholder ? (
              <Image source={{ uri: activeViolation.photoPlaceholder }} style={styles.boxImg} />
            ) : (
              <View style={styles.noImgBox}><Text style={styles.noImgText}>No Photo</Text></View>
            )}
          </View>

          {/* Box 2: Corrective Action Taken & New Evidence */}
          <View style={styles.compareBox}>
            <Text style={styles.boxHeader}>2. ACTION TAKEN & EVIDENCE</Text>
            <Text style={styles.boxDesc}>
              {activeViolation.correctiveActionNote || 'Action reported complete by maintenance crew.'}
            </Text>
            {activeViolation.newEvidencePlaceholder ? (
              <Image source={{ uri: activeViolation.newEvidencePlaceholder }} style={styles.boxImg} />
            ) : (
              <PhotoPlaceholderPicker
                label="Capture Verification Photo"
                initialPhoto={newEvidence}
                onPhotoSelected={setNewEvidence}
              />
            )}
          </View>
        </View>

        {/* Verification Note input */}
        <View style={styles.noteInputBox}>
          <Text style={styles.noteLabel}>Re-Inspection Verification Remarks</Text>
          <TextInput
            style={styles.textInput}
            value={verificationNote}
            onChangeText={setVerificationNote}
            placeholder="Record inspector comments on repair quality..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* TWO PRIMARY ACTIONS: Issue Solved / Issue Not Solved */}
        <Text style={styles.decisionLabel}>INSPECTION VERIFICATION DECISION:</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.solvedBtn}
            onPress={() => handleDecision(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={22} color="#FFF" />
            <View>
              <Text style={styles.btnMainText}>ISSUE SOLVED</Text>
              <Text style={styles.btnSubText}>Status → VERIFIED / CLOSED</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notSolvedBtn}
            onPress={() => handleDecision(false)}
            activeOpacity={0.85}
          >
            <Ionicons name="alert-circle" size={22} color="#FFF" />
            <View>
              <Text style={styles.btnMainText}>NOT SOLVED</Text>
              <Text style={styles.btnSubText}>Status → REOPENED</Text>
            </View>
          </TouchableOpacity>
        </View>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 18,
  },
  backBtnText: {
    color: Colors.textDark,
    fontSize: 12,
    fontWeight: '800',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 12,
  },
  pickerScroll: {
    marginBottom: 12,
  },
  pickerTab: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  pickerTabActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: Colors.primary,
  },
  pickerTabText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  pickerTabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  mainCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  topStatusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  issueTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  issueLoc: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 12,
  },
  compareGrid: {
    gap: 12,
    marginVertical: 8,
  },
  compareBox: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  boxHeader: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  boxDesc: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 8,
  },
  boxImg: {
    width: '100%',
    height: 110,
    borderRadius: 6,
  },
  noImgBox: {
    height: 60,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  noImgText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  noteInputBox: {
    marginVertical: 10,
  },
  noteLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: Colors.textPrimary,
    fontSize: 12,
  },
  decisionLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  solvedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  notSolvedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.critical,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  btnMainText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  btnSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '600',
  },
});
