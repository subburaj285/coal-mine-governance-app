import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { StatusBadge } from '../components/StatusBadge';
import { PhotoPlaceholderPicker } from '../components/PhotoPlaceholderPicker';
import { CorrectiveAction } from '../types';

export const CorrectiveActionScreen: React.FC = () => {
  const { correctiveActions, updateActionStatus, setActiveScreen } = useApp();
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);
  const [evidencePhoto, setEvidencePhoto] = useState('');

  const handleUpdateStatus = async (status: CorrectiveAction['status']) => {
    if (!selectedAction) return;
    await updateActionStatus(selectedAction.id, status, evidencePhoto || selectedAction.evidencePlaceholder);
    setSelectedAction(null);
    setEvidencePhoto('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>CORRECTIVE ACTION TRACKER</Text>
        <Text style={styles.headerSubtitle}>
          Assigned field rectification tasks & DGMS compliance deadlines
        </Text>

        {correctiveActions.map((action) => {
          return (
            <View key={action.id} style={styles.card}>
              <View style={styles.cardTop}>
                <StatusBadge label={action.status} type="status" />
                <View style={styles.deadLineTag}>
                  <Ionicons name="time-outline" size={12} color={Colors.primary} />
                  <Text style={styles.deadlineText}>Due: {action.deadline}</Text>
                </View>
              </View>

              {/* Action Flow */}
              <View style={styles.flowContainer}>
                <View style={styles.flowStep}>
                  <View style={styles.stepDot} />
                  <View style={styles.stepContent}>
                    <Text style={styles.stepLabel}>ISSUE</Text>
                    <Text style={styles.stepTitle}>{action.issueTitle}</Text>
                  </View>
                </View>

                <View style={styles.flowConnector} />

                <View style={styles.flowStep}>
                  <View style={[styles.stepDot, { backgroundColor: Colors.info }]} />
                  <View style={styles.stepContent}>
                    <Text style={styles.stepLabel}>RESPONSIBLE PERSON & DEPT</Text>
                    <Text style={styles.stepPerson}>
                      {action.responsiblePerson} ({action.responsibleDepartment})
                    </Text>
                  </View>
                </View>

                <View style={styles.flowConnector} />

                <View style={styles.flowStep}>
                  <View style={[styles.stepDot, { backgroundColor: Colors.primary }]} />
                  <View style={styles.stepContent}>
                    <Text style={styles.stepLabel}>REQUIRED ACTION</Text>
                    <Text style={styles.stepAction}>{action.requiredAction}</Text>
                  </View>
                </View>
              </View>

              {action.evidencePlaceholder && (
                <View style={styles.evidenceBox}>
                  <Image source={{ uri: action.evidencePlaceholder }} style={styles.evidenceImg} />
                  <View style={styles.evidenceTag}>
                    <Ionicons name="checkmark-circle" size={12} color="#FFF" />
                    <Text style={styles.evidenceTagText}>Evidence Uploaded</Text>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setSelectedAction(action)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.textPrimary} />
                  <Text style={styles.actionBtnText}>Update Status & Evidence</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Action Update Modal */}
      <Modal visible={!!selectedAction} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedAction && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Update Corrective Action</Text>
                  <TouchableOpacity onPress={() => setSelectedAction(null)}>
                    <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalIssueName}>{selectedAction.issueTitle}</Text>
                <Text style={styles.modalReq}>{selectedAction.requiredAction}</Text>

                <PhotoPlaceholderPicker
                  label="Attach Repair / Evidence Photo Placeholder"
                  initialPhoto={evidencePhoto}
                  onPhotoSelected={setEvidencePhoto}
                />

                <Text style={styles.statusSelectLabel}>SELECT NEW ACTION STATUS:</Text>

                <View style={styles.statusOptions}>
                  <TouchableOpacity
                    style={[styles.statusBtn, { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: Colors.info }]}
                    onPress={() => handleUpdateStatus('In Progress')}
                  >
                    <Ionicons name="time" size={18} color={Colors.info} />
                    <Text style={[styles.statusBtnText, { color: Colors.info }]}>Mark IN PROGRESS</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: Colors.success }]}
                    onPress={() => handleUpdateStatus('Completed')}
                  >
                    <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                    <Text style={[styles.statusBtnText, { color: Colors.success }]}>Mark COMPLETED</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.reinspectTriggerBtn}
                  onPress={() => {
                    setSelectedAction(null);
                    setActiveScreen('ReInspection');
                  }}
                >
                  <Ionicons name="git-compare-outline" size={16} color={Colors.primary} />
                  <Text style={styles.reinspectTriggerText}>GO TO RE-INSPECTION VERIFICATION</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
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
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 14,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deadLineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 4,
  },
  deadlineText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  flowContainer: {
    marginVertical: 4,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.critical,
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  stepPerson: {
    color: Colors.info,
    fontSize: 12,
    fontWeight: '600',
  },
  stepAction: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  flowConnector: {
    width: 2,
    height: 14,
    backgroundColor: Colors.cardBorder,
    marginLeft: 4,
    marginVertical: 2,
  },
  evidenceBox: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  evidenceImg: {
    width: '100%',
    height: 100,
  },
  evidenceTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  evidenceTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  buttonRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  modalIssueName: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  modalReq: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginVertical: 4,
  },
  statusSelectLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 8,
  },
  statusOptions: {
    gap: 8,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  reinspectTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  reinspectTriggerText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
});
