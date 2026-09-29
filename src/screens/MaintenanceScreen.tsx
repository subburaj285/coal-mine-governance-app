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
import { MachineryIssue } from '../types';

export const MaintenanceScreen: React.FC = () => {
  const { machineryIssues, updateMachineryRepair, setActiveScreen } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<MachineryIssue | null>(null);
  const [evidencePhoto, setEvidencePhoto] = useState('');

  const handleUpdate = async (status: MachineryIssue['status']) => {
    if (!selectedIssue) return;
    await updateMachineryRepair(selectedIssue.id, status, evidencePhoto || selectedIssue.evidencePlaceholder);
    setSelectedIssue(null);
    setEvidencePhoto('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>MACHINERY & FLEET MAINTENANCE</Text>
        <Text style={styles.headerSub}>Assigned mechanical repair work orders & conveyor health</Text>

        {machineryIssues.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.machineTag}>
                <Ionicons name="cog" size={16} color={Colors.maintenance} />
                <Text style={styles.machineTagText}>{item.machineId} • {item.machineName}</Text>
              </View>
              <StatusBadge label={item.priority} type="severity" size="small" />
            </View>

            <Text style={styles.issueTitle}>{item.issueTitle}</Text>
            <Text style={styles.locationText}>
              <Ionicons name="location-outline" size={12} color={Colors.textMuted} /> {item.location}
            </Text>
            <Text style={styles.issueDesc}>{item.description}</Text>

            {item.evidencePlaceholder && (
              <View style={styles.evidenceWrapper}>
                <Image source={{ uri: item.evidencePlaceholder }} style={styles.evidenceImg} />
                <View style={styles.evidenceTag}>
                  <Ionicons name="checkmark-circle" size={12} color="#FFF" />
                  <Text style={styles.evidenceTagText}>Repair Evidence Attached</Text>
                </View>
              </View>
            )}

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.assignedText}>Assigned: {item.assignedTo}</Text>
                <StatusBadge label={item.status} type="status" size="small" />
              </View>

              <TouchableOpacity
                style={styles.manageBtn}
                onPress={() => setSelectedIssue(item)}
                activeOpacity={0.8}
              >
                <Ionicons name="build" size={14} color={Colors.textDark} />
                <Text style={styles.manageBtnText}>Action Work Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Machinery Action Modal */}
      <Modal visible={!!selectedIssue} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedIssue && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Action Work Order</Text>
                  <TouchableOpacity onPress={() => setSelectedIssue(null)}>
                    <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalTopRow}>
                  <Text style={styles.modalMachineId}>{selectedIssue.machineId}</Text>
                  <StatusBadge label={selectedIssue.priority} type="severity" />
                </View>

                <Text style={styles.modalIssueTitle}>{selectedIssue.issueTitle}</Text>
                <Text style={styles.modalDesc}>{selectedIssue.description}</Text>

                <PhotoPlaceholderPicker
                  label="Attach Repair Evidence Photo Placeholder"
                  initialPhoto={evidencePhoto}
                  onPhotoSelected={setEvidencePhoto}
                />

                <Text style={styles.actionPrompt}>UPDATE REPAIR WORK ORDER STATUS:</Text>

                <View style={styles.actionGrid}>
                  <TouchableOpacity
                    style={[styles.statusOption, { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: Colors.info }]}
                    onPress={() => handleUpdate('In Progress')}
                  >
                    <Ionicons name="play-circle" size={20} color={Colors.info} />
                    <Text style={[styles.statusOptionText, { color: Colors.info }]}>START REPAIR</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusOption, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: Colors.success }]}
                    onPress={() => handleUpdate('Completed')}
                  >
                    <Ionicons name="checkmark-done-circle" size={20} color={Colors.success} />
                    <Text style={[styles.statusOptionText, { color: Colors.success }]}>MARK COMPLETED</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.reinspectLink}
                  onPress={() => {
                    setSelectedIssue(null);
                    setActiveScreen('ReInspection');
                  }}
                >
                  <Ionicons name="git-compare-outline" size={16} color={Colors.primary} />
                  <Text style={styles.reinspectLinkText}>FORWARD TO SAFETY RE-INSPECTION</Text>
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
  headerSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 14,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  machineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 6,
  },
  machineTagText: {
    color: Colors.maintenance,
    fontSize: 11,
    fontWeight: '800',
  },
  issueTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  locationText: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  issueDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginVertical: 8,
  },
  evidenceWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 6,
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 10,
    marginTop: 6,
  },
  assignedText: {
    color: Colors.textMuted,
    fontSize: 10,
    marginBottom: 4,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  manageBtnText: {
    color: Colors.textDark,
    fontSize: 11,
    fontWeight: '800',
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
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalMachineId: {
    color: Colors.maintenance,
    fontSize: 14,
    fontWeight: '800',
  },
  modalIssueTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  modalDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginVertical: 6,
  },
  actionPrompt: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 8,
  },
  actionGrid: {
    gap: 8,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '900',
  },
  reinspectLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 14,
    gap: 6,
  },
  reinspectLinkText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
});
